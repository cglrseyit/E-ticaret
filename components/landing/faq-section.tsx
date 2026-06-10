import { Section, SectionHeading } from "@/components/landing/section";
import { Accordion } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Kargo ne kadar sürede gelir?",
    answer:
      "Siparişiniz 1-2 iş günü içinde kargoya verilir, teslimat 2-5 iş günü sürer. Yoğun dönemlerde bu süre 7 iş gününe kadar uzayabilir. 500₺ üzeri siparişlerde kargo ücretsizdir.",
  },
  {
    question: "İade ve değişim koşulları nedir?",
    answer:
      "Ürünü teslim aldıktan sonra 14 gün içinde, kullanılmamış ve orijinal kutusunda olmak şartıyla koşulsuz iade edebilirsiniz. Ücret iadesi 10 iş günü içinde yapılır.",
  },
  {
    question: "Ürün garantili mi?",
    answer:
      "Evet, tüm ürünlerimiz 2 yıl ithalatçı garantisi kapsamındadır. Kullanıcı hatası ve sıvı teması dışındaki arızalar garanti kapsamındadır.",
  },
  {
    question: "Ödeme güvenli mi?",
    answer:
      "Ödemeleriniz 256-bit SSL şifreleme ile korunur. Kredi/banka kartı ile güvenli ödeme yapabilir veya kapıda ödeme seçeneğini kullanabilirsiniz. Kart bilgileriniz tarafımızda saklanmaz.",
  },
  {
    question: "Kapıda ödeme var mı?",
    answer:
      "Evet, kapıda nakit veya kart ile ödeme yapabilirsiniz. Kapıda ödeme seçeneğinde 19,90₺ hizmet bedeli eklenir.",
  },
  {
    question: "Cihazı nasıl kullanırım?",
    answer:
      "Cihazı şarj edip boyun veya sırt bölgenize yerleştirin, mod ve yoğunluğu ayarlayın. Günde 10-15 dakika kullanım önerilir. Detaylı kullanım kılavuzu kutudan çıkmaktadır.",
  },
];

export function FaqSection() {
  return (
    <Section muted>
      <SectionHeading eyebrow="SSS" title="Sık Sorulan Sorular" />
      <div className="mx-auto mt-10 max-w-2xl">
        <Accordion items={faqs} />
      </div>
    </Section>
  );
}
