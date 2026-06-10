import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getSettings } from "@/lib/queries";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Premium Ürün | Hızlı Kargo & 14 Gün Koşulsuz İade",
    template: "%s | Mağaza",
  },
  description:
    "Binlerce mutlu müşteri. Hızlı kargo, güvenli ödeme ve 14 gün koşulsuz iade garantisi.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Mağaza",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const config = {
    freeShippingThreshold: Number(settings.free_shipping_threshold || "500"),
    codFee: Number(settings.cod_fee || "19.90"),
    whatsapp: settings.whatsapp_number || "905555555555",
    storeName: settings.store_name || "Mağaza",
  };

  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers config={config}>{children}</Providers>
      </body>
    </html>
  );
}
