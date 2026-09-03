import { createClient } from "@/lib/supabase/server";
import type { StoreSalesEntry } from "@/types/domain";
import type { ReportFilters } from "@/lib/data/report-entries";

/**
 * Actual online-store entries inside the extent. RLS decides the ceiling: an
 * admin reads every entry, a media buyer only their own. `platformId` is
 * ignored — store sales carry no platform dimension.
 */
export async function getStoreSalesEntries(filters: ReportFilters): Promise<StoreSalesEntry[]> {
  const supabase = await createClient();

  let query = supabase
    .from("store_sales_entries")
    .select("*")
    .order("period_start", { ascending: true });

  if (filters.associationId) query = query.eq("association_id", filters.associationId);
  if (filters.mediaBuyerId) query = query.eq("created_by", filters.mediaBuyerId);
  if (filters.from) query = query.gte("period_start", filters.from);
  if (filters.to) query = query.lte("period_end", filters.to);

  const { data } = await query;
  return data ?? [];
}

export type StoreSalesTotals = { orderCount: number; salesValue: number; visitCount: number };

export function sumStoreSales(entries: StoreSalesEntry[]): StoreSalesTotals {
  return entries.reduce(
    (acc, e) => ({
      orderCount: acc.orderCount + e.order_count,
      salesValue: acc.salesValue + e.sales_value,
      visitCount: acc.visitCount + e.visit_count,
    }),
    { orderCount: 0, salesValue: 0, visitCount: 0 }
  );
}
