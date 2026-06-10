import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { cartSyncSchema } from "@/lib/validation";

/** Mirror the client cart into the DB so "abandoned carts" can be reported. */
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sid = cookieStore.get("sid")?.value;
  if (!sid) return NextResponse.json({ ok: true, skipped: "no_session" });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = cartSyncSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const { items } = parsed.data;

  // Empty cart -> drop any tracked cart for this session.
  if (items.length === 0) {
    await prisma.cart.deleteMany({ where: { sessionId: sid, status: "active" } });
    return NextResponse.json({ ok: true, empty: true });
  }

  const cart = await prisma.cart.upsert({
    where: { sessionId: sid },
    create: { sessionId: sid, status: "active" },
    update: { status: "active", updatedAt: new Date() },
  });

  // Replace items
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cartItem.createMany({
    data: items.map((i) => ({
      cartId: cart.id,
      productId: i.productId,
      productName: i.productName,
      variantInfo: i.variantInfo ?? null,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    })),
  });

  return NextResponse.json({ ok: true });
}
