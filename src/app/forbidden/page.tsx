"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Stamp } from "@/components/brand/lockup";
import { TitleBlock } from "@/components/drawing";

export default function ForbiddenPage() {
  const { dict } = useI18n();

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-4 flex items-center gap-2.5">
          <Stamp size={30} />
          <span className="annot">{dict.appName}</span>
        </div>

        <TitleBlock
          title={dict.forbidden.title}
          extent={dict.forbidden.sheetNote}
          revision="403"
        />

        <div className="border border-t-0 border-line bg-paper-raised px-4 py-6 sm:px-5">
          {/* the correction rule: the drawing's red, struck across the sheet */}
          <div className="mb-5 h-0.5 w-full bg-alarm" aria-hidden="true" />
          <p className="max-w-prose text-sm leading-relaxed text-ink-2">
            {dict.forbidden.subtitle}
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard">{dict.forbidden.backHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
