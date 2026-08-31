/** Display formatting. Figures are always Latin tabular numerals so columns align. */

import type { Locale } from "@/i18n/config";

/**
 * The mark a currency is read by, per script. The figure itself never changes
 * script — only its unit does, so an Arabic sheet reads ريال and an English one
 * reads SAR off the same tabular column.
 */
const CURRENCY_MARK: Record<string, Record<Locale, string>> = {
  SAR: { ar: "ر.س", en: "SAR" },
};

export function currencyMark(currency: string, locale: Locale = "en"): string {
  return CURRENCY_MARK[currency]?.[locale] ?? currency;
}

export function formatNumber(n: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(n);
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

/** A sum with its unit annotated after it, the way a dimension carries its unit. */
export function formatMoney(n: number, currency: string, locale: Locale = "en"): string {
  const figure = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  return `${figure} ${currencyMark(currency, locale)}`;
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
