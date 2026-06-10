const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

/** 7x24 visit heatmap. Color intensity scales with the max bucket. */
export function Heatmap({ grid, max }: { grid: number[][]; max: number }) {
  const color = (v: number) => {
    if (v === 0) return "var(--muted)";
    const t = max ? v / max : 0;
    // teal scale via opacity over accent
    return `color-mix(in srgb, var(--accent) ${Math.round(20 + t * 80)}%, white)`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="flex">
          <div className="w-10" />
          <div className="grid flex-1 grid-cols-24 gap-0.5" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="text-center text-[9px] text-muted-foreground">
                {h % 3 === 0 ? h : ""}
              </div>
            ))}
          </div>
        </div>
        {grid.map((row, d) => (
          <div key={d} className="mt-0.5 flex items-center">
            <div className="w-10 text-xs text-muted-foreground">{DAYS[d]}</div>
            <div className="grid flex-1 grid-cols-24 gap-0.5" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
              {row.map((v, h) => (
                <div
                  key={h}
                  title={`${DAYS[d]} ${h}:00 — ${v} ziyaret`}
                  className="aspect-square rounded-sm"
                  style={{ backgroundColor: color(v) }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
