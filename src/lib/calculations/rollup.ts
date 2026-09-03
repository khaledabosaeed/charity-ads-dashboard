/**
 * Roll-ups over day-level entries — the reading behind every report sheet.
 * Per-entry metrics stay in `./statistics`; this file only aggregates.
 */

import { roas } from "@/lib/calculations/statistics";

/** The three columns every report reads off an entry. */
export type RollupSource = {
  amount_spent: number;
  advertising_return: number;
  order_count: number;
  donation_value: number;
  period_start: string;
  currency_code: string;
};

export type Rollup = {
  spend: number;
  revenue: number;
  orders: number;
  /** Pixel-reported donation value — distinct from `revenue` (advertising_return). */
  donations: number;
  /** Return on ad spend for the whole roll-up. Null while nothing was spent. */
  roas: number | null;
  /** Distinct dates carrying spend or return — how long the campaign ran. */
  activeDays: number;
  entries: number;
};

export function rollup(entries: RollupSource[]): Rollup {
  let spend = 0;
  let revenue = 0;
  let orders = 0;
  let donations = 0;
  const days = new Set<string>();

  for (const e of entries) {
    spend += e.amount_spent;
    revenue += e.advertising_return;
    orders += e.order_count;
    donations += e.donation_value;
    if (e.amount_spent > 0 || e.advertising_return > 0) days.add(e.period_start);
  }

  return {
    spend,
    revenue,
    orders,
    donations,
    roas: roas(revenue, spend),
    activeDays: days.size,
    entries: entries.length,
  };
}

export type RollupGroup<T> = {
  id: string;
  label: string;
  totals: Rollup;
  entries: T[];
};

/**
 * Groups entries by whatever the caller identifies them by — a platform, an
 * association — and ranks the groups by return, the way the sheets read.
 * `seed` names groups that must appear even with nothing drawn against them:
 * a platform at zero is a reading, not an absence.
 */
export function rollupBy<T extends RollupSource>(
  entries: T[],
  identify: (entry: T) => { id: string; label: string } | null,
  seed: { id: string; label: string }[] = []
): RollupGroup<T>[] {
  const groups = new Map<string, { label: string; entries: T[] }>();

  for (const s of seed) groups.set(s.id, { label: s.label, entries: [] });

  for (const entry of entries) {
    const key = identify(entry);
    if (!key) continue;
    const group = groups.get(key.id);
    if (group) group.entries.push(entry);
    else groups.set(key.id, { label: key.label, entries: [entry] });
  }

  return [...groups.entries()]
    .map(([id, group]) => ({ id, label: group.label, totals: rollup(group.entries), entries: group.entries }))
    .sort((a, b) => b.totals.revenue - a.totals.revenue || b.totals.spend - a.totals.spend);
}

/**
 * Totals only carry a currency when every entry agrees on one. Mixed books are
 * reported as bare figures rather than silently stamped with a symbol.
 */
export function unifiedCurrency(entries: RollupSource[]): string | null {
  const codes = new Set(entries.map((e) => e.currency_code));
  return codes.size === 1 ? [...codes][0] : null;
}

/** A roll-up figure with its unit, or the bare figure when the books are mixed. */
export function withUnit(text: string, unit: string | null): string {
  return unit ? `${text} ${unit}` : text;
}
