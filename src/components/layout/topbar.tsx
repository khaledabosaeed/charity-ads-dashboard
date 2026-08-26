"use client";

import { LogOut, Menu } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { signOutAction } from "@/app/(auth)/actions";
import type { Profile } from "@/types/domain";

export function Topbar({
  profile,
  onMenuClick,
}: {
  profile: Profile;
  onMenuClick?: () => void;
}) {
  const { dict } = useI18n();

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        {onMenuClick ? (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        ) : null}
        <span className="font-semibold">{dict.appName}</span>
      </div>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <span className="hidden text-sm text-muted-foreground sm:inline">{profile.full_name}</span>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm">
            <LogOut className="h-4 w-4" />
            {dict.nav.signOut}
          </Button>
        </form>
      </div>
    </header>
  );
}
