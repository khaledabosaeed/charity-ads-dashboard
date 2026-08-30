"use client";

import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { RuledHeading, TitleBlock } from "@/components/drawing";
import { StatisticsTable } from "@/app/(dashboard)/statistics/statistics-table";
import type { Association, StatisticsEntryWithRelations } from "@/types/domain";

function LinkedList({ label, names }: { label: string; names: string[] }) {
  return (
    <div className="flex flex-col gap-2 px-4 py-4 sm:px-5">
      <p className="annot">{label}</p>
      {names.length === 0 ? (
        <p className="text-sm text-ink-3">—</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {names.map((n) => (
            <li key={n}>
              <Badge variant="muted">{n}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
    <>
      <TitleBlock
        title={association.name}
        extent={association.code ? `${dict.associations.code} ${association.code}` : undefined}
        action={
          <Badge variant={association.is_active ? "success" : "muted"}>
            {association.is_active ? dict.common.active : dict.common.inactive}
          </Badge>
        }
      />

      {association.description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-ink-2">{association.description}</p>
      ) : null}

      <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
        <div className="bg-paper-raised">
          <LinkedList
            label={dict.associations.platformsLinked}
            names={platforms.map((p) => p.name)}
          />
        </div>
        {isAdmin ? (
          <div className="bg-paper-raised">
            <LinkedList
              label={dict.associations.mediaBuyersLinked}
              names={mediaBuyers.map((m) => m.full_name)}
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <RuledHeading>{dict.statistics.title}</RuledHeading>
        <StatisticsTable entries={entries} />
      </div>
    </>
  );
}
