"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Lockup, Stamp } from "@/components/brand/lockup";
import { RAIL_COOKIE_NAME, type RailState } from "@/components/layout/rail-config";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/domain";

/**
 * The rail is a full-height amber field down the start edge — colour owning a
 * whole region rather than dressing a neutral one. Its foot carries the user
 * plate, the way a title block names who drew the sheet. Closed, the field is
 * still there: it narrows to its icons rather than disappearing.
 */
function Rail({
  profile,
  collapsed,
  onNavigate,
}: {
  profile: Profile;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { dict } = useI18n();
  return (
    <>
      <div
        className={cn(
          "border-b border-rail-line/60",
          collapsed ? "flex justify-center p-2" : "p-4"
        )}
      >
        {collapsed ? (
          <Stamp size={36} />
        ) : (
          <Lockup productLine={dict.appName} companyClassName="text-rail-ink" />
        )}
      </div>

      <Sidebar role={profile.role} collapsed={collapsed} onNavigate={onNavigate} />

      <div
        className={cn(
          "mt-auto border-t border-rail-line/60",
          collapsed ? "p-2 text-center" : "p-4"
        )}
      >
        {collapsed ? (
          <p
            className="figure text-[0.8125rem] font-semibold text-rail-ink"
            title={profile.full_name}
          >
            {profile.full_name.trim().charAt(0)}
          </p>
        ) : (
          <>
            <p className="truncate text-[0.8125rem] font-semibold text-rail-ink">
              {profile.full_name}
            </p>
            <p className="annot mt-0.5">
              {profile.role === "admin" ? dict.nav.roleAdmin : dict.nav.roleMediaBuyer}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export function AppShell({
  profile,
  initialRail = "open",
  children,
}: {
  profile: Profile;
  /** Read from the rail cookie by the dashboard layout, so there is no flash. */
  initialRail?: RailState;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rail, setRail] = useState<RailState>(initialRail);
  const collapsed = rail === "closed";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* The rail's state outlives the page, the way the theme and the locale do. */
  const toggleRail = useCallback(() => {
    setRail((current) => {
      const next: RailState = current === "closed" ? "open" : "closed";
      document.cookie = `${RAIL_COOKIE_NAME}=${next}; path=/; max-age=31536000; samesite=lax`;
      return next;
    });
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* the rail — permanent from md up, open or closed */}
      <aside
        className={cn(
          "rail sticky top-0 hidden h-screen shrink-0 flex-col bg-rail md:flex",
          "transition-[width] duration-200 ease-[var(--ease-draw)]",
          collapsed ? "w-16" : "w-[15.5rem]"
        )}
      >
        <Rail profile={profile} collapsed={collapsed} />
      </aside>

      {/* the rail as a drawer, below md — always full width there */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="close"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className={cn(
              "rail ink-in absolute inset-y-0 start-0 flex w-[15.5rem] flex-col bg-rail",
              "shadow-[0_0_40px_-8px_rgb(0_0_0/0.5)]"
            )}
          >
            <Rail profile={profile} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          menuOpen={mobileOpen}
          onMenuClick={() => setMobileOpen((v) => !v)}
          railOpen={!collapsed}
          onRailToggle={toggleRail}
        />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="mx-auto flex w-full min-w-0 max-w-[86rem] flex-col gap-6 [&>*]:min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
