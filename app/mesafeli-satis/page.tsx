import type { Metadata } from "next";
import {
  LegalShell,
  LegalH2,
  LegalP,
  LegalUl,
} from "@/components/landing/legal-page";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "Mesafeli Satış Sözleşmesi şablonu. Sipariş anında ürün ve alıcı bilgileri ile dinamik olarak doldurulur.",
};

export default function MesafeliPage() {
  return (
    <LegalShell
      title="Mesafeli Satış Sözleşmesi"
      description="Aşağıdaki şablon, sipariş anında ürün, tutar ve alıcı bilgileri ile dinamik olarak doldurularak alıcı ve satıcı arasında akdedilir."
      updatedAt="01.01.2026"
    >
      <LegalH2>1. Taraflar</LegalH2>
      <LegalP>
        İşbu sözleşme, aşağıda bilgileri yer alan SATICI ile ALICI arasında,
        tamamen kendi istek ve serbest iradeleri ile aşağıda belirtilen
        şartlarla kurulmuştur.
      </LegalP>

      <LegalP>
        <strong>SATICI:</strong>
        <br />
        Ünvan: [ŞİRKET ADI]
        <br />
        Adres: [ADRES]
        <br />
        Telefon: 0850 000 00 00
        <br />
        E-posta: destek@example.com
        <br />
        Mersis No: [MERSİS NO]
      </LegalP>

      <LegalP>
        <strong>ALICI:</strong>
        <br />
        Ad Soyad: [Sipariş anında doldurulur]
        <br />
        Teslimat Adresi: [Sipariş anında doldurulur]
        <br />
        Telefon: [Sipariş anında doldurulur]
        <br />
        E-posta: [Sipariş anında doldurulur]
      </LegalP>

      <LegalH2>2. Sözleşmenin Konusu</LegalH2>
      <LegalP>
        İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait{" "}
        <a className="text-accent hover:underline" href="/">
          web sitesi
        </a>{" "}
        üzerinden elektronik ortamda siparişini verdiği, sözleşmede nitelikleri
        ve satış fiyatı belirtilen ürünün satışı ile teslimine ilişkin olarak
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin
        saptanmasıdır.
      </LegalP>

      <LegalH2>3. Sözleşme Konusu Ürün</LegalH2>
      <LegalP>
        Ürünün cinsi, türü, miktarı, marka/modeli, satış bedeli, ödeme şekli,
        teslimat bilgileri ALICI'nın sipariş onayında belirtildiği şekilde olup,
        sipariş özeti işbu sözleşmenin ayrılmaz parçasıdır.
      </LegalP>
      <LegalUl>
        <li>Ürün adı: [Sipariş anında doldurulur]</li>
        <li>Adet: [Sipariş anında doldurulur]</li>
        <li>Birim fiyat: [Sipariş anında doldurulur]</li>
        <li>Kargo bedeli: [Sipariş anında doldurulur]</li>
        <li>Toplam tutar (KDV dahil): [Sipariş anında doldurulur]</li>
      </LegalUl>

      <LegalH2>4. Genel Hükümler</LegalH2>
      <LegalUl>
        <li>
          ALICI, sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme
          şekli ile teslimata ilişkin tüm ön bilgileri okuyup bilgi sahibi
          olduğunu ve elektronik ortamda onay verdiğini kabul, beyan ve taahhüt
          eder.
        </li>
        <li>
          Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her
          bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak
          kargoya teslim tarihinden itibaren ortalama 2-5 iş günü içinde
          ALICI'nın belirttiği adrese teslim edilir.
        </li>
        <li>
          Sözleşme konusu ürünün teslimatı için işbu sözleşmenin elektronik
          ortamda onaylanmış olması ve satış bedelinin ALICI'nın tercih ettiği
          ödeme şekliyle ödenmiş olması şarttır.
        </li>
        <li>
          Ürünün hasarlı, ayıplı veya kusurlu çıkması durumunda ALICI, ürünü
          kullanmadan SATICI'ya bildirim yapmakla yükümlüdür.
        </li>
      </LegalUl>

      <LegalH2>5. Cayma Hakkı</LegalH2>
      <LegalP>
        ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi
        veya kuruluşa tesliminden itibaren <strong>14 (on dört) gün</strong>{" "}
        içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir
        gerekçe göstermeksizin sözleşmeden cayma hakkını kullanabilir.
      </LegalP>
      <LegalP>
        Cayma hakkının kullanılması için süre içinde SATICI'ya yazılı bildirimde
        bulunulması ve ürünün ambalajı açılmış olsa dahi tekrar satılabilir
        durumda olması şarttır. Detaylı bilgi{" "}
        <a className="text-accent hover:underline" href="/iade-ve-degisim">
          İade ve Değişim
        </a>{" "}
        sayfamızda yer almaktadır.
      </LegalP>

      <LegalH2>6. Cayma Hakkının Kullanılamayacağı Ürünler</LegalH2>
      <LegalP>
        Niteliği itibarıyla iade edilemeyecek ürünler, hızla bozulan veya son
        kullanma tarihi geçebilecek ürünler ve tek kullanımlık hijyen ürünleri
        (ambalajı açılmış olanlar) cayma hakkı kapsamı dışındadır.
      </LegalP>

      <LegalH2>7. Yetkili Mahkeme</LegalH2>
      <LegalP>
        İşbu sözleşmenin uygulanmasında, Sanayi ve Ticaret Bakanlığınca ilan
        edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya
        SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
      </LegalP>

      <LegalH2>8. Yürürlük</LegalH2>
      <LegalP>
        ALICI, siteden verdiği elektronik siparişle birlikte işbu sözleşmenin
        tüm koşullarını kabul etmiş sayılır. Sözleşme, siparişin verildiği
        tarihte yürürlüğe girer.
      </LegalP>
    </LegalShell>
  );
}
