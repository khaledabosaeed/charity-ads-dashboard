"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { DATE_PRESETS, presetRange, type DatePreset } from "@/lib/dates/presets";

/**
 * Quick date-range buttons. Each is a plain link carrying the resolved
 * from/to alongside whatever other filters are already in the URL, so the
 * extent stays shareable exactly like the manual date fields below it.
 */
export function DateRangePresets({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const { dict } = useI18n();

  const presetLabel: Record<DatePreset, string> = {
    today: dict.dashboard.presetToday,
    yesterday: dict.dashboard.presetYesterday,
    last7: dict.dashboard.presetLast7,
    thisMonth: dict.dashboard.presetThisMonth,
    lastMonth: dict.dashboard.presetLastMonth,
    max: dict.dashboard.presetMax,
  };

  function hrefFor(preset: DatePreset) {
    const { from, to } = presetRange(preset);
    const params = new URLSearchParams();
    if (searchParams.associationId) params.set("associationId", searchParams.associationId);
    if (searchParams.platformId) params.set("platformId", searchParams.platformId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  }

  function isActive(preset: DatePreset) {
    const { from, to } = presetRange(preset);
    return (searchParams.from ?? "") === (from ?? "") && (searchParams.to ?? "") === (to ?? "");
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5"
      role="group"
      aria-label={dict.dashboard.filters}
    >
      {DATE_PRESETS.map((preset) => (
        <Button key={preset} asChild size="sm" variant={isActive(preset) ? "default" : "outline"}>
          <Link href={hrefFor(preset)}>{presetLabel[preset]}</Link>
        </Button>
      ))}
    </div>
  );
}
