"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ar from "@/i18n/dictionaries/ar";
import en from "@/i18n/dictionaries/en";
import type { Dictionary } from "@/i18n/dictionary";

export type Locale = "ar" | "en";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

const LOCALE_COOKIE = "locale";

type I18nContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)locale=(ar|en)/);
  return (match?.[1] as Locale) ?? null;
}

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => readCookieLocale() ?? initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dict: dictionaries[locale], setLocale }),
    [locale, setLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export const LOCALE_COOKIE_NAME = LOCALE_COOKIE;
