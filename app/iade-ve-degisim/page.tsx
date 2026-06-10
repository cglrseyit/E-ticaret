import type { Metadata } from "next";
import {
  LegalShell,
  LegalH2,
  LegalH3,
  LegalP,
  LegalUl,
  LegalOl,
} from "@/components/landing/legal-page";

export const metadata: Metadata = {
  title: "İade ve Değişim Koşulları",
  description:
    "14 gün koşulsuz iade hakkınızı nasıl kullanacağınız, iade süreci ve ücret iadesi süreleri.",
};

export default function IadePage() {
  return (
    <LegalShell
      title="İade ve Değişim Koşulları"
      description="Memnuniyetiniz bizim için önemlidir. Ürünü teslim aldıktan sonra 14 gün içinde koşulsuz iade hakkınızı kullanabilirsiniz."
      updatedAt="01.01.2026"
    >
      <LegalH2>1. Cayma Hakkı</LegalH2>
      <LegalP>
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği uyarınca, tüketici sıfatıyla siparişinizi teslim aldığınız
        tarihten itibaren <strong>14 (on dört) gün</strong> içinde hiçbir gerekçe
        göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına
        sahipsiniz.
      </LegalP>

      <LegalH2>2. İade Koşulları</LegalH2>
      <LegalP>
        İade edilecek ürünün aşağıdaki koşulları taşıması gerekmektedir:
      </LegalP>
      <LegalUl>
        <li>Ürün kullanılmamış ve yeniden satılabilir durumda olmalıdır.</li>
        <li>
          Orijinal kutusu, ambalajı, etiketleri ve tüm aksesuarları eksiksiz
          olmalıdır.
        </li>
        <li>Ürünün kullanım kılavuzu ve faturası ile birlikte gönderilmelidir.</li>
        <li>
          Hijyen ürünleri, kişisel bakım ürünleri ve ambalajı açılmış olan tek
          kullanımlık ürünler, sağlık ve hijyen kuralları gereği iade kapsamı
          dışındadır.
        </li>
      </LegalUl>

      <LegalH2>3. İade Süreci</LegalH2>
      <LegalOl>
        <li>
          <strong>İade talebinizi iletin:</strong>{" "}
          <a className="text-accent hover:underline" href="/iletisim">
            iletişim formu
          </a>{" "}
          ya da WhatsApp üzerinden sipariş numaranız ile bize ulaşın.
        </li>
        <li>
          <strong>Onayı bekleyin:</strong> Talebiniz aynı iş günü içinde
          değerlendirilir; size iade onayı ve kargo bilgileri iletilir.
        </li>
        <li>
          <strong>Ürünü gönderin:</strong> Anlaşmalı kargo firmamız aracılığıyla
          ürünü güvenli şekilde paketleyerek bize ulaştırın.
        </li>
        <li>
          <strong>Kontrol ve onay:</strong> Ürün tarafımıza ulaştıktan sonra 3 iş
          günü içinde incelenir.
        </li>
        <li>
          <strong>Ücret iadesi:</strong> Onaylanan iadelerde tutar, en geç 10 iş
          günü içinde ödeme yaptığınız kanala iade edilir.
        </li>
      </LegalOl>

      <LegalH2>4. İade Kargo Ücreti</LegalH2>
      <LegalP>
        Anlaşmalı kargo firmamız üzerinden gönderilen iadelerde kargo ücreti
        tarafımıza aittir. Anlaşmalı olmayan kargo firmaları ile yapılan
        gönderimlerde kargo ücreti müşteriye aittir; karşı ödemeli gönderiler
        kabul edilmemektedir.
      </LegalP>

      <LegalH2>5. Değişim</LegalH2>
      <LegalP>
        Tek ürün olarak sattığımız üründe varyant (renk/beden) değişimi talepleri
        için lütfen iletişim sayfamızdan bize ulaşın. Stok durumuna göre değişim
        veya iade işlemi başlatılır.
      </LegalP>

      <LegalH3>Ücret İadesi Süresi</LegalH3>
      <LegalP>
        Kredi/banka kartı ile yapılan ödemelerde iade tutarının kartınıza
        yansıma süresi bankanıza göre 2-10 iş günü arasında değişebilir. Banka
        havalesi ile yapılan ödemeler için IBAN bilginizi iletmeniz gerekir.
      </LegalP>

      <LegalH2>6. Arızalı veya Hatalı Ürün</LegalH2>
      <LegalP>
        Teslim aldığınız ürün hasarlı, arızalı veya siparişinizden farklıysa
        teslim tarihinden itibaren 48 saat içinde fotoğrafları ile birlikte bize
        bildirin. Ürün ücretsiz olarak değiştirilir veya bedelinin tamamı iade
        edilir.
      </LegalP>

      <LegalH2>7. İletişim</LegalH2>
      <LegalP>
        İade ile ilgili tüm sorularınız için{" "}
        <a className="text-accent hover:underline" href="/iletisim">
          iletişim formumuzu
        </a>{" "}
        kullanabilir, [ŞİRKET ADI] adresine ([ADRES]) yazabilirsiniz.
      </LegalP>
    </LegalShell>
  );
}
