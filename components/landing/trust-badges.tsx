import { Lock, RefreshCw, Truck, CreditCard } from "lucide-react";

const badges = [
  { icon: Lock, title: "256-bit SSL", sub: "Güvenli bağlantı" },
  { icon: RefreshCw, title: "14 Gün İade", sub: "Koşulsuz" },
  { icon: Truck, title: "Hızlı Kargo", sub: "2 iş günü" },
  { icon: CreditCard, title: "Güvenli Ödeme", sub: "Kart & kapıda" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {badges.map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-3 rounded-2xl border bg-card p-3.5"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-hover">
            <b.icon size={20} />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight">{b.title}</div>
            <div className="text-xs text-muted-foreground">{b.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
