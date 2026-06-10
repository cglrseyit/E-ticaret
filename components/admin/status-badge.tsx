import { cn } from "@/lib/utils";

const map: Record<string, { label: string; cls: string }> = {
  pending: { label: "Bekliyor", cls: "bg-amber-100 text-amber-700" },
  paid: { label: "Ödendi", cls: "bg-teal-100 text-teal-700" },
  shipped: { label: "Kargoda", cls: "bg-indigo-100 text-indigo-700" },
  delivered: { label: "Teslim Edildi", cls: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "İptal", cls: "bg-rose-100 text-rose-700" },
  refunded: { label: "İade", cls: "bg-stone-200 text-stone-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = map[status] ?? { label: status, cls: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", s.cls)}>
      {s.label}
    </span>
  );
}

export const ORDER_STATUSES = Object.keys(map);
export const statusLabel = (s: string) => map[s]?.label ?? s;
