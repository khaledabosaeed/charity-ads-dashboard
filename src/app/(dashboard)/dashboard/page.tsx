import { createClient } from "@/lib/supabase/server";
import { getAvailableAssociationsWithPlatforms } from "@/lib/data/statistics-options";
import { PageHeading } from "@/components/layout/page-heading";
import { StatisticsFilters } from "@/app/(dashboard)/statistics/statistics-filters";
import { StatisticsTable } from "@/app/(dashboard)/statistics/statistics-table";
import { DashboardCards } from "./dashboard-cards";
import { DashboardChart } from "./dashboard-chart";
import { EmptyState } from "@/components/layout/empty-state";
import { LatestEntriesHeading } from "./latest-entries-heading";
import type { StatisticsEntryWithRelations } from "@/types/domain";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("statistics_entries")
    .select("*, association:associations(id, name), platform:platforms(id, name), author:profiles(id, full_name)")
    .order("period_start", { ascending: true });

  if (params.associationId) query = query.eq("association_id", params.associationId);
  if (params.platformId) query = query.eq("platform_id", params.platformId);
  if (params.from) query = query.gte("period_start", params.from);
  if (params.to) query = query.lte("period_end", params.to);

  const [{ data: entriesAsc }, associations] = await Promise.all([
    query,
    getAvailableAssociationsWithPlatforms(),
  ]);

  const entries = (entriesAsc as unknown as StatisticsEntryWithRelations[]) ?? [];
  const latest = [...entries].reverse().slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="dashboard.title" />
      <StatisticsFilters associations={associations} searchParams={params} />

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DashboardCards entries={entries} />
          <DashboardChart entries={entries} />
          <div className="flex flex-col gap-3">
            <LatestEntriesHeading />
            <StatisticsTable entries={latest} />
          </div>
        </>
      )}
    </div>
  );
}
