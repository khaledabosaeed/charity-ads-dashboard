"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useI18n } from "@/i18n";
import { formatNumber } from "@/lib/format";
import type { PlatformReading } from "@/app/(dashboard)/platforms/platform-summary";

/** The app's four semantic tokens, cycled by index — there is no larger qualitative palette. */
const SERIES_COLORS = ["var(--amber-deep)", "var(--datum)", "var(--alarm)", "var(--ink-3)"];

function DrawnTooltip({
  active,
  payload,
  spendLabel,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number }[];
  spendLabel: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  if (!point) return null;

  return (
    <div className="border border-line-2 bg-paper-raised shadow-[0_2px_10px_-4px_rgb(0_0_0/0.25)]">
      <p className="figure border-b border-line px-3 py-1.5 text-[0.6875rem] text-ink-2">
        {point.name}
      </p>
      <dl className="flex flex-col gap-1.5 px-3 py-2">
        <div className="flex items-baseline justify-between gap-6">
          <dt className="annot">{spendLabel}</dt>
          <dd className="figure text-[0.8125rem] font-semibold text-ink">
            {formatNumber(point.value ?? 0)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function PlatformSpendDonut({ readings }: { readings: PlatformReading[] }) {
  const { dict } = useI18n();

  const data = readings
    .filter((r) => r.totals.spend > 0)
    .map((r) => ({ name: r.label, value: r.totals.spend }));

  return (
    <section className="border border-line bg-paper-raised">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold tracking-tight text-ink">
          {dict.dashboard.spendShareTitle}
        </h2>
        <ul className="flex flex-wrap items-center gap-3">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5"
                style={{ backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }}
                aria-hidden="true"
              />
              <span className="annot">{d.name}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="px-2 pb-3 pt-5 sm:px-4">
        <div className="plot-in h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<DrawnTooltip spendLabel={dict.statistics.amountSpent} />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="85%"
                strokeWidth={2}
                stroke="var(--paper-raised)"
                isAnimationActive={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
