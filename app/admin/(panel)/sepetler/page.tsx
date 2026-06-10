import { ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { CartRemindButton } from "@/components/admin/cart-remind-button";
import { formatPrice } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = "force-dynamic";

const ABANDON_MS = 60 * 60 * 1000; // 1 hour

export default async function CartsPage() {
  const carts = await prisma.cart.findMany({
    where: { status: { in: ["active", "abandoned"] } },
    include: { items: true },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  const now = Date.now();
  const rows = carts.map((c) => {
    const total = c.items.reduce((s, i) => s + Number(i.unitPrice) * i.quantity, 0);
    const isAbandoned =
      c.status === "abandoned" || now - c.updatedAt.getTime() > ABANDON_MS;
    return { ...c, total, isAbandoned };
  });

  const abandonedRows = rows.filter((r) => r.isAbandoned);
  const abandonedValue = abandonedRows.reduce((s, r) => s + r.total, 0);
  const activeCount = rows.length - abandonedRows.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sepetler</h1>
        <p className="text-sm text-muted-foreground">Aktif ve terk edilmiş sepetler</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Aktif Sepet" value={String(activeCount)} />
        <Stat label="Terk Edilmiş" value={String(abandonedRows.length)} />
        <Stat label="Terk Edilen Tutar" value={formatPrice(abandonedValue)} />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <ShoppingCart size={36} className="opacity-30" /> Sepet bulunamadı.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Sepet</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Ürünler</th>
                <th className="px-4 py-3 font-medium">Tutar</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-muted-foreground">{c.sessionId.slice(0, 14)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(c.updatedAt, { locale: tr, addSuffix: true })}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {c.items.map((i) => `${i.quantity}× ${i.productName.split("—")[0].trim()}`).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(c.total)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.isAbandoned ? "warning" : "success"}>
                      {c.isAbandoned ? "Terk edilmiş" : "Aktif"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.isAbandoned && <CartRemindButton cartId={c.id} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}
