import {
  getActiveProduct,
  getReviews,
  getRatingStats,
  getSettings,
  getLiveViewers,
} from "@/lib/queries";
import { AnnouncementBar } from "@/components/landing/announcement-bar";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { ProductGallery } from "@/components/landing/product-gallery";
import { BuyBox } from "@/components/landing/buy-box";
import { TrustBadges } from "@/components/landing/trust-badges";
import { SocialProof } from "@/components/landing/social-proof";
import { Benefits } from "@/components/landing/benefits";
import { ProductTabs } from "@/components/landing/product-tabs";
import { VideoSection } from "@/components/landing/video-section";
import { ReviewsSection } from "@/components/landing/reviews-section";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { Guarantee } from "@/components/landing/guarantee";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { StickyBuyBar } from "@/components/landing/sticky-buy-bar";
import { Section, SectionHeading } from "@/components/landing/section";
import { discountPercent } from "@/lib/utils";

// Always reflect fresh DB content (live viewers, stock, settings).
export const dynamic = "force-dynamic";

export default async function Home() {
  const product = await getActiveProduct();
  const settings = await getSettings();
  const storeName = settings.store_name || "Mağaza";

  if (!product) {
    return (
      <>
        <SiteHeader storeName={storeName} />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="text-2xl font-bold">Ürün bulunamadı</h1>
          <p className="mt-2 text-muted-foreground">
            Henüz aktif bir ürün yok. Yönetim panelinden bir ürün ekleyin.
          </p>
        </main>
        <SiteFooter storeName={storeName} />
      </>
    );
  }

  const [reviews, stats, liveViewers] = await Promise.all([
    getReviews(product.id),
    getRatingStats(product.id),
    getLiveViewers(5),
  ]);

  const baseViewers = Number(settings.live_viewers_base || "0");
  const viewers = Math.max(baseViewers, liveViewers);
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <>
      <AnnouncementBar text={settings.announcement_bar_text || "Hoş geldiniz!"} />
      <SiteHeader storeName={storeName} />

      <main className="flex flex-col">
        {/* 2. Hero / product showcase */}
        <section id="urun" className="border-b">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-12 lg:py-12">
            <ProductGallery images={product.images} discount={discount} />
            <BuyBox
              product={product}
              average={stats.average}
              reviewCount={stats.count}
              countdownEnd={settings.countdown_end || null}
              liveViewers={viewers}
            />
          </div>

          {/* 3. Trust badges */}
          <div className="mx-auto max-w-7xl px-4 pb-8">
            <TrustBadges />
          </div>
        </section>

        {/* 6. Social proof */}
        <SocialProof count={settings.social_proof_count || "10.000+"} />

        {/* 5. Benefits */}
        <Benefits />

        {/* 7. Product detail tabs */}
        <Section muted>
          <SectionHeading eyebrow="Ürün Detayı" title="Bilmeniz gereken her şey" />
          <div className="mt-10">
            <ProductTabs descriptionHtml={product.description} />
          </div>
        </Section>

        {/* 8. Video */}
        <VideoSection url={product.videoUrl || settings.video_url || null} />

        {/* 9. Reviews */}
        <ReviewsSection reviews={reviews} stats={stats} />

        {/* 10. Comparison */}
        <ComparisonTable />

        {/* 12. Guarantee */}
        <Guarantee />

        {/* 11. FAQ */}
        <FaqSection />

        {/* 13. Final CTA */}
        <FinalCta product={product} />
      </main>

      {/* 14. Footer */}
      <SiteFooter storeName={storeName} />

      {/* Mobile sticky add-to-cart */}
      <StickyBuyBar product={product} />
    </>
  );
}
