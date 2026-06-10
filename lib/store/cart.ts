"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  lineId: string; // `${productId}:${variantId ?? "default"}`
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantId: string | null;
  variantInfo: string | null;
  unitPrice: number;
  quantity: number;
};

type AddInput = Omit<CartItem, "lineId">;

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (item: AddInput, quantity?: number) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const lineIdFor = (productId: string, variantId: string | null) =>
  `${productId}:${variantId ?? "default"}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (item, quantity = 1) =>
        set((state) => {
          const lineId = lineIdFor(item.productId, item.variantId);
          const existing = state.items.find((i) => i.lineId === lineId);
          let items: CartItem[];
          if (existing) {
            items = state.items.map((i) =>
              i.lineId === lineId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            items = [...state.items, { ...item, lineId, quantity }];
          }
          return { items, isOpen: true };
        }),
      setQuantity: (lineId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.lineId !== lineId)
              : state.items.map((i) =>
                  i.lineId === lineId ? { ...i, quantity } : i
                ),
        })),
      remove: (lineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.lineId !== lineId),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "neckpro-cart",
      // Don't persist the drawer open state.
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Derived selectors (call with the hook).
export const selectCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
