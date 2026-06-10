import { Check, X } from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/section";

const rows = [
  "3D derin doku şiatsu masajı",
  "42°C akıllı ısıtma fonksiyonu",
  "Kablosuz & şarjlı kullanım",
  "Sessiz motor (45 dB)",
  "14 gün koşulsuz iade",
  "2 yıl Türkçe garanti",
  "Türkiye'den hızlı kargo",
];

export function ComparisonTable() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Karşılaştırma"
        title="NeckPro Max vs. Sıradan Masaj Cihazları"
        subtitle="Neden farklı olduğumuzu görün."
      />

      <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border bg-card">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b bg-muted/50 px-4 py-3 sm:px-6">
          <span className="text-sm font-semibold text-muted-foreground">Özellik</span>
          <span className="w-20 text-center text-sm font-bold text-accent sm:w-28">
            NeckPro Max
          </span>
          <span className="w-20 text-center text-sm font-medium text-muted-foreground sm:w-28">
            Sıradan
          </span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r}
            className={`grid grid-cols-[1fr_auto_auto] items-center gap-2 px-4 py-3.5 sm:px-6 ${
              i % 2 ? "bg-muted/30" : ""
            }`}
          >
            <span className="text-sm">{r}</span>
            <span className="grid w-20 place-items-center sm:w-28">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground">
                <Check size={16} strokeWidth={3} />
              </span>
            </span>
            <span className="grid w-20 place-items-center sm:w-28">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground">
                <X size={16} strokeWidth={3} />
              </span>
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
