"use client";

/**
 * Lightweight client event tracker. Sends events to /api/track via sendBeacon
 * (falls back to fetch keepalive). The full session/heartbeat pipeline is built
 * in Faz 4; this stub is safe to call before the endpoint exists (errors are
 * swallowed).
 */
export type TrackType =
  | "page_view"
  | "product_view"
  | "time_on_page"
  | "add_to_cart"
  | "remove_from_cart"
  | "checkout_start"
  | "checkout_step"
  | "purchase"
  | "exit_intent";

export type TrackCtx = {
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export function trackEvent(
  type: TrackType,
  metadata?: Record<string, unknown>,
  path?: string,
  ctx?: TrackCtx
) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      type,
      path: path ?? window.location.pathname,
      metadata: metadata ?? null,
      ctx,
    });
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon && navigator.sendBeacon("/api/track", blob)) return;
    fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {
    /* no-op */
  }
}
