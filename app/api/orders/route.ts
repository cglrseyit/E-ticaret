import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation";
import {
  generateOrderNumber,
  validateCoupon,
  computeTotals,
  type PricedLine,
} from "@/lib/orders";
import { getCheckoutSettings } from "@/lib/settings";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Re-price every line from the database (never trust client prices).
  const lines: PricedLine[] = [];
  for (const item of data.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { variants: true },
    });
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Yetersiz stok: ${product.name}` },
        { status: 400 }
      );
    }
    let unitPrice = Number(product.price);
    let variantInfo: string | null = null;
    if (item.variantId) {
      const v = product.variants.find((x) => x.id === item.variantId);
      if (v) {
        unitPrice += Number(v.priceDiff);
        variantInfo = `${v.name}: ${v.value}`;
      }
    }
    lines.push({
      productId: product.id,
      productName: product.name,
      variantId: item.variantId ?? null,
      variantInfo,
      quantity: item.quantity,
      unitPrice,
    });
  }

  const subtotal =
    Math.round(lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0) * 100) / 100;

  // Coupon
  let discount = 0;
  let appliedCoupon: string | null = null;
  if (data.couponCode) {
    const c = await validateCoupon(data.couponCode, subtotal);
    if (c.valid) {
      discount = c.discount;
      appliedCoupon = c.code ?? null;
    }
  }

  const settings = await getCheckoutSettings();
  const totals = computeTotals({
    subtotal,
    discount,
    paymentMethod: data.paymentMethod,
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingCost: settings.shippingCost,
    codFee: settings.codFee,
  });

  const orderNumber = await generateOrderNumber();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sid")?.value ?? null;

  // Create the order
  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: "pending",
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone.replace(/\s/g, ""),
      address: data.address,
      city: data.city,
      district: data.district,
      zipCode: data.zipCode || null,
      note: data.note || null,
      subtotal: totals.subtotal,
      shippingCost: totals.shippingCost,
      discount: totals.discount,
      total: totals.total,
      paymentMethod: data.paymentMethod,
      paymentStatus: "unpaid",
      couponCode: appliedCoupon,
      sessionId,
      items: {
        create: lines.map((l) => ({
          productId: l.productId,
          productName: l.productName,
          variantInfo: l.variantInfo,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      },
    },
  });

  // Bump coupon usage
  if (appliedCoupon) {
    await prisma.coupon.update({
      where: { code: appliedCoupon },
      data: { usedCount: { increment: 1 } },
    });
  }

  // Mark the session's cart as converted
  if (sessionId) {
    await prisma.cart
      .updateMany({ where: { sessionId }, data: { status: "converted" } })
      .catch(() => {});
  }

  // Kick off payment via the active provider
  const provider = getPaymentProvider();

  if (data.paymentMethod === "cod") {
    // Cash on delivery: no online payment; order stays pending/unpaid.
    return NextResponse.json({
      ok: true,
      orderNumber,
      total: totals.total,
      redirectUrl: `/odeme/basarili?order=${encodeURIComponent(orderNumber)}`,
    });
  }

  const payment = await provider.createPayment({
    orderNumber,
    total: totals.total,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
  });

  if (payment.ref) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: payment.ref },
    });
  }

  // With the mock provider we mark paid immediately on the success page.
  return NextResponse.json({
    ok: true,
    orderNumber,
    total: totals.total,
    redirectUrl:
      payment.redirectUrl ??
      `/odeme/basarili?order=${encodeURIComponent(orderNumber)}`,
  });
}
