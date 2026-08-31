import { requireActiveUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getAvailableAssociationsWithPlatforms } from "@/lib/data/statistics-options";
import { getMediaBuyerOptions, today, type MediaBuyerOption } from "@/lib/data/report-entries";
import { getDefaultCurrency } from "@/lib/env";
import { DailyEntrySheet, type DayLine } from "./daily-entry-sheet";

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The day sheet: one screen for a whole day's figures across every platform an
 * association runs on, rather than one form per platform. Whatever is already
 * on the record for that day is loaded back into the blanks, so saving twice
 * corrects the day instead of duplicating it.
 */
export default async function DailyEntryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const profile = await requireActiveUser();
  const isAdmin = profile.role === "admin";

  const [associations, buyers] = await Promise.all([
    getAvailableAssociationsWithPlatforms(),
    isAdmin ? getMediaBuyerOptions() : Promise.resolve<MediaBuyerOption[]>([]),
  ]);

  /* Only an admin files someone else's day; a media buyer's own name is the
     only option the band ever offers them. */
  const mediaBuyers: MediaBuyerOption[] = isAdmin
    ? [{ id: profile.id, name: profile.full_name }, ...buyers.filter((b) => b.id !== profile.id)]
    : [];

  const date = params.date && ISO.test(params.date) ? params.date : today();
  const associationId = associations.some((a) => a.id === params.associationId)
    ? (params.associationId as string)
    : (associations[0]?.id ?? "");
  const mediaBuyerId =
    isAdmin && mediaBuyers.some((b) => b.id === params.mediaBuyerId)
      ? (params.mediaBuyerId as string)
      : profile.id;

  let lines: DayLine[] = [];
  if (associationId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("statistics_entries")
      .select("platform_id, amount_spent, advertising_return")
      .eq("association_id", associationId)
      .eq("created_by", mediaBuyerId)
      .eq("period_start", date)
      .eq("period_end", date);

    lines = (data ?? []).map((e) => ({
      platformId: e.platform_id,
      amountSpent: e.amount_spent,
      advertisingReturn: e.advertising_return,
    }));
  }

  return (
    <DailyEntrySheet
      key={`${date}:${associationId}:${mediaBuyerId}`}
      associations={associations}
      mediaBuyers={mediaBuyers}
      date={date}
      associationId={associationId}
      mediaBuyerId={mediaBuyerId}
      buyerName={mediaBuyers.find((b) => b.id === mediaBuyerId)?.name ?? profile.full_name}
      lines={lines}
      currency={getDefaultCurrency()}
    />
  );
}
