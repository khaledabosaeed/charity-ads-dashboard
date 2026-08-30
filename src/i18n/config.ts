/**
 * Server-safe i18n constants.
 *
 * These must NOT live in a "use client" module: a Server Component importing a
 * value from a client module receives a client reference, not the string, so
 * the root layout would read an undefined cookie name and always fall back to
 * the default locale.
 */
export type Locale = "ar" | "en";

export const LOCALE_COOKIE_NAME = "locale";

export const DEFAULT_LOCALE: Locale = "ar";
