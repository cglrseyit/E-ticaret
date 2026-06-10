# Tek Ürün Dropshipping E-Ticaret Sitesi

Tek bir ürünü satmaya odaklanmış, yüksek dönüşümlü bir landing/ürün sayfası + Shopify tarzı analitik dashboard içeren bir admin paneli. Türkçe arayüz, TRY (₺) para birimi, mobil öncelikli tasarım.

## Teknoloji yığını

- **Next.js 16+ (App Router) + TypeScript**
- **Tailwind CSS 4** + custom design system (`globals.css`)
- **Prisma ORM** (lokal: SQLite, prod: PostgreSQL — `schema.prisma` üzerinden değiştirilir)
- **Zustand** (sepet) + **react-hook-form + zod** (formlar)
- **recharts** (admin grafikler), **framer-motion** (mikro etkileşimler), **lucide-react** (ikonlar)
- **NextAuth-benzeri JWT cookie auth** (admin için custom, `lib/auth.ts`)
- **PayTR** ödeme entegrasyonu (iskelet) + dev için `MockPaymentProvider`
- Kendi yazılmış lightweight analytics (session + event log + funnel + heatmap)

## Hızlı başlangıç

```bash
# 1. Paketleri kur
npm install

# 2. Ortam değişkenlerini hazırla
cp .env.example .env
# .env dosyasını aç ve JWT_SECRET değerini güçlü bir rastgele dizgeyle değiştir.

# 3. Veritabanı şemasını uygula + örnek veri yükle
npm run db:push
npm run db:seed

# 4. Geliştirme sunucusunu çalıştır
npm run dev
```

Site: <http://localhost:3000>
Admin: <http://localhost:3000/admin/login>

### İlk giriş bilgileri (seed)

```
E-posta : admin@site.com
Parola  : Admin123!
```

> **Önemli:** Bu varsayılan parolayı production'a almadan **mutlaka** değiştir.
> Yeni bir admin kullanıcısı oluşturmak için Prisma Studio'yu kullanabilirsin:
> `npm run db:studio` → AdminUser tablosu.

## NPM script'leri

| Script | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Production sunucu |
| `npm run lint` | ESLint |
| `npm run db:push` | Prisma şemasını DB'ye uygula |
| `npm run db:seed` | Örnek ürün + admin + 30 günlük demo analitik verisi |
| `npm run db:seed -- --no-demo` | Demo analitik olmadan sadece temel veri |
| `npm run db:studio` | Prisma Studio (görsel DB tarayıcı) |
| `npm run db:reset` | DB'yi sıfırla + seed (⚠️ tüm veriyi siler) |

## Proje yapısı

```
app/
  page.tsx                 Landing / ürün sayfası
  sepet/                   Sepet
  odeme/                   Checkout (mock veya PayTR)
  siparis-takip/           Misafir sipariş sorgulama
  sss, iade-ve-degisim,    Yasal & içerik sayfaları
  garanti, kargo-ve-...,
  mesafeli-satis,
  gizlilik-politikasi,
  iletisim/
  admin/
    login/
    (panel)/               Auth korumalı admin layout
      page.tsx             Dashboard
      analitik, canli,     Detaylı analitik / canlı / sepetler
      sepetler/
      urunler/, yeni/      Ürün CRUD
      siparisler/          Sipariş yönetimi
      yorumlar, kuponlar,
      ayarlar/
  api/
    track/                 Analytics event endpoint
    cart/                  Cart DB sync
    orders/                Sipariş oluştur + lookup
    coupons/validate/
    payments/paytr/        PayTR S2S callback
    admin/                 Admin-only endpoints
  sitemap.ts, robots.ts    SEO
  not-found, error,        Hata / yükleme sayfaları
  loading/
components/
  landing/                 Müşteri tarafı bileşenleri (header, footer, sticky bar, buy box, vs.)
  admin/                   Admin tarafı bileşenleri (sidebar, stat cards, charts, forms)
  ui/                      Düşük seviye UI primitive'leri (button, accordion, badge, stars)
  analytics/               Tracker + cart sync (client)
lib/
  prisma.ts                Prisma client singleton
  auth.ts                  JWT yardımcıları
  admin-guard.ts           Server-side admin yetkilendirme
  queries.ts               Public DB query'leri
  analytics/               Server-side metrik / agregat hesapları
  payments/                Mock + PayTR sağlayıcısı
  store/                   Zustand sepet + config context
  validation.ts            Tüm zod şemaları
prisma/
  schema.prisma            Şema (SQLite — prod'da postgres'e geç)
  seed.ts                  Seed script
```

## PayTR'ı aktifleştirme

