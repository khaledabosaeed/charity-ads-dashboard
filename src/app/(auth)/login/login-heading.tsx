"use client";

import { useI18n } from "@/i18n";

export function LoginHeading() {
  const { dict } = useI18n();
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold">{dict.login.title}</h1>
      <p className="text-sm text-muted-foreground">{dict.login.subtitle}</p>
    </div>
  );
}
