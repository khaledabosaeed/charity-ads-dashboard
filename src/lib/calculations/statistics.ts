/** Derived statistics metrics. Never stored — always computed for display. */

export function remainingBudget(budget: number, amountSpent: number): number {
  return budget - amountSpent;
}

/** Percentage of budget spent, 0-100+. Returns 0 when budget is 0. */
export function spendPercentage(budget: number, amountSpent: number): number {
  if (budget <= 0) return 0;
  return (amountSpent / budget) * 100;
}

/** Return on spend. Returns null when amountSpent is 0 (undefined ratio). */
export function roas(revenue: number, amountSpent: number): number | null {
  if (amountSpent <= 0) return null;
  return revenue / amountSpent;
}

/** Average donation value. Returns null when donationCount is 0. */
export function avgDonationValue(donationValue: number, donationCount: number): number | null {
  if (donationCount <= 0) return null;
  return donationValue / donationCount;
}

/** Average value per result (AOV). Returns null when there are no orders. */
export function avgResultValue(advertisingReturn: number, orderCount: number): number | null {
  if (orderCount <= 0) return null;
  return advertisingReturn / orderCount;
}

/** Cost per result (order). Returns null when amountSpent or orderCount is 0. */
export function costPerResult(amountSpent: number, orderCount: number): number | null {
  if (amountSpent <= 0 || orderCount <= 0) return null;
  return amountSpent / orderCount;
}

/**
 * Percentage change from `previous` to `current`, e.g. 0.32 for a 32% rise.
 * Null when there is nothing to compare against (previous is null or zero).
 */
export function percentChange(current: number, previous: number | null): number | null {
  if (previous === null || previous === 0) return null;
  return (current - previous) / Math.abs(previous);
}

/** Formats a nullable numeric metric for display: "—" when unavailable. */
export function formatMetric(value: number | null, formatter: (n: number) => string): string {
  return value === null ? "—" : formatter(value);
}
