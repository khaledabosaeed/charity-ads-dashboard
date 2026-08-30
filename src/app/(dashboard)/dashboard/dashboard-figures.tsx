"use client";

import { useI18n } from "@/i18n";
import { DimensionCell, DimensionGrid, SectionBand } from "@/components/drawing";
import { formatCount, formatNumber, formatPercent } from "@/lib/format";
import { formatMetric, remainingBudget, roas, spendPercentage } from "@/lib/calculations/statistics";
import type { StatisticsEntryWithRelations } from "@/types/domain";

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((acc, item) => acc + pick(item), 0);
}

export function DashboardFigures({ entries }: { entries: StatisticsEntryWithRelations[] }) {
  const { dict } = useI18n();

  const totalBudget = sum(entries, (e) => e.budget);
  const totalSpent = sum(entries, (e) => e.amount_spent);
  const remaining = remainingBudget(totalBudget, totalSpent);

  const roasValues = entries
    .map((e) => roas(e.advertising_return, e.amount_spent))
    .filter((v): v is number => v !== null);
  const avgRoas =
    roasValues.length > 0 ? roasValues.reduce((a, b) => a + b, 0) / roasValues.length : null;

  /* Totals only carry a currency when every entry agrees on one. Mixed books
     are reported as bare figures rather than silently stamped with a symbol. */
  const currencies = new Set(entries.map((e) => e.currency_code));
  const unit = currencies.size === 1 ? [...currencies][0] : null;

  const cells = [
    {
      label: dict.dashboard.donationCount,
      value: formatCount(sum(entries, (e) => e.donation_count)),
      note: undefined,
      tone: "ink" as const,
    },
    {
      label: dict.dashboard.donationValue,
      value: formatNumber(sum(entries, (e) => e.donation_value)),
      note: unit,
      tone: "ink" as const,
    },
    {
      label: dict.dashboard.advertisingReturn,
      value: formatNumber(sum(entries, (e) => e.advertising_return)),
      note: unit,
      tone: "datum" as const,
    },
    {
      label: dict.dashboard.associationReturn,
      value: formatNumber(sum(entries, (e) => e.association_return)),
      note: unit,
      tone: "datum" as const,
    },
    {
      label: dict.dashboard.avgRoas,
      value: formatMetric(avgRoas, (n) => `${n.toFixed(2)}×`),
      note: undefined,
      tone: avgRoas !== null && avgRoas >= 1 ? ("datum" as const) : ("ink" as const),
    },
    {
      label: dict.dashboard.entriesCounted,
      value: formatCount(entries.length),
      note: undefined,
      tone: "ink" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <SectionBand
        budgetLabel={dict.dashboard.totalBudget}
        budgetValue={unit ? `${formatNumber(totalBudget)} ${unit}` : formatNumber(totalBudget)}
        spentLabel={dict.dashboard.totalSpent}
        spentValue={formatNumber(totalSpent)}
        remainingLabel={dict.dashboard.remainingBudget}
        remainingValue={formatNumber(Math.abs(remaining))}
        overrunLabel={dict.dashboard.overrun}
        budget={totalBudget}
        spent={totalSpent}
        percentText={`${formatPercent(spendPercentage(totalBudget, totalSpent))} ${dict.dashboard.spendReading}`}
      />

      <DimensionGrid className="sm:grid-cols-3 lg:grid-cols-6">
        {cells.map((c) => (
          <DimensionCell key={c.label} label={c.label} value={c.value} note={c.note} tone={c.tone} />
        ))}
      </DimensionGrid>
    </div>
  );
}
