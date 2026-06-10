// Payment provider abstraction. Swap implementations via PAYMENT_PROVIDER env.
// Faz 3 ships MockPaymentProvider; Faz 8 fills in PayTRProvider.

export type PaymentOrder = {
  orderNumber: string;
  total: number; // TRY
  customerEmail: string;
  customerName: string;
  customerPhone: string;
};

export type CreatePaymentResult = {
  /** Where to send the customer next (mock returns our own success/fail page). */
  redirectUrl?: string;
  /** PayTR iframe token (used by the iframe flow). */
  iframeToken?: string;
  /** Provider-side reference id. */
  ref?: string;
};

export type VerifyResult = {
  orderRef: string;
  success: boolean;
};

export interface PaymentProvider {
  readonly name: string;
  createPayment(order: PaymentOrder): Promise<CreatePaymentResult>;
  verifyCallback(payload: unknown): Promise<VerifyResult>;
}
