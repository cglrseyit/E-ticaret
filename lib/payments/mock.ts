import type {
  PaymentProvider,
  PaymentOrder,
  CreatePaymentResult,
  VerifyResult,
} from "./provider";

/**
 * Development payment provider. Always "succeeds" after a short delay.
 * Append ?fail=1 to the success redirect target to simulate a failure.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async createPayment(order: PaymentOrder): Promise<CreatePaymentResult> {
    // Simulate a gateway round-trip.
    await new Promise((r) => setTimeout(r, 600));
    return {
      ref: `MOCK-${order.orderNumber}`,
      redirectUrl: `/odeme/basarili?order=${encodeURIComponent(order.orderNumber)}`,
    };
  }

  async verifyCallback(payload: unknown): Promise<VerifyResult> {
    const p = (payload ?? {}) as { orderRef?: string; fail?: boolean };
    return {
      orderRef: p.orderRef ?? "",
      success: !p.fail,
    };
  }
}
