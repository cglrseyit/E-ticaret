import { prisma } from "@/lib/prisma";
import { subDays, format } from "date-fns";
import { tr } from "date-fns/locale";
import { pctDelta, type DateRange } from "@/lib/dates";

const NON_SALE_STATUS = "cancelled";

export type TimePoint = { label: string; current: number; previous: number };

export type DashboardMetrics = {
  range: { label: string; from: string; to: string };
  cards: {
    sales: { value: number; delta: number | null };
    orders: { value: number; delta: number | null };
    visitors: { value: number; delta: number | null };
    conversion: { value: number; delta: number | null };
    avgOrder: { value: number; delta: number | null };
    addToCartRate: { value: number; delta: number | null };
  };
  salesSeries: TimePoint[];
  visitorSeries: TimePoint[];
  funnel: { label: string; count: number; pct: number }[];
  recentOrders: {
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  pendingCount: number;
};

type OrderRow = { total: unknown; createdAt: Date; status: string };
type SessionRow = { id: string; firstSeen: Date };
type EventRow = { sessionId: string; type: string; createdAt: Date };

function sumSales(orders: OrderRow[]): { sales: number; count: number } {
  let sales = 0;
  let count = 0;
  for (const o of orders) {
    if (o.status === NON_SALE_STATUS) continue;
    sales += Number(o.total);
    count++;
  }
  return { sales, count };
}

function distinctSessions(events: EventRow[], type: string): number {
  const s = new Set<string>();
  for (const e of events) if (e.type === type) s.add(e.sessionId);
  return s.size;
}

function bucketByHour(dates: Date[]): number[] {
  const out = new Array(24).fill(0);
  for (const d of dates) out[d.getHours()]++;
  return out;
}

function bucketByDay(dates: Date[], from: Date, days: number): number[] {
  const out = new Array(days).fill(0);
  const fromMid = new Date(from);
  fromMid.setHours(0, 0, 0, 0);
  for (const d of dates) {
    const idx = Math.floor((d.getTime() - fromMid.getTime()) / 86400000);
    if (idx >= 0 && idx < days) out[idx]++;
  }
  return out;
}

function bucketSumByHour(orders: OrderRow[]): number[] {
  const out = new Array(24).fill(0);
  for (const o of orders) {
    if (o.status === NON_SALE_STATUS) continue;
    out[o.createdAt.getHours()] += Number(o.total);
  }
  return out;
}

function bucketSumByDay(orders: OrderRow[], from: Date, days: number): number[] {
  const out = new Array(days).fill(0);
  const fromMid = new Date(from);
  fromMid.setHours(0, 0, 0, 0);
  for (const o of orders) {
    if (o.status === NON_SALE_STATUS) continue;
    const idx = Math.floor((o.createdAt.getTime() - fromMid.getTime()) / 86400000);
    if (idx >= 0 && idx < days) out[idx] += Number(o.total);
  }
  return out;
}

export async function getDashboardMetrics(range: DateRange): Promise<DashboardMetrics> {
  const { from, to, prevFrom, prevTo, granularity, days } = range;

  const [
    curOrders, prevOrders, curSessions, prevSessions, curEvents, prevEvents,
    recentOrders, pendingCount,
  ] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: from, lte: to } }, select: { total: true, createdAt: true, status: true } }),
    prisma.order.findMany({ where: { createdAt: { gte: prevFrom, lte: prevTo } }, select: { total: true, createdAt: true, status: true } }),
    prisma.visitorSession.findMany({ where: { firstSeen: { gte: from, lte: to } }, select: { id: true, firstSeen: true } }),
    prisma.visitorSession.findMany({ where: { firstSeen: { gte: prevFrom, lte: prevTo } }, select: { id: true, firstSeen: true } }),
    prisma.analyticsEvent.findMany({ where: { createdAt: { gte: from, lte: to } }, select: { sessionId: true, type: true, createdAt: true } }),
    prisma.analyticsEvent.findMany({ where: { createdAt: { gte: prevFrom, lte: prevTo } }, select: { sessionId: true, type: true, createdAt: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { orderNumber: true, customerName: true, total: true, status: true, createdAt: true } }),
    prisma.order.count({ where: { status: "pending" } }),
  ]);

  const cur = sumSales(curOrders as OrderRow[]);
  const prev = sumSales(prevOrders as OrderRow[]);
  const curVisitors = (curSessions as SessionRow[]).length;
  const prevSessionsCount = (prevSessions as SessionRow[]).length;

  const curConversion = curVisitors ? (cur.count / curVisitors) * 100 : 0;
  const prevConversion = prevSessionsCount ? (prev.count / prevSessionsCount) * 100 : 0;
  const curAov = cur.count ? cur.sales / cur.count : 0;
  const prevAov = prev.count ? prev.sales / prev.count : 0;

  const curAtc = distinctSessions(curEvents as EventRow[], "add_to_cart");
  const prevAtc = distinctSessions(prevEvents as EventRow[], "add_to_cart");
  const curAtcRate = curVisitors ? (curAtc / curVisitors) * 100 : 0;
  const prevAtcRate = prevSessionsCount ? (prevAtc / prevSessionsCount) * 100 : 0;

  // Time series
  let salesCur: number[], salesPrev: number[], visCur: number[], visPrev: number[], labels: string[];
  if (granularity === "hour") {
    salesCur = bucketSumByHour(curOrders as OrderRow[]);
    salesPrev = bucketSumByHour(prevOrders as OrderRow[]);
    visCur = bucketByHour((curSessions as SessionRow[]).map((s) => s.firstSeen));
    visPrev = bucketByHour((prevSessions as SessionRow[]).map((s) => s.firstSeen));
    labels = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
  } else {
    salesCur = bucketSumByDay(curOrders as OrderRow[], from, days);
    salesPrev = bucketSumByDay(prevOrders as OrderRow[], prevFrom, days);
    visCur = bucketByDay((curSessions as SessionRow[]).map((s) => s.firstSeen), from, days);
    visPrev = bucketByDay((prevSessions as SessionRow[]).map((s) => s.firstSeen), prevFrom, days);
    labels = Array.from({ length: days }, (_, i) =>
      format(subDays(to, days - 1 - i), "d MMM", { locale: tr })
    );
  }

  const salesSeries: TimePoint[] = labels.map((label, i) => ({
    label, current: Math.round(salesCur[i] || 0), previous: Math.round(salesPrev[i] || 0),
  }));
  const visitorSeries: TimePoint[] = labels.map((label, i) => ({
    label, current: visCur[i] || 0, previous: visPrev[i] || 0,
  }));

  // Funnel
  const pv = distinctSessions(curEvents as EventRow[], "product_view");
  const cs = distinctSessions(curEvents as EventRow[], "checkout_start");
  const funnelRaw = [
    { label: "Ziyaret", count: curVisitors },
    { label: "Ürün Görüntüleme", count: pv },
    { label: "Sepete Ekleme", count: curAtc },
    { label: "Ödeme Başlatma", count: cs },
    { label: "Satın Alma", count: cur.count },
  ];
  const top = funnelRaw[0].count || 1;
  const funnel = funnelRaw.map((f) => ({ ...f, pct: Math.round((f.count / top) * 100) }));

  return {
    range: { label: range.label, from: from.toISOString(), to: to.toISOString() },
    cards: {
      sales: { value: Math.round(cur.sales), delta: pctDelta(cur.sales, prev.sales) },
      orders: { value: cur.count, delta: pctDelta(cur.count, prev.count) },
      visitors: { value: curVisitors, delta: pctDelta(curVisitors, prevSessionsCount) },
      conversion: { value: Math.round(curConversion * 100) / 100, delta: pctDelta(curConversion, prevConversion) },
      avgOrder: { value: Math.round(curAov), delta: pctDelta(curAov, prevAov) },
      addToCartRate: { value: Math.round(curAtcRate * 10) / 10, delta: pctDelta(curAtcRate, prevAtcRate) },
    },
    salesSeries,
    visitorSeries,
    funnel,
    recentOrders: recentOrders.map((o) => ({
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      total: Number(o.total),
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    })),
    pendingCount,
  };
}
