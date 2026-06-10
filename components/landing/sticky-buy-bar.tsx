"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";
import type { ProductDTO } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { trackEvent } from "@/lib/analytics/track";

/**
 * Mobile sticky add-to-cart bar. Appears once the user scrolls past the hero
 * (tracked via the element with id="urun"). Adds the default variant.
 */
export function StickyBuyBar({ product }: { product: ProductDTO }) {
  const [visible, setVisible] = React.useState(false);
  const add = useCart((s) => s.add);

  React.useEffect(() => {
    const hero = document.getElementById("urun");
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) =>
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const variant = product.variants[0] ?? null;
  const unitPrice = product.price + (variant?.priceDiff ?? 0);

  const handleAdd = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? "",
        variantId: variant?.id ?? null,
        variantInfo: variant ? `${variant.name}: ${variant.value}` : null,
        unitPrice,
      },
      1
    );
    trackEvent("add_to_cart", { quantity: 1, productId: product.id });
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur transition-transform duration-300 sm:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs text-muted-foreground">{product.name}</div>
          <div className="font-bold text-price">{formatPrice(unitPrice)}</div>
        </div>
        <Button size="md" className="shrink-0" onClick={handleAdd}>
          <ShoppingCart size={18} />
          Sepete Ekle
        </Button>
      </div>
    </div>
  );
}
