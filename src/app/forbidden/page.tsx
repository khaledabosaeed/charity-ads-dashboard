"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  const { dict } = useI18n();
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
      <ShieldAlert className="h-12 w-12 text-destructive" />
      <div>
        <h1 className="text-xl font-semibold">{dict.forbidden.title}</h1>
        <p className="text-sm text-muted-foreground">{dict.forbidden.subtitle}</p>
      </div>
      <Button asChild>
        <Link href="/dashboard">{dict.forbidden.backHome}</Link>
      </Button>
    </div>
  );
}
