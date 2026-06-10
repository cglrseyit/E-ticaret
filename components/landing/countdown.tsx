"use client";

import * as React from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Counts down to an ISO target. Hides itself once elapsed. */
export function Countdown({ target }: { target: string }) {
  const targetMs = React.useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = React.useState<number | null>(null);

  React.useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    // Avoid hydration mismatch: render a stable placeholder first paint
    return <CountdownShell h="--" m="--" s="--" />;
  }

  const diff = Math.max(0, targetMs - now);
  if (diff <= 0) return null;

  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return <CountdownShell h={pad(h)} m={pad(m)} s={pad(s)} />;
}

function CountdownShell({ h, m, s }: { h: string; m: string; s: string }) {
  const Cell = ({ v, label }: { v: string; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="grid min-w-[2.75rem] place-items-center rounded-lg bg-primary px-2 py-1.5 font-mono text-lg font-bold text-primary-foreground tabular-nums sm:text-xl">
        {v}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5">
      <Cell v={h} label="Saat" />
      <span className="pb-4 text-lg font-bold text-muted-foreground">:</span>
      <Cell v={m} label="Dakika" />
      <span className="pb-4 text-lg font-bold text-muted-foreground">:</span>
      <Cell v={s} label="Saniye" />
    </div>
  );
}
