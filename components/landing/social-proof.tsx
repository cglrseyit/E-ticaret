import { Users } from "lucide-react";

const press = ["TechLife", "SağlıkPlus", "EvDekor", "Wellness TR", "Gadget360", "YaşamStil"];

export function SocialProof({ count }: { count: string }) {
  return (
    <section className="border-y bg-card py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-lg font-bold sm:text-xl">
            <Users size={22} className="text-accent" />
            <span>{count} mutlu müşteri</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Basında ve sosyal medyada konuşulan ürün
          </p>
        </div>

        {/* Press logo marquee (placeholder) */}
        <div className="no-scrollbar mt-6 overflow-hidden">
          <div className="flex w-max animate-marquee gap-10">
            {[...press, ...press].map((name, i) => (
              <span
                key={i}
                className="text-lg font-bold tracking-tight text-muted-foreground/50 grayscale"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
