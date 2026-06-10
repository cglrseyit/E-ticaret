import type { Metadata } from "next";
import {
  LegalShell,
  LegalH2,
  LegalP,
  LegalUl,
} from "@/components/landing/legal-page";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Kargo ve Teslimat",
  description:
    "Sipariş hazırlama süresi, kargo firmaları, teslimat süresi ve ücretsiz kargo eşiği.",
};

export default async function KargoPage() {
  const settings = await getSettings();
  const threshold = Number(settings.free_shipping_threshold || "500");

  return (
    <LegalShell
      title="Kargo ve Teslimat"
      description="Siparişleriniz aynı veya ertesi iş günü kargoya teslim edilir. Türkiye'nin her noktasına anlaşmalı kargo firmamızla hızlıca ulaştırılır."
      updatedAt="01.01.2026"
    >
      <LegalH2>1. Sipariş Hazırlama Süresi</LegalH2>
      <LegalP>
        Saat 15:00'a kadar verdiğiniz siparişler aynı iş günü içinde, sonrasında
        verilen siparişler ise bir sonraki iş günü kargoya teslim edilir.
        Hafta sonu ve resmî tatil günlerinde verilen siparişler, takip eden ilk
        iş gününde işleme alınır.
      </LegalP>

      <LegalH2>2. Teslimat Süresi</LegalH2>
      <LegalP>
        Kargoya verilen siparişiniz, bulunduğunuz şehre göre ortalama{" "}
        <strong>2-5 iş günü</strong> içinde adresinize teslim edilir.
      </LegalP>
      <LegalUl>
        <li>Büyükşehirler: 1-3 iş günü</li>
        <li>İl merkezleri: 2-4 iş günü</li>
        <li>İlçeler ve uzak bölgeler: 3-5 iş günü</li>
      </LegalUl>
      <LegalP>
        Kampanya dönemleri, resmî tatiller, olağanüstü hava koşulları ve kargo
        firmasından kaynaklı yoğunluklarda teslimat süresi 7 iş gününe kadar
        uzayabilir.
      </LegalP>

      <LegalH2>3. Kargo Ücreti</LegalH2>
      <LegalP>
        <strong>
          {threshold.toLocaleString("tr-TR")}₺ ve üzeri tüm siparişlerde kargo
          ücretsizdir.
        </strong>{" "}
        Bu tutarın altındaki siparişlerde geçerli kargo bedeli, ödeme adımında
        sipariş özetinizde belirtilir.
      </LegalP>

      <LegalH2>4. Anlaşmalı Kargo Firmaları</LegalH2>
      <LegalP>
        Siparişleriniz Türkiye'nin önde gelen kargo firmalarıyla taşınır:
      </LegalP>
      <LegalUl>
        <li>Yurtiçi Kargo</li>
        <li>Aras Kargo</li>
        <li>MNG Kargo</li>
        <li>PTT Kargo</li>
      </LegalUl>
      <LegalP>
        Hangi firmanın kullanılacağı bulunduğunuz bölgeye göre belirlenir; takip
        numarası kargo verildiğinde tarafınıza iletilir.
      </LegalP>

      <LegalH2>5. Sipariş Takibi</LegalH2>
      <LegalP>
        Kargonuz teslim edildiğinde SMS ve e-posta ile takip numarası
        gönderilir. Ayrıca sitemizdeki{" "}
        <a className="text-accent hover:underline" href="/siparis-takip">
          Sipariş Takip
        </a>{" "}
        sayfasından e-posta adresiniz ve sipariş numaranızla siparişinizin
        güncel durumunu sorgulayabilirsiniz.
      </LegalP>

      <LegalH2>6. Teslim Alma</LegalH2>
      <LegalP>
        Kargo paketini teslim alırken lütfen hasar kontrolü yapın. Pakette
        görünür bir hasar varsa kargo görevlisinden tutanak tutmasını talep edin
        ve teslim almadan iletişime geçin. Hasar tutanağı tutulmadan teslim
        alınan ürünlerde sorumluluk müşteriye aittir.
      </LegalP>

      <LegalH2>7. Adres Değişikliği</LegalH2>
      <LegalP>
        Siparişiniz kargoya verilmeden önce adres değişikliği talebinde
        bulunabilirsiniz. Kargoya verildikten sonra adres değişikliği için kargo
        firmasıyla doğrudan iletişime geçmeniz gerekir.
      </LegalP>

      <LegalH2>8. Teslimat Yapılamayan Durumlar</LegalH2>
      <LegalP>
        Adresinizde kimse bulunmuyorsa kargo firması size telefonla ulaşıp ikinci
        bir teslimat dener veya kargoyu en yakın şubede beklemeye alır. 7 gün
        içinde teslim alınmayan kargolar firmamıza iade edilir; iade edilen
        siparişlerin yeniden gönderimi yeni kargo ücretine tabidir.
      </LegalP>
    </LegalShell>
  );
}
