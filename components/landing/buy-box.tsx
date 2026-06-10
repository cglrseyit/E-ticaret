"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap, Eye, Flame, Truck, Check } from "lucide-react";
import type { ProductDTO } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/stars";
import { cn, formatPrice, discountPercent } from "@/lib/utils";
import { Countdown } from "@/components/landing/countdown";
import { useCart } from "@/lib/store/cart";
import { trackEvent } from "@/lib/analytics/track";

export function BuyBox({
  product,
  average,
  reviewCount,
  countdownEnd,
  liveViewers,
}: {
  product: ProductDTO;
  average: number;
  reviewCount: number;
  countdownEnd: string | null;
  liveViewers: number;
}) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [added, setAdded] = React.useState(false);

  const [variantId, setVariantId] = React.useState<string | null>(
    product.variants[0]?.id ?? null
  );
  const [qty, setQty] = React.useState(1);

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const unitPrice = product.price + (variant?.priceDiff ?? 0);
  const lineTotal = unitPrice * qty;
  const discount = discountPercent(product.price, product.compareAtPrice);
  const lowStock = product.stock > 0 && product.stock < 20;

  const buildItem = () => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0]?.url ?? "",
    variantId: variant?.id ?? null,
    variantInfo: variant ? `${variant.name}: ${variant.value}` : null,
    unitPrice,
  });

  const handleAdd = () => {
    add(buildItem(), qty);
    trackEvent("add_to_cart", { quantity: qty, productId: product.id });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    add(buildItem(), qty);
    trackEvent("add_to_cart", { quantity: qty, productId: product.id });
    router.push("/odeme");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Title + rating */}
      <div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {product.name}
        </h1>
        <a
          href="#yorumlar"
          className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Stars value={average} size={18} />
          <span className="font-semibold text-foreground">{average.toFixed(1)}</span>
          <span className="underline-offset-2 hover:underline">
            ({reviewCount} değerlendirme)
          </span>
        </a>
      </div>

      <p className="text-[15px] leading-relaxed text-muted-foreground">
        {product.shortDescription}
      </p>

      {/* Price */}
      <div className="flex flex-wrap items-end gap-3">
        <span className="text-3xl font-extrabold tracking-tight text-price sm:text-4xl">
          {formatPrice(unitPrice)}
        </span>
        {product.compareAtPrice && (
          <span className="pb-1 text-lg text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {discount && (
          <Badge variant="sale" className="mb-1.5 text-sm">
            %{discount} İNDİRİM
          </Badge>
        )}
      </div>

      {/* Scarcity row */}
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
        {lowStock && (
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <Flame size={18} className="text-price" />
            Stokta son {product.stock} adet — hızlı tükeniyor!
          </div>
        )}
        {lowStock && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-amber-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-price"
              style={{ width: `${Math.min(100, (product.stock / 20) * 100)}%` }}
            />
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Eye size={16} />
            <span>
              Şu an <strong className="tabular-nums">{liveViewers}</strong> kişi inceliyor
            </span>
          </div>
          {countdownEnd && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-800">
                Kampanya bitişine:
              </span>
              <Countdown target={countdownEnd} />
            </div>
          )}
        </div>
      </div>

      {/* Variant selector */}
      {product.variants.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-semibold">
            {product.variants[0].name}:{" "}
            <span className="text-muted-foreground">{variant?.value}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const selected = v.id === variantId;
              const out = v.stock <= 0;
              return (
                <button
                  key={v.id}
                  disabled={out}
                  onClick={() => setVariantId(v.id)}
                  className={cn(
                    "rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition",
                    selected
                      ? "border-accent bg-accent-soft text-accent-hover"
                      : "border-border hover:border-foreground/30",
                    out && "cursor-not-allowed opacity-40 line-through"
                  )}
                >
                  {v.value}
                  {v.priceDiff > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      +{formatPrice(v.priceDiff)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity + CTA */}
      <div className="flex items-stretch gap-3">
        <div className="flex items-center rounded-xl border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-12 w-12 place-items-center rounded-l-xl hover:bg-muted"
            aria-label="Adet azalt"
          >
            <Minus size={18} />
          </button>
          <span className="w-10 text-center font-semibold tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            className="grid h-12 w-12 place-items-center rounded-r-xl hover:bg-muted"
            aria-label="Adet artır"
          >
            <Plus size={18} />
          </button>
        </div>

        <Button
          size="lg"
          className="flex-1 text-base"
          onClick={handleAdd}
          disabled={product.stock <= 0}
        >
          {added ? (
            <>
              <Check size={20} /> Sepete Eklendi
            </>
          ) : (
            <>
              <ShoppingCart size={20} /> Sepete Ekle
            </>
          )}
        </Button>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleBuyNow}
        disabled={product.stock <= 0}
      >
        <Zap size={20} />
        Hemen Al — {formatPrice(lineTotal)}
      </Button>

      {/* Inline trust line */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Truck size={16} className="text-accent" />
        <span>
          Bugün sipariş ver, <strong className="text-foreground">2 iş gününde</strong> kargoda
        </span>
      </div>
    </div>
  );
}
