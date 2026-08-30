"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, dict, setLocale } = useI18n();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
      aria-label={dict.common.language}
    >
      <Languages className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only sm:not-sr-only">{dict.common.language}</span>
    </Button>
  );
}
