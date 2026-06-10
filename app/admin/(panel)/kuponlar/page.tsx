import { prisma } from "@/lib/prisma";
import { CouponsManager } from "@/components/admin/coupons-manager";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kuponlar</h1>
        <p className="text-sm text-muted-foreground">{coupons.length} kupon</p>
      </div>
      <CouponsManager
        coupons={coupons.map((c) => ({
          id: c.id, code: c.code, type: c.type, value: Number(c.value),
          isActive: c.isActive, usageLimit: c.usageLimit, usedCount: c.usedCount,
          expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
        }))}
      />
    </div>
  );
}
