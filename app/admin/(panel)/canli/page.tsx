"use client";

import * as React from "react";
import { Radio, Users, Eye, ShoppingBag, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type LiveData = {
  active5: number;
  active30: number;
  currentPages: { path: string; count: number }[];
  todayOrders: number;
  todayRevenue: number;
  recentPurchases: { orderNumber: string; customerName: string; total: number; city: string; createdAt: string }[];
};

const PAGE_LABEL: Record<string, string> = {
  "/": "Ana Sayfa / Ürün",
  "/sepet": "Sepet",
  "/odeme": "Ödeme",
  "/odeme/basarili": "Teşekkür",
};

export default function LivePage() {
  const [data, setData] = React.useState<LiveData | null>(null);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/live", { cache: "no-store" });
        if (res.ok && active) setData(await res.json());
      } catch {
        /* ignore */
      }
    };
    load();
    const id = setInterval(load, 10000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
        </span>
        <h1 className="text-2xl font-bold">Canlı Görünüm</h1>
        <span className="text-sm text-muted-foreground">· 10 sn'de bir güncellenir</span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Big icon={Users} label="Son 5 dk aktif" value={data?.active5 ?? "—"} accent />
        <Big icon={Eye} label="Son 30 dk aktif" value={data?.active30 ?? "—"} />
        <Big icon={ShoppingBag} label="Bugünkü sipariş" value={data?.todayOrders ?? "—"} />
        <Big icon={Radio} label="Bugünkü ciro" value={data ? formatPrice(data.todayRevenue) : "—"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-semibold">Şu an nerede geziniyorlar</h2>
          {!data || data.currentPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Şu an aktif ziyaretçi yok.</p>
          ) : (
            <div className="space-y-2.5">
              {data.currentPages.map((p) => (
                <div key={p.path} className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-2.5 text-sm">
                  <span className="font-medium">{PAGE_LABEL[p.path] || p.path}</span>
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-hover">
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-semibold">Canlı Satış Akışı</h2>
          <div className="space-y-2">
            {data?.recentPurchases.map((o) => (
              <div key={o.orderNumber} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
                <div>
                  <div className="font-medium">{o.customerName}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={11} /> {o.city}
                  </div>
                </div>
                <span className="font-semibold text-success">{formatPrice(o.total)}</span>
              </div>
            )) ?? <p className="text-sm text-muted-foreground">Yükleniyor...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Big({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-accent/30 bg-accent-soft/30" : "bg-card"}`}>
      <Icon className={accent ? "text-accent" : "text-muted-foreground"} size={20} />
      <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
