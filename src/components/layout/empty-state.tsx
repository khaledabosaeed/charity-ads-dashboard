"use client";

import { Inbox } from "lucide-react";
import { useI18n } from "@/i18n";

export function EmptyState({ message }: { message?: string }) {
  const { dict } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-muted-foreground">
      <Inbox className="h-8 w-8" />
      <p className="text-sm">{message ?? dict.common.noData}</p>
    </div>
  );
}
