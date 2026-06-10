"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Truck, ArrowLeft } from "lucide-react";
import { useCart, selectSubtotal } from "@/lib/store/cart";
import { useStoreConfig } from "@/lib/store/config";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, setQuantity, remove } = useCart();
  const subtotal = useCart(selectSubtotal);
  const { freeShippingThreshold, shippingCost } = useStoreConfig();

  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : shippingCost;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingBag size={56} className="text-muted-foreground/30" />
        <h1 className="text-2xl font-bold">Sepetin boş</h1>
        <p className="text-muted-foreground">Hemen alışverişe başla.</p>
        <Link href="/">
          <Button size="lg">
            <ArrowLeft size={18} /> Alışverişe başla
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">Sepetim</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="divide-y rounded-2xl border bg-card">
          {items.map((it) => (
            <div key={it.lineId} className="flex gap-4 p-4 sm:p-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border">
                <Image src={it.image} alt={it.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link href="/" className="font-medium hover:text-accent">
                  {it.name}
                </Link>
                {it.variantInfo && (
                  <p className="text-sm text-muted-foreground">{it.variantInfo}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  Birim: {formatPrice(it.unitPrice)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border">
                    <button onClick={() => setQuantity(it.lineId, it.quantity - 1)} className="grid h-9 w-9 place-items-center hover:bg-muted" aria-label="Azalt">
                      <Minus size={15} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium tabular-nums">{it.quantity}</span>
                    <button onClick={() => setQuantity(it.lineId, it.quantity + 1)} className="grid h-9 w-9 place-items-center hover:bg-muted" aria-label="Artır">
                      <Plus size={15} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">{formatPrice(it.unitPrice * it.quantity)}</span>
                    <button onClick={() => remove(it.lineId)} className="text-muted-foreground hover:text-danger" aria-label="Kaldır">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="font-bold">Sipariş Özeti</h2>

          {remaining > 0 ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-accent-soft/40 p-3 text-sm">
              <Truck size={16} className="mt-0.5 text-accent" />
              <span>
                <strong>{formatPrice(remaining)}</strong> daha ekle, kargo bedava!
              </span>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-accent-soft/40 p-3 text-sm font-medium text-accent-hover">
              <Truck size={16} /> Ücretsiz kargo kazandın 🎉
            </div>
          )}

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ara toplam</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Kargo</dt>
              <dd className="font-medium">{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t pt-3 text-base">
              <dt className="font-bold">Toplam</dt>
              <dd className="font-bold text-price">{formatPrice(subtotal + shipping)}</dd>
            </div>
          </dl>

          <Link href="/odeme">
            <Button size="lg" className="mt-4 w-full">
              Ödemeye Geç <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="mt-1 w-full">
              Alışverişe devam et
            </Button>
          </Link>
        </aside>
      </div>
    </main>
  );
}
