import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

export function StatCard({
  title,
  value,
  delta,
  format = "number",
  icon: Icon,
}: {
  title: string;
  value: number;
  delta: number | null;
  format?: "currency" | "number" | "percent";
  icon: LucideIcon;
}) {
  const display =
    format === "currency"
      ? formatPrice(value)
      : format === "percent"
      ? `%${value.toLocaleString("tr-TR")}`
      : value.toLocaleString("tr-TR");

  const up = (delta ?? 0) >= 0;

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent-hover">
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{display}</div>
      {delta !== null ? (
        <div
          className={cn(
            "mt-1 inline-flex items-center gap-1 text-xs font-semibold",
            up ? "text-success" : "text-danger"
          )}
        >
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          %{Math.abs(delta)}
          <span className="font-normal text-muted-foreground">önceki döneme göre</span>
        </div>
      ) : (
        <div className="mt-1 text-xs text-muted-foreground">önceki dönem verisi yok</div>
      )}
    </div>
  );
}
