"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActiveUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { statisticsEntrySchema } from "@/lib/validations/statistics";

export type ActionState = { error?: string; fieldErrors?: Record<string, string> };

function parseForm(formData: FormData) {
  return statisticsEntrySchema.safeParse({
    associationId: formData.get("associationId"),
    platformId: formData.get("platformId"),
    periodStart: formData.get("periodStart"),
    periodEnd: formData.get("periodEnd"),
    currencyCode: formData.get("currencyCode"),
    budget: formData.get("budget"),
    amountSpent: formData.get("amountSpent"),
    donationCount: formData.get("donationCount"),
    donationValue: formData.get("donationValue"),
    orderCount: formData.get("orderCount"),
    advertisingReturn: formData.get("advertisingReturn"),
    associationReturn: formData.get("associationReturn"),
    notes: formData.get("notes"),
  });
}

function fieldErrorsFrom(error: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function mapDbError(message: string): string {
  if (message.includes("statistics_entries_unique_period")) {
    return "يوجد سجل بنفس الجمعية والمنصة والفترة لهذا المستخدم مسبقًا";
  }
  if (message.includes("PLATFORM_NOT_LINKED")) {
    return "المنصة المختارة غير مفعّلة لهذه الجمعية";
  }
  if (message.includes("MEDIA_BUYER_NOT_ASSIGNED")) {
    return "أنت غير مرتبط بهذه الجمعية";
  }
  return message;
}

export async function createStatisticsEntry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await requireActiveUser();
  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("statistics_entries").insert({
    association_id: parsed.data.associationId,
    platform_id: parsed.data.platformId,
    created_by: profile.id,
    period_start: parsed.data.periodStart,
    period_end: parsed.data.periodEnd,
    currency_code: parsed.data.currencyCode,
    budget: parsed.data.budget,
    amount_spent: parsed.data.amountSpent,
    donation_count: parsed.data.donationCount,
    donation_value: parsed.data.donationValue,
    order_count: parsed.data.orderCount,
    advertising_return: parsed.data.advertisingReturn,
    association_return: parsed.data.associationReturn,
    notes: parsed.data.notes || null,
  });

  if (error) return { error: mapDbError(error.message) };

  revalidatePath("/statistics");
  revalidatePath("/dashboard");
  redirect("/statistics");
}

export async function updateStatisticsEntry(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireActiveUser();
  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("statistics_entries")
    .update({
      association_id: parsed.data.associationId,
      platform_id: parsed.data.platformId,
      period_start: parsed.data.periodStart,
      period_end: parsed.data.periodEnd,
      currency_code: parsed.data.currencyCode,
      budget: parsed.data.budget,
      amount_spent: parsed.data.amountSpent,
      donation_count: parsed.data.donationCount,
      donation_value: parsed.data.donationValue,
      order_count: parsed.data.orderCount,
      advertising_return: parsed.data.advertisingReturn,
      association_return: parsed.data.associationReturn,
      notes: parsed.data.notes || null,
    })
    .eq("id", id);

  if (error) return { error: mapDbError(error.message) };

  revalidatePath("/statistics");
  revalidatePath("/dashboard");
  redirect("/statistics");
}

function revalidateEntryPaths() {
  revalidatePath("/statistics");
  revalidatePath("/dashboard");
  revalidatePath("/daily");
  revalidatePath("/entry");
  revalidatePath("/platforms");
  revalidatePath("/associations");
}

/**
 * Removes one filed line. If it was the last platform line for that day,
 * the day-level association return goes with it so the sheet does not keep
 * a figure that no longer belongs to any reading.
 */
export async function deleteStatisticsEntry(id: string): Promise<{ error?: string }> {
  const profile = await requireActiveUser();
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("statistics_entries")
    .select("id, association_id, created_by, period_start, period_end")
    .eq("id", id)
    .maybeSingle();

  if (!row) return { error: "السجل غير موجود" };
  if (profile.role !== "admin" && row.created_by !== profile.id) {
    return { error: "لا يمكنك حذف هذا السجل" };
  }

  const { error } = await supabase.from("statistics_entries").delete().eq("id", id);
  if (error) return { error: error.message };

  const { count } = await supabase
    .from("statistics_entries")
    .select("id", { count: "exact", head: true })
    .eq("association_id", row.association_id)
    .eq("created_by", row.created_by)
    .eq("period_start", row.period_start)
    .eq("period_end", row.period_end);

  if ((count ?? 0) === 0) {
    const { error: salesError } = await supabase
      .from("store_sales_entries")
      .delete()
      .eq("association_id", row.association_id)
      .eq("created_by", row.created_by)
      .eq("period_start", row.period_start)
      .eq("period_end", row.period_end);
    if (salesError) return { error: salesError.message };
  }

  revalidateEntryPaths();
  return {};
}
