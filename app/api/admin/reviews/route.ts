import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { reviewSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });

  const product = await prisma.product.findFirst({ where: { isActive: true } });
  if (!product) return NextResponse.json({ error: "Ürün yok" }, { status: 400 });

  await prisma.review.create({
    data: { ...parsed.data, productId: product.id },
  });
  return NextResponse.json({ ok: true });
}
