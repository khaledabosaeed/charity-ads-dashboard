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
import { EmptyState } from "@/components/layout/empty-state";
import { PlatformSummary } from "./platform-summary";

/**
 * Every platform the user runs on, side by side. A platform with nothing drawn
 * against it still appears — zero is a reading, and a silent platform is one of
 * the things this sheet exists to show.
 */
export default async function PlatformSummaryPage({
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

  const seed = Array.from(
    new Map(
      associations
        .filter((a) => !filters.associationId || a.id === filters.associationId)
        .flatMap((a) => a.platforms)
        .map((p) => [p.id, { id: p.id, label: p.name }])
    ).values()
  );

  const readings = rollupBy(
    entries,
    (e) => (e.platform ? { id: e.platform.id, label: e.platform.name } : null),
    seed
  ).map(({ id, label, totals }) => ({ id, label, totals }));

  return (
    <>
      <PageHeading
        titleKey="daily.platformsTitle"
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
        showPlatform={false}
      />
      {readings.length === 0 ? (
        <EmptyState />
      ) : (
        <PlatformSummary readings={readings} unit={unifiedCurrency(entries)} />
      )}
    </>
  );
}
