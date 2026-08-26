"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/domain";

export function AppShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar profile={profile} onMenuClick={() => setMobileOpen((v) => !v)} />
      <div className="flex flex-1">
        <aside
          className={cn(
            "w-60 shrink-0 border-e border-border bg-card md:block",
            mobileOpen ? "block" : "hidden"
          )}
        >
          <Sidebar role={profile.role} />
        </aside>
        <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
