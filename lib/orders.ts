import { prisma } from "@/lib/prisma";

/** Next human-readable order number, e.g. BLS-2026-00158. */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.order.count();
  return `BLS-${year}-${String(count + 1).padStart(5, "0")}`;
}

export type PricedLine = {
  productId: string;
  productName: string;
  variantId: string | null;
  variantInfo: string | null;
  quantity: number;
  unitPrice: number;
};

export type CouponResult = {
  valid: boolean;
  code?: string;
  discount: number;
  message?: string;
};

/** Validate a coupon against a subtotal. Returns the discount amount. */
export async function validateCoupon(
  rawCode: string,
  subtotal: number
): Promise<CouponResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, discount: 0, message: "Kupon kodu girin." };

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.isActive)
    return { valid: false, discount: 0, message: "Geçersiz kupon kodu." };
  if (coupon.expiresAt && coupon.expiresAt < new Date())
    return { valid: false, discount: 0, message: "Kuponun süresi dolmuş." };
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
    return { valid: false, discount: 0, message: "Kupon kullanım limiti dolmuş." };

  const value = Number(coupon.value);
  const discount =
    coupon.type === "percent"
      ? Math.round(subtotal * (value / 100) * 100) / 100
      : Math.min(value, subtotal);

  return { valid: true, code, discount, message: "Kupon uygulandı." };
}

export type OrderTotals = {
  subtotal: number;
  discount: number;
  shippingCost: number;
  codFee: number;
  total: number;
};

/** Recompute all monetary fields server-side (never trust the client). */
export function computeTotals(opts: {
  subtotal: number;
  discount: number;
  paymentMethod: "paytr" | "cod";
  freeShippingThreshold: number;
  shippingCost: number;
  codFee: number;
}): OrderTotals {
  const { subtotal, discount, paymentMethod } = opts;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shippingCost =
    afterDiscount >= opts.freeShippingThreshold ? 0 : opts.shippingCost;
  const codFee = paymentMethod === "cod" ? opts.codFee : 0;
  const total = Math.round((afterDiscount + shippingCost + codFee) * 100) / 100;
  return { subtotal, discount, shippingCost, codFee, total };
}
