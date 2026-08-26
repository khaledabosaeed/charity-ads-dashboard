"use client";

import { useI18n } from "@/i18n";

function resolve(obj: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : path;
}

export function PageHeading({
  titleKey,
  action,
}: {
  titleKey: string;
  action?: React.ReactNode;
}) {
  const { dict } = useI18n();
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-xl font-semibold">{resolve(dict, titleKey)}</h1>
      {action}
    </div>
  );
}
