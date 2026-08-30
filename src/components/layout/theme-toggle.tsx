"use client";

import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/i18n";
import { useTheme } from "@/theme";
import { Button } from "@/components/ui/button";

/**
 * Paper or blueprint. The control names the sheet you are switching to, not an
 * abstract "mode", and it says which one is current for screen readers.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { dict } = useI18n();
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? dict.common.themeLight : dict.common.themeDark;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      onClick={toggle}
      aria-label={next}
      title={next}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      )}
      <span className="sr-only sm:not-sr-only">{next}</span>
    </Button>
  );
}
