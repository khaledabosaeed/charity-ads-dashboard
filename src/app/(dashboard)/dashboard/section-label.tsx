"use client";

import { useI18n } from "@/i18n";
import { formatPeriod } from "@/lib/format";

/** The sheet's drawn extent: which slice of the record this view covers. */
export function ExtentLabel({ from, to }: { from?: string; to?: string }) {
  const { dict } = useI18n();
  if (!from && !to) return <>{dict.dashboard.extentAll}</>;
  return (
    <>
      {dict.dashboard.extentFrom}{" "}
      <span className="figure">{formatPeriod(from ?? "…", to ?? "…")}</span>
    </>
  );
}

export function LatestEntriesLabel() {
  const { dict } = useI18n();
  return <>{dict.dashboard.latestEntries}</>;
}
