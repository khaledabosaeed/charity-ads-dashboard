import * as React from "react";
import { cn } from "@/lib/utils";
import { percentChange } from "@/lib/calculations/statistics";

/* ------------------------------------------------------------------ *
 * The drawing's vocabulary. Every screen is built from these six.
 * No cards, no rounded panels, no soft shadows — hairlines and mass.
 * ------------------------------------------------------------------ */

/** A drawing sheet: a hairline rectangle on the board. */
export function Sheet({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("border border-line bg-paper-raised", className)}
      {...props}
    />
  );
}

/**
 * The sheet's title block. On a real drawing it names the sheet, its scale and
 * its revision; here it names the view, its filter extent, and the date it was
 * drawn — plus the one action that belongs to this sheet.
 */
export function TitleBlock({
  title,
  extent,
  revision,
  action,
  className,
}: {
  title: React.ReactNode;
  extent?: React.ReactNode;
  revision?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-line-2 bg-paper-raised", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-5">
        <h1 className="text-lg font-semibold leading-tight tracking-tight text-ink sm:text-xl">
          {title}
        </h1>
        {action}
      </div>
      {(extent || revision) && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-line px-4 py-2 sm:px-5">
          {extent ? <span className="annot">{extent}</span> : null}
          {revision ? (
            <span className="annot figure ms-auto text-ink-3">{revision}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}

/**
 * A dimension string: a measured extent with tick serifs at both ends, the
 * label above it and the figure beneath. This is how every metric is annotated.
 */
/**
 * A period-over-period reading: how the current figure compares to the same
 * length of time just before it. Silent (an em-dash) when there is nothing to
 * compare against yet.
 */
export function TrendBadge({
  current,
  previous,
  positiveIsGood = true,
  formatter = (n) => `${Math.round(Math.abs(n) * 100)}%`,
}: {
  current: number;
  previous: number | null;
  /** Flip for cost-like metrics, where a fall is the good direction. */
  positiveIsGood?: boolean;
  formatter?: (change: number) => string;
}) {
  const change = percentChange(current, previous);
  if (change === null) {
    return <span className="annot figure text-ink-3">—</span>;
  }

  const rising = change > 0;
  const good = rising === positiveIsGood;
  const flat = change === 0;

  return (
    <span
      className={cn(
        "annot figure",
        flat ? "text-ink-3" : good ? "text-datum" : "text-alarm"
      )}
    >
      {flat ? "—" : rising ? "▲" : "▼"} {formatter(change)}
    </span>
  );
}

export function DimensionCell({
  label,
  value,
  note,
  trend,
  tone = "ink",
  className,
  style,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  note?: React.ReactNode;
  trend?: React.ReactNode;
  tone?: "ink" | "amber" | "datum" | "alarm" | "cobalt";
  className?: string;
  style?: React.CSSProperties;
}) {
  const ruleTone = {
    ink: "bg-line-2",
    amber: "bg-amber-deep",
    datum: "bg-datum",
    alarm: "bg-alarm",
    cobalt: "bg-cobalt",
  }[tone];
  const figureTone = {
    ink: "text-ink",
    amber: "text-amber-ink",
    datum: "text-datum",
    alarm: "text-alarm",
    cobalt: "text-cobalt",
  }[tone];

  return (
    <div className={cn("px-4 py-4 sm:px-5", className)} style={style}>
      <p className="annot min-h-[2.7em]">{label}</p>
      <div className="rule-in relative mb-2.5 mt-1 h-2" aria-hidden="true">
        <span className={cn("absolute inset-x-0 top-1/2 h-px -translate-y-1/2", ruleTone)} />
        <span className={cn("absolute inset-y-0 start-0 w-px", ruleTone)} />
        <span className={cn("absolute inset-y-0 end-0 w-px", ruleTone)} />
      </div>
      <p className={cn("figure text-2xl font-semibold leading-none sm:text-[1.75rem]", figureTone)}>
        {value}
      </p>
      {note ? <p className="annot mt-2 text-ink-3">{note}</p> : null}
      {trend ? <p className="mt-1">{trend}</p> : null}
    </div>
  );
}

/**
 * A grid of dimension cells divided by hairlines only. The hairlines are drawn
 * with a background rather than per-cell borders so the grid closes cleanly at
 * every breakpoint and in both directions.
 */
export function DimensionGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {React.Children.map(children, (child, i) => (
        <div
          className="bg-paper-raised"
          key={i}
          style={{ "--draw-delay": `${340 + i * 40}ms` } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * The section band: a quantity drawn as mass with a visible cut.
 * The full drawn extent is max(budget, spent). The consumed part is solid and
 * hatched; the remainder is left open; any overrun past the budget edge is drawn
 * in the correction red with a dense hatch and a vertical rule at the edge.
 * A green datum runs beneath — zero, everywhere.
 */
export function SectionBand({
  budgetLabel,
  budgetValue,
  spentLabel,
  spentValue,
  remainingLabel,
  remainingValue,
  overrunLabel,
  budget,
  spent,
  percentText,
  animate = true,
}: {
  budgetLabel: React.ReactNode;
  budgetValue: React.ReactNode;
  spentLabel: React.ReactNode;
  spentValue: React.ReactNode;
  remainingLabel: React.ReactNode;
  remainingValue: React.ReactNode;
  overrunLabel: React.ReactNode;
  budget: number;
  spent: number;
  percentText: string;
  animate?: boolean;
}) {
  const extent = Math.max(budget, spent, 1);
  const spentPct = Math.min(100, (Math.min(spent, budget) / extent) * 100);
  const budgetPct = (budget / extent) * 100;
  const overrun = Math.max(0, spent - budget);
  const overrunPct = (overrun / extent) * 100;
  const over = overrun > 0;

  return (
    <div className="border border-line bg-paper-raised">
      {/* dimension string above the mass */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 pt-4 sm:px-5">
        <p className="annot">{budgetLabel}</p>
        <p className="figure text-2xl font-semibold leading-none text-ink sm:text-3xl">
          {budgetValue}
        </p>
      </div>

      <div className="px-4 pb-4 pt-4 sm:px-5">
        {/* the mass */}
        <div className="relative h-16 border border-line-2 bg-amber-veil sm:h-20">
          {/* remaining budget stays open, faintly hatched */}
          <div
            className="hatch absolute inset-y-0 start-0 opacity-40"
            style={{ width: `${budgetPct}%` }}
            aria-hidden="true"
          />
          {/* the consumed mass, solid, cut from the start edge */}
          <div
            className={cn(
              "absolute inset-y-0 start-0 bg-amber",
              animate ? "strike" : "transition-[width] duration-300 ease-out"
            )}
            style={{ width: `${spentPct}%` }}
          >
            <div className="hatch-dense absolute inset-0 opacity-50" aria-hidden="true" />
          </div>
          {/* the overrun, drawn past the budget edge in correction red */}
          {over ? (
            <div
              className={cn(
                "absolute inset-y-0 bg-alarm",
                animate ? "strike" : "transition-[width,inset-inline-start] duration-300 ease-out"
              )}
              style={{ insetInlineStart: `${budgetPct}%`, width: `${overrunPct}%` }}
            >
              <div className="hatch-dense absolute inset-0 opacity-60" aria-hidden="true" />
            </div>
          ) : null}
          {/* the cut face */}
          <div
            className={cn(
              "absolute inset-y-0 w-px bg-line-3",
              !animate && "transition-[inset-inline-start] duration-300 ease-out"
            )}
            style={{ insetInlineStart: `${spentPct}%` }}
            aria-hidden="true"
          />
          {/* the budget edge, when the mass runs past it */}
          {over ? (
            <div
              className="absolute inset-y-[-6px] w-0.5 bg-line-3"
              style={{ insetInlineStart: `${budgetPct}%` }}
              aria-hidden="true"
            />
          ) : null}
          <span
            className="absolute bottom-1.5 start-2.5 text-[0.6875rem] font-semibold text-rail-ink"
            style={{ opacity: spentPct > 14 ? 1 : 0 }}
          >
            <span className="figure">{percentText}</span>
          </span>
        </div>

        {/* the datum: zero, everywhere — and ruled before any quantity is drawn */}
        <div
          className={cn("mt-1 h-0.5 w-full bg-datum", animate && "rule-in")}
          aria-hidden="true"
        />

        {/* what the mass says, read left of the cut and right of it */}
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <p className="flex items-baseline gap-2">
            <span className="annot">{spentLabel}</span>
            <span className="figure text-base font-semibold text-amber-ink">{spentValue}</span>
          </p>
          <p className="flex items-baseline gap-2">
            <span className="annot">{over ? overrunLabel : remainingLabel}</span>
            <span
              className={cn(
                "figure text-base font-semibold",
                over ? "text-alarm" : "text-datum"
              )}
            >
              {remainingValue}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/** A hairline rule carrying a label — the drawing's section divider. */
export function RuledHeading({
  children,
  action,
  className,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <h2 className="shrink-0 text-sm font-semibold tracking-tight text-ink">{children}</h2>
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
      {action}
    </div>
  );
}
