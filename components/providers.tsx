"use client";

import { StoreConfigProvider, type StoreConfig } from "@/lib/store/config";
import { CartDrawer } from "@/components/landing/cart-drawer";
import { Tracker } from "@/components/analytics/tracker";
import { CartSync } from "@/components/analytics/cart-sync";

export function Providers({
  config,
  children,
}: {
  config: Partial<StoreConfig>;
  children: React.ReactNode;
}) {
  return (
    <StoreConfigProvider value={config}>
      {children}
      <CartDrawer />
      <Tracker />
      <CartSync />
    </StoreConfigProvider>
  );
}
