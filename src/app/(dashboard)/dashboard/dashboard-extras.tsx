"use client";

import { useI18n } from "@/i18n";
import { DimensionCell, DimensionGrid, RuledHeading } from "@/components/drawing";
import { formatMetric } from "@/lib/calculations/statistics";
import { formatCount, formatNumber, formatPercent } from "@/lib/format";
import { PlatformSummary, type PlatformReading } from "@/app/(dashboard)/platforms/platform-summary";
import { PlatformRoasChart } from "./platform-roas-chart";
import { PlatformSpendDonut } from "./platform-spend-donut";
import type { StoreSalesTotals } from "@/lib/data/store-sales";

/**
 * Everything the redesigned dashboard adds beyond the original KPI grid and
 * time-series chart: the per-platform cards, the store-sales section, and the
 * two comparison charts. Grouped here because all of it needs the dictionary.
 */
export function DashboardExtras({
  platformReadings,
  unit,
  storeSales,
  totalSpent,
}: {
  platformReadings: PlatformReading[];
  unit: string | null;
  storeSales: StoreSalesTotals;
  /** Ad spend across whatever's in scope — cost-per-order reads against it. */
  totalSpent: number;
}) {
  const { dict } = useI18n();
  const storeAov = storeSales.orderCount > 0 ? storeSales.salesValue / storeSales.orderCount : null;
  const conversionRate =
    storeSales.visitCount > 0 ? storeSales.orderCount / storeSales.visitCount : null;
  const costPerOrder = storeSales.orderCount > 0 ? totalSpent / storeSales.orderCount : null;

  return (
    <>
      {platformReadings.length > 0 ? (
        <div className="flex flex-col gap-3">
          <RuledHeading>{dict.daily.platformsTitle}</RuledHeading>
          <PlatformSummary readings={platformReadings} unit={unit} />
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <RuledHeading>{dict.daily.storeSalesTitle}</RuledHeading>
        <DimensionGrid className="sm:grid-cols-3 lg:grid-cols-5">
          <DimensionCell
            label={dict.daily.storeOrderCount}
            value={formatCount(storeSales.orderCount)}
            tone="ink"
          />
          <DimensionCell
            label={dict.daily.storeSalesValue}
            value={formatNumber(storeSales.salesValue)}
            note={unit ?? undefined}
            tone="datum"
          />
          <DimensionCell
            label={dict.dashboard.aov}
            value={formatMetric(storeAov, (n) => formatNumber(n))}
            note={unit ?? undefined}
            tone="ink"
          />
          <DimensionCell
            label={dict.dashboard.conversionRate}
            value={formatMetric(conversionRate, (n) => formatPercent(n * 100))}
            tone="ink"
          />
          <DimensionCell
            label={dict.dashboard.costPerOrder}
            value={formatMetric(costPerOrder, (n) => formatNumber(n))}
            note={unit ?? undefined}
            tone="amber"
          />
        </DimensionGrid>
      </div>

      {platformReadings.length > 1 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PlatformRoasChart readings={platformReadings} />
          <PlatformSpendDonut readings={platformReadings} />
        </div>
      ) : null}
    </>
  );
}
