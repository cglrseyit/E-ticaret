import { createHmac } from "node:crypto";
import type {
  PaymentProvider,
  PaymentOrder,
  CreatePaymentResult,
  VerifyResult,
} from "./provider";

/**
 * PayTR iframe API provider — skeleton.
 *
 * Activate by setting in `.env`:
 *   PAYMENT_PROVIDER=paytr
 *   PAYTR_MERCHANT_ID=xxxxxxx
 *   PAYTR_MERCHANT_KEY=xxxxxxxxxxxxxx
 *   PAYTR_MERCHANT_SALT=xxxxxxxxxxxxxx
 *   NEXT_PUBLIC_SITE_URL=https://your-domain.com
 *
 * Flow (see https://dev.paytr.com/iframe-api):
 *  1. Build the hash from merchant + order params using HMAC-SHA256 + base64
 *  2. POST it to https://www.paytr.com/odeme/api/get-token
 *  3. PayTR returns a token; embed via https://www.paytr.com/odeme/guvenli/{token}
 *  4. PayTR POSTs to /api/payments/paytr/callback with merchant_oid + status
 *  5. Verify hash, update Order, respond "OK" (plain text)
 *
 * This file is intentionally inert — `createPayment` throws unless the env
 * is configured, so the mock provider keeps working during local dev.
 */

const TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";
const IFRAME_BASE = "https://www.paytr.com/odeme/guvenli";

type PayTRConfig = {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  siteUrl: string;
};

function readConfig(): PayTRConfig | null {
  const merchantId = process.env.PAYTR_MERCHANT_ID;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!merchantId || !merchantKey || !merchantSalt || !siteUrl) return null;
  return { merchantId, merchantKey, merchantSalt, siteUrl };
}

/** Convert TRY amount to PayTR's expected integer kuruş. */
function toKurus(amount: number): number {
  return Math.round(amount * 100);
}

/** PayTR's token hash: HMAC-SHA256( merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode , merchant_key ) base64. */
function buildTokenHash(cfg: PayTRConfig, input: {
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: number;
  userBasketB64: string;
  noInstallment: 0 | 1;
  maxInstallment: number;
  currency: "TL" | "EUR" | "USD" | "GBP" | "RUB";
  testMode: 0 | 1;
}): string {
  const concat =
    cfg.merchantId +
    input.userIp +
    input.merchantOid +
    input.email +
    input.paymentAmount +
    input.userBasketB64 +
    input.noInstallment +
    input.maxInstallment +
    input.currency +
    input.testMode +
    cfg.merchantSalt;

  return createHmac("sha256", cfg.merchantKey).update(concat).digest("base64");
}

/** Verify the callback hash PayTR sends to /api/payments/paytr/callback. */
export function verifyCallbackHash(
  cfg: PayTRConfig,
  payload: { merchant_oid: string; status: string; total_amount: string; hash: string }
): boolean {
  const concat =
    payload.merchant_oid +
    cfg.merchantSalt +
    payload.status +
    payload.total_amount;
  const expected = createHmac("sha256", cfg.merchantKey)
    .update(concat)
    .digest("base64");
  return expected === payload.hash;
}

export class PayTRProvider implements PaymentProvider {
  readonly name = "paytr";

  async createPayment(order: PaymentOrder): Promise<CreatePaymentResult> {
    const cfg = readConfig();
    if (!cfg) {
      throw new Error(
        "PayTR is not configured. Set PAYTR_MERCHANT_ID / _KEY / _SALT and NEXT_PUBLIC_SITE_URL in .env."
      );
    }

    // user_basket is a JSON array of [name, unit_price, quantity] tuples,
    // base64-encoded. For a single-product store we put the order line in.
    const basket = JSON.stringify([
      [order.orderNumber, order.total.toFixed(2), 1],
    ]);
    const userBasketB64 = Buffer.from(basket).toString("base64");

    const params = {
      merchant_id: cfg.merchantId,
      user_ip: "0.0.0.0", // TODO: forward real IP from the route handler
      merchant_oid: order.orderNumber.replace(/[^A-Za-z0-9]/g, ""),
      email: order.customerEmail,
      payment_amount: toKurus(order.total),
      user_basket: userBasketB64,
      no_installment: 0 as 0,
      max_installment: 0,
      currency: "TL" as const,
      test_mode: (process.env.PAYTR_TEST_MODE === "1" ? 1 : 0) as 0 | 1,
      user_name: order.customerName,
      user_phone: order.customerPhone,
      user_address: "-", // TODO: pass real address through PaymentOrder
      merchant_ok_url: `${cfg.siteUrl}/odeme/basarili?order=${encodeURIComponent(order.orderNumber)}`,
      merchant_fail_url: `${cfg.siteUrl}/odeme/basarisiz?order=${encodeURIComponent(order.orderNumber)}`,
      timeout_limit: 30,
      debug_on: 0,
      lang: "tr",
    };

    const paytr_token = buildTokenHash(cfg, {
      userIp: params.user_ip,
      merchantOid: params.merchant_oid,
      email: params.email,
      paymentAmount: params.payment_amount,
      userBasketB64,
      noInstallment: params.no_installment,
      maxInstallment: params.max_installment,
      currency: params.currency,
      testMode: params.test_mode,
    });

    const form = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, paytr_token })) {
      form.append(k, String(v));
    }

    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    const json = (await res.json()) as { status: string; token?: string; reason?: string };
    if (json.status !== "success" || !json.token) {
      throw new Error(`PayTR token error: ${json.reason ?? "unknown"}`);
    }

    return {
      iframeToken: json.token,
      // For the iframe flow we redirect the customer to the hosted page.
      redirectUrl: `${IFRAME_BASE}/${json.token}`,
      ref: params.merchant_oid,
    };
  }

  async verifyCallback(payload: unknown): Promise<VerifyResult> {
    const cfg = readConfig();
    if (!cfg) return { orderRef: "", success: false };

    const p = (payload ?? {}) as {
      merchant_oid?: string;
      status?: string;
      total_amount?: string;
      hash?: string;
    };

    if (!p.merchant_oid || !p.status || !p.total_amount || !p.hash) {
      return { orderRef: p.merchant_oid ?? "", success: false };
    }

    const valid = verifyCallbackHash(cfg, {
      merchant_oid: p.merchant_oid,
      status: p.status,
      total_amount: p.total_amount,
      hash: p.hash,
    });

    return {
      orderRef: p.merchant_oid,
      success: valid && p.status === "success",
    };
  }
}
