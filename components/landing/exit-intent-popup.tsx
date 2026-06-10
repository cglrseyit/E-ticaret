"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Gift, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const SHOWN_KEY = "exit_intent_popup_shown";
const CODE = "HOSGELDIN10";

/**
 * Exit-intent coupon popup. Fires once per session on:
 *  - desktop: mouse leaves through the top of the viewport
 *  - mobile: a fast upward swipe near the top of the page
 * Independent from the analytics tracker so we can re-open in the same load
 * if dismissed accidentally? No — strictly once per session matches the brief.
 */
export function ExitIntentPopup() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const skipRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/odeme") ||
    pathname?.startsWith("/sepet");

  React.useEffect(() => {
    if (skipRoute) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SHOWN_KEY)) return;

    let lastY = window.scrollY;
    let armed = false;
    // Arm after a small delay so we don't fire on initial mouse movement.
    const armTimer = window.setTimeout(() => (armed = true), 4000);

    const trigger = () => {
      if (!armed) return;
      if (sessionStorage.getItem(SHOWN_KEY)) return;
      sessionStorage.setItem(SHOWN_KEY, "1");
      setOpen(true);
    };

    const onMouseOut = (e: MouseEvent) => {
      // Only fire when leaving through the top edge with no related target.
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (lastY - y > 100 && y < 200) trigger();
      lastY = y;
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [skipRoute]);

  // Lock body scroll when open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* no-op */
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Kapat"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="relative bg-gradient-to-br from-accent to-accent-hover p-6 text-center text-accent-foreground">
          <button
            type="button"
            aria-label="Kapat"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <X size={18} />
          </button>

          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/20">
            <Gift size={28} />
          </div>
          <h2
            id="exit-intent-title"
            className="mt-4 text-2xl font-bold tracking-tight"
          >
            Gitmeyin! %10 indirim sizi bekliyor
          </h2>
          <p className="mt-2 text-sm/relaxed text-white/90">
            Sadece bu ziyaretinize özel — kupon kodunu kopyalayın ve ödeme
            adımında uygulayın.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <button
            type="button"
            onClick={copy}
            className="flex w-full items-center justify-between gap-2 rounded-xl border-2 border-dashed border-accent bg-accent-soft px-4 py-4 transition hover:bg-accent-soft/70"
          >
            <span className="text-xs font-medium text-accent-hover">
              KUPON KODU
            </span>
            <span className="font-mono text-xl font-bold tracking-widest text-accent-hover">
              {CODE}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-accent-hover">
              {copied ? (
                <>
                  <Check size={14} /> Kopyalandı
                </>
              ) : (
                <>
                  <Copy size={14} /> Kopyala
                </>
              )}
            </span>
          </button>

          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              setOpen(false);
              document.getElementById("urun")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            İndirimi Kullan
          </Button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            Hayır teşekkürler, devam etmek istemiyorum
          </button>
        </div>
      </div>
    </div>
  );
}
