import type { Metadata } from "next";
import {
  LegalShell,
  LegalH2,
  LegalP,
  LegalUl,
} from "@/components/landing/legal-page";

export const metadata: Metadata = {
  title: "Garanti Koşulları",
  description:
    "Ürünlerimizde 2 yıl ithalatçı garantisi. Kapsam, kapsam dışı durumlar ve arıza süreci.",
};

export default function GarantiPage() {
  return (
    <LegalShell
      title="Garanti Koşulları"
      description="Tüm ürünlerimiz 2 yıl ithalatçı garantisi kapsamındadır. Üretim kaynaklı arızalar ücretsiz onarılır veya değiştirilir."
      updatedAt="01.01.2026"
    >
      <LegalH2>1. Garanti Süresi</LegalH2>
      <LegalP>
        Satın aldığınız ürün, faturanın düzenlendiği tarihten itibaren{" "}
        <strong>2 (iki) yıl</strong> süresince ithalatçı garantisi altındadır.
        Garanti süresi içinde üretimden kaynaklanan arızalar ücretsiz olarak
        onarılır, onarımın mümkün olmadığı durumlarda ürün yenisi ile
        değiştirilir.
      </LegalP>

      <LegalH2>2. Garanti Kapsamı</LegalH2>
      <LegalUl>
        <li>Üretim hatalarından kaynaklanan arızalar</li>
        <li>Malzeme kalitesinden kaynaklanan arızalar</li>
        <li>Montaj veya işçilik hatasından kaynaklanan arızalar</li>
        <li>Normal kullanım koşullarında ortaya çıkan elektronik arızalar</li>
      </LegalUl>

      <LegalH2>3. Garanti Kapsamı Dışı Durumlar</LegalH2>
      <LegalP>Aşağıdaki durumlar garanti kapsamı dışındadır:</LegalP>
      <LegalUl>
        <li>
          Kullanım kılavuzunda belirtilen koşullara aykırı kullanımdan
          kaynaklanan arızalar
        </li>
        <li>Fiziksel darbe, düşürme, kırılma sonucu oluşan hasarlar</li>
        <li>Sıvı teması, nem, su girmesi sonucu oluşan arızalar</li>
        <li>
          Aşırı sıcaklık veya soğuk ortamda saklama / kullanım sonucu oluşan
          arızalar
        </li>
        <li>
          Yetkili olmayan kişi veya servislerce yapılan müdahale ve onarımlar
        </li>
        <li>
          Voltaj farklılıkları, şebeke arızaları ve elektrik kaynaklı dış
          etkenlerden doğan hasarlar
        </li>
        <li>Doğal afetler, yangın, hırsızlık vb. olağanüstü durumlar</li>
        <li>Sarf malzemeleri (aksesuar, kablo, başlık vb. zamanla aşınan parçalar)</li>
      </LegalUl>

      <LegalH2>4. Arıza Durumunda Süreç</LegalH2>
      <LegalP>
        Ürününüzde bir arıza oluşması durumunda{" "}
        <a className="text-accent hover:underline" href="/iletisim">
          iletişim formumuz
        </a>{" "}
        veya WhatsApp hattımız üzerinden bize ulaşabilirsiniz. Süreç şu şekilde
        ilerler:
      </LegalP>
      <LegalUl>
        <li>Arıza talebiniz oluşturulur ve servis kaydı açılır.</li>
        <li>Anlaşmalı kargomuzla ürün ücretsiz olarak servise alınır.</li>
        <li>İnceleme sonucu en geç 7 iş günü içinde tarafınıza bildirilir.</li>
        <li>
          Garanti kapsamındaki arızalar 20 iş günü içinde ücretsiz olarak
          giderilir.
        </li>
        <li>Onarım sonrası ürün ücretsiz olarak adresinize iletilir.</li>
      </LegalUl>

      <LegalH2>5. Garanti Belgesinin İbrazı</LegalH2>
      <LegalP>
        Garanti hizmetlerinden faydalanabilmek için satın alma faturanızın
        ibrazı yeterlidir. E-arşiv faturanız siparişiniz kargoya verildiğinde
        e-posta adresinize iletilmiştir.
      </LegalP>

      <LegalH2>6. Yasal Haklar</LegalH2>
      <LegalP>
        Bu garanti belgesi 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
        ilgili yönetmelikler çerçevesinde tanınan yasal haklarınıza ek olarak
        verilmiştir. Tüketici Hakem Heyeti ve Tüketici Mahkemelerine başvuru
        haklarınız saklıdır.
      </LegalP>

      <LegalH2>7. İthalatçı / Üretici Firma</LegalH2>
      <LegalP>
        Ünvan: [ŞİRKET ADI]
        <br />
        Adres: [ADRES]
        <br />
        Telefon: 0850 000 00 00
        <br />
        E-posta: destek@example.com
      </LegalP>
    </LegalShell>
  );
}
