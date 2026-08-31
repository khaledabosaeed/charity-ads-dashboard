"use client";

import { useI18n } from "@/i18n";
import { currencyMark, formatCount, formatNumber } from "@/lib/format";
import { formatMetric } from "@/lib/calculations/statistics";
import type { Rollup } from "@/lib/calculations/rollup";

export type PlatformReading = { id: string; label: string; totals: Rollup };

/** One platform's standing: what it consumed, what it returned, how long it ran. */
function PlatformCell({ reading, unit }: { reading: PlatformReading; unit: string | null }) {
  const { dict, locale } = useI18n();
  const { totals } = reading;
  const r = totals.roas;

  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="truncate text-[0.9375rem] font-semibold text-ink">{reading.label}</h3>
        <span className="annot shrink-0">
          <span className="figure">{formatCount(totals.activeDays)}</span> {dict.daily.activeDays}
        </span>
      </div>

      <dl className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="annot">{dict.statistics.amountSpent}</dt>
          <dd className="figure text-base font-semibold text-amber-ink">
            {formatNumber(totals.spend)}
            {unit ? <span className="ms-1 text-[0.6875rem] text-ink-3">{currencyMark(unit, locale)}</span> : null}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="annot">{dict.statistics.advertisingReturn}</dt>
          <dd className="figure text-base font-semibold text-datum">
            {formatNumber(totals.revenue)}
            {unit ? <span className="ms-1 text-[0.6875rem] text-ink-3">{currencyMark(unit, locale)}</span> : null}
          </dd>
        </div>
      </dl>

      <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-line pt-3">
        <span className="annot">{dict.statistics.roas}</span>
        <span
          className={
            "figure text-lg font-semibold leading-none " +
            (r === null ? "text-ink-3" : r >= 1 ? "text-datum" : "text-alarm")
          }
        >
          {formatMetric(r, (n) => `${n.toFixed(2)}×`)}
        </span>
      </div>
    </div>
  );
}

export function PlatformSummary({
  readings,
  unit,
}: {
  readings: PlatformReading[];
  unit: string | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {readings.map((reading) => (
        <div key={reading.id} className="bg-paper-raised">
          <PlatformCell reading={reading} unit={unit} />
        </div>
      ))}
    </div>
  );
}
