"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

function resolve(obj: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : path;
}

export function NewLinkButton({ href, labelKey }: { href: string; labelKey: string }) {
  const { dict } = useI18n();
  return (
    <Button asChild size="sm">
      <Link href={href}>
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">{resolve(dict, labelKey)}</span>
      </Link>
    </Button>
  );
}
