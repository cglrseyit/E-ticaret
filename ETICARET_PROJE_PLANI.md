# TEK ÜRÜN DROPSHIPPING E-TİCARET SİTESİ — PROJE PLANI

> **Bu dosya Claude Code için hazırlanmıştır.** Fazları sırayla uygula. Her faz sonunda
> `npm run dev` ile uygulamanın ayağa kalktığını ve fazın "Kabul Kriterleri"nin sağlandığını
> doğrula, sonra bir sonraki faza geç. Tasarım üretirken **21st.dev Magic MCP** araçlarını
> kullan (`/ui` komutları) — tasarımlar modern, profesyonel ve dönüşüm odaklı olsun.

---

## 0. PROJE ÖZETİ

- **Konsept:** Tek ürün (one-product store) dropshipping sitesi. Tüm site, ziyaretçiyi TEK bir ürünü satın almaya ikna etmek üzerine kuruludur.
- **İki yüz:** (1) Müşteri tarafı: yüksek dönüşümlü landing/ürün sayfası + satın alma akışı. (2) Yönetim paneli: Shopify benzeri analitik dashboard + ürün/sipariş yönetimi.
- **Dil:** Arayüz tamamen **Türkçe**. Kod, değişken adları ve yorumlar İngilizce.
- **Para birimi:** TRY (₺). Fiyat formatı: `1.299,90 ₺`.
- **Ödeme:** PayTR entegrasyonu sonradan eklenecek. Şimdilik **soyut bir PaymentProvider arayüzü + MockPaymentProvider** yaz; PayTR iframe entegrasyonu için hazır iskelet bırak (detay Faz 6'da).
- **Responsive:** Mobile-first. Trafik ağırlıklı mobilden gelecek (Instagram/TikTok reklamları varsayımı). Her sayfa 360px genişlikte kusursuz olmalı.

---

## 1. TEKNOLOJİ YIĞINI

| Katman | Seçim | Not |
|---|---|---|
| Framework | **Next.js 14+ (App Router) + TypeScript** | SSR → SEO + hız |
| UI | **Tailwind CSS + shadcn/ui** | 21st.dev Magic MCP ile uyumlu |
| Animasyon | framer-motion | Mikro etkileşimler için |
| İkonlar | lucide-react | |
| Veritabanı | **PostgreSQL + Prisma ORM** | Lokalde Docker veya lokal Postgres; prod'da Railway |
| Auth (admin) | NextAuth (Credentials) veya JWT + httpOnly cookie | Sadece admin girişi; müşteri için misafir checkout |
| Grafikler | **recharts** | Admin dashboard |
| Form/validasyon | react-hook-form + zod | |
| State | Zustand (sepet için) + localStorage persist | |
| E-posta | nodemailer (SMTP) — iskelet bırak | Sipariş onayı, terk edilmiş sepet |
| Görsel | next/image + `/public/products/` | Admin panelden upload (lokal disk, prod'da S3-uyumlu adapter iskeleti) |

Kurulum: `npx create-next-app@latest` → TypeScript, Tailwind, App Router, ESLint seçili.
Ek paketler: `prisma @prisma/client zod react-hook-form zustand recharts framer-motion lucide-react clsx tailwind-merge class-variance-authority date-fns bcryptjs jsonwebtoken nodemailer`

---

## 2. 21st.dev MAGIC MCP KULLANIMI (TASARIM)

- MCP zaten yapılandırılmış olmalı (kurulum komutu bu dosyanın sonunda, kullanıcı notlarında).
- Yeni bir UI bileşeni gerektiğinde Magic MCP'den ilham al / üret: hero section, ürün galerisi, testimonial slider, pricing card, FAQ accordion, admin sidebar, stat cards, charts layout.
- **Tasarım dili:** Temiz, premium, güven veren. Bol beyaz alan, tek vurgu rengi (accent), büyük ve okunaklı tipografi, yumuşak gölgeler, yuvarlatılmış köşeler (rounded-2xl). "Ucuz dropshipping sitesi" gibi DEĞİL, marka sitesi gibi görünmeli.
- Renk paleti CSS değişkenleriyle merkezi yönetilsin (`globals.css` → `--primary`, `--accent` vb.) ki sonradan marka rengine göre tek yerden değişsin.
- Magic'in ürettiği bileşenlerde `"use client"`, Tailwind v3/v4 uyumu ve gerekli bağımlılıkları (`framer-motion`, `@radix-ui/react-slot` vb.) kontrol et.

---

## 3. VERİTABANI ŞEMASI (Prisma)

```prisma
model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         String   @default("admin") // admin | staff
  createdAt    DateTime @default(now())
}

model Product {
  id              String   @id @default(cuid())
  slug            String   @unique
  name            String
  shortDescription String
  description     String   // zengin metin (HTML/markdown)
  price           Decimal  @db.Decimal(10,2)
  compareAtPrice  Decimal? @db.Decimal(10,2) // üstü çizili "eski fiyat"
  costPrice       Decimal? @db.Decimal(10,2) // tedarik maliyeti → kâr hesabı
  stock           Int      @default(100)
  sku             String?
  isActive        Boolean  @default(true)
  images          ProductImage[]
  variants        ProductVariant[]
  reviews         Review[]
  seoTitle        String?
  seoDescription  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model ProductImage { id String @id @default(cuid()); url String; alt String?; sortOrder Int @default(0); productId String; product Product @relation(...) }

model ProductVariant { // renk/beden vb. — tek ürün olsa da varyant desteği olsun
  id String @id @default(cuid()); name String; value String; priceDiff Decimal @default(0) @db.Decimal(10,2); stock Int @default(100); productId String; ...
}

model Review { // admin panelden eklenebilir + onay mekanizması
  id String @id @default(cuid()); authorName String; rating Int; title String?; body String; isApproved Boolean @default(true); isVerifiedPurchase Boolean @default(false); createdAt DateTime @default(now()); productId String; ...
}

model Order {
  id            String   @id @default(cuid())
  orderNumber   String   @unique // örn: BLS-2026-00001 gibi okunaklı
  status        String   @default("pending") // pending | paid | shipped | delivered | cancelled | refunded
  customerName  String
  customerEmail String
  customerPhone String
  address       String
  city          String
  district      String
  zipCode       String?
  items         OrderItem[]
  subtotal      Decimal @db.Decimal(10,2)
  shippingCost  Decimal @default(0) @db.Decimal(10,2)
  discount      Decimal @default(0) @db.Decimal(10,2)
  total         Decimal @db.Decimal(10,2)
  paymentMethod String  @default("paytr") // paytr | cod (kapıda ödeme)
  paymentStatus String  @default("unpaid") // unpaid | paid | failed | refunded
  paymentRef    String? // PayTR merchant_oid
  trackingNumber String?
  cargoCompany  String?
  note          String?
  sessionId     String? // analitik eşleştirme
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model OrderItem { id String @id @default(cuid()); orderId String; productId String; variantInfo String?; quantity Int; unitPrice Decimal @db.Decimal(10,2); ... }

model Cart { // sepet sunucu tarafında da izlensin → "sepete ekli ürünler" raporu için
  id        String   @id @default(cuid())
  sessionId String   @unique
  items     CartItem[]
  status    String   @default("active") // active | converted | abandoned
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CartItem { id String @id @default(cuid()); cartId String; productId String; variantInfo String?; quantity Int; ... }

model VisitorSession {
  id         String   @id @default(cuid()) // client'ta cookie ile tutulan sessionId
  firstSeen  DateTime @default(now())
  lastSeen   DateTime @updatedAt
  userAgent  String?
  referrer   String?
  utmSource  String?; utmMedium String?; utmCampaign String?
  device     String?  // mobile | desktop | tablet (UA'dan parse)
  country    String?
  isReturning Boolean @default(false)
  events     AnalyticsEvent[]
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  sessionId String
  session   VisitorSession @relation(...)
  type      String   // page_view | product_view | time_on_page | add_to_cart | remove_from_cart | checkout_start | checkout_step | purchase | exit_intent
  path      String?
  metadata  Json?    // örn: { seconds: 45 } veya { quantity: 2 }
  createdAt DateTime @default(now())
  @@index([type, createdAt])
  @@index([sessionId])
}

model Coupon { id String @id @default(cuid()); code String @unique; type String; value Decimal @db.Decimal(10,2); isActive Boolean @default(true); usageLimit Int?; usedCount Int @default(0); expiresAt DateTime?; }

model SiteSetting { // tekil ayarlar key-value
  key String @id // örn: "free_shipping_threshold", "announcement_bar_text", "whatsapp_number", "countdown_end"
  value String
}
```

**Seed script (`prisma/seed.ts`):**
- 1 admin kullanıcı: `admin@site.com / Admin123!` (bcrypt hash) — README'ye not düş, ilk girişte değiştirilmesi önerilsin.
- 1 örnek ürün: gerçekçi bir dropshipping ürünü uydur (örn. "Akıllı Boyun Masaj Cihazı"), 4-5 placeholder görsel, `compareAtPrice` ile indirimli fiyat, 8-10 gerçekçi Türkçe müşteri yorumu (4-5 yıldız ağırlıklı, 1-2 tane 3 yıldız → inandırıcılık).
- Site ayarları: ücretsiz kargo eşiği 500₺, duyuru bandı metni, WhatsApp numarası placeholder.
- **Demo analitik verisi:** son 30 gün için rastgele ama gerçekçi dağılımlı session + event + sipariş verisi üret (günde 80-300 ziyaret, %1.5-3 dönüşüm) ki dashboard ilk açılışta dolu görünsün. Seed'de `--demo` flag'i ile opsiyonel yap.

---

## 4. SAYFA YAPISI

### 4.1 Müşteri Tarafı (public)

```
/                      → Landing + ürün sayfası (TEK SAYFA, aşağıda detay)
/sepet                 → Sepet
/odeme                 → Checkout (adres + ödeme)
/odeme/basarili        → Teşekkür sayfası (sipariş no + özet)
/odeme/basarisiz       → Hata sayfası
/siparis-takip         → E-posta + sipariş no ile sorgulama
/sss                   → Sık Sorulan Sorular
/iade-ve-degisim       → İade & Değişim Koşulları
/garanti               → Garanti Koşulları
/gizlilik-politikasi   → Gizlilik / KVKK
/mesafeli-satis        → Mesafeli Satış Sözleşmesi
/kargo-ve-teslimat     → Kargo & Teslimat
/iletisim              → İletişim formu + WhatsApp linki
```

### 4.2 Admin Paneli (`/admin`, auth korumalı, middleware ile)

```
/admin/login
/admin                 → Dashboard (analitik özet — Shopify tarzı)
/admin/analitik        → Detaylı analitik (saatlik/günlük grafikler, funnel)
/admin/canli           → Canlı görünüm (son 30 dk aktif ziyaretçi, gerçek zamanlı)
/admin/urunler         → Ürün listesi
/admin/urunler/yeni    → Ürün ekleme (görsel upload dahil)
/admin/urunler/[id]    → Ürün düzenleme
/admin/siparisler      → Sipariş listesi (filtre: durum, tarih)
/admin/siparisler/[id] → Sipariş detay (durum güncelle, kargo no gir)
/admin/sepetler        → Aktif & terk edilmiş sepetler
/admin/yorumlar        → Yorum yönetimi (ekle/onayla/sil)
/admin/kuponlar        → Kupon yönetimi
/admin/ayarlar         → Site ayarları (duyuru bandı, kargo eşiği, WhatsApp no, sayaç bitişi)
```

---

## 5. MÜŞTERİ TARAFI — DÖNÜŞÜM ODAKLI LANDING/ÜRÜN SAYFASI

Ana sayfa = ürün sayfası. Ziyaretçiyi ikna etmek için yukarıdan aşağıya şu bloklar (her biri ayrı component):

1. **Duyuru bandı** (üstte, ayarlardan yönetilir): "🚚 Bugün sipariş ver, 2 iş gününde kargoda — 500₺ üzeri ÜCRETSİZ kargo"
2. **Hero / Ürün vitrini:** Sol: görsel galeri (zoom, thumbnail, swipe — mobilde dokunmatik). Sağ: ürün adı, ⭐ ortalama puan + yorum sayısı (yorumlara scroll link), fiyat + üstü çizili eski fiyat + "%XX İNDİRİM" rozeti, varyant seçici, adet seçici, **büyük "Sepete Ekle" CTA** + altında "Hemen Al" (direkt checkout).
3. **Güven rozetleri** (CTA hemen altında): 🔒 256-bit SSL · 📦 14 gün koşulsuz iade · 🚚 Hızlı kargo · 💳 Güvenli ödeme (PayTR/kart logoları placeholder)
4. **Aciliyet/kıtlık öğeleri:** "Son X ürün!" (gerçek stok < 20 ise göster) · geri sayım sayacı (ayarlardan bitiş tarihi; kampanya) · "Şu an **N kişi** bu ürünü inceliyor" (gerçek: son 5 dk aktif session sayısı; minimum taban değeri ayarlardan).
5. **Fayda odaklı özellik bölümü:** 3-4 ikon + başlık + kısa metin ("Özellik değil fayda anlat" prensibi).
6. **Sosyal kanıt şeridi:** "10.000+ mutlu müşteri" + basın/medya logoları placeholder.
7. **Ürün detay sekmeleri:** Açıklama · Teknik Özellikler · Kutu İçeriği · Kullanım.
8. **Video alanı** (opsiyonel embed, admin panelden URL).
9. **Müşteri yorumları:** Puan dağılım grafiği (5★ %72 vb.) + yorum kartları + foto placeholder. "Doğrulanmış Alışveriş" rozeti.
10. **Karşılaştırma tablosu:** "Biz vs. Sıradan Ürünler" (✓/✗ tablosu).
11. **SSS accordion** (5-6 soru — kargo süresi, iade, garanti, kullanım).
12. **Garanti vaadi bloğu:** "14 Gün Koşulsuz İade Garantisi — Memnun kalmazsan paranı iade ediyoruz." (büyük, güven veren tasarım)
13. **Son CTA:** Fiyat + buton tekrarı.
14. **Footer:** Yasal sayfa linkleri, iletişim, sosyal medya placeholder.

**Sticky davranışlar:**
- Mobilde alta yapışık **sticky "Sepete Ekle" barı** (fiyat + buton) — kullanıcı hero'yu geçince görünür.
- **Exit-intent popup** (desktop: mouse üste çıkınca; mobil: hızlı yukarı scroll): "%10 indirim kuponu: HOSGELDIN10" — session başına 1 kez.
- Sepete ekleyince yan panel (drawer) açılır: ürün + "Ödemeye Geç" CTA + "X₺ daha ekle, kargo bedava" progress barı.

**Checkout (`/odeme`):**
- Tek sayfa, 2 adım görünümü: (1) İletişim + teslimat adresi (ad, e-posta, telefon, il/ilçe seçici, açık adres), (2) Ödeme yöntemi: "Kredi/Banka Kartı (PayTR)" [şimdilik mock] + "Kapıda Ödeme" (+19,90₺ hizmet bedeli, ayarlardan).
- Sipariş özeti sağda sticky (mobilde açılır-kapanır üstte).
- Kupon kodu alanı.
- Form zod ile valide; telefon maskesi `5XX XXX XX XX`.
- "Siparişi Tamamla" → Order kaydı + sepet `converted` + `purchase` eventi + teşekkür sayfası.
- Mesafeli satış sözleşmesi onay checkbox'ı (linkli).

---

## 6. ÖDEME ALTYAPISI (PayTR'a hazır iskelet)

```ts
// lib/payments/provider.ts
interface PaymentProvider {
  createPayment(order: Order): Promise<{ redirectUrl?: string; iframeToken?: string }>;
  verifyCallback(payload: unknown): Promise<{ orderRef: string; success: boolean }>;
}
```
- `MockPaymentProvider`: 2 sn bekleyip başarılı döner (geliştirme için), `?fail=1` ile başarısız senaryo test edilebilir.
- `PayTRProvider` dosyasını **iskelet olarak** oluştur: PayTR iframe API akışına uygun yorum satırlarıyla — `merchant_id`, `merchant_key`, `merchant_salt` env'den; token isteği `https://www.paytr.com/odeme/api/get-token`; hash üretimi (HMAC-SHA256, base64); `/api/payments/paytr/callback` endpoint'i (POST, hash doğrulama, `OK` cevabı). Gerçek değerler gelince sadece env doldurulup provider değiştirilecek şekilde.
- `.env`: `PAYMENT_PROVIDER=mock` → sonra `paytr`.

---

## 7. ANALİTİK SİSTEMİ (kendi yazacağımız, Shopify tarzı)

### 7.1 Veri toplama (client)
- İlk ziyarette `sessionId` üret (cookie, 30 gün; aynı gün içi tek session sayımı için `lastSeen` mantığı).
- Hafif bir tracker (`lib/analytics/tracker.ts`) — `navigator.sendBeacon` ile `/api/track` endpoint'ine event yollar:
  - `page_view` (her sayfa), `product_view` (ürün görünür olduğunda)
  - `time_on_page`: 15 sn'de bir heartbeat **veya** sayfadan ayrılırken (`visibilitychange`) toplam süre — performans için ayrılırken tek event tercih et: `{ seconds }`
  - `add_to_cart` / `remove_from_cart` `{ quantity }`
  - `checkout_start`, `checkout_step` `{ step }`, `purchase` `{ orderId, total }`
  - `exit_intent`
- UTM parametrelerini ve referrer'ı session'a kaydet. UA'dan cihaz tipi parse et.
- Admin sayfalarında tracker ÇALIŞMASIN.

### 7.2 API
- `POST /api/track` — rate limit (basit in-memory, IP başına), bot filtreleme (UA kontrolü), zod validasyon.
- Sepet senkronizasyonu: sepete ekleme/çıkarma hem Zustand hem `POST /api/cart` ile DB'ye.

### 7.3 Admin Dashboard metrikleri

**Ana dashboard (`/admin`):** Tarih aralığı seçici (Bugün / Dün / Son 7 gün / Son 30 gün / Özel) + önceki dönemle % karşılaştırma okları (Shopify tarzı yeşil/kırmızı).
- Stat kartları: **Toplam Satış (₺)** · **Sipariş Sayısı** · **Ziyaretçi (tekil session)** · **Dönüşüm Oranı** (sipariş/session) · **Ortalama Sepet Tutarı** · **Sepete Ekleme Oranı**
- **Saatlik/Günlük satış grafiği** (recharts AreaChart; "Bugün" seçiliyse saatlik, uzun aralıkta günlük) — önceki dönem kesikli çizgiyle üstüne bindirilmiş.
- Ziyaretçi grafiği (aynı mantık).
- **Dönüşüm hunisi:** Ziyaret → Ürün görüntüleme → Sepete ekleme → Checkout başlatma → Satın alma (her adımda sayı + %).
- Son siparişler tablosu (5 adet) + bekleyen sipariş uyarısı.

**Detaylı analitik (`/admin/analitik`):**
- **Ürün sayfasında ortalama kalma süresi** (time_on_page ortalaması, gün bazlı trend)
- **Geri dönen ziyaretçi oranı** (isReturning)
- Cihaz dağılımı (pasta), trafik kaynağı (utm_source/referrer tablosu)
- Saat bazlı ısı haritası: hangi gün+saat en çok ziyaret/satış (7x24 grid)
- Terk edilmiş sepet oranı ve toplam terk edilen tutar
- En çok kullanılan kuponlar

**Canlı görünüm (`/admin/canli`):**
- Son 5/30 dk aktif ziyaretçi sayısı (10 sn'de bir polling), şu an hangi sayfadalar, bugünkü canlı satış akışı.

**Sepetler (`/admin/sepetler`):**
- Aktif sepetler (içindeki ürün/adet/tutar) · 1 saattir güncellenmeyenler "terk edilmiş" işaretlenir (cron yerine sorgu anında hesapla) · terk edilmiş sepetlere e-posta gönderme butonu (nodemailer iskeleti, şimdilik consol/log).

---

## 8. ADMIN PANELİ — ÜRÜN & SİPARİŞ YÖNETİMİ

- **Ürün formu:** ad, slug (otomatik), kısa açıklama, zengin açıklama (basit markdown/textarea + önizleme), fiyat, eski fiyat, maliyet, stok, SKU, varyantlar (dinamik satır ekle), görsel upload (çoklu, sürükle-bırak, sıralama; `/public/uploads/` altına, dosya adı uuid), SEO başlık/açıklama, aktif/pasif.
- **Sipariş detayı:** durum dropdown (durum değişince `updatedAt`), kargo firması + takip no alanı (girilince müşteriye e-posta iskeleti), iade/iptal işaretleme, sipariş notu, müşteri bilgileri, ödeme durumu.
- **Sipariş listesi:** arama (isim/e-posta/sipariş no), durum filtreleri (sekmeler: Tümü/Bekleyen/Ödendi/Kargoda/Tamamlandı/İptal), CSV dışa aktarma butonu.
- Admin layout: sol sidebar (mobilde hamburger), üstte tarih + çıkış. Koyu/açık tema toggle (nice-to-have).

---

## 9. YASAL/İÇERİK SAYFALARI (HAZIR METİNLERLE DOLDUR)

Aşağıdaki sayfaları **gerçekçi, profesyonel Türkçe metinlerle** doldur (placeholder şirket adı `[ŞİRKET ADI]`, adres `[ADRES]` köşeli parantezle bırakılsın — kullanıcı sonra dolduracak):

- **Garanti Koşulları:** 2 yıl ithalatçı garantisi çerçevesi, garanti kapsamı/kapsam dışı durumlar (kullanıcı hatası, sıvı teması vb.), arıza durumunda süreç.
- **İade & Değişim:** 14 gün cayma hakkı (mesafeli sözleşmeler yönetmeliğine uygun dil), iade şartları (kullanılmamış, orijinal kutu), iade süreci adımları, ücret iadesi süresi (10 iş günü).
- **Kargo & Teslimat:** 1-2 iş günü kargoya veriliş, 2-5 iş günü teslimat (dropshipping tedarik süresi için "yoğun dönemlerde 7 iş gününe kadar uzayabilir" esnekliği), kargo firmaları, ücretsiz kargo eşiği.
- **Mesafeli Satış Sözleşmesi:** standart şablon, dinamik alanlar (ürün, tutar, alıcı) sipariş anında doldurulacak şekilde not düş.
- **Gizlilik / KVKK:** veri toplama (sipariş bilgileri, çerezler, analitik), saklama, haklar.
- **SSS:** 8-10 soru-cevap (kargo, iade, garanti, ödeme güvenliği, kapıda ödeme, ürün kullanımı).

---

## 10. PERFORMANS, SEO, KALİTE

- Lighthouse mobil hedefi: Performance > 85, SEO > 95.
- `next/image`, lazy loading, font `next/font` ile (Inter veya benzeri).
- Meta taglar + Open Graph + ürün için JSON-LD (`Product` + `AggregateRating` + `Offer` şeması) → Google'da yıldızlı sonuç.
- `sitemap.xml` ve `robots.txt` (admin'i disallow).
- Hata sınırları, loading skeletonları (özellikle dashboard grafikleri).
- Tüm para hesapları Decimal/kuruş bazlı, floating point hatası olmasın.
- Temel güvenlik: admin route'ları middleware ile korunur, API'lerde zod validasyon, rate limit `/api/track` ve login'de (brute force), httpOnly cookie, CSRF için Next.js varsayılanları, upload'ta dosya tipi/boyut kontrolü (max 5MB, sadece görsel).

---

## 11. FAZ PLANI (UYGULAMA SIRASI)

**Faz 1 — Kurulum & Şema:** Next.js projesi, Tailwind, shadcn/ui, Prisma + tüm modeller, seed script (demo verisiyle). ✅ Kabul: `prisma studio`da dolu tablolar, dev server açılıyor.

**Faz 2 — Müşteri tarafı temel:** Layout, duyuru bandı, landing/ürün sayfası blokları (1-14), responsive. ✅ Kabul: mobil 360px'te kusursuz, tüm bloklar seed verisiyle dolu.

**Faz 3 — Sepet & Checkout:** Zustand sepet + drawer + sticky bar, sepet sayfası, checkout formu, MockPayment, sipariş oluşturma, teşekkür/hata sayfaları, kupon. ✅ Kabul: uçtan uca sipariş verilebiliyor, DB'de Order oluşuyor.

**Faz 4 — Analitik toplama:** tracker, /api/track, session/event kayıtları, sepet DB senkronu. ✅ Kabul: gezinirken event'ler DB'ye düşüyor.

**Faz 5 — Admin auth + Dashboard:** login, middleware, ana dashboard (stat kartları + saatlik/günlük grafikler + funnel + son siparişler). ✅ Kabul: demo veriyle Shopify benzeri dolu dashboard.

**Faz 6 — Admin yönetim:** ürün CRUD + görsel upload, sipariş yönetimi, yorum/kupon/ayarlar, sepetler ekranı, detaylı analitik + canlı görünüm. ✅ Kabul: panelden eklenen ürün sitede anında görünüyor.

**Faz 7 — İçerik & cila:** yasal sayfalar (hazır metinler), SSS, sipariş takip sayfası, exit-intent, SEO/JSON-LD, sitemap, loading/error state'leri, Lighthouse turu.

**Faz 8 — PayTR iskeleti & README:** PayTRProvider iskeleti + callback endpoint, `.env.example`, README (kurulum, seed, admin girişi, PayTR'ı aktif etme adımları, deploy notları — Railway uyumlu).

---

## 12. ENV ÖRNEĞİ

```env
DATABASE_URL=postgresql://...
JWT_SECRET=degistir
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYMENT_PROVIDER=mock
PAYTR_MERCHANT_ID=
PAYTR_MERCHANT_KEY=
PAYTR_MERCHANT_SALT=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
```

---

## 13. KULLANICI NOTLARI (Claude Code için değil — Seyit için)

### 21st.dev Magic MCP kurulumu (bir kez, terminalden):
```bash
claude mcp add magic --scope user --env API_KEY="<21ST_DEV_API_ANAHTARIN>" -- npx -y @21st-dev/magic@latest
```
Sonra `claude mcp list` ile "magic"in göründüğünü doğrula, Claude Code'u yeniden başlat. Anahtarını bu MD dosyasına veya git'e ASLA yazma/commit etme.

### Sonradan senin yapacakların:
- PayTR mağaza anlaşması → `merchant_id/key/salt` değerlerini `.env`'e gir, `PAYMENT_PROVIDER=paytr` yap.
- Yasal metinlerdeki `[ŞİRKET ADI]`, `[ADRES]` alanları + kargo/iade gün sayıları.
- Gerçek ürün bilgisi/görselleri (admin panelden).
- Domain + Railway/self-host deploy.
