"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Lockup } from "@/components/brand/lockup";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/domain";

/**
 * The rail is a full-height amber field down the start edge — colour owning a
 * whole region rather than dressing a neutral one. Its foot carries the user
 * plate, the way a title block names who drew the sheet.
 */
function Rail({ profile, onNavigate }: { profile: Profile; onNavigate?: () => void }) {
  const { dict } = useI18n();
  return (
    <>
      <div className="border-b border-rail-line/60 p-4">
        <Lockup
          productLine={dict.appName}
          companyClassName="text-rail-ink"
        />
      </div>
      <Sidebar role={profile.role} onNavigate={onNavigate} />
      <div className="mt-auto border-t border-rail-line/60 p-4">
        <p className="truncate text-[0.8125rem] font-semibold text-rail-ink">
          {profile.full_name}
        </p>
        <p className="annot mt-0.5">
          {profile.role === "admin" ? dict.nav.roleAdmin : dict.nav.roleMediaBuyer}
        </p>
      </div>
    </>
  );
}

export function AppShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* the rail — permanent from md up */}
      <aside className="rail sticky top-0 hidden h-screen w-[15.5rem] shrink-0 flex-col bg-rail md:flex">
        <Rail profile={profile} />
      </aside>

      {/* the rail as a drawer, below md */}
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
        />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="mx-auto flex w-full min-w-0 max-w-[86rem] flex-col gap-6 [&>*]:min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
