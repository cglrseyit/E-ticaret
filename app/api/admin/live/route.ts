import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { startOfToday } from "date-fns";

export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const now = Date.now();
  const since5 = new Date(now - 5 * 60 * 1000);
  const since30 = new Date(now - 30 * 60 * 1000);
  const today = startOfToday();

  const [active5, active30, pageGroups, todayOrders, recentPurchases] = await Promise.all([
    prisma.visitorSession.count({ where: { lastSeen: { gte: since5 } } }),
    prisma.visitorSession.count({ where: { lastSeen: { gte: since30 } } }),
    prisma.analyticsEvent.groupBy({
      by: ["path"],
      where: { type: "page_view", createdAt: { gte: since5 } },
      _count: { path: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: today } },
      select: { total: true, status: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { orderNumber: true, customerName: true, total: true, city: true, createdAt: true },
    }),
  ]);

  const currentPages = pageGroups
    .map((g) => ({ path: g.path || "/", count: g._count.path }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total), 0);

  return NextResponse.json({
    active5,
    active30,
    currentPages,
    todayOrders: todayOrders.length,
    todayRevenue: Math.round(todayRevenue),
    recentPurchases: recentPurchases.map((o) => ({
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      total: Number(o.total),
      city: o.city,
      createdAt: o.createdAt.toISOString(),
    })),
  });
}
