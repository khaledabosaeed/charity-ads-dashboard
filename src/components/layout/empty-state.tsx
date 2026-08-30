"use client";

import { useI18n } from "@/i18n";

/**
 * Nothing drawn yet. The region is left open and hatched, the way an unresolved
 * area is left on a drawing — never filled with a placeholder figure.
 */
export function EmptyState({ message, action }: { message?: string; action?: React.ReactNode }) {
  const { dict } = useI18n();
  return (
    <div className="border border-dashed border-line-2 bg-paper-raised">
      <div className="hatch flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="text-sm text-ink-2">{message ?? dict.common.noData}</p>
        <div className="h-0.5 w-24 bg-datum" aria-hidden="true" />
        {action}
      </div>
    </div>
  );
}
