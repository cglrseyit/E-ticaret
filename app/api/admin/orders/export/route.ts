import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const url = new URL(req.url);
  const status = url.searchParams.get("status");

  const orders = await prisma.order.findMany({
    where: status && status !== "all" ? { status } : {},
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Sipariş No", "Tarih", "Durum", "Ödeme", "Müşteri", "E-posta", "Telefon",
    "İl", "İlçe", "Adres", "Ara Toplam", "Kargo", "İndirim", "Toplam", "Kargo Firma", "Takip No",
  ];
  const rows = orders.map((o) =>
    [
      o.orderNumber,
      o.createdAt.toISOString(),
      o.status,
      o.paymentMethod,
      o.customerName,
      o.customerEmail,
      o.customerPhone,
      o.city,
      o.district,
      o.address,
      Number(o.subtotal),
      Number(o.shippingCost),
      Number(o.discount),
      Number(o.total),
      o.cargoCompany ?? "",
      o.trackingNumber ?? "",
    ]
      .map(csvCell)
      .join(",")
  );

  const csv = "﻿" + [header.join(","), ...rows].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="siparisler-${Date.now()}.csv"`,
    },
  });
}
