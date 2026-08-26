/** Derived statistics metrics. Never stored — always computed for display. */

export function remainingBudget(budget: number, amountSpent: number): number {
  return budget - amountSpent;
}

/** Percentage of budget spent, 0-100+. Returns 0 when budget is 0. */
export function spendPercentage(budget: number, amountSpent: number): number {
  if (budget <= 0) return 0;
  return (amountSpent / budget) * 100;
}

/** Return on ad spend. Returns null when amountSpent is 0 (undefined ratio). */
export function roas(advertisingReturn: number, amountSpent: number): number | null {
  if (amountSpent <= 0) return null;
  return advertisingReturn / amountSpent;
}

/** Average donation value. Returns null when donationCount is 0. */
export function avgDonationValue(donationValue: number, donationCount: number): number | null {
  if (donationCount <= 0) return null;
  return donationValue / donationCount;
}

/** Formats a nullable numeric metric for display: "—" when unavailable. */
export function formatMetric(value: number | null, formatter: (n: number) => string): string {
  return value === null ? "—" : formatter(value);
}
