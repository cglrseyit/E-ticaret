/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Database seed.
 *
 *   npm run db:seed            -> seeds base data + 30 days of demo analytics
 *   npm run db:seed -- --no-demo  -> base data only (admin, product, settings)
 *
 * Demo analytics make the admin dashboard look full on first open.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const withDemo = !process.argv.includes("--no-demo");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]): T => arr[rand(0, arr.length - 1)];
const chance = (p: number) => Math.random() < p;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("🌱 Seeding database...");

  // Clean slate (order matters due to FKs)
  await prisma.analyticsEvent.deleteMany();
  await prisma.visitorSession.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.adminUser.deleteMany();

  // --- Admin user ---------------------------------------------------------
  const passwordHash = await bcrypt.hash("Admin123!", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@site.com",
      passwordHash,
      name: "Mağaza Yöneticisi",
      role: "admin",
    },
  });
  console.log("  ✓ Admin: admin@site.com / Admin123!");

  // --- Product ------------------------------------------------------------
  const price = 1299.9;
  const compareAtPrice = 2499.9;
  const product = await prisma.product.create({
    data: {
      slug: "akilli-boyun-masaj-cihazi",
      name: "Akıllı Boyun ve Sırt Masaj Cihazı — NeckPro Max",
      shortDescription:
        "Derin doku şiatsu masajı, ısıtma ve EMS darbe teknolojisiyle saniyeler içinde boyun, omuz ve sırt ağrılarına son verin.",
      description: `
<p><strong>Gün boyu masa başında mı çalışıyorsunuz?</strong> NeckPro Max, fizyoterapi kliniklerindeki şiatsu masaj tekniğini evinize taşır. 3 boyutlu dönen masaj başlıkları, derin doku düğümlerini çözerken entegre ısıtma fonksiyonu kasları gevşetir.</p>
<p>EMS düşük frekanslı darbe teknolojisi sinir uçlarını uyararak kan dolaşımını artırır ve ağrı sinyallerini bloke eder. Tamamen kablosuz tasarımı sayesinde evde, ofiste veya yolculukta dilediğiniz yerde kullanabilirsiniz.</p>
<ul>
  <li>⚡ 3 boyutlu derin doku şiatsu masajı</li>
  <li>🔥 42°C akıllı ısıtma fonksiyonu</li>
  <li>💪 6 farklı masaj modu, 16 yoğunluk seviyesi</li>
  <li>🔋 2500 mAh şarjlı batarya — tek şarjla 15 kullanım</li>
  <li>🤫 45 dB sessiz motor</li>
</ul>`.trim(),
      price,
      compareAtPrice,
      costPrice: 420,
      stock: 17,
      sku: "NPM-001",
      isActive: true,
      seoTitle:
        "Akıllı Boyun Masaj Cihazı NeckPro Max — Şiatsu + Isıtma | %48 İndirim",
      seoDescription:
        "Derin doku şiatsu masajı, ısıtma ve EMS teknolojisi. 14 gün koşulsuz iade, hızlı kargo. Binlerce mutlu müşteri.",
      videoUrl: null,
      images: {
        create: [
          { url: "/products/neckpro-1.svg", alt: "NeckPro Max boyun masaj cihazı önden görünüm", sortOrder: 0 },
          { url: "/products/neckpro-2.svg", alt: "Şiatsu masaj başlıkları yakın çekim", sortOrder: 1 },
          { url: "/products/neckpro-3.svg", alt: "Isıtma fonksiyonu kullanımı", sortOrder: 2 },
          { url: "/products/neckpro-4.svg", alt: "Kutu içeriği ve aksesuarlar", sortOrder: 3 },
          { url: "/products/neckpro-5.svg", alt: "Ofiste kullanım", sortOrder: 4 },
        ],
      },
      variants: {
        create: [
          { name: "Renk", value: "Antrasit Gri", priceDiff: 0, stock: 9, sortOrder: 0 },
          { name: "Renk", value: "Inci Beyazı", priceDiff: 0, stock: 5, sortOrder: 1 },
          { name: "Renk", value: "Lacivert", priceDiff: 50, stock: 3, sortOrder: 2 },
        ],
      },
    },
  });
  console.log(`  ✓ Product: ${product.name}`);

  // --- Reviews ------------------------------------------------------------
  const reviews: {
    authorName: string;
    rating: number;
    title: string;
    body: string;
    isVerifiedPurchase: boolean;
    daysAgo: number;
  }[] = [
    { authorName: "Ayşe K.", rating: 5, title: "Boyun ağrılarıma birebir geldi", body: "Masa başı çalışıyorum, akşamları boynum tutuluyordu. Bir haftadır her gün 15 dk kullanıyorum, fark inanılmaz. Isıtma özelliği harika.", isVerifiedPurchase: true, daysAgo: 3 },
    { authorName: "Mehmet T.", rating: 5, title: "Kargosu çok hızlıydı", body: "2 günde elime ulaştı. Ürün gerçekten anlatıldığı gibi, sessiz çalışıyor. Eşim de çok beğendi, ikinciyi alacağız.", isVerifiedPurchase: true, daysAgo: 6 },
    { authorName: "Zeynep A.", rating: 5, title: "Hediye aldım, bayıldı", body: "Anneme hediye ettim, boyun fıtığı var. Doktoru da masajın iyi geleceğini söylemişti. Çok memnun kaldı, teşekkürler.", isVerifiedPurchase: true, daysAgo: 9 },
    { authorName: "Caner Ö.", rating: 4, title: "Güzel ama şarjı biraz çabuk bitiyor", body: "Ürün kaliteli, masaj gücü yeterli. Tek eksisi yoğun kullanımda şarj biraz çabuk bitiyor. Yine de tavsiye ederim.", isVerifiedPurchase: true, daysAgo: 12 },
    { authorName: "Fatma N.", rating: 5, title: "Spor sonrası kas ağrılarına ilaç gibi", body: "Antrenman sonrası sırt kaslarım çok ağrıyordu. EMS modu gerçekten işe yarıyor. Paramın hakkını fazlasıyla verdi.", isVerifiedPurchase: true, daysAgo: 14 },
    { authorName: "Burak D.", rating: 5, title: "Beklentimin üzerinde", body: "Açıkçası bu kadar iyi olmasını beklemiyordum. Şiatsu başlıkları gerçekten derine işliyor. Sessizliği de cabası.", isVerifiedPurchase: true, daysAgo: 18 },
    { authorName: "Selin Y.", rating: 4, title: "Kullanışlı", body: "Kullanımı kolay, kumandası anlaşılır. Yoğunluk seviyeleri yeterli. İlk gün biraz sert geldi ama alışınca süper.", isVerifiedPurchase: false, daysAgo: 21 },
    { authorName: "Hakan İ.", rating: 5, title: "Ofiste herkes sırada", body: "Ofise getirdim, arkadaşlar denedi hepsi link istedi. Gün ortası molalarında kullanıyorum, akşama daha dinç oluyorum.", isVerifiedPurchase: true, daysAgo: 24 },
    { authorName: "Elif S.", rating: 3, title: "İdare eder", body: "Ürün fena değil ama ben daha güçlü beklemiştim. Hafif-orta masaj sevenler için ideal. Kutusu şık geldi.", isVerifiedPurchase: true, daysAgo: 27 },
    { authorName: "Okan M.", rating: 5, title: "Kesinlikle alın", body: "Fiyat performans olarak rakipsiz. İndirimli aldım, normal fiyatına da değer. Isıtma + masaj kombinasyonu muhteşem.", isVerifiedPurchase: true, daysAgo: 30 },
  ];

  await prisma.review.createMany({
    data: reviews.map((r) => ({
      productId: product.id,
      authorName: r.authorName,
      rating: r.rating,
      title: r.title,
      body: r.body,
      isApproved: true,
      isVerifiedPurchase: r.isVerifiedPurchase,
      createdAt: daysAgoDate(r.daysAgo),
    })),
  });
  console.log(`  ✓ ${reviews.length} reviews`);

  // --- Site settings ------------------------------------------------------
  const countdownEnd = new Date();
  countdownEnd.setDate(countdownEnd.getDate() + 2);
  countdownEnd.setHours(23, 59, 59, 0);

  await prisma.siteSetting.createMany({
    data: [
      { key: "free_shipping_threshold", value: "500" },
      { key: "announcement_bar_text", value: "🚚 Bugün sipariş ver, 2 iş gününde kargoda — 500₺ üzeri ÜCRETSİZ kargo" },
      { key: "whatsapp_number", value: "905555555555" },
      { key: "countdown_end", value: countdownEnd.toISOString() },
      { key: "cod_fee", value: "19.90" },
      { key: "live_viewers_base", value: "23" },
      { key: "social_proof_count", value: "10.000+" },
      { key: "video_url", value: "" },
      { key: "store_name", value: "NeckPro Store" },
    ],
  });
  console.log("  ✓ Site settings");

  // --- Coupons ------------------------------------------------------------
  await prisma.coupon.createMany({
    data: [
      { code: "HOSGELDIN10", type: "percent", value: 10, isActive: true, usageLimit: null, usedCount: 142 },
      { code: "KARGO0", type: "fixed", value: 49.9, isActive: true, usageLimit: 500, usedCount: 58 },
      { code: "BAHAR20", type: "percent", value: 20, isActive: true, usageLimit: 200, usedCount: 173 },
    ],
  });
  console.log("  ✓ Coupons");

  // --- Demo analytics -----------------------------------------------------
  if (withDemo) {
    await seedDemoAnalytics(product.id, Number(price), Number(compareAtPrice));
  } else {
    console.log("  ⏭  Skipping demo analytics (--no-demo)");
  }

  console.log("✅ Seed complete.");
}

function daysAgoDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(rand(8, 22), rand(0, 59), rand(0, 59), 0);
  return d;
}

// ---------------------------------------------------------------------------
// Demo analytics: ~30 days of sessions, events and orders
// ---------------------------------------------------------------------------
async function seedDemoAnalytics(
  productId: string,
  price: number,
  compareAtPrice: number
) {
  console.log("  ⏳ Generating 30 days of demo analytics...");

  const devices = [
    ...Array(70).fill("mobile"),
    ...Array(22).fill("desktop"),
    ...Array(8).fill("tablet"),
  ];
  const utmSources = [
    ...Array(38).fill("instagram"),
    ...Array(27).fill("tiktok"),
    ...Array(14).fill("google"),
    ...Array(13).fill("direct"),
    ...Array(8).fill("facebook"),
  ];
  const cities = [
    "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana",
    "Konya", "Gaziantep", "Mersin", "Kayseri", "Eskişehir", "Samsun",
  ];
  const firstNames = ["Ahmet", "Mehmet", "Ayşe", "Fatma", "Mustafa", "Emine", "Ali", "Hatice", "Hüseyin", "Zeynep", "Can", "Elif", "Burak", "Selin", "Okan", "Derya", "Murat", "Esra"];
  const lastNames = ["Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Yıldız", "Yıldırım", "Öztürk", "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara"];

  type SessionRow = {
    id: string;
    firstSeen: Date;
    lastSeen: Date;
    userAgent: string;
    referrer: string | null;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string | null;
    device: string;
    country: string;
    isReturning: boolean;
  };
  type EventRow = {
    sessionId: string;
    type: string;
    path: string | null;
    metadata: any;
    createdAt: Date;
  };
  type OrderRow = {
    sessionId: string;
    when: Date;
    quantity: number;
    device: string;
  };

  const sessions: SessionRow[] = [];
  const events: EventRow[] = [];
  const ordersToCreate: OrderRow[] = [];

  let sessionCounter = 0;

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() - dayOffset);
    const dow = dayDate.getDay(); // 0 Sun .. 6 Sat

    // Weekend + recency boost for traffic
    const weekendBoost = dow === 0 || dow === 6 ? 1.25 : 1;
    const recencyBoost = 1 + (29 - dayOffset) * 0.012; // newer days slightly busier
    const baseVisits = rand(80, 300);
    const visits = Math.round(baseVisits * weekendBoost * recencyBoost);

    // Conversion rate varies 1.5%–3%
    const convRate = randFloat(0.015, 0.03);

    for (let v = 0; v < visits; v++) {
      sessionCounter++;
      const sessionId = `demo_${dayOffset}_${v}_${sessionCounter}`;
      const device = pick(devices);
      const utmSource = pick(utmSources);
      const hour = weightedHour();
      const ts = new Date(dayDate);
      ts.setHours(hour, rand(0, 59), rand(0, 59), 0);

      const durationSec = rand(20, 480); // time on the page
      const lastSeen = new Date(ts.getTime() + durationSec * 1000);
      const isReturning = chance(0.2);

      sessions.push({
        id: sessionId,
        firstSeen: ts,
        lastSeen,
        userAgent: device === "mobile" ? "Mozilla/5.0 (iPhone)" : "Mozilla/5.0 (Windows NT 10.0)",
        referrer: utmSource === "direct" ? null : `https://${utmSource}.com/`,
        utmSource,
        utmMedium: utmSource === "direct" ? "none" : utmSource === "google" ? "cpc" : "social",
        utmCampaign: utmSource === "direct" ? null : pick(["bahar-kampanya", "retarget", "lookalike", "story-ads"]),
        device,
        country: "TR",
        isReturning,
      });

      // page_view (entry)
      events.push({ sessionId, type: "page_view", path: "/", metadata: null, createdAt: ts });

      // product_view (~85%)
      const viewedProduct = chance(0.85);
      if (viewedProduct) {
        events.push({
          sessionId,
          type: "product_view",
          path: "/",
          metadata: { productId },
          createdAt: new Date(ts.getTime() + rand(2, 20) * 1000),
        });
      }

      // time_on_page on exit
      events.push({
        sessionId,
        type: "time_on_page",
        path: "/",
        metadata: { seconds: durationSec },
        createdAt: lastSeen,
      });

      // Funnel: add_to_cart (~14% of those who viewed)
      const addedToCart = viewedProduct && chance(0.16);
      let quantity = 1;
      if (addedToCart) {
        quantity = chance(0.2) ? 2 : 1;
        events.push({
          sessionId,
          type: "add_to_cart",
          path: "/",
          metadata: { quantity },
          createdAt: new Date(ts.getTime() + rand(15, 90) * 1000),
        });

        // checkout_start (~45% of carts)
        const startedCheckout = chance(0.45);
        if (startedCheckout) {
          events.push({
            sessionId,
            type: "checkout_start",
            path: "/odeme",
            metadata: null,
            createdAt: new Date(ts.getTime() + rand(90, 180) * 1000),
          });
        }
      }

      // exit_intent (~10%)
      if (chance(0.1)) {
        events.push({
          sessionId,
          type: "exit_intent",
          path: "/",
          metadata: null,
          createdAt: new Date(ts.getTime() + rand(30, 200) * 1000),
        });
      }

      // Purchase based on conversion rate (must have added to cart)
      if (addedToCart && chance(convRate / 0.16)) {
        const purchaseTime = new Date(ts.getTime() + rand(180, 360) * 1000);
        events.push({
          sessionId,
          type: "purchase",
          path: "/odeme/basarili",
          metadata: { total: price * quantity, quantity },
          createdAt: purchaseTime,
        });
        ordersToCreate.push({ sessionId, when: purchaseTime, quantity, device });
      }
    }
  }

  console.log(`     • ${sessions.length} sessions, ${events.length} events, ${ordersToCreate.length} orders`);

  // Insert sessions
  for (const c of chunk(sessions, 500)) {
    await prisma.visitorSession.createMany({ data: c });
  }
  // Insert events
  for (const c of chunk(events, 1000)) {
    await prisma.analyticsEvent.createMany({ data: c });
  }

  // Insert orders (with items)
  const freeShipThreshold = 500;
  let orderSeq = 1;
  const statuses = [
    ...Array(8).fill("delivered"),
    ...Array(4).fill("shipped"),
    ...Array(3).fill("paid"),
    ...Array(2).fill("pending"),
    ...Array(1).fill("cancelled"),
  ];

  // Sort orders chronologically so order numbers increase with time
  ordersToCreate.sort((a, b) => a.when.getTime() - b.when.getTime());

  for (const o of ordersToCreate) {
    const unitPrice = price;
    const subtotal = unitPrice * o.quantity;
    const usedCoupon = chance(0.25);
    const discount = usedCoupon ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    const paymentMethod = chance(0.3) ? "cod" : "paytr";
    const codFee = paymentMethod === "cod" ? 19.9 : 0;
    const shippingCost = subtotal - discount >= freeShipThreshold ? 0 : 49.9;
    const total = subtotal - discount + shippingCost + codFee;
    const status =
      o.when.getTime() > Date.now() - 2 * 86400000
        ? pick(["pending", "paid", "shipped"])
        : pick(statuses);

    const fn = pick(firstNames);
    const ln = pick(lastNames);
    const city = pick(cities);

    await prisma.order.create({
      data: {
        orderNumber: `BLS-2026-${String(orderSeq++).padStart(5, "0")}`,
        status,
        customerName: `${fn} ${ln}`,
        customerEmail: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
        customerPhone: `5${rand(30, 59)}${rand(1000000, 9999999)}`,
        address: `${pick(["Atatürk", "Cumhuriyet", "İstiklal", "Bağdat", "Gazi"])} Cad. No:${rand(1, 200)} D:${rand(1, 20)}`,
        city,
        district: pick(["Merkez", "Kadıköy", "Çankaya", "Konak", "Nilüfer", "Muratpaşa"]),
        zipCode: String(rand(1000, 81000)).padStart(5, "0"),
        subtotal,
        shippingCost,
        discount,
        total,
        paymentMethod,
        paymentStatus: ["delivered", "shipped", "paid"].includes(status) ? "paid" : status === "cancelled" ? "refunded" : "unpaid",
        couponCode: usedCoupon ? "HOSGELDIN10" : null,
        trackingNumber: ["delivered", "shipped"].includes(status) ? `TR${rand(100000000, 999999999)}` : null,
        cargoCompany: ["delivered", "shipped"].includes(status) ? pick(["Yurtiçi Kargo", "Aras Kargo", "MNG Kargo", "Sürat Kargo"]) : null,
        sessionId: o.sessionId,
        createdAt: o.when,
        updatedAt: o.when,
        items: {
          create: [
            {
              productId,
              productName: "Akıllı Boyun ve Sırt Masaj Cihazı — NeckPro Max",
              variantInfo: pick(["Renk: Antrasit Gri", "Renk: Inci Beyazı", "Renk: Lacivert"]),
              quantity: o.quantity,
              unitPrice,
            },
          ],
        },
      },
    });

    // Mark the matching session's cart as converted (create a converted cart record)
    await prisma.cart.create({
      data: {
        sessionId: `${o.sessionId}_cart`,
        status: "converted",
        createdAt: o.when,
        updatedAt: o.when,
        items: {
          create: [
            {
              productId,
              productName: "Akıllı Boyun ve Sırt Masaj Cihazı — NeckPro Max",
              variantInfo: "Renk: Antrasit Gri",
              unitPrice,
              quantity: o.quantity,
            },
          ],
        },
      },
    });
  }

  // A few abandoned + active carts (no order) for the carts screen
  for (let i = 0; i < 18; i++) {
    const ageHours = chance(0.6) ? rand(2, 72) : rand(0, 1); // most abandoned, some active
    const created = new Date(Date.now() - ageHours * 3600 * 1000);
    const qty = chance(0.25) ? 2 : 1;
    await prisma.cart.create({
      data: {
        sessionId: `abandoned_${i}_${Date.now()}`,
        status: ageHours >= 1 ? "abandoned" : "active",
        createdAt: created,
        updatedAt: created,
        items: {
          create: [
            {
              productId,
              productName: "Akıllı Boyun ve Sırt Masaj Cihazı — NeckPro Max",
              variantInfo: "Renk: Antrasit Gri",
              unitPrice: price,
              quantity: qty,
            },
          ],
        },
      },
    });
  }

  console.log("     • Carts (converted + abandoned/active) created");
}

// Weighted hour-of-day: low at night, peaks around lunch and 19:00–23:00
function weightedHour(): number {
  const weights = [
    1, 1, 1, 1, 1, 2, 3, 5, 7, 8, 9, 10, // 0-11
    11, 10, 9, 9, 10, 12, 16, 20, 22, 20, 14, 6, // 12-23
  ];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let h = 0; h < 24; h++) {
    r -= weights[h];
    if (r <= 0) return h;
  }
  return 20;
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
