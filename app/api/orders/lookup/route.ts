import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  orderNumber: z.string().trim().min(3).max(40),
  email: z.string().trim().email(),
});

/**
 * Public order lookup endpoint. Matches an order by its number AND the
 * customer email so a leaked order number alone can't reveal personal data.
 * Returns a slimmed-down DTO suitable for the tracking page.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Sipariş numarası ve e-posta gerekli." },
      { status: 400 }
    );
  }

  const { orderNumber, email } = parsed.data;

  const order = await prisma.order.findUnique({
    where: { orderNumber: orderNumber.toUpperCase() },
    include: { items: true },
  });

  if (!order || order.customerEmail.toLowerCase() !== email.toLowerCase()) {
    // Generic message — don't leak whether the order number exists.
    return NextResponse.json(
      { error: "Sipariş bulunamadı. Bilgileri kontrol edip tekrar deneyin." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      customerName: order.customerName,
      city: order.city,
      district: order.district,
      trackingNumber: order.trackingNumber,
      cargoCompany: order.cargoCompany,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discount: Number(order.discount),
      total: Number(order.total),
      items: order.items.map((i) => ({
        productName: i.productName,
        variantInfo: i.variantInfo,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
      })),
    },
  });
}
