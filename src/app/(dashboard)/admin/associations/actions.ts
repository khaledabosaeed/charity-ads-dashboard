"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { associationSchema } from "@/lib/validations/association";

export type ActionState = { error?: string; fieldErrors?: Record<string, string> };

function parseAssociationForm(formData: FormData) {
  return associationSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description"),
  });
}

export async function createAssociation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = parseAssociationForm(formData);
  if (!parsed.success) {
    return { fieldErrors: flatten(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("associations")
    .insert({
      name: parsed.data.name,
      code: parsed.data.code || null,
      description: parsed.data.description || null,
      created_by: admin.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "تعذر إنشاء الجمعية" };
  }

  revalidatePath("/admin/associations");
  redirect(`/admin/associations/${data.id}/edit`);
}

export async function updateAssociation(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseAssociationForm(formData);
  if (!parsed.success) {
    return { fieldErrors: flatten(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("associations")
    .update({
      name: parsed.data.name,
      code: parsed.data.code || null,
      description: parsed.data.description || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/associations");
  revalidatePath(`/admin/associations/${id}/edit`);
  return {};
}

export async function toggleAssociationActive(id: string, isActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("associations").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/associations");
}

export async function setAssociationPlatforms(associationId: string, platformIds: string[]) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("association_platforms").delete().eq("association_id", associationId);
  if (platformIds.length > 0) {
    await supabase
      .from("association_platforms")
      .insert(platformIds.map((platform_id) => ({ association_id: associationId, platform_id })));
  }
  revalidatePath(`/admin/associations/${associationId}/edit`);
}

export async function setAssociationMediaBuyers(associationId: string, mediaBuyerIds: string[]) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  await supabase.from("association_media_buyers").delete().eq("association_id", associationId);
  if (mediaBuyerIds.length > 0) {
    await supabase.from("association_media_buyers").insert(
      mediaBuyerIds.map((media_buyer_id) => ({
        association_id: associationId,
        media_buyer_id,
        assigned_by: admin.id,
      }))
    );
  }
  revalidatePath(`/admin/associations/${associationId}/edit`);
  revalidatePath("/admin/users");
}

function flatten(error: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
