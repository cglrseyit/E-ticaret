import type { Metadata } from "next";
import {
  LegalShell,
  LegalH2,
  LegalH3,
  LegalP,
  LegalUl,
} from "@/components/landing/legal-page";

export const metadata: Metadata = {
  title: "Gizlilik Politikası ve KVKK",
  description:
    "6698 sayılı KVKK kapsamında kişisel verilerin korunması, işlenme amaçları, saklama süresi ve haklarınız.",
};

export default function GizlilikPage() {
  return (
    <LegalShell
      title="Gizlilik Politikası ve KVKK Aydınlatma Metni"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) çerçevesinde, veri sorumlusu sıfatıyla kişisel verilerinizin işlenmesine ilişkin aydınlatma metnidir."
      updatedAt="01.01.2026"
    >
      <LegalH2>1. Veri Sorumlusu</LegalH2>
      <LegalP>
        Ünvan: [ŞİRKET ADI]
        <br />
        Adres: [ADRES]
        <br />
        E-posta: destek@example.com
      </LegalP>

      <LegalH2>2. İşlenen Kişisel Veriler</LegalH2>
      <LegalP>
        Hizmetlerimizden yararlanmanız sırasında aşağıdaki kişisel verileriniz
        işlenebilir:
      </LegalP>
      <LegalUl>
        <li>
          <strong>Kimlik bilgileri:</strong> ad, soyad
        </li>
        <li>
          <strong>İletişim bilgileri:</strong> e-posta, telefon, teslimat
          adresi, fatura adresi
        </li>
        <li>
          <strong>Müşteri işlem bilgileri:</strong> sipariş geçmişi, sepet
          içeriği, talep ve şikayetler
        </li>
        <li>
          <strong>İşlem güvenliği bilgileri:</strong> IP adresi, oturum
          bilgileri, çerez kayıtları
        </li>
        <li>
          <strong>Pazarlama bilgileri:</strong> alışveriş alışkanlıkları,
          kampanya tercihleri, anonimleştirilmiş analitik veriler
        </li>
        <li>
          <strong>Finansal bilgiler:</strong> ödeme bilgileri (kart bilgileri
          tarafımıza iletilmez, PayTR güvenli ödeme altyapısı üzerinden
          işlenir)
        </li>
      </LegalUl>

      <LegalH2>3. Kişisel Verilerin İşlenme Amaçları</LegalH2>
      <LegalUl>
        <li>Sipariş oluşturma, ödeme ve teslimat süreçlerinin yürütülmesi</li>
        <li>Müşteri hizmetleri ve destek faaliyetlerinin yürütülmesi</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi (fatura, vergi vb.)</li>
        <li>
          Sözleşmenin kurulması ve ifasıyla doğrudan ilgili veri işleme
          faaliyetleri
        </li>
        <li>
          Hizmet kalitesinin artırılması, analitik ve istatistiksel
          değerlendirmeler
        </li>
        <li>
          Açık rızanız olması halinde pazarlama, kampanya ve özel teklif
          bildirimleri
        </li>
      </LegalUl>

      <LegalH2>4. Kişisel Verilerin Aktarımı</LegalH2>
      <LegalP>
        Kişisel verileriniz; yasal düzenlemeler çerçevesinde aşağıdaki taraflara
        aktarılabilir:
      </LegalP>
      <LegalUl>
        <li>Anlaşmalı kargo firmaları (teslimat amacıyla)</li>
        <li>Ödeme altyapı sağlayıcısı (PayTR - güvenli ödeme amacıyla)</li>
        <li>E-fatura / e-arşiv hizmet sağlayıcıları (yasal yükümlülük)</li>
        <li>Mali müşavir ve hukuk danışmanları (gerekli olduğu ölçüde)</li>
        <li>
          Yetkili kamu kurum ve kuruluşları (yasal talep halinde)
        </li>
      </LegalUl>

      <LegalH2>5. Veri Toplama Yöntemi ve Hukuki Sebebi</LegalH2>
      <LegalP>
        Kişisel verileriniz; web sitemiz üzerinden elektronik ortamda, sözleşme
        kurulması, sözleşmenin ifası, hukuki yükümlülüklerin yerine getirilmesi
        ve meşru menfaatlerimiz hukuki sebeplerine dayanılarak toplanmaktadır.
        Pazarlama amaçlı işlemeler için açık rıza alınır.
      </LegalP>

      <LegalH2>6. Çerez (Cookie) Politikası</LegalH2>
      <LegalP>
        Web sitemizde kullanıcı deneyimini iyileştirmek, sepetinizi hatırlamak
        ve site kullanımına ilişkin istatistikleri toplamak amacıyla çerezler
        kullanılmaktadır.
      </LegalP>
      <LegalH3>Kullanılan çerez türleri</LegalH3>
      <LegalUl>
        <li>
          <strong>Zorunlu çerezler:</strong> sepet ve oturum işlevleri için
          gereklidir (`sid`).
        </li>
        <li>
          <strong>Analitik çerezler:</strong> ziyaretçi davranışını anonim
          olarak ölçer (kendi geliştirdiğimiz analitik altyapısı).
        </li>
      </LegalUl>
      <LegalP>
        Tarayıcı ayarlarınızdan çerezleri istediğiniz zaman silebilir veya
        engelleyebilirsiniz; ancak bu durumda bazı işlevler kullanılamayabilir.
      </LegalP>

      <LegalH2>7. Saklama Süresi</LegalH2>
      <LegalP>
        Kişisel verileriniz, ilgili mevzuatta öngörülen süreler boyunca (vergi
        ve ticaret mevzuatı için 10 yıl, KVKK kapsamında işlenme amacının
        sona ermesinin ardından makul süre içinde) saklanır ve süre sonunda
        silinir, yok edilir veya anonim hale getirilir.
      </LegalP>

      <LegalH2>8. KVKK Kapsamındaki Haklarınız</LegalH2>
      <LegalP>KVKK madde 11 uyarınca veri sahibi olarak aşağıdaki haklara sahipsiniz:</LegalP>
      <LegalUl>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>Kişisel verileriniz işlendiyse buna ilişkin bilgi talep etme</li>
        <li>
          Kişisel verilerinizin işlenme amacını ve bunların amacına uygun
          kullanılıp kullanılmadığını öğrenme
        </li>
        <li>
          Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü
          kişileri bilme
        </li>
        <li>
          Kişisel verilerin eksik veya yanlış işlenmiş olması halinde bunların
          düzeltilmesini isteme
        </li>
        <li>
          KVKK ve ilgili mevzuat hükümlerine uygun olarak işlenmiş olmasına
          rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması halinde
          silinmesini veya yok edilmesini isteme
        </li>
        <li>
          İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz
          edilmesi suretiyle aleyhine bir sonucun ortaya çıkmasına itiraz etme
        </li>
        <li>
          Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara
          uğraması halinde zararın giderilmesini talep etme
        </li>
      </LegalUl>

      <LegalH2>9. Başvuru Yolu</LegalH2>
      <LegalP>
        Yukarıdaki haklarınıza ilişkin taleplerinizi, destek@example.com
        e-posta adresine veya [ADRES] adresine yazılı olarak iletebilirsiniz.
        Başvurularınız en geç 30 gün içinde sonuçlandırılır.
      </LegalP>
    </LegalShell>
  );
}
