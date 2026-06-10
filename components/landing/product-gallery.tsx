"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImageDTO } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";

export function ProductGallery({
  images,
  discount,
}: {
  images: ProductImageDTO[];
  discount: number | null;
}) {
  const [active, setActive] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const list = images.length ? images : [];

  const go = (i: number) => {
    const next = (i + list.length) % list.length;
    setActive(next);
  };

  // Sync active index when user swipes the mobile track
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  };

  if (!list.length) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-muted" />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image — desktop click, mobile swipe track */}
      <div className="relative">
        {discount && (
          <Badge variant="sale" className="absolute left-3 top-3 z-10 text-sm shadow-md">
            %{discount} İNDİRİM
          </Badge>
        )}

        {/* Mobile: swipeable track */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl border bg-card sm:hidden"
        >
          {list.map((img) => (
            <div key={img.id} className="relative aspect-square w-full shrink-0 snap-center">
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                sizes="100vw"
                className="object-cover"
                priority={img.sortOrder === 0}
              />
            </div>
          ))}
        </div>

        {/* Desktop: single image with arrows + zoom */}
        <div className="group relative hidden aspect-square w-full overflow-hidden rounded-2xl border bg-card sm:block">
          <Image
            src={list[active].url}
            alt={list[active].alt ?? ""}
            fill
            sizes="(min-width:1024px) 40vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
          {list.length > 1 && (
            <>
              <button
                onClick={() => go(active - 1)}
                aria-label="Önceki görsel"
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 shadow-md backdrop-blur transition hover:bg-background"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => go(active + 1)}
                aria-label="Sonraki görsel"
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 shadow-md backdrop-blur transition hover:bg-background"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Dots (mobile) */}
        {list.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
            {list.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-5 bg-accent" : "w-1.5 bg-stone-300"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails (desktop) */}
      {list.length > 1 && (
        <div className="hidden grid-cols-5 gap-2 sm:grid">
          {list.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition",
                i === active ? "border-accent" : "border-transparent hover:border-border"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
