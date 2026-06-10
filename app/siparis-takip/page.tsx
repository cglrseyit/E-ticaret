import type { Metadata } from "next";
import { LegalShell } from "@/components/landing/legal-page";
import { OrderTracker } from "@/components/landing/order-tracker";

export const metadata: Metadata = {
  title: "Sipariş Takip",
  description:
    "Sipariş numaranız ve e-posta adresiniz ile siparişinizin güncel durumunu öğrenin.",
};

export default function SiparisTakipPage() {
  return (
    <LegalShell
      title="Sipariş Takip"
      description="Sipariş numaranız ve sipariş sırasında kullandığınız e-posta adresinizle siparişinizin durumunu sorgulayın."
    >
      <OrderTracker />
    </LegalShell>
  );
}
