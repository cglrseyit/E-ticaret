import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";

/**
 * PayTR notification (S2S) callback. PayTR sends an x-www-form-urlencoded POST
 * with merchant_oid, status, total_amount, hash and (on failure) failed_reason.
 *
 * We MUST respond with the literal text "OK" so PayTR stops retrying.
 * Anything else (including a 500) will be retried for ~24 hours.
 *
 * Configure this URL in your PayTR merchant panel:
 *   https://your-domain.com/api/payments/paytr/callback
 */
export async function POST(req: Request) {
  // PayTR posts form-encoded data — parse accordingly.
  let payload: Record<string, string> = {};
  try {
    const form = await req.formData();
    for (const [k, v] of form.entries()) payload[k] = String(v);
  } catch {
    // Fall back to JSON for testing.
    try {
      payload = (await req.json()) as Record<string, string>;
    } catch {
      return new Response("OK", { status: 200 });
    }
  }

  const provider = getPaymentProvider();
  if (provider.name !== "paytr") {
    // Endpoint hit while PAYMENT_PROVIDER is "mock" — acknowledge so PayTR
    // does not retry against a misconfigured env.
    return new Response("OK", { status: 200 });
  }

  const verified = await provider.verifyCallback(payload).catch(() => null);
  if (!verified || !verified.orderRef) {
    // Bad hash — still return "OK" to stop retries; log here when wired up.
    console.warn("PayTR callback failed verification", payload);
    return new Response("OK", { status: 200 });
  }

  // The orderRef we stored is the alphanumeric form of orderNumber. Match it
  // against the payment reference we persisted at order creation time.
  const order = await prisma.order.findFirst({
    where: { paymentRef: verified.orderRef },
  });

  if (!order) {
    console.warn("PayTR callback for unknown order", verified.orderRef);
    return new Response("OK", { status: 200 });
  }

  if (verified.success) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "paid", status: "paid" },
    });
  } else {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "failed" },
    });
  }

  return new Response("OK", { status: 200 });
}

// PayTR sometimes pings GET to verify the URL.
export async function GET() {
  return new Response("OK", { status: 200 });
}
