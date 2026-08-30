/** Display formatting. Figures are always Latin tabular numerals so columns align. */

export function formatNumber(n: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(n);
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

export function formatMoney(n: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${formatNumber(n)} ${currency}`;
  }
}

/** Compact form for the section band, where the figure sits inside the mass. */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatPercent(n: number, digits = 1): string {
  return `${formatNumber(n, digits)}%`;
}

/** A period reads as a measured extent: 2026-01-01 → 2026-03-31 */
export function formatPeriod(start: string, end: string): string {
  return `${start} → ${end}`;
}
