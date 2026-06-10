import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { LegalShell } from "@/components/landing/legal-page";
import { ContactForm } from "@/components/landing/contact-form";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Soru, öneri ve destek talepleriniz için bize ulaşın. WhatsApp, e-posta veya iletişim formu ile 24 saat içinde dönüş yapıyoruz.",
};

export default async function IletisimPage() {
  const settings = await getSettings();
  const whatsapp = (settings.whatsapp_number || "905555555555").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    "Merhaba, ürün hakkında bilgi almak istiyorum."
  )}`;

  return (
    <LegalShell
      title="İletişim"
      description="Sorularınız, önerileriniz ve destek talepleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz. Mesai saatleri içinde 24 saat içinde dönüş yapıyoruz."
    >
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Bize ulaşın
          </h2>

          <ContactInfo
            icon={MessageCircle}
            title="WhatsApp Destek"
            value="En hızlı yanıt için WhatsApp"
            href={whatsappUrl}
            cta="WhatsApp'tan yaz"
          />
          <ContactInfo
            icon={Mail}
            title="E-posta"
            value="destek@example.com"
            href="mailto:destek@example.com"
          />
          <ContactInfo
            icon={Phone}
            title="Telefon"
            value="0850 000 00 00"
            href="tel:08500000000"
          />
          <ContactInfo
            icon={Clock}
            title="Çalışma Saatleri"
            value="Pzt - Cmt · 09:00 - 18:00"
          />
          <ContactInfo
            icon={MapPin}
            title="Adres"
            value="[ŞİRKET ADI] · [ADRES]"
          />

          <div className="rounded-2xl border bg-muted/40 p-4 text-sm">
            <p className="font-medium">Yardım merkezi</p>
            <p className="mt-1 text-muted-foreground">
              Birçok sorunun yanıtı{" "}
              <Link href="/sss" className="text-accent hover:underline">
                Sık Sorulan Sorular
              </Link>{" "}
              ve{" "}
              <Link href="/kargo-ve-teslimat" className="text-accent hover:underline">
                Kargo &amp; Teslimat
              </Link>{" "}
              sayfalarımızda.
            </p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            Formu doldurun
          </h2>
          <ContactForm />
        </div>
      </div>
    </LegalShell>
  );
}

function ContactInfo({
  icon: Icon,
  title,
  value,
  href,
  cta,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: string;
  href?: string;
  cta?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-hover">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground break-words">{value}</div>
        {cta && href && (
          <div className="mt-1 text-xs font-medium text-accent">{cta} →</div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block rounded-xl border bg-card p-4 transition hover:bg-muted/50"
      >
        {inner}
      </a>
    );
  }
  return <div className="rounded-xl border bg-card p-4">{inner}</div>;
}
