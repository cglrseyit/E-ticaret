import {
  startOfDay, endOfDay, subDays, startOfToday, endOfToday,
} from "date-fns";

export type RangeKey = "today" | "yesterday" | "7d" | "30d" | "custom";
export type Granularity = "hour" | "day";

export type DateRange = {
  key: RangeKey;
  label: string;
  from: Date;
  to: Date;
  prevFrom: Date;
  prevTo: Date;
  granularity: Granularity;
  days: number; // bucket count for day granularity
};

export function resolveRange(
  key: RangeKey,
  customFrom?: string,
  customTo?: string
): DateRange {
  const now = new Date();
  switch (key) {
    case "today": {
      const from = startOfToday();
      return {
        key, label: "Bugün", from, to: endOfToday(),
        prevFrom: subDays(from, 1), prevTo: subDays(now, 1),
        granularity: "hour", days: 1,
      };
    }
    case "yesterday": {
      const y = subDays(now, 1);
      const from = startOfDay(y);
      return {
        key, label: "Dün", from, to: endOfDay(y),
        prevFrom: subDays(from, 1), prevTo: endOfDay(subDays(y, 1)),
        granularity: "hour", days: 1,
      };
    }
    case "7d": {
      const from = startOfDay(subDays(now, 6));
      return {
        key, label: "Son 7 gün", from, to: endOfToday(),
        prevFrom: startOfDay(subDays(now, 13)), prevTo: endOfDay(subDays(now, 7)),
        granularity: "day", days: 7,
      };
    }
    case "custom": {
      if (customFrom && customTo) {
        const from = startOfDay(new Date(customFrom));
        const to = endOfDay(new Date(customTo));
        const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000));
        const span = to.getTime() - from.getTime();
        return {
          key, label: "Özel", from, to,
          prevFrom: new Date(from.getTime() - span), prevTo: from,
          granularity: days <= 1 ? "hour" : "day", days,
        };
      }
      // fall through to 30d
    }
    case "30d":
    default: {
      const from = startOfDay(subDays(now, 29));
      return {
        key: key === "custom" ? "30d" : key, label: "Son 30 gün", from, to: endOfToday(),
        prevFrom: startOfDay(subDays(now, 59)), prevTo: endOfDay(subDays(now, 30)),
        granularity: "day", days: 30,
      };
    }
  }
}

export function pctDelta(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}
