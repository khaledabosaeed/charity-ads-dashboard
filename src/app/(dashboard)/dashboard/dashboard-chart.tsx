"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useI18n } from "@/i18n";
import { formatNumber } from "@/lib/format";
import type { StatisticsEntryWithRelations } from "@/types/domain";

type Point = { date: string; spent: number; return: number };

/** The drawing's own tooltip: a small sheet with a title block and two figures. */
function DrawnTooltip({
  active,
  payload,
  label,
  spentLabel,
  returnLabel,
}: {
  active?: boolean;
  payload?: { dataKey?: string | number; value?: number }[];
  label?: string;
  spentLabel: string;
  returnLabel: string;
}) {
  if (!active || !payload?.length) return null;
  const get = (key: string) => payload.find((p) => p.dataKey === key)?.value ?? 0;

  return (
    <div className="border border-line-2 bg-paper-raised shadow-[0_2px_10px_-4px_rgb(0_0_0/0.25)]">
      <p className="figure border-b border-line px-3 py-1.5 text-[0.6875rem] text-ink-2">{label}</p>
      <dl className="flex flex-col gap-1.5 px-3 py-2">
        <div className="flex items-baseline justify-between gap-6">
          <dt className="annot">{spentLabel}</dt>
          <dd className="figure text-[0.8125rem] font-semibold text-amber-ink">
            {formatNumber(get("spent"))}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-6">
          <dt className="annot">{returnLabel}</dt>
          <dd className="figure text-[0.8125rem] font-semibold text-datum">
            {formatNumber(get("return"))}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function DashboardChart({ entries }: { entries: StatisticsEntryWithRelations[] }) {
  const { dict } = useI18n();

  const byDate = new Map<string, Point>();
  for (const e of entries) {
    const key = e.period_start;
    const existing = byDate.get(key) ?? { date: key, spent: 0, return: 0 };
    existing.spent += e.amount_spent;
    existing.return += e.advertising_return;
    byDate.set(key, existing);
  }
  const data = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="border border-line bg-paper-raised">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold tracking-tight text-ink">
          {dict.dashboard.chartTitle}
        </h2>
        {/* the key, drawn in the same inks the chart uses */}
        <ul className="flex items-center gap-4">
          <li className="flex items-center gap-2">
            <span className="hatch-dense h-2.5 w-5 bg-amber" aria-hidden="true" />
            <span className="annot">{dict.statistics.amountSpent}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-datum" aria-hidden="true" />
            <span className="annot">{dict.statistics.advertisingReturn}</span>
          </li>
        </ul>
      </header>

      <div className="px-2 pb-3 pt-5 sm:px-4">
        <div className="plot-in h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 12 }}>
              <defs>
                {/* the 45° hatch of a cut face, as an SVG fill */}
                <pattern
                  id="spend-hatch"
                  width="6"
                  height="6"
                  patternTransform="rotate(45)"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="6" height="6" fill="var(--amber)" fillOpacity="0.16" />
                  <line x1="0" y1="0" x2="0" y2="6" stroke="var(--amber-deep)" strokeWidth="1.4" />
                </pattern>
              </defs>

              <CartesianGrid stroke="var(--line)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: "var(--line-2)" }}
                minTickGap={24}
                reversed={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(v: number) => formatNumber(v, 0)}
              />
              {/* the datum */}
              <ReferenceLine y={0} stroke="var(--datum)" strokeWidth={2} />
              <Tooltip
                cursor={{ stroke: "var(--line-3)", strokeWidth: 1, strokeDasharray: "3 3" }}
                content={
                  <DrawnTooltip
                    spentLabel={dict.statistics.amountSpent}
                    returnLabel={dict.statistics.advertisingReturn}
                  />
                }
              />
              <Area
                type="linear"
                dataKey="spent"
                stroke="var(--amber-deep)"
                strokeWidth={1.5}
                fill="url(#spend-hatch)"
                isAnimationActive={false}
                activeDot={{ r: 3, fill: "var(--amber-deep)", stroke: "var(--paper-raised)" }}
              />
              <Line
                type="linear"
                dataKey="return"
                stroke="var(--datum)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                activeDot={{ r: 3, fill: "var(--datum)", stroke: "var(--paper-raised)" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
