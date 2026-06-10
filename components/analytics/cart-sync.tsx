"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/store/cart";

/** Debounced mirror of the client cart to the DB (skips /admin). */
export function CartSync() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);

  React.useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const id = setTimeout(() => {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          variantInfo: i.variantInfo,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
      };
      const body = JSON.stringify(payload);
      try {
        const blob = new Blob([body], { type: "application/json" });
        if (!(navigator.sendBeacon && navigator.sendBeacon("/api/cart", blob))) {
          fetch("/api/cart", { method: "POST", body, keepalive: true }).catch(() => {});
        }
      } catch {
        /* no-op */
      }
    }, 800);
    return () => clearTimeout(id);
  }, [items, pathname]);

  return null;
}
