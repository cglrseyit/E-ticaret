export function Funnel({
  steps,
}: {
  steps: { label: string; count: number; pct: number }[];
}) {
  return (
    <div className="space-y-3">
      {steps.map((s, i) => {
        const prev = i > 0 ? steps[i - 1].count : s.count;
        const stepRate = prev ? Math.round((s.count / prev) * 100) : 100;
        return (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">{s.label}</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground tabular-nums">
                  {s.count.toLocaleString("tr-TR")}
                </strong>{" "}
                · %{s.pct}
              </span>
            </div>
            <div className="h-7 overflow-hidden rounded-lg bg-muted">
              <div
                className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-accent to-accent-hover px-2 text-[11px] font-semibold text-white transition-all"
                style={{ width: `${Math.max(s.pct, 4)}%` }}
              >
                {i > 0 && stepRate < 100 && `↓${100 - stepRate}%`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
