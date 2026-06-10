"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { RangeKey } from "@/lib/dates";

const options: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Bugün" },
  { key: "yesterday", label: "Dün" },
  { key: "7d", label: "Son 7 gün" },
  { key: "30d", label: "Son 30 gün" },
];

export function RangePicker({ active }: { active: RangeKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function select(key: RangeKey) {
    const p = new URLSearchParams(params.toString());
    p.set("range", key);
    router.push(`${pathname}?${p.toString()}`);
  }

  return (
    <div className="inline-flex rounded-xl border bg-card p-1">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => select(o.key)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition",
            active === o.key
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
