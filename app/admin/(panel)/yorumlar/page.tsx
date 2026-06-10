import { prisma } from "@/lib/prisma";
import { ReviewsManager } from "@/components/admin/reviews-manager";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  const approved = reviews.filter((r) => r.isApproved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Yorumlar</h1>
        <p className="text-sm text-muted-foreground">
          {reviews.length} yorum · {approved} onaylı
        </p>
      </div>
      <ReviewsManager
        reviews={reviews.map((r) => ({
          id: r.id,
          authorName: r.authorName,
          rating: r.rating,
          title: r.title,
          body: r.body,
          isApproved: r.isApproved,
          isVerifiedPurchase: r.isVerifiedPurchase,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
