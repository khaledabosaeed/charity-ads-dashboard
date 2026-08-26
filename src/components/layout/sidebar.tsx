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

export function Sidebar({ role }: { role: UserRole }) {
  const { dict } = useI18n();
  const pathname = usePathname();

  const items = [
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

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
