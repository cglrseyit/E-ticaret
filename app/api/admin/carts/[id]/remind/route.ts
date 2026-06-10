import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { sendMail, abandonedCartEmail } from "@/lib/email";

/** Sends an abandoned-cart reminder (email skeleton — logs in dev). */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const { id } = await params;

  const cart = await prisma.cart.findUnique({ where: { id }, include: { items: true } });
  if (!cart) return NextResponse.json({ error: "Sepet bulunamadı" }, { status: 404 });

  // We don't store the visitor email for anonymous carts; this is a skeleton.
  const tpl = abandonedCartEmail({});
  await sendMail({ to: "musteri@example.com", ...tpl }).catch(() => {});

  return NextResponse.json({ ok: true, logged: true });
}
