/** Quick date-range extents for the report filters, and the prior window each one compares against. */

import {
  differenceInCalendarDays,
  endOfMonth,
  format,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

export type DatePreset = "today" | "yesterday" | "last7" | "thisMonth" | "lastMonth" | "max";

export const DATE_PRESETS: DatePreset[] = [
  "today",
  "yesterday",
  "last7",
  "thisMonth",
  "lastMonth",
  "max",
];

function iso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** The extent a preset names. `max` names no bound at all. */
export function presetRange(preset: DatePreset): { from?: string; to?: string } {
  const now = new Date();

  switch (preset) {
    case "today":
      return { from: iso(now), to: iso(now) };
    case "yesterday": {
      const y = subDays(now, 1);
      return { from: iso(y), to: iso(y) };
    }
    case "last7":
      return { from: iso(subDays(now, 6)), to: iso(now) };
    case "thisMonth":
      return { from: iso(startOfMonth(now)), to: iso(now) };
    case "lastMonth": {
      const prior = subMonths(now, 1);
      return { from: iso(startOfMonth(prior)), to: iso(endOfMonth(prior)) };
    }
    case "max":
      return {};
  }
}

/**
 * The equal-length window immediately before `from`..`to` — what a comparison
 * badge reads against, whichever preset (or custom range) produced the extent.
 */
export function previousPeriod(from: string, to: string): { from: string; to: string } {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  const length = differenceInCalendarDays(end, start) + 1;

  const previousEnd = subDays(start, 1);
  const previousStart = subDays(previousEnd, length - 1);

  return { from: iso(previousStart), to: iso(previousEnd) };
}
