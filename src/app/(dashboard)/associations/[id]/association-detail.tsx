"use client";

import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsTable } from "@/app/(dashboard)/statistics/statistics-table";
import type { Association, StatisticsEntryWithRelations } from "@/types/domain";

export function AssociationDetail({
  association,
  platforms,
  mediaBuyers,
  entries,
  isAdmin,
}: {
  association: Association;
  platforms: { id: string; name: string }[];
  mediaBuyers: { id: string; full_name: string }[];
  entries: StatisticsEntryWithRelations[];
  isAdmin: boolean;
}) {
  const { dict } = useI18n();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg text-foreground">{association.name}</CardTitle>
          <Badge variant={association.is_active ? "success" : "muted"}>
            {association.is_active ? dict.common.active : dict.common.inactive}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          {association.description ? <p className="text-muted-foreground">{association.description}</p> : null}
          <div>
            <span className="font-medium">{dict.associations.platformsLinked}: </span>
            {platforms.length === 0 ? "—" : platforms.map((p) => p.name).join("، ")}
          </div>
          {isAdmin ? (
            <div>
              <span className="font-medium">{dict.associations.mediaBuyersLinked}: </span>
              {mediaBuyers.length === 0 ? "—" : mediaBuyers.map((m) => m.full_name).join("، ")}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{dict.statistics.title}</h2>
        <StatisticsTable entries={entries} />
      </div>
    </div>
  );
}
