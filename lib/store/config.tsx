"use client";

import * as React from "react";

export type StoreConfig = {
  freeShippingThreshold: number;
  shippingCost: number;
  codFee: number;
  whatsapp: string;
  storeName: string;
};

const defaults: StoreConfig = {
  freeShippingThreshold: 500,
  shippingCost: 49.9,
  codFee: 19.9,
  whatsapp: "905555555555",
  storeName: "Mağaza",
};

const Ctx = React.createContext<StoreConfig>(defaults);

export function StoreConfigProvider({
  value,
  children,
}: {
  value: Partial<StoreConfig>;
  children: React.ReactNode;
}) {
  const merged = React.useMemo(() => ({ ...defaults, ...value }), [value]);
  return <Ctx.Provider value={merged}>{children}</Ctx.Provider>;
}

export function useStoreConfig() {
  return React.useContext(Ctx);
}
