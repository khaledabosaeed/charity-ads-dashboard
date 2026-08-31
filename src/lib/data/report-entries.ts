import { createClient } from "@/lib/supabase/server";
import type { StatisticsEntryWithRelations } from "@/types/domain";

/** The extent every report sheet is drawn from. */
export type ReportFilters = {
  associationId?: string;
  platformId?: string;
  mediaBuyerId?: string;
  from?: string;
  to?: string;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Today in the sheet's own format — the daily report's default extent. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readReportFilters(
  params: Record<string, string | undefined>,
  { defaultToToday = false }: { defaultToToday?: boolean } = {}
): ReportFilters {
  const date = (value: string | undefined) => (value && ISO.test(value) ? value : undefined);
  const fallback = defaultToToday ? today() : undefined;

  return {
    associationId: params.associationId || undefined,
    platformId: params.platformId || undefined,
    mediaBuyerId: params.mediaBuyerId || undefined,
    from: date(params.from) ?? fallback,
    to: date(params.to) ?? fallback,
  };
}

/**
 * Entries inside the extent, oldest first. RLS decides the ceiling: an admin
 * reads every entry, a media buyer only their own.
 */
export async function getReportEntries(
  filters: ReportFilters
): Promise<StatisticsEntryWithRelations[]> {
  const supabase = await createClient();

  let query = supabase
    .from("statistics_entries")
    .select(
      "*, association:associations(id, name), platform:platforms(id, name), author:profiles(id, full_name)"
    )
    .order("period_start", { ascending: true });

  if (filters.associationId) query = query.eq("association_id", filters.associationId);
  if (filters.platformId) query = query.eq("platform_id", filters.platformId);
  if (filters.mediaBuyerId) query = query.eq("created_by", filters.mediaBuyerId);
  if (filters.from) query = query.gte("period_start", filters.from);
  if (filters.to) query = query.lte("period_end", filters.to);

  const { data } = await query;
  return (data as unknown as StatisticsEntryWithRelations[]) ?? [];
}

export type MediaBuyerOption = { id: string; name: string };

/**
 * The people a report may be narrowed to — anyone who can author an entry, so
 * admins filing a day on their own account are included. Only an admin sees
 * more than themselves here: the profiles policy returns nothing else to anyone.
 */
export async function getMediaBuyerOptions(): Promise<MediaBuyerOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("is_active", true)
    .order("full_name");

  return (data ?? []).map((p) => ({ id: p.id, name: p.full_name }));
}
