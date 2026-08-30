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
} from "lucide-react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database.types";

export function useNavItems(role: UserRole) {
  const { dict } = useI18n();
  return [
    { href: "/dashboard", label: dict.nav.dashboard, icon: LayoutDashboard },
    { href: "/statistics", label: dict.nav.statistics, icon: ListChecks },
    ...(role === "admin"
      ? [
          { href: "/admin/associations", label: dict.nav.associations, icon: Building2 },
          { href: "/admin/media-buyers", label: dict.nav.mediaBuyers, icon: Users },
          { href: "/admin/platforms", label: dict.nav.platforms, icon: Radio },
          { href: "/admin/audit-logs", label: dict.nav.auditLogs, icon: ScrollText },
        ]
      : []),
  ];
}

/**
 * Navigation on the amber rail. The selected storey inverts to ink — the block
 * is the state, so no dot, bar, or chevron is needed to announce it.
 */
export function Sidebar({
  role,
  onNavigate,
}: {
  role: UserRole;
  onNavigate?: () => void;
}) {
  const { dict } = useI18n();
  const pathname = usePathname();
  const items = useNavItems(role);

  return (
    <nav className="flex flex-col gap-px p-3" aria-label={dict.nav.dashboard}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[2px] px-3 py-2.5 text-[0.8125rem] font-medium",
              "transition-colors duration-150",
              active
                ? "bg-rail-ink text-rail"
                : "text-rail-ink hover:bg-rail-line"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
