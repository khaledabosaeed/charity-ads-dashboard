"use client";

import { LogOut, Menu, X } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Stamp } from "@/components/brand/lockup";
import { signOutAction } from "@/app/(auth)/actions";

/**
 * Below md the rail collapses into a drawer, so the topbar itself becomes the
 * amber region — colour keeps owning a whole band of the screen rather than
 * scattering into button fills. From md up the rail is back and the topbar
 * returns to paper.
 */
export function Topbar({
  menuOpen,
  onMenuClick,
}: {
  menuOpen?: boolean;
  onMenuClick?: () => void;
}) {
  const { dict } = useI18n();

  const onRailGhost =
    "text-rail-ink hover:bg-rail-line md:text-ink-2 md:hover:bg-paper-sunk md:hover:text-ink";

  return (
    <header
      className={
        "sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-rail-line bg-rail px-3 " +
        "text-rail-ink md:border-line md:bg-paper/90 md:px-5 md:text-ink md:backdrop-blur-sm"
      }
    >
      {onMenuClick ? (
        <Button
          variant="ghost"
          size="icon"
          className={"md:hidden " + onRailGhost}
          onClick={onMenuClick}
          aria-expanded={menuOpen}
          aria-label={dict.nav.menu}
        >
          {menuOpen ? (
            <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          )}
        </Button>
      ) : null}

      <span className="flex items-center gap-2 md:hidden">
        <Stamp size={28} />
        <span className="max-w-[9.5rem] truncate text-[0.8125rem] font-semibold">
          {dict.appName}
        </span>
      </span>

      <div className="ms-auto flex items-center gap-1 sm:gap-2">
        <LocaleSwitcher className={onRailGhost} />
        <ThemeToggle className={onRailGhost} />
        <span className="mx-1 hidden h-5 w-px bg-rail-line md:block md:bg-line" aria-hidden="true" />
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className={
              "border-rail-ink/30 bg-transparent text-rail-ink hover:border-rail-ink/50 hover:bg-rail-line " +
              "md:border-line-2 md:bg-paper-raised md:text-ink md:hover:border-line-3 md:hover:bg-paper-sunk"
            }
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="hidden sm:inline">{dict.nav.signOut}</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
