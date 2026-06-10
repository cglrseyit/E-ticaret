import Link from "next/link";
import {
  Wallet, ShoppingBag, Users, TrendingUp, CreditCard, MousePointerClick,
  AlertCircle, ArrowRight,
} from "lucide-react";
import { resolveRange, type RangeKey } from "@/lib/dates";
import { getDashboardMetrics } from "@/lib/analytics/metrics";
import { StatCard } from "@/components/admin/stat-card";
import { TrendChart } from "@/components/admin/trend-chart";
import { Funnel } from "@/components/admin/funnel";
import { RangePicker } from "@/components/admin/range-picker";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const sp = await searchParams;
  const key = (sp.range as RangeKey) || "30d";
  const range = resolveRange(key);
  const m = await getDashboardMetrics(range);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{range.label} özeti</p>
        </div>
        <RangePicker active={key} />
      </div>

      {/* Pending alert */}
      {m.pendingCount > 0 && (
        <Link
          href="/admin/siparisler?status=pending"
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 transition hover:bg-amber-100"
        >
          <AlertCircle size={18} />
          <span><strong>{m.pendingCount}</strong> bekleyen sipariş var.</span>
          <ArrowRight size={16} className="ml-auto" />
        </Link>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard title="Toplam Satış" value={m.cards.sales.value} delta={m.cards.sales.delta} format="currency" icon={Wallet} />
        <StatCard title="Sipariş Sayısı" value={m.cards.orders.value} delta={m.cards.orders.delta} icon={ShoppingBag} />
        <StatCard title="Ziyaretçi" value={m.cards.visitors.value} delta={m.cards.visitors.delta} icon={Users} />
        <StatCard title="Dönüşüm Oranı" value={m.cards.conversion.value} delta={m.cards.conversion.delta} format="percent" icon={TrendingUp} />
        <StatCard title="Ort. Sepet" value={m.cards.avgOrder.value} delta={m.cards.avgOrder.delta} format="currency" icon={CreditCard} />
        <StatCard title="Sepete Ekleme Oranı" value={m.cards.addToCartRate.value} delta={m.cards.addToCartRate.delta} format="percent" icon={MousePointerClick} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-semibold">Satış</h2>
          <p className="mb-4 text-xs text-muted-foreground">Bu dönem vs. önceki dönem (kesikli)</p>
          <TrendChart data={m.salesSeries} type="currency" color="var(--accent)" />
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-semibold">Ziyaretçi</h2>
          <p className="mb-4 text-xs text-muted-foreground">Bu dönem vs. önceki dönem (kesikli)</p>
          <TrendChart data={m.visitorSeries} type="number" color="#6366f1" />
        </div>
      </div>

      {/* Funnel + recent orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-semibold">Dönüşüm Hunisi</h2>
          <p className="mb-4 text-xs text-muted-foreground">Ziyaretten satın almaya</p>
          <Funnel steps={m.funnel} />
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Son Siparişler</h2>
            <Link href="/admin/siparisler" className="text-sm text-accent hover:underline">
              Tümü
            </Link>
          </div>
          <div className="divide-y">
            {m.recentOrders.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">Henüz sipariş yok.</p>
            )}
            {m.recentOrders.map((o) => (
              <Link
                key={o.orderNumber}
                href={`/admin/siparisler/${o.orderNumber}`}
                className="flex items-center justify-between gap-3 py-3 transition hover:opacity-80"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{o.customerName}</div>
                  <div className="font-mono text-xs text-muted-foreground">{o.orderNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatPrice(o.total)}</div>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
