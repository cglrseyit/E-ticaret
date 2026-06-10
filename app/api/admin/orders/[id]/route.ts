import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { orderUpdateSchema } from "@/lib/validation";
import { sendMail, orderShippedEmail } from "@/lib/email";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = orderUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }
  const d = parsed.data;

  // Look up by orderNumber or id
  const existing = await prisma.order.findFirst({
    where: { OR: [{ orderNumber: id }, { id }] },
  });
  if (!existing) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });

  const updated = await prisma.order.update({
    where: { id: existing.id },
    data: {
      ...(d.status !== undefined ? { status: d.status } : {}),
      ...(d.paymentStatus !== undefined ? { paymentStatus: d.paymentStatus } : {}),
      ...(d.trackingNumber !== undefined ? { trackingNumber: d.trackingNumber || null } : {}),
      ...(d.cargoCompany !== undefined ? { cargoCompany: d.cargoCompany || null } : {}),
      ...(d.note !== undefined ? { note: d.note || null } : {}),
    },
  });

  // Fire a "shipped" email skeleton when tracking info just got added.
  const becameShipped =
    d.status === "shipped" || (d.trackingNumber && !existing.trackingNumber);
  if (becameShipped && updated.trackingNumber && updated.cargoCompany) {
    const tpl = orderShippedEmail({
      name: updated.customerName,
      orderNumber: updated.orderNumber,
      cargoCompany: updated.cargoCompany,
      trackingNumber: updated.trackingNumber,
    });
    await sendMail({ to: updated.customerEmail, ...tpl }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
