import { createClient } from "@/lib/supabase/server";
import { getAvailableAssociationsWithPlatforms } from "@/lib/data/statistics-options";
import { getAssociationReturnTotal, resolveAssociationReturn } from "@/lib/data/report-entries";
import { previousPeriod } from "@/lib/dates/presets";
import { rollupBy, unifiedCurrency } from "@/lib/calculations/rollup";
import { withDisplayPlatformName } from "@/lib/format";
import { PageHeading } from "@/components/layout/page-heading";
import { RuledHeading } from "@/components/drawing";
import { StatisticsFilters } from "@/app/(dashboard)/statistics/statistics-filters";
import { StatisticsTable } from "@/app/(dashboard)/statistics/statistics-table";
import { DashboardFigures } from "./dashboard-figures";
import { DashboardChart } from "./dashboard-chart";
import { DashboardExtras } from "./dashboard-extras";
import { EmptyState } from "@/components/layout/empty-state";
import { NewLinkButton } from "@/components/layout/new-link-button";
import { ExtentLabel, LatestEntriesLabel } from "./section-label";
import type { StatisticsEntryWithRelations } from "@/types/domain";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  async function fetchEntries(from?: string, to?: string) {
    let query = supabase
      .from("statistics_entries")
      .select(
        "*, association:associations(id, name), platform:platforms(id, name), author:profiles(id, full_name)"
      )
      .order("period_start", { ascending: true });

    if (params.associationId) query = query.eq("association_id", params.associationId);
    if (params.platformId) query = query.eq("platform_id", params.platformId);
    if (from) query = query.gte("period_start", from);
    if (to) query = query.lte("period_end", to);

    const { data } = await query;
    return ((data as unknown as StatisticsEntryWithRelations[]) ?? []).map(withDisplayPlatformName);
  }

  /* The comparison badges need the equivalent stretch of time right before the
     current extent. Without both bounds there is no fixed-length window to
     mirror, so the previous period is simply left empty. */
  const previous = params.from && params.to ? previousPeriod(params.from, params.to) : undefined;

  const [entries, previousEntries, associations, salesReturn, previousSalesReturn] = await Promise.all([
    fetchEntries(params.from, params.to),
    previous ? fetchEntries(previous.from, previous.to) : Promise.resolve([]),
    getAvailableAssociationsWithPlatforms(),
    getAssociationReturnTotal({
      associationId: params.associationId,
      from: params.from,
      to: params.to,
    }),
    previous
      ? getAssociationReturnTotal({
          associationId: params.associationId,
          from: previous.from,
          to: previous.to,
        })
      : Promise.resolve(0),
  ]);

  const associationReturn = resolveAssociationReturn(salesReturn, entries);
  const previousAssociationReturn = resolveAssociationReturn(previousSalesReturn, previousEntries);

  const latest = [...entries].reverse().slice(0, 10);

  const seed = Array.from(
    new Map(
      associations
        .filter((a) => !params.associationId || a.id === params.associationId)
        .flatMap((a) => a.platforms)
        .filter((p) => !params.platformId || p.id === params.platformId)
        .map((p) => [p.id, { id: p.id, label: p.name }])
    ).values()
  );
  const platformReadings = rollupBy(
    entries,
    (e) => (e.platform ? { id: e.platform.id, label: e.platform.name } : null),
    seed
  ).map(({ id, label, totals }) => ({ id, label, totals }));
  const unit = unifiedCurrency(entries);

  /* The revision line of a drawing records when it was last drawn. */
  const drawnOn = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeading
        titleKey="dashboard.title"
        extent={<ExtentLabel from={params.from} to={params.to} />}
        revision={drawnOn}
        action={<NewLinkButton href="/statistics/new" labelKey="statistics.new" />}
      />
      <StatisticsFilters associations={associations} searchParams={params} />

      {entries.length === 0 && associationReturn === 0 ? (
        <EmptyState action={<NewLinkButton href="/statistics/new" labelKey="statistics.new" />} />
      ) : (
        <>
          <DashboardFigures
            entries={entries}
            previousEntries={previousEntries}
            associationReturn={associationReturn}
            previousAssociationReturn={previousAssociationReturn}
          />

          {entries.length > 0 ? (
            <>
              <DashboardExtras platformReadings={platformReadings} unit={unit} />

              <DashboardChart entries={entries} />

              <div className="flex flex-col gap-3">
                <RuledHeading>
                  <LatestEntriesLabel />
                </RuledHeading>
                <StatisticsTable entries={latest} />
              </div>
            </>
          ) : null}
        </>
      )}
    </>
  );
}