1. PayTR mağaza anlaşmanı tamamla, panelden `merchant_id`, `merchant_key`, `merchant_salt` değerlerini al.
2. `.env` dosyasını güncelle:

   ```env
   PAYMENT_PROVIDER=paytr
   PAYTR_MERCHANT_ID=...
   PAYTR_MERCHANT_KEY=...
   PAYTR_MERCHANT_SALT=...
   PAYTR_TEST_MODE=1            # canlıya alana kadar test modu
   NEXT_PUBLIC_SITE_URL=https://senin-domainin.com
   ```

3. **PayTR panelinde** "Bildirim URL" (callback) alanına şunu yaz:

   ```
   https://senin-domainin.com/api/payments/paytr/callback
   ```

4. `/odeme` üzerinden test siparişi ver. Test modunda PayTR sandbox kartlarıyla başarı/başarısızlık denenebilir.
5. Canlıya geçerken `PAYTR_TEST_MODE=0` yap.

> `lib/payments/paytr.ts` PayTR'ın **iframe API** akışını kullanır: token alır,
> müşteriyi `https://www.paytr.com/odeme/guvenli/{token}` adresine yönlendirir,
> PayTR sunucu sunucuya callback yapar (`merchant_oid`, `status`, `total_amount`,
> `hash`). Hash imzası HMAC-SHA256 ile doğrulanır.

## Yapılacaklar listesi (kullanıcı)

İlk gerçek üretim için **manuel doldurman gereken** alanlar:

- [ ] `JWT_SECRET` güçlü bir rastgele dizgeyle değiştirildi
- [ ] Varsayılan admin parolası değiştirildi (`AdminUser.passwordHash`)
- [ ] Yasal sayfalardaki `[ŞİRKET ADI]` ve `[ADRES]` placeholder'ları gerçek bilgilerle dolduruldu
  - `app/garanti/page.tsx`
  - `app/iade-ve-degisim/page.tsx`
  - `app/mesafeli-satis/page.tsx`
  - `app/gizlilik-politikasi/page.tsx`
  - `app/iletisim/page.tsx`
  - `components/landing/site-footer.tsx`
- [ ] Admin panelden gerçek ürün bilgisi ve görselleri eklendi
- [ ] Admin paneli → Ayarlar: duyuru bandı, WhatsApp numarası, ücretsiz kargo eşiği vb. güncellendi
- [ ] PayTR mağaza anlaşması yapıldı + `.env` güncellendi + `PAYMENT_PROVIDER=paytr`
- [ ] SMTP bilgileri girildi (sipariş onayı, terk edilmiş sepet e-postaları)
- [ ] Domain bağlandı, `NEXT_PUBLIC_SITE_URL` güncellendi

## Deploy notları (Railway)

1. Railway'de yeni bir proje oluştur, GitHub repo'yu bağla.
2. Bir **PostgreSQL** servisi ekle, Railway'in sağladığı `DATABASE_URL`'i Next.js servisinin env'ine ekle.
3. `prisma/schema.prisma` içinde `datasource db { provider = "postgresql" }` olarak değiştir (default SQLite).
4. Tüm `.env.example` değişkenlerini Railway env panelinden gir (özellikle `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`, PayTR ve SMTP).
5. **Build command:** `npx prisma generate && next build`
   **Start command:** `next start -p $PORT`
6. İlk deploy sonrası bir kez seed'i çalıştır (Railway'in shell'inden):

   ```bash
   npx prisma db push
   npm run db:seed -- --no-demo
   ```

7. PayTR panelinde callback URL'i Railway domain'inle güncelle.
8. Custom domain bağla, HTTPS'i etkinleştir.

### Lighthouse hedefleri

- Performance: 85+ (mobil)
- SEO: 95+
- Accessibility: 90+

İlk build'den sonra Lighthouse turu at, gerekirse görsel boyutlarını
optimize et (admin panelden upload edilen görseller `next/image` ile
sunulur).

## Faz planı durumu

- [x] **Faz 1** — Kurulum & Şema (Prisma, seed)
- [x] **Faz 2** — Müşteri tarafı landing
- [x] **Faz 3** — Sepet & Checkout (mock ödeme)
- [x] **Faz 4** — Analitik toplama (tracker, /api/track)
- [x] **Faz 5** — Admin auth + Dashboard
- [x] **Faz 6** — Admin yönetim (ürün/sipariş/yorum/kupon/ayarlar/sepetler)
- [x] **Faz 7** — İçerik & cila (yasal sayfalar, sipariş takip, exit-intent, SEO/JSON-LD, sitemap)
- [x] **Faz 8** — PayTR iskeleti & README

## Lisans

Tüm hakları saklıdır.
