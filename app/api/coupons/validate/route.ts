import { NextResponse } from "next/server";
import { couponSchema } from "@/lib/validation";
import { validateCoupon } from "@/lib/orders";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false, message: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ valid: false, message: "Geçersiz istek" }, { status: 400 });
  }

  const result = await validateCoupon(parsed.data.code, parsed.data.subtotal);
  return NextResponse.json(result);
}
