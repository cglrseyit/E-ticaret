import { PlayCircle } from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/section";

/** Optional product video. If no URL is set, shows a styled placeholder. */
export function VideoSection({ url }: { url: string | null }) {
  return (
    <Section>
      <SectionHeading
        eyebrow="Tanıtım"
        title="Ürünü iş başında görün"
      />
      <div className="mx-auto mt-8 max-w-3xl">
        <div className="relative aspect-video overflow-hidden rounded-2xl border bg-card">
          {url ? (
            <iframe
              src={url}
              title="Ürün tanıtım videosu"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-muted to-accent-soft/40">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <PlayCircle size={56} className="text-accent" />
                <span className="text-sm font-medium">Tanıtım videosu yakında</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
