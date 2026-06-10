"use client";

import * as React from "react";
import {
  Package, Search, MapPin, Truck, CheckCircle2, AlertCircle, Clock, CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatPrice } from "@/lib/utils";

type OrderItemDTO = {
  productName: string;
  variantInfo: string | null;
  quantity: number;
  unitPrice: number;
};

type OrderDTO = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  city: string;
  district: string;
  trackingNumber: string | null;
  cargoCompany: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  items: OrderItemDTO[];
};

const TIMELINE: { key: string; label: string; icon: typeof Package }[] = [
  { key: "pending", label: "Sipariş Alındı", icon: Package },
  { key: "paid", label: "Ödeme Onaylandı", icon: CreditCard },
  { key: "shipped", label: "Kargoda", icon: Truck },
  { key: "delivered", label: "Teslim Edildi", icon: CheckCircle2 },
];

function progressIndex(status: string): number {
  switch (status) {
    case "pending": return 0;
    case "paid": return 1;
    case "shipped": return 2;
    case "delivered": return 3;
    case "cancelled":
    case "refunded":
      return -1;
    default: return 0;
  }
}

export function OrderTracker() {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<OrderDTO | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOrder(null);

    if (!orderNumber.trim() || !email.trim()) {
      setError("Sipariş numarası ve e-posta gerekli.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sipariş bulunamadı.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="orderNumber" className="mb-1.5 block text-sm font-medium">
              Sipariş Numarası
            </label>
            <input
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="BLS-2026-00001"
              className="h-11 w-full rounded-xl border bg-background px-3 font-mono text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@eposta.com"
              className="h-11 w-full rounded-xl border bg-background px-3 text-[15px] outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={loading}>
          {loading ? "Sorgulanıyor…" : (<>Siparişi Sorgula <Search size={16} /></>)}
        </Button>

        <p className="mt-3 text-xs text-muted-foreground">
          Sipariş numaranızı bulamıyor musunuz? Sipariş onay e-postanızda yer alır.
        </p>
      </form>

      {order && <OrderDetails order={order} />}
    </div>
  );
}

function OrderDetails({ order }: { order: OrderDTO }) {
  const current = progressIndex(order.status);
  const cancelled = current === -1;

  return (
    <div className="space-y-6 rounded-2xl border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
        <div>
          <div className="text-sm text-muted-foreground">Sipariş Numarası</div>
          <div className="mt-0.5 font-mono text-lg font-semibold">{order.orderNumber}</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={13} />
            <span>{new Date(order.createdAt).toLocaleString("tr-TR")}</span>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Timeline */}
      {cancelled ? (
        <div className="flex items-center gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm">
          <AlertCircle className="text-danger" size={18} />
          <span>Bu sipariş {order.status === "cancelled" ? "iptal edilmiş" : "iade edilmiştir"}.</span>
        </div>
      ) : (
        <ol className="grid grid-cols-4 gap-2 sm:gap-4">
          {TIMELINE.map((s, i) => {
            const reached = i <= current;
            const Icon = s.icon;
            return (
              <li key={s.key} className="flex flex-col items-center text-center">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${
                    reached
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-muted bg-background text-muted-foreground"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span
                  className={`mt-2 text-[11px] font-medium sm:text-xs ${
                    reached ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {/* Cargo info */}
      {order.trackingNumber && (
        <div className="rounded-xl border bg-muted/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Truck size={16} className="text-accent" />
            Kargo Bilgisi
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Info label="Kargo Firması" value={order.cargoCompany || "—"} />
            <Info label="Takip Numarası" value={order.trackingNumber} mono />
          </div>
        </div>
      )}

      {/* Delivery + items */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <MapPin size={16} className="text-muted-foreground" />
            Teslimat
          </h3>
          <div className="space-y-2 text-sm">
            <Info label="Alıcı" value={order.customerName} />
            <Info label="İl / İlçe" value={`${order.city} / ${order.district}`} />
            <Info
              label="Ödeme Yöntemi"
              value={order.paymentMethod === "cod" ? "Kapıda Ödeme" : "Kredi/Banka Kartı"}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Package size={16} className="text-muted-foreground" />
            Ürünler
          </h3>
          <ul className="space-y-2 text-sm">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{i.productName}</div>
                  <div className="text-xs text-muted-foreground">
                    {i.variantInfo ? `${i.variantInfo} · ` : ""}
                    {i.quantity} adet
                  </div>
                </div>
                <div className="shrink-0 text-right text-sm">
                  {formatPrice(i.unitPrice * i.quantity)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-1.5 border-t pt-4 text-sm">
        <Row label="Ara Toplam" value={formatPrice(order.subtotal)} />
        {order.discount > 0 && (
          <Row label="İndirim" value={`- ${formatPrice(order.discount)}`} accent />
        )}
        <Row
          label="Kargo"
          value={order.shippingCost === 0 ? "Ücretsiz" : formatPrice(order.shippingCost)}
        />
        <div className="mt-2 flex items-center justify-between border-t pt-3 text-base font-bold">
          <span>Toplam</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={mono ? "font-mono text-sm" : "text-sm"}>{value}</div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-semibold text-accent" : ""}>{value}</span>
    </div>
  );
}
