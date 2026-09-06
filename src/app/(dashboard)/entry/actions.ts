"use server";

import { revalidatePath } from "next/cache";
import { requireRoles } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { dailySheetSchema } from "@/lib/validations/daily-sheet";

export type DailySheetState = {
  error?: string;
  /** How many platform lines were written, and when — the toast reads both. */
  saved?: number;
  at?: number;
};

/** The sheet posts one pair of fields per platform: `spend:<id>` / `revenue:<id>`. */
function readRows(formData: FormData) {
  const rows: {
    platformId: string;
    amountSpent: unknown;
    advertisingReturn: unknown;
    orderCount: unknown;
  }[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("spend:")) continue;
    const platformId = key.slice("spend:".length);
    rows.push({
      platformId,
      amountSpent: value === "" ? 0 : value,
      advertisingReturn: (formData.get(`revenue:${platformId}`) || 0) as unknown,
      orderCount: (formData.get(`orders:${platformId}`) || 0) as unknown,
    });
  }
  return rows;
}

function mapDbError(message: string): string {
  if (message.includes("PLATFORM_NOT_LINKED")) return "إحدى المنصات غير مفعّلة لهذه الجمعية";
  if (message.includes("MEDIA_BUYER_NOT_ASSIGNED")) return "أنت غير مرتبط بهذه الجمعية";
  return message;
}

/**
 * Writes a whole day in one stroke: one row per platform, the day itself being
 * a single-date period. Re-saving the same day updates it rather than piling up
 * duplicates — the unique period constraint is the conflict target — and the
 * columns the day sheet does not carry (budget, donations) are left untouched
 * on rows that already exist.
 */
export async function saveDailySheet(
  _prev: DailySheetState,
  formData: FormData
): Promise<DailySheetState> {
  const profile = await requireRoles("admin", "media_buyer");

  const parsed = dailySheetSchema.safeParse({
    mediaBuyerId: formData.get("mediaBuyerId") || undefined,
    date: formData.get("date"),
    associationId: formData.get("associationId"),
    currencyCode: formData.get("currencyCode"),
    rows: readRows(formData),
    associationReturn: formData.get("associationReturn") || 0,
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "تعذّر حفظ اليوم" };

  const { date, associationId, currencyCode, rows, associationReturn } = parsed.data;

  /* An admin may file a day on a media buyer's behalf — the band lets them pick
     one. Anyone else files their own day, whatever the form claims. */
  const filedBy =
    profile.role === "admin" && parsed.data.mediaBuyerId ? parsed.data.mediaBuyerId : profile.id;

  const supabase = await createClient();

  /* A line already on the record is always rewritten — including back down to
     zero. A line that is zero and was never recorded is simply not a reading. */
  const { data: existing } = await supabase
    .from("statistics_entries")
    .select("platform_id")
    .eq("association_id", associationId)
    .eq("created_by", filedBy)
    .eq("period_start", date)
    .eq("period_end", date);

  const recorded = new Set((existing ?? []).map((e) => e.platform_id));
  const writable = rows.filter(
    (r) =>
      r.amountSpent > 0 || r.advertisingReturn > 0 || r.orderCount > 0 || recorded.has(r.platformId)
  );

  const { data: existingReturn } = await supabase
    .from("store_sales_entries")
    .select("id")
    .eq("association_id", associationId)
    .eq("created_by", filedBy)
    .eq("period_start", date)
    .eq("period_end", date)
    .maybeSingle();

  const writeAssociationReturn = associationReturn > 0 || Boolean(existingReturn);

  if (writable.length === 0 && !writeAssociationReturn) {
    return { error: "لا توجد أرقام لحفظها في هذا اليوم" };
  }

  if (writable.length > 0) {
    const { error } = await supabase.from("statistics_entries").upsert(
      writable.map((r) => ({
        association_id: associationId,
        platform_id: r.platformId,
        created_by: filedBy,
        period_start: date,
        period_end: date,
        currency_code: currencyCode,
        amount_spent: r.amountSpent,
        advertising_return: r.advertisingReturn,
        order_count: r.orderCount,
      })),
      { onConflict: "association_id,platform_id,created_by,period_start,period_end" }
    );

    if (error) return { error: mapDbError(error.message) };
  }

  if (writeAssociationReturn) {
    /* Only association_return is written here — the store-sales columns this
       table also carries (order_count, sales_value, visit_count) are left
       untouched on rows that already exist, and default to 0 on a new one. */
    const { error } = await supabase.from("store_sales_entries").upsert(
      {
        association_id: associationId,
        created_by: filedBy,
        period_start: date,
        period_end: date,
        currency_code: currencyCode,
        association_return: associationReturn,
      },
      { onConflict: "association_id,created_by,period_start,period_end" }
    );

    if (error) return { error: mapDbError(error.message) };
  }

  revalidatePath("/entry");
  revalidatePath("/daily");
  revalidatePath("/platforms");
  revalidatePath("/associations");
  revalidatePath("/dashboard");
  revalidatePath("/statistics");

  return { saved: writable.length + (writeAssociationReturn ? 1 : 0), at: Date.now() };
}
