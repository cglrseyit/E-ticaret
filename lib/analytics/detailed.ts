import { prisma } from "@/lib/prisma";
import type { DateRange } from "@/lib/dates";

export type DetailedAnalytics = {
  avgTimeOnPage: number; // seconds
  returningRate: number; // %
  totalSessions: number;
  deviceDist: { name: string; value: number }[];
  trafficSources: { source: string; sessions: number; pct: number }[];
  heatmap: number[][]; // [day 0-6 (Mon..Sun)][hour 0-23]
  heatmapMax: number;
  abandonedRate: number; // %
  abandonedValue: number;
  topCoupons: { code: string; used: number }[];
};

const DEVICE_LABEL: Record<string, string> = {
  mobile: "Mobil", desktop: "Masaüstü", tablet: "Tablet",
};

export async function getDetailedAnalytics(range: DateRange): Promise<DetailedAnalytics> {
  const { from, to } = range;

  const [sessions, timeEvents, pageViews, carts, coupons] = await Promise.all([
    prisma.visitorSession.findMany({
      where: { firstSeen: { gte: from, lte: to } },
      select: { device: true, utmSource: true, referrer: true, isReturning: true },
    }),
    prisma.analyticsEvent.findMany({
      where: { type: "time_on_page", createdAt: { gte: from, lte: to } },
      select: { metadata: true },
    }),
    prisma.analyticsEvent.findMany({
      where: { type: "page_view", createdAt: { gte: from, lte: to } },
      select: { createdAt: true },
    }),
    prisma.cart.findMany({ select: { status: true, items: { select: { unitPrice: true, quantity: true } } } }),
    prisma.coupon.findMany({ orderBy: { usedCount: "desc" }, take: 5 }),
  ]);

  const totalSessions = sessions.length || 1;

  // avg time on page
  let totalSec = 0, count = 0;
  for (const e of timeEvents) {
    const s = (e.metadata as { seconds?: number } | null)?.seconds;
    if (typeof s === "number" && s > 0 && s < 3600) {
      totalSec += s; count++;
    }
  }
  const avgTimeOnPage = count ? Math.round(totalSec / count) : 0;

  // returning rate
  const returning = sessions.filter((s) => s.isReturning).length;
  const returningRate = Math.round((returning / totalSessions) * 100);

  // device distribution
  const devMap = new Map<string, number>();
  for (const s of sessions) {
    const k = s.device || "desktop";
    devMap.set(k, (devMap.get(k) || 0) + 1);
  }
  const deviceDist = [...devMap.entries()].map(([k, v]) => ({
    name: DEVICE_LABEL[k] || k, value: v,
  }));

  // traffic sources
  const srcMap = new Map<string, number>();
  for (const s of sessions) {
    const k = s.utmSource || (s.referrer ? new URL(s.referrer).hostname.replace("www.", "") : "direct");
    srcMap.set(k, (srcMap.get(k) || 0) + 1);
  }
  const trafficSources = [...srcMap.entries()]
    .map(([source, n]) => ({ source, sessions: n, pct: Math.round((n / totalSessions) * 100) }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 8);

  // heatmap (Mon..Sun x 0..23)
  const heatmap: number[][] = Array.from({ length: 7 }, () => new Array(24).fill(0));
  let heatmapMax = 0;
  for (const e of pageViews) {
    const d = e.createdAt;
    const day = (d.getDay() + 6) % 7; // Mon=0 .. Sun=6
    const h = d.getHours();
    heatmap[day][h]++;
    if (heatmap[day][h] > heatmapMax) heatmapMax = heatmap[day][h];
  }

  // abandoned carts
  const abandoned = carts.filter((c) => c.status === "abandoned");
  const abandonedRate = carts.length ? Math.round((abandoned.length / carts.length) * 100) : 0;
  const abandonedValue = abandoned.reduce(
    (s, c) => s + c.items.reduce((t, i) => t + Number(i.unitPrice) * i.quantity, 0),
    0
  );

  const topCoupons = coupons
    .filter((c) => c.usedCount > 0)
    .map((c) => ({ code: c.code, used: c.usedCount }));

  return {
    avgTimeOnPage, returningRate, totalSessions: sessions.length,
    deviceDist, trafficSources, heatmap, heatmapMax,
    abandonedRate, abandonedValue, topCoupons,
  };
}
