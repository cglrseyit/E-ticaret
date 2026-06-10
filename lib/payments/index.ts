import type { PaymentProvider } from "./provider";
import { MockPaymentProvider } from "./mock";
import { PayTRProvider } from "./paytr";

let cached: PaymentProvider | null = null;

/** Returns the active payment provider based on PAYMENT_PROVIDER env. */
export function getPaymentProvider(): PaymentProvider {
  if (cached) return cached;
  const which = process.env.PAYMENT_PROVIDER ?? "mock";
  switch (which) {
    case "paytr":
      cached = new PayTRProvider();
      break;
    case "mock":
    default:
      cached = new MockPaymentProvider();
  }
  return cached;
}

export * from "./provider";
