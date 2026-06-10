import { BadgeCheck } from "lucide-react";
import type { ReviewDTO, RatingStats } from "@/lib/queries";
import { Section, SectionHeading } from "@/components/landing/section";
import { Stars } from "@/components/ui/stars";

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "bugün";
  if (days === 1) return "dün";
  if (days < 30) return `${days} gün önce`;
  return `${Math.floor(days / 30)} ay önce`;
}

const palette = ["bg-teal-100 text-teal-700", "bg-rose-100 text-rose-700", "bg-amber-100 text-amber-700", "bg-indigo-100 text-indigo-700", "bg-emerald-100 text-emerald-700"];

export function ReviewsSection({
  reviews,
  stats,
}: {
  reviews: ReviewDTO[];
  stats: RatingStats;
}) {
  const total = stats.count || 1;

  return (
    <Section id="yorumlar" muted>
      <SectionHeading
        eyebrow="Müşteri Yorumları"
        title="Binlerce kişi bize güvendi"
        subtitle="Gerçek müşterilerimizin değerlendirmeleri."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Summary */}
        <div className="rounded-2xl border bg-card p-6">
          <div className="text-center">
            <div className="text-5xl font-extrabold tracking-tight">
              {stats.average.toFixed(1)}
            </div>
            <Stars value={stats.average} size={20} className="mt-2 justify-center" />
            <div className="mt-1 text-sm text-muted-foreground">
              {stats.count} değerlendirme
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const c = stats.distribution[star];
              const pct = Math.round((c / total) * 100);
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-6 text-muted-foreground">{star}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-star" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right tabular-nums text-muted-foreground">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r, i) => (
            <div key={r.id} className="rounded-2xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${palette[i % palette.length]}`}
                >
                  {r.authorName.charAt(0)}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    {r.authorName}
                    {r.isVerifiedPurchase && (
                      <BadgeCheck size={15} className="text-accent" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {r.isVerifiedPurchase ? "Doğrulanmış Alışveriş" : "Yorum"} ·{" "}
                    {timeAgo(r.createdAt)}
                  </div>
                </div>
              </div>
              <Stars value={r.rating} size={15} className="mt-3" />
              {r.title && <p className="mt-2 font-semibold">{r.title}</p>}
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
