"use client";

import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import type { TimePoint } from "@/lib/analytics/metrics";
import { formatPrice } from "@/lib/utils";

export function TrendChart({
  data,
  type = "number",
  color = "var(--accent)",
}: {
  data: TimePoint[];
  type?: "currency" | "number";
  color?: string;
}) {
  const fmt = (v: number) =>
    type === "currency" ? formatPrice(v) : v.toLocaleString("tr-TR");

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v) => (type === "currency" ? `${Math.round(v / 1000)}k` : `${v}`)}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            fontSize: 13,
          }}
          formatter={(value: number, name: string) => [
            fmt(value),
            name === "current" ? "Bu dönem" : "Önceki dönem",
          ]}
        />
        <Area
          type="monotone"
          dataKey="previous"
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          fill="none"
        />
        <Area
          type="monotone"
          dataKey="current"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#g-${color})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
