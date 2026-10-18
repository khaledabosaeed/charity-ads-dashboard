"use client";

import { useI18n } from "@/i18n";
import { DimensionCell, DimensionGrid, TrendBadge } from "@/components/drawing";
import { currencyMark, formatCount, formatNumber } from "@/lib/format";
import { avgResultValue, costPerResult, formatMetric, roas } from "@/lib/calculations/statistics";
import type { StatisticsEntryWithRelations } from "@/types/domain";

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((acc, item) => acc + pick(item), 0);
}

/** A tidy column count for whatever survives the empty-card filter below. */
function colsClass(n: number): string {
  if (n % 4 === 0) return "sm:grid-cols-2 lg:grid-cols-4";
  if (n % 3 === 0 || n === 6) return "sm:grid-cols-3 lg:grid-cols-3";
  if (n === 2) return "sm:grid-cols-2 lg:grid-cols-2";
  if (n === 1) return "sm:grid-cols-1 lg:grid-cols-1";
  return "sm:grid-cols-3 lg:grid-cols-4";
}

export function DashboardFigures({
  entries,
  previousEntries,
  associationReturn,
  previousAssociationReturn,
  platformScoped = false,
}: {
  entries: StatisticsEntryWithRelations[];
  previousEntries: StatisticsEntryWithRelations[];
  /** Day-level association return, already totalled for the current extent. */
  associationReturn: number;
  previousAssociationReturn: number;
  /** Narrowed to one platform — see the overall ROAS below. */
  platformScoped?: boolean;
}) {
  const { dict, locale } = useI18n();

  const totalSpent = sum(entries, (e) => e.amount_spent);
  const prevTotalSpent = sum(previousEntries, (e) => e.amount_spent);

  const totalReturn = sum(entries, (e) => e.advertising_return);
  const prevTotalReturn = sum(previousEntries, (e) => e.advertising_return);

  /* Association return is one day-level figure for every platform at once, so
     it cannot be read against a single platform's spend. Narrowed to a
     platform, the ROAS reads that platform's own advertising return. */
  const overallRoas = roas(platformScoped ? totalReturn : associationReturn, totalSpent);
  const prevRoas = roas(
    platformScoped ? prevTotalReturn : previousAssociationReturn,
    prevTotalSpent
  );

  const resultCount = sum(entries, (e) => e.order_count);
  const prevResultCount = sum(previousEntries, (e) => e.order_count);

  const overallCostPerResult = costPerResult(totalSpent, resultCount);
  const prevCostPerResult = costPerResult(prevTotalSpent, prevResultCount);

  const averageResultValue = avgResultValue(totalReturn, resultCount);
  const prevAverageResultValue = avgResultValue(prevTotalReturn, prevResultCount);

  /* Totals only carry a currency when every entry agrees on one. Mixed books
     are reported as bare figures rather than silently stamped with a symbol. */
  const currencies = new Set(entries.map((e) => e.currency_code));
  const unit = currencies.size === 1 ? [...currencies][0] : null;

  /* The same seven readings the per-platform cards show, just totalled across
     whatever the filters leave in scope — "all platforms" reads as one card
     shaped exactly like the ones underneath it. A tile with nothing behind it
     yet is dropped rather than shown as a bare "—" or 0, and reappears on its
     own the moment that data exists. */
  const headline = [
    {
      label: dict.statistics.amountSpent,
      value: formatNumber(totalSpent),
      note: unit ? currencyMark(unit, locale) : unit,
      tone: "amber" as const,
      trend: <TrendBadge current={totalSpent} previous={prevTotalSpent} positiveIsGood={false} />,
      hasData: totalSpent > 0,
    },
    {
      label: dict.statistics.advertisingReturn,
      value: formatNumber(totalReturn),
      note: unit ? currencyMark(unit, locale) : unit,
      tone: "datum" as const,
      trend: <TrendBadge current={totalReturn} previous={prevTotalReturn} />,
      hasData: totalReturn > 0,
    },
    {
      label: dict.dashboard.associationReturn,
      value: formatNumber(associationReturn),
      note: unit ? currencyMark(unit, locale) : unit,
      tone: "datum" as const,
      hasData: associationReturn > 0,
    },
    {
      label: dict.statistics.costPerResult,
      value: formatMetric(overallCostPerResult, (n) => formatNumber(n)),
      note: unit ? currencyMark(unit, locale) : unit,
      tone: "amber" as const,
      trend: (
        <TrendBadge current={overallCostPerResult ?? 0} previous={prevCostPerResult} positiveIsGood={false} />
      ),
      hasData: overallCostPerResult !== null,
    },
    {
      label: dict.statistics.resultCount,
      value: formatCount(resultCount),
      note: undefined,
      tone: "ink" as const,
      trend: <TrendBadge current={resultCount} previous={prevResultCount} />,
      hasData: resultCount > 0,
    },
    {
      label: dict.statistics.avgResultValue,
      value: formatMetric(averageResultValue, (n) => formatNumber(n)),
      note: unit ? currencyMark(unit, locale) : unit,
      tone: "ink" as const,
      trend: <TrendBadge current={averageResultValue ?? 0} previous={prevAverageResultValue} />,
      hasData: averageResultValue !== null,
    },
    {
      label: dict.statistics.roas,
      value: formatMetric(overallRoas, (n) => `${n.toFixed(2)}×`),
      note: undefined,
      tone: overallRoas !== null && overallRoas >= 1 ? ("datum" as const) : ("ink" as const),
      trend: <TrendBadge current={overallRoas ?? 0} previous={prevRoas} />,
      hasData: overallRoas !== null,
    },
  ].filter((c) => c.hasData);

  const secondary = [
    {
      label: dict.dashboard.entriesCounted,
      value: formatCount(entries.length),
      note: undefined,
      tone: "ink" as const,
      hasData: entries.length > 0,
    },
  ].filter((c) => c.hasData);

  return (
    <div className="flex flex-col gap-4">
      {headline.length > 0 ? (
        <DimensionGrid className={colsClass(headline.length)}>
          {headline.map((c) => (
            <DimensionCell
              key={c.label}
              label={c.label}
              value={c.value}
              note={c.note}
              tone={c.tone}
              trend={c.trend}
            />
          ))}
        </DimensionGrid>
      ) : null}

      {/* The budget-vs-spend band is hidden for now: most entries carry no
          budget yet, which drew every sheet as a false "over budget" alarm. */}

      {secondary.length > 0 ? (
        <DimensionGrid className={colsClass(secondary.length)}>
          {secondary.map((c) => (
            <DimensionCell key={c.label} label={c.label} value={c.value} note={c.note} tone={c.tone} />
          ))}
        </DimensionGrid>
      ) : null}
    </div>
  );
}
