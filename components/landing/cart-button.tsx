"use client";

import { ShoppingBag } from "lucide-react";
import { useCart, selectCount } from "@/lib/store/cart";

export function CartButton() {
  const count = useCart(selectCount);
  const open = useCart((s) => s.open);

  return (
    <button
      onClick={open}
      aria-label="Sepet"
      className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-muted"
    >
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </button>
  );
}
