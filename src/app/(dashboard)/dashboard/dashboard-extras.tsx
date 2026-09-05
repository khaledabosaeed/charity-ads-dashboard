"use client";

import { useI18n } from "@/i18n";
import { RuledHeading } from "@/components/drawing";
import { PlatformSummary, type PlatformReading } from "@/app/(dashboard)/platforms/platform-summary";
import { PlatformRoasChart } from "./platform-roas-chart";
import { PlatformSpendDonut } from "./platform-spend-donut";

/**
 * Everything the redesigned dashboard adds beyond the original KPI grid and
 * time-series chart: the per-platform cards and the two comparison charts.
 */
export function DashboardExtras({
  platformReadings,
  unit,
}: {
  platformReadings: PlatformReading[];
  unit: string | null;
}) {
  const { dict } = useI18n();

  return (
    <>
      {platformReadings.length > 0 ? (
        <div className="flex flex-col gap-3">
          <RuledHeading>{dict.daily.platformsTitle}</RuledHeading>
          <PlatformSummary readings={platformReadings} unit={unit} />
        </div>
      ) : null}

      {platformReadings.length > 1 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PlatformRoasChart readings={platformReadings} />
          <PlatformSpendDonut readings={platformReadings} />
        </div>
      ) : null}
    </>
  );
}
