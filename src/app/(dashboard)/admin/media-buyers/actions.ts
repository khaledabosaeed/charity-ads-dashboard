"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createMediaBuyerSchema, updateMediaBuyerSchema } from "@/lib/validations/media-buyer";
import type { ActionState } from "../associations/actions";

function fieldErrorsFrom(error: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function createMediaBuyer(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // Verify the caller is an active admin BEFORE ever touching the service-role client.
  const admin = await requireAdmin();

  const associationIds = formData.getAll("associationIds").map(String);
  const parsed = createMediaBuyerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    associationIds,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const adminClient = createAdminClient();
  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return { error: createError?.message ?? "تعذر إنشاء المستخدم" };
  }

  const { error: profileError } = await adminClient.from("profiles").insert({
    id: created.user.id,
    full_name: parsed.data.fullName,
    role: "media_buyer",
  });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return { error: profileError.message };
  }

  if (parsed.data.associationIds && parsed.data.associationIds.length > 0) {
    await adminClient.from("association_media_buyers").insert(
      parsed.data.associationIds.map((association_id) => ({
        association_id,
        media_buyer_id: created.user.id,
        assigned_by: admin.id,
      }))
    );
  }

  revalidatePath("/admin/media-buyers");
  redirect(`/admin/media-buyers/${created.user.id}/edit`);
}

export async function updateMediaBuyer(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const associationIds = formData.getAll("associationIds").map(String);
  const parsed = updateMediaBuyerSchema.safeParse({
    fullName: formData.get("fullName"),
    isActive: formData.get("isActive") === "on",
    associationIds,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, is_active: parsed.data.isActive ?? true })
    .eq("id", id);

  if (error) return { error: error.message };

  await supabase.from("association_media_buyers").delete().eq("media_buyer_id", id);
  if (parsed.data.associationIds && parsed.data.associationIds.length > 0) {
    await supabase.from("association_media_buyers").insert(
      parsed.data.associationIds.map((association_id) => ({
        association_id,
        media_buyer_id: id,
      }))
    );
  }

  revalidatePath("/admin/media-buyers");
  revalidatePath(`/admin/media-buyers/${id}/edit`);
  return {};
}

export async function toggleMediaBuyerActive(id: string, isActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("profiles").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/media-buyers");
}
