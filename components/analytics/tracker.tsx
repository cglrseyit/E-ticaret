"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { trackEvent, type TrackCtx } from "@/lib/analytics/track";

function readCtx(): TrackCtx {
  const params = new URLSearchParams(window.location.search);
  return {
    referrer: document.referrer || undefined,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
  };
}

/**
 * Client-side analytics tracker. Mounted on public pages only (skips /admin).
 * - page_view on each route
 * - product_view on the landing page
 * - time_on_page on tab hide / unload (single event with total seconds)
 * - exit_intent (desktop mouse-to-top; mobile fast upward scroll), once/session
 */
export function Tracker() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // page_view + product_view per route
  React.useEffect(() => {
    if (isAdmin) return;
    const ctx = readCtx();
    trackEvent("page_view", null as never, pathname, ctx);
    if (pathname === "/") {
      trackEvent("product_view", null as never, pathname);
    }
  }, [pathname, isAdmin]);

  // time_on_page: accumulate while visible, flush on hide/unload
  React.useEffect(() => {
    if (isAdmin) return;
    let start = Date.now();
    let accumulated = 0;
    let flushed = false;

    const flush = () => {
      if (flushed) return;
      const seconds = Math.round((accumulated + (Date.now() - start)) / 1000);
      if (seconds >= 2) {
        flushed = true;
        trackEvent("time_on_page", { seconds }, pathname);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        accumulated += Date.now() - start;
        flush();
      } else {
        start = Date.now();
        flushed = false;
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [pathname, isAdmin]);

  // exit_intent (once per session)
  React.useEffect(() => {
    if (isAdmin) return;
    if (sessionStorage.getItem("exit_intent_fired")) return;
    let lastY = window.scrollY;

    const fire = () => {
      if (sessionStorage.getItem("exit_intent_fired")) return;
      sessionStorage.setItem("exit_intent_fired", "1");
      trackEvent("exit_intent", null as never, pathname);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0) fire();
    };
    const onScroll = () => {
      const y = window.scrollY;
      if (lastY - y > 80 && y < 300) fire(); // fast upward scroll near top
      lastY = y;
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, isAdmin]);

  return null;
}
