import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, MapPin, CreditCard, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/status-badge";
import { OrderManage } from "@/components/admin/order-manage";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { OR: [{ orderNumber: id }, { id }] },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/siparisler" className="grid h-9 w-9 place-items-center rounded-lg border hover:bg-muted">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-mono text-xl font-bold">{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              {format(order.createdAt, "d MMMM yyyy, HH:mm", { locale: tr })}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold"><Package size={18} /> Ürünler</h2>
            <ul className="divide-y">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium">{it.productName}</p>
                    {it.variantInfo && <p className="text-xs text-muted-foreground">{it.variantInfo}</p>}
                    <p className="text-xs text-muted-foreground">{it.quantity} × {formatPrice(Number(it.unitPrice))}</p>
                  </div>
                  <span className="font-semibold">{formatPrice(Number(it.unitPrice) * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t pt-4 text-sm">
              <Row label="Ara toplam" value={formatPrice(Number(order.subtotal))} />
              {Number(order.discount) > 0 && <Row label={`İndirim ${order.couponCode ? `(${order.couponCode})` : ""}`} value={`-${formatPrice(Number(order.discount))}`} />}
              <Row label="Kargo" value={Number(order.shippingCost) === 0 ? "Ücretsiz" : formatPrice(Number(order.shippingCost))} />
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <dt>Toplam</dt><dd className="text-price">{formatPrice(Number(order.total))}</dd>
              </div>
            </dl>
          </div>

          {/* Customer + address */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="mb-3 flex items-center gap-2 font-semibold"><User size={18} /> Müşteri</h2>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.customerName}</p>
                <p className="text-muted-foreground">{order.customerEmail}</p>
                <p className="text-muted-foreground">{order.customerPhone}</p>
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="mb-3 flex items-center gap-2 font-semibold"><MapPin size={18} /> Teslimat</h2>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{order.address}</p>
                <p>{order.district} / {order.city} {order.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold"><CreditCard size={18} /> Ödeme</h2>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div><span className="text-muted-foreground">Yöntem: </span><span className="font-medium">{order.paymentMethod === "cod" ? "Kapıda Ödeme" : "Kredi/Banka Kartı"}</span></div>
              <div><span className="text-muted-foreground">Durum: </span><span className="font-medium">{order.paymentStatus}</span></div>
              {order.paymentRef && <div><span className="text-muted-foreground">Ref: </span><span className="font-mono">{order.paymentRef}</span></div>}
            </div>
          </div>
        </div>

        {/* Manage */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 font-semibold">Sipariş Yönetimi</h2>
            <OrderManage
              orderNumber={order.orderNumber}
              initial={{
                status: order.status,
                paymentStatus: order.paymentStatus,
                cargoCompany: order.cargoCompany,
                trackingNumber: order.trackingNumber,
                note: order.note,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
