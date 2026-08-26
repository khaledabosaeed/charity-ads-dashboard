"use client";

import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { AssociationOption } from "@/lib/data/statistics-options";

export function StatisticsFilters({
  associations,
  searchParams,
}: {
  associations: AssociationOption[];
  searchParams: Record<string, string | undefined>;
}) {
  const { dict } = useI18n();

  const platforms = Array.from(
    new Map(associations.flatMap((a) => a.platforms).map((p) => [p.id, p])).values()
  );

  return (
    <Card>
      <CardContent className="pt-4">
        <form className="flex flex-wrap items-end gap-3" method="get">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="associationId">
              {dict.statistics.association}
            </label>
            <select
              id="associationId"
              name="associationId"
              defaultValue={searchParams.associationId ?? ""}
              className="h-10 rounded-md border border-border bg-card px-3 text-sm"
            >
              <option value="">{dict.common.all}</option>
              {associations.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="platformId">
              {dict.statistics.platform}
            </label>
            <select
              id="platformId"
              name="platformId"
              defaultValue={searchParams.platformId ?? ""}
              className="h-10 rounded-md border border-border bg-card px-3 text-sm"
            >
              <option value="">{dict.common.all}</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="from">
              {dict.common.from}
            </label>
            <Input id="from" name="from" type="date" defaultValue={searchParams.from ?? ""} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="to">
              {dict.common.to}
            </label>
            <Input id="to" name="to" type="date" defaultValue={searchParams.to ?? ""} />
          </div>

          <Button type="submit" size="sm">
            {dict.dashboard.filters}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
