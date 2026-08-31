import { requireActiveUser } from "@/lib/auth/session";
import { getAvailableAssociationsWithPlatforms } from "@/lib/data/statistics-options";
import {
  getMediaBuyerOptions,
  getReportEntries,
  readReportFilters,
} from "@/lib/data/report-entries";
import { formatPeriod } from "@/lib/format";
import { PageHeading } from "@/components/layout/page-heading";
import { ReportFilters } from "@/components/reports/report-filters";
import { NewLinkButton } from "@/components/layout/new-link-button";
import { DailyReport } from "./daily-report";

/** The day's report. Opens on today; every other extent is asked for. */
export default async function DailyReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const profile = await requireActiveUser();
  const filters = readReportFilters(params, { defaultToToday: true });

  const [entries, associations, mediaBuyers] = await Promise.all([
    getReportEntries(filters),
    getAvailableAssociationsWithPlatforms(),
    profile.role === "admin" ? getMediaBuyerOptions() : Promise.resolve([]),
  ]);

  return (
    <>
      <PageHeading
        titleKey="daily.reportTitle"
        extent={formatPeriod(filters.from ?? "…", filters.to ?? "…")}
        action={<NewLinkButton href="/entry" labelKey="daily.entryTitle" />}
      />
      <ReportFilters associations={associations} mediaBuyers={mediaBuyers} filters={filters} />
      <DailyReport entries={entries} />
    </>
  );
}
