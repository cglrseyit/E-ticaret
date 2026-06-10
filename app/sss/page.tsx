import type { Metadata } from "next";
import { LegalShell, LegalH2, LegalP } from "@/components/landing/legal-page";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "Kargo, iade, ödeme, garanti ve ürün kullanımı hakkında merak edilen tüm soruların yanıtları.",
};

const faqs = [
  {
    question: "Siparişim ne kadar sürede elime ulaşır?",
    answer:
      "Siparişiniz 1-2 iş günü içerisinde kargoya teslim edilir. Teslimat süresi bulunduğunuz şehre göre değişmekle birlikte ortalama 2-5 iş günüdür. Kampanya dönemlerinde ve resmî tatillerde bu süre 7 iş gününe kadar uzayabilir.",
  },
  {
    question: "Kargo ücreti ne kadar?",
    answer:
      "500₺ ve üzeri tüm siparişlerinizde kargo ücretsizdir. Bu tutarın altındaki siparişlerde standart kargo bedeli ödeme adımında belirtilir.",
  },
  {
    question: "Kapıda ödeme seçeneği var mı?",
    answer:
      "Evet. Kapıda nakit veya kredi/banka kartı ile ödeme yapabilirsiniz. Kapıda ödeme tercih edildiğinde 19,90₺ hizmet bedeli sipariş tutarına eklenir.",
  },
  {
    question: "Ürünü iade edebilir miyim?",
    answer:
      "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde, kullanılmamış ve orijinal kutusunda olmak şartıyla koşulsuz iade hakkınız vardır. İade onayı sonrası ücret iadeniz 10 iş günü içinde aynı ödeme kanalına yapılır.",
  },
  {
    question: "Ürün garantili mi?",
    answer:
      "Tüm ürünlerimiz 2 yıl ithalatçı garantisi kapsamındadır. Üretim hatasından kaynaklanan arızalar garanti kapsamındadır. Kullanıcı hatası, fiziksel darbe ve sıvı teması garanti dışındadır.",
  },
  {
    question: "Ödeme bilgilerim güvende mi?",
    answer:
      "Tüm ödemeler 256-bit SSL şifreleme ve PayTR güvenli ödeme altyapısı üzerinden alınır. Kart bilgileriniz hiçbir şekilde tarafımızda saklanmaz.",
  },
  {
    question: "Siparişimi nasıl takip ederim?",
    answer:
      "Siparişiniz kargoya verildiğinde size SMS ve e-posta ile takip numarası iletilir. Ayrıca sitemizdeki “Sipariş Takip” sayfasından e-posta adresiniz ve sipariş numaranız ile durumu sorgulayabilirsiniz.",
  },
  {
    question: "Faturamı nasıl alırım?",
    answer:
      "E-arşiv fatura, siparişiniz kargoya verildikten sonra e-posta adresinize otomatik olarak iletilir. Kurumsal fatura talepleriniz için iletişim formundan bize ulaşabilirsiniz.",
  },
  {
    question: "Adresimi veya siparişimi değiştirebilir miyim?",
    answer:
      "Sipariş kargoya verilmeden önce adres veya ürün değişikliği talebinde bulunabilirsiniz. Lütfen en kısa sürede WhatsApp veya iletişim formu üzerinden bizimle iletişime geçin.",
  },
  {
    question: "Cihazı nasıl kullanırım?",
    answer:
      "Kullanım talimatı ve kullanıcı kılavuzu ürün kutusundan çıkmaktadır. Ayrıca ürün sayfasındaki video ve kullanım sekmesinden de detaylı bilgiye ulaşabilirsiniz.",
  },
];

export default function SssPage() {
  return (
    <LegalShell
      title="Sık Sorulan Sorular"
      description="En çok sorulan sorulara hızlı yanıtlar. Aradığınızı bulamazsanız iletişim sayfamızdan bize ulaşabilirsiniz."
    >
      <Accordion items={faqs} />

      <LegalH2>Başka bir sorunuz mu var?</LegalH2>
      <LegalP>
        Aradığınız yanıtı bulamadıysanız{" "}
        <a className="text-accent hover:underline" href="/iletisim">
          iletişim formumuz
        </a>{" "}
        üzerinden bize ulaşabilirsiniz. Mesai saatleri içinde en geç 24 saat
        içinde dönüş yapıyoruz.
      </LegalP>
    </LegalShell>
  );
}
