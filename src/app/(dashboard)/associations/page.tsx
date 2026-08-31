import { requireActiveUser } from "@/lib/auth/session";
import { getAvailableAssociationsWithPlatforms } from "@/lib/data/statistics-options";
import {
  getMediaBuyerOptions,
  getReportEntries,
  readReportFilters,
} from "@/lib/data/report-entries";
import { rollupBy, unifiedCurrency } from "@/lib/calculations/rollup";
import { formatPeriod } from "@/lib/format";
import { PageHeading } from "@/components/layout/page-heading";
import { ReportFilters } from "@/components/reports/report-filters";
import { AssociationRanking } from "./association-ranking";

/** Association performance, ranked — the sheet a media buyer reads to prioritise. */
export default async function AssociationPerformancePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const profile = await requireActiveUser();
  const filters = readReportFilters(params);

  const [entries, associations, mediaBuyers] = await Promise.all([
    getReportEntries(filters),
    getAvailableAssociationsWithPlatforms(),
    profile.role === "admin" ? getMediaBuyerOptions() : Promise.resolve([]),
  ]);

  const readings = rollupBy(
    entries,
    (e) => (e.association ? { id: e.association.id, label: e.association.name } : null),
    associations.map((a) => ({ id: a.id, label: a.name }))
  ).map(({ id, label, totals }) => ({ id, label, totals }));

  return (
    <>
      <PageHeading
        titleKey="daily.clientsTitle"
        extent={
          filters.from || filters.to
            ? formatPeriod(filters.from ?? "…", filters.to ?? "…")
            : undefined
        }
      />
      <ReportFilters
        associations={associations}
        mediaBuyers={mediaBuyers}
        filters={filters}
        showAssociation={false}
      />
      <AssociationRanking readings={readings} unit={unifiedCurrency(entries)} />
    </>
  );
}
