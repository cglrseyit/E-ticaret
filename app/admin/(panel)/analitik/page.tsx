import { Clock, Repeat, MonitorSmartphone, TrendingDown } from "lucide-react";
import { resolveRange, type RangeKey } from "@/lib/dates";
import { getDetailedAnalytics } from "@/lib/analytics/detailed";
import { RangePicker } from "@/components/admin/range-picker";
import { DevicePie } from "@/components/admin/device-pie";
import { Heatmap } from "@/components/admin/heatmap";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const sp = await searchParams;
  const key = (sp.range as RangeKey) || "30d";
  const range = resolveRange(key);
  const a = await getDetailedAnalytics(range);

  const mins = Math.floor(a.avgTimeOnPage / 60);
  const secs = a.avgTimeOnPage % 60;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Detaylı Analitik</h1>
          <p className="text-sm text-muted-foreground">{range.label}</p>
        </div>
        <RangePicker active={key} />
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Mini icon={Clock} label="Ort. Sayfada Kalma" value={`${mins}d ${secs}s`} />
        <Mini icon={Repeat} label="Geri Dönen Ziyaretçi" value={`%${a.returningRate}`} />
        <Mini icon={TrendingDown} label="Terk Edilen Sepet" value={`%${a.abandonedRate}`} />
        <Mini icon={MonitorSmartphone} label="Terk Edilen Tutar" value={formatPrice(a.abandonedValue)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Device pie */}
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-semibold">Cihaz Dağılımı</h2>
          <DevicePie data={a.deviceDist} />
        </div>

        {/* Traffic sources */}
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-semibold">Trafik Kaynakları</h2>
          <div className="space-y-2.5">
            {a.trafficSources.map((s) => (
              <div key={s.source}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium capitalize">{s.source}</span>
                  <span className="text-muted-foreground">{s.sessions} · %{s.pct}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Ziyaret Isı Haritası</h2>
        <p className="mb-4 text-xs text-muted-foreground">Gün ve saate göre ziyaret yoğunluğu</p>
        <Heatmap grid={a.heatmap} max={a.heatmapMax} />
      </div>

      {/* Top coupons */}
      <div className="rounded-2xl border bg-card p-5">
        <h2 className="mb-4 font-semibold">En Çok Kullanılan Kuponlar</h2>
        {a.topCoupons.length === 0 ? (
          <p className="text-sm text-muted-foreground">Kupon kullanımı yok.</p>
        ) : (
          <div className="space-y-2">
            {a.topCoupons.map((c) => (
              <div key={c.code} className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-2.5 text-sm">
                <span className="font-mono font-semibold">{c.code}</span>
                <span className="text-muted-foreground">{c.used} kullanım</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Mini({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <Icon className="text-accent" size={18} />
      <div className="mt-2 text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
