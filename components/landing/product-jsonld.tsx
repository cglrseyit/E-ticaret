import type { ProductDTO, ReviewDTO, RatingStats } from "@/lib/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Structured data for the active product. Emits Product + Offer + AggregateRating
 * + the top 5 reviews so Google can render rich snippets (stars, price, stock).
 */
export function ProductJsonLd({
  product,
  reviews,
  stats,
  storeName,
}: {
  product: ProductDTO;
  reviews: ReviewDTO[];
  stats: RatingStats;
  storeName: string;
}) {
  const hero = product.images[0]?.url
    ? new URL(product.images[0].url, siteUrl).toString()
    : undefined;

  const allImages = product.images
    .slice(0, 6)
    .map((i) => new URL(i.url, siteUrl).toString());

  const data: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${siteUrl}/#product`,
    name: product.name,
    description: product.shortDescription,
    sku: product.sku ?? product.slug,
    brand: { "@type": "Brand", name: storeName },
    ...(hero && { image: allImages }),
    offers: {
      "@type": "Offer",
      url: siteUrl,
      priceCurrency: "TRY",
      price: product.price.toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      ...(product.compareAtPrice && {
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: product.price.toFixed(2),
          priceCurrency: "TRY",
        },
      }),
    },
  };

  if (stats.count > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: stats.average.toFixed(1),
      reviewCount: stats.count,
      bestRating: 5,
      worstRating: 1,
    };

    data.review = reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: { "@type": "Person", name: r.authorName },
      ...(r.title && { name: r.title }),
      reviewBody: r.body,
      datePublished: r.createdAt.slice(0, 10),
    }));
  }

  return (
    <script
      type="application/ld+json"
      // Safe: data is built server-side from typed input, no user HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Minimal organization/website JSON-LD for the root layout. */
export function OrganizationJsonLd({ storeName }: { storeName: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: storeName,
    url: siteUrl,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
