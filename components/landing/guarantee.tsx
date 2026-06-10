import { ShieldCheck } from "lucide-react";
import { Section } from "@/components/landing/section";

export function Guarantee() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent-soft/60 to-background p-8 text-center sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/30">
          <ShieldCheck size={32} />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
          14 Gün Koşulsuz İade Garantisi
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Ürünümüzden memnun kalmazsanız, hiçbir soru sormadan paranızı iade
          ediyoruz. Riski biz alıyoruz — siz sadece rahatlamanın tadını çıkarın.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-accent-hover">
          <span>✓ Soru sorulmaz</span>
          <span>✓ Hızlı iade</span>
          <span>✓ Ücret tam iadesi</span>
        </div>
      </div>
    </Section>
  );
}
