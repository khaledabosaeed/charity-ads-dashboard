"use client";

import { Filter, X } from "lucide-react";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/input";
import { DateField } from "@/components/ui/date-field";
import type { AssociationOption } from "@/lib/data/statistics-options";
import type { MediaBuyerOption, ReportFilters as Filters } from "@/lib/data/report-entries";

/**
 * The extent controls shared by the three report sheets. A plain GET form, so
 * the drawn extent is always in the URL and shareable, and the fields show the
 * extent the server actually used — including the defaults it filled in.
 */
export function ReportFilters({
  associations,
  mediaBuyers,
  filters,
  showAssociation = true,
  showPlatform = true,
}: {
  associations: AssociationOption[];
  mediaBuyers?: MediaBuyerOption[];
  filters: Filters;
  showAssociation?: boolean;
  showPlatform?: boolean;
}) {
  const { dict } = useI18n();

  const platforms = Array.from(
    new Map(associations.flatMap((a) => a.platforms).map((p) => [p.id, p])).values()
  );

  const active = Boolean(
    filters.associationId || filters.platformId || filters.mediaBuyerId || filters.from || filters.to
  );

  return (
    <form method="get" className="border border-line bg-paper-raised" aria-label={dict.dashboard.filters}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2 sm:px-5">
        <Filter className="h-3.5 w-3.5 text-ink-3" strokeWidth={1.75} aria-hidden="true" />
        <span className="annot">{dict.dashboard.filters}</span>
      </div>

      <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] lg:items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.8125rem] font-medium text-ink-2" htmlFor="from">
            {dict.common.from}
          </label>
          <DateField id="from" name="from" defaultValue={filters.from ?? ""} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.8125rem] font-medium text-ink-2" htmlFor="to">
            {dict.common.to}
          </label>
          <DateField id="to" name="to" defaultValue={filters.to ?? ""} />
        </div>

        {mediaBuyers && mediaBuyers.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8125rem] font-medium text-ink-2" htmlFor="mediaBuyerId">
              {dict.daily.mediaBuyer}
            </label>
            <NativeSelect id="mediaBuyerId" name="mediaBuyerId" defaultValue={filters.mediaBuyerId ?? ""}>
              <option value="">{dict.common.all}</option>
              {mediaBuyers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </NativeSelect>
          </div>
        ) : null}

        {showAssociation ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8125rem] font-medium text-ink-2" htmlFor="associationId">
              {dict.statistics.association}
            </label>
            <NativeSelect id="associationId" name="associationId" defaultValue={filters.associationId ?? ""}>
              <option value="">{dict.common.all}</option>
              {associations.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </NativeSelect>
          </div>
        ) : null}

        {showPlatform ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8125rem] font-medium text-ink-2" htmlFor="platformId">
              {dict.statistics.platform}
            </label>
            <NativeSelect id="platformId" name="platformId" defaultValue={filters.platformId ?? ""}>
              <option value="">{dict.common.all}</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>
          </div>
        ) : null}

        <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
          <Button type="submit" size="default">
            {dict.common.apply}
          </Button>
          {active ? (
            <Button type="button" variant="ghost" size="default" asChild>
              <a href="?">
                <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                {dict.common.clear}
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
