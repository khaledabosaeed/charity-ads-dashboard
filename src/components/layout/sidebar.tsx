"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  Building2,
  Users,
  Radio,
  ScrollText,
  FilePlus2,
  ClipboardList,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/domain";

/**
 * Two jobs, two rails. A media buyer's day runs entry → today's report →
 * platform standing → association standing, so those four sheets are the whole
 * navigation. An admin owns the account structure instead, and keeps the
 * portfolio dashboard, the full record, and the admin sheets.
 */
export function useNavItems(role: UserRole) {
  const { dict } = useI18n();

  if (role !== "admin") {
    return [
      { href: "/entry", label: dict.nav.dailyEntry, icon: FilePlus2 },
      { href: "/daily", label: dict.nav.dailyReport, icon: ClipboardList },
      { href: "/platforms", label: dict.nav.platformsSummary, icon: Radio },
      { href: "/associations", label: dict.nav.associationsPerformance, icon: Building2 },
    ];
  }

  return [
    { href: "/dashboard", label: dict.nav.dashboard, icon: LayoutDashboard },
    { href: "/daily", label: dict.nav.dailyReport, icon: ClipboardList },
    { href: "/statistics", label: dict.nav.statistics, icon: ListChecks },
    { href: "/admin/associations", label: dict.nav.associations, icon: Building2 },
    { href: "/admin/users", label: dict.nav.users, icon: Users },
    { href: "/admin/platforms", label: dict.nav.platforms, icon: Radio },
    { href: "/admin/audit-logs", label: dict.nav.auditLogs, icon: ScrollText },
  ];
}

/**
 * Navigation on the amber rail. The selected storey inverts to ink — the block
 * is the state, so no dot, bar, or chevron is needed to announce it.
 */
export function Sidebar({
  role,
  collapsed,
  onNavigate,
}: {
  role: UserRole;
  /** Closed, the rail keeps only the icons — the region stays, the words go. */
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const items = useNavItems(role);

  return (
    <nav
      className={cn("flex flex-col gap-px", collapsed ? "p-2" : "p-3")}
      aria-label={dict.nav.dashboard}
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[2px] py-2.5 text-[0.8125rem] font-medium",
              "transition-colors duration-150",
              collapsed ? "justify-center px-0" : "px-3",
              active
                ? "bg-rail-ink text-rail"
                : "text-rail-ink hover:bg-rail-line"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
