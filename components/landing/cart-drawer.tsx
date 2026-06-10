"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Truck, Trash2, ArrowRight } from "lucide-react";
import { useCart, selectSubtotal, selectCount } from "@/lib/store/cart";
import { useStoreConfig } from "@/lib/store/config";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, setQuantity, remove } = useCart();
  const subtotal = useCart(selectSubtotal);
  const count = useCart(selectCount);
  const { freeShippingThreshold } = useStoreConfig();

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Lock body scroll while open
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!isOpen}
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Sepet"
      >
        <header className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2 font-bold">
            <ShoppingBag size={20} /> Sepetim
            {count > 0 && (
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-hover">
                {count} ürün
              </span>
            )}
          </div>
          <button onClick={close} aria-label="Kapat" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted">
            <X size={20} />
          </button>
        </header>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="border-b bg-accent-soft/40 px-5 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Truck size={16} className="text-accent" />
              {remaining > 0 ? (
                <span>
                  <strong>{formatPrice(remaining)}</strong> daha ekle, kargo{" "}
                  <strong className="text-accent-hover">BEDAVA</strong>!
                </span>
              ) : (
                <span className="font-semibold text-accent-hover">
                  🎉 Ücretsiz kargo kazandın!
                </span>
              )}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-accent-soft">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <ShoppingBag size={48} className="opacity-30" />
              <p>Sepetin boş.</p>
              <Button variant="soft" size="sm" onClick={close}>
                Alışverişe devam et
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((it) => (
                <li key={it.lineId} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-card">
                    <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{it.name}</p>
                    {it.variantInfo && (
                      <p className="text-xs text-muted-foreground">{it.variantInfo}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border">
                        <button onClick={() => setQuantity(it.lineId, it.quantity - 1)} className="grid h-8 w-8 place-items-center hover:bg-muted" aria-label="Azalt">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">{it.quantity}</span>
                        <button onClick={() => setQuantity(it.lineId, it.quantity + 1)} className="grid h-8 w-8 place-items-center hover:bg-muted" aria-label="Artır">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatPrice(it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => remove(it.lineId)} className="self-start text-muted-foreground hover:text-danger" aria-label="Kaldır">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="border-t px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ara toplam</span>
              <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
            </div>
            <Link href="/odeme" onClick={close}>
              <Button size="lg" className="w-full">
                Ödemeye Geç <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/sepet" onClick={close}>
              <Button variant="ghost" size="sm" className="mt-1 w-full">
                Sepeti görüntüle
              </Button>
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
