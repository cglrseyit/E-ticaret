import { prisma } from "@/lib/prisma";

/** Server-side settings reader with sensible numeric defaults. */
export async function getCheckoutSettings() {
  const rows = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    freeShippingThreshold: Number(map.free_shipping_threshold || "500"),
    shippingCost: 49.9,
    codFee: Number(map.cod_fee || "19.90"),
    whatsapp: map.whatsapp_number || "905555555555",
    storeName: map.store_name || "Mağaza",
  };
}
