import Link from "next/link";
import { Download, Search, ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatPrice, cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = "force-dynamic";

const tabs = [
  { key: "all", label: "Tümü" },
  { key: "pending", label: "Bekleyen" },
  { key: "paid", label: "Ödendi" },
  { key: "shipped", label: "Kargoda" },
  { key: "delivered", label: "Tamamlandı" },
  { key: "cancelled", label: "İptal" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status || "all";
  const q = (sp.q || "").trim();

  const where = {
    ...(status !== "all" ? { status } : {}),
    ...(q
      ? {
          OR: [
            { customerName: { contains: q } },
            { customerEmail: { contains: q } },
            { orderNumber: { contains: q } },
          ],
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const exportHref = `/api/admin/orders/export?status=${status}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Siparişler</h1>
          <p className="text-sm text-muted-foreground">{orders.length} kayıt</p>
        </div>
        <a href={exportHref} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
          <Download size={16} /> CSV
        </a>
      </div>

      {/* Search */}
      <form className="flex gap-2" action="/admin/siparisler" method="get">
        {status !== "all" && <input type="hidden" name="status" value={status} />}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="İsim, e-posta veya sipariş no ara..."
            className="w-full rounded-xl border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </form>

      {/* Tabs */}
      <div className="no-scrollbar flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const href = `/admin/siparisler?status=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
          return (
            <Link
              key={t.key}
              href={href}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition",
                status === t.key ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <ShoppingCart size={36} className="opacity-30" />
            <p>Sipariş bulunamadı.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Sipariş</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Tarih</th>
                <th className="px-4 py-3 font-medium">Tutar</th>
                <th className="px-4 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/siparisler/${o.orderNumber}`} className="block">
                      <div className="font-medium">{o.customerName}</div>
                      <div className="font-mono text-xs text-muted-foreground">{o.orderNumber}</div>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {format(o.createdAt, "d MMM yyyy HH:mm", { locale: tr })}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(Number(o.total))}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
