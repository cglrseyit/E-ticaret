import { Sparkles, HeartPulse, BatteryCharging, VolumeX } from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/section";

const benefits = [
  {
    icon: HeartPulse,
    title: "Dakikalar içinde rahatlama",
    text: "Derin doku şiatsu masajı, gün boyu biriken gerginliği ve ağrıyı saniyeler içinde çözer. İlk kullanımda farkı hissedin.",
  },
  {
    icon: Sparkles,
    title: "Klinik kalitesinde teknoloji",
    text: "Isıtma + EMS darbe teknolojisi kan dolaşımını artırır, kasları gevşetir. Fizyoterapistlerin önerdiği yöntem evinizde.",
  },
  {
    icon: BatteryCharging,
    title: "Kablosuz ve taşınabilir",
    text: "Tek şarjla 15 kullanım. Evde, ofiste, arabada — dilediğiniz yerde kullanın. Kabloya takılı kalmayın.",
  },
  {
    icon: VolumeX,
    title: "Sessiz, rahatsız etmez",
    text: "45 dB sessiz motor. Televizyon izlerken, kitap okurken veya çalışırken rahatça kullanabilirsiniz.",
  },
];

export function Benefits() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Neden NeckPro Max?"
        title="Sadece bir cihaz değil, günlük rahatlama ritüeli"
        subtitle="Özellikleri değil, hayatınızda yaratacağı farkı anlatıyoruz."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="flex gap-4 rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-hover">
              <b.icon size={24} />
            </span>
            <div>
              <h3 className="font-bold">{b.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                {b.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
