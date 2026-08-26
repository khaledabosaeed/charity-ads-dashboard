"use client";

import { useI18n } from "@/i18n";

export function LatestEntriesHeading() {
  const { dict } = useI18n();
  return <h2 className="text-lg font-semibold">{dict.dashboard.latestEntries}</h2>;
}
