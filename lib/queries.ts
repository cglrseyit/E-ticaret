import { prisma } from "@/lib/prisma";

// Plain, serializable shapes for client components (Decimal -> number).
export type ProductImageDTO = { id: string; url: string; alt: string | null; sortOrder: number };
export type ProductVariantDTO = {
  id: string;
  name: string;
  value: string;
  priceDiff: number;
  stock: number;
};
export type ReviewDTO = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
};
export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string | null;
  videoUrl: string | null;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
};

export type RatingStats = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>; // counts per star
};

/** The single active product with images and variants (serialized). */
export async function getActiveProduct(): Promise<ProductDTO | null> {
  const p = await prisma.product.findFirst({
    where: { isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!p) return null;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription,
    description: p.description,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    stock: p.stock,
    sku: p.sku,
    videoUrl: p.videoUrl,
    images: p.images.map((i) => ({
      id: i.id,
      url: i.url,
      alt: i.alt,
      sortOrder: i.sortOrder,
    })),
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      value: v.value,
      priceDiff: Number(v.priceDiff),
      stock: v.stock,
    })),
  };
}

/** Approved reviews for a product (newest first). */
export async function getReviews(productId: string): Promise<ReviewDTO[]> {
  const rows = await prisma.review.findMany({
    where: { productId, isApproved: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    title: r.title,
    body: r.body,
    isVerifiedPurchase: r.isVerifiedPurchase,
    createdAt: r.createdAt.toISOString(),
  }));
}

/** Aggregate rating stats from approved reviews. */
export async function getRatingStats(productId: string): Promise<RatingStats> {
  const rows = await prisma.review.findMany({
    where: { productId, isApproved: true },
    select: { rating: true },
  });
  const distribution: RatingStats["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of rows) {
    const k = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
    distribution[k]++;
    sum += r.rating;
  }
  const count = rows.length;
  const average = count ? Math.round((sum / count) * 10) / 10 : 0;
  return { average, count, distribution };
}

/** All site settings as a key/value map. */
export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

/** Count of sessions active in the last N minutes (for "X people viewing"). */
export async function getLiveViewers(minutes = 5): Promise<number> {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  return prisma.visitorSession.count({ where: { lastSeen: { gte: since } } });
}
