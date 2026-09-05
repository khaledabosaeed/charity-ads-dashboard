import { createClient } from "@/lib/supabase/server";
import { getAvailableAssociationsWithPlatforms } from "@/lib/data/statistics-options";
import { PageHeading } from "@/components/layout/page-heading";
import { NewLinkButton } from "@/components/layout/new-link-button";
import { StatisticsFilters } from "./statistics-filters";
import { StatisticsTable } from "./statistics-table";
import { withDisplayPlatformName } from "@/lib/format";
import type { StatisticsEntryWithRelations } from "@/types/domain";

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("statistics_entries")
    .select("*, association:associations(id, name), platform:platforms(id, name), author:profiles(id, full_name)")
    .order("period_start", { ascending: false });

  if (params.associationId) query = query.eq("association_id", params.associationId);
  if (params.platformId) query = query.eq("platform_id", params.platformId);
  if (params.from) query = query.gte("period_start", params.from);
  if (params.to) query = query.lte("period_end", params.to);

  const [{ data: entries }, associations] = await Promise.all([
    query,
    getAvailableAssociationsWithPlatforms(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        titleKey="statistics.title"
        action={<NewLinkButton href="/statistics/new" labelKey="statistics.new" />}
      />
      <StatisticsFilters associations={associations} searchParams={params} />
      <StatisticsTable
        entries={((entries as unknown as StatisticsEntryWithRelations[]) ?? []).map(
          withDisplayPlatformName
        )}
      />
    </div>
  );
}
