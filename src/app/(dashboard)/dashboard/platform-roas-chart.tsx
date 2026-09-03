"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useI18n } from "@/i18n";
import type { PlatformReading } from "@/app/(dashboard)/platforms/platform-summary";

/** The app's four semantic tokens, cycled by index — there is no larger qualitative palette. */
const SERIES_COLORS = ["var(--amber-deep)", "var(--datum)", "var(--alarm)", "var(--ink-3)"];

function DrawnTooltip({
  active,
  payload,
  roasLabel,
}: {
  active?: boolean;
  payload?: { payload?: { label?: string; roas?: number } }[];
  roasLabel: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="border border-line-2 bg-paper-raised shadow-[0_2px_10px_-4px_rgb(0_0_0/0.25)]">
      <p className="figure border-b border-line px-3 py-1.5 text-[0.6875rem] text-ink-2">
        {point.label}
      </p>
      <dl className="flex flex-col gap-1.5 px-3 py-2">
        <div className="flex items-baseline justify-between gap-6">
          <dt className="annot">{roasLabel}</dt>
          <dd className="figure text-[0.8125rem] font-semibold text-ink">
            {(point.roas ?? 0).toFixed(2)}×
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function PlatformRoasChart({ readings }: { readings: PlatformReading[] }) {
  const { dict } = useI18n();

  const data = readings.map((r) => ({ label: r.label, roas: r.totals.roas ?? 0 }));

  return (
    <section className="border border-line bg-paper-raised">
      <header className="flex items-center justify-between gap-x-6 gap-y-2 border-b border-line px-4 py-3 sm:px-5">
        <h2 className="text-sm font-semibold tracking-tight text-ink">
          {dict.dashboard.roasComparisonTitle}
        </h2>
      </header>

      <div className="px-2 pb-3 pt-5 sm:px-4">
        <div className="plot-in h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 12 }}>
              <CartesianGrid stroke="var(--line)" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "var(--line-2)" }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(v: number) => `${v}×`}
              />
              <Tooltip
                cursor={{ fill: "var(--paper-sunk)" }}
                content={<DrawnTooltip roasLabel={dict.statistics.roas} />}
              />
              <Bar dataKey="roas" isAnimationActive={false}>
                {data.map((_, i) => (
                  <Cell key={i} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
