import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { couponAdminSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const body = await req.json().catch(() => null);
  const parsed = couponAdminSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  const d = parsed.data;
  const code = d.code.trim().toUpperCase();

  const exists = await prisma.coupon.findUnique({ where: { code } });
  if (exists) return NextResponse.json({ error: "Bu kod zaten var" }, { status: 409 });

  await prisma.coupon.create({
    data: {
      code,
      type: d.type,
      value: d.value,
      isActive: d.isActive,
      usageLimit: d.usageLimit ?? null,
      expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
    },
  });
  return NextResponse.json({ ok: true });
}
