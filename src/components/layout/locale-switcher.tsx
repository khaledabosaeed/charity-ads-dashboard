"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const { locale, dict, setLocale } = useI18n();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
    >
      <Languages className="h-4 w-4" />
      {dict.common.language}
    </Button>
  );
}
