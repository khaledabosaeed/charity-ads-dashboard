"use client";

import { useI18n } from "@/i18n";
import { TitleBlock } from "@/components/drawing";

function resolve(obj: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === "string" ? value : path;
}

/** Every sheet opens with its title block. */
export function PageHeading({
  titleKey,
  extent,
  revision,
  action,
}: {
  titleKey: string;
  extent?: React.ReactNode;
  revision?: React.ReactNode;
  action?: React.ReactNode;
}) {
  const { dict } = useI18n();
  return (
    <TitleBlock
      title={resolve(dict, titleKey)}
      extent={extent}
      revision={revision}
      action={action}
    />
  );
}
