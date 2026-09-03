"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createUserSchema, updateUserSchema } from "@/lib/validations/user";
import type { ActionState } from "../associations/actions";

function fieldErrorsFrom(error: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Guards the one irreversible mistake this screen can make: the account list
 * losing its last way in. An admin may not demote or disable themselves, and
 * the final active admin may not be demoted or disabled by anyone.
 */
async function wouldStrandTheAccount(id: string, stillAdmin: boolean, stillActive: boolean) {
  if (stillAdmin && stillActive) return false;

  const supabase = await createClient();
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin")
    .eq("is_active", true)
    .neq("id", id);

  return (count ?? 0) === 0;
}

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // Verify the caller is an active admin BEFORE ever touching the service-role client.
  const admin = await requireAdmin();

  const parsed = createUserSchema.safeParse({
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    email: formData.get("email"),
    password: formData.get("password"),
    associationIds: formData.getAll("associationIds").map(String),
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
    role: parsed.data.role,
  });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return { error: profileError.message };
  }

  /* Only a media buyer is assigned associations; an admin reads them all. */
  const links = parsed.data.role === "media_buyer" ? (parsed.data.associationIds ?? []) : [];
  if (links.length > 0) {
    await adminClient.from("association_media_buyers").insert(
      links.map((association_id) => ({
        association_id,
        media_buyer_id: created.user.id,
        assigned_by: admin.id,
      }))
    );
  }

  revalidatePath("/admin/users");
  redirect(`/admin/users/${created.user.id}/edit`);
}

export async function updateUser(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  const parsed = updateUserSchema.safeParse({
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    isActive: formData.get("isActive") === "on",
    email: formData.get("email"),
    password: formData.get("password"),
    associationIds: formData.getAll("associationIds").map(String),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const { fullName, role, email, password } = parsed.data;
  const isActive = parsed.data.isActive ?? true;
  const editingSelf = admin.id === id;

  if (editingSelf && role !== "admin") {
    return { error: "لا يمكنك تغيير صلاحية حسابك بنفسك" };
  }
  if (editingSelf && !isActive) {
    return { error: "لا يمكنك تعطيل حسابك" };
  }
  if (await wouldStrandTheAccount(id, role === "admin", isActive)) {
    return { error: "لا يمكن تعطيل آخر مشرف فعّال أو تغيير صلاحيته" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, role, is_active: isActive })
    .eq("id", id);

  if (error) return { error: error.message };

  /* Credentials live in auth, not in the profile, so they are changed with the
     service-role client — and only after the admin check above. */
  if (email || password) {
    const adminClient = createAdminClient();
    const { data: existing } = await adminClient.auth.admin.getUserById(id);
    const emailChanged = Boolean(email && email !== existing.user?.email);

    if (emailChanged || password) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(id, {
        ...(emailChanged ? { email, email_confirm: true } : {}),
        ...(password ? { password } : {}),
      });
      if (authError) return { error: authError.message };
    }
  }

  await supabase.from("association_media_buyers").delete().eq("media_buyer_id", id);
  const links = role === "media_buyer" ? (parsed.data.associationIds ?? []) : [];
  if (links.length > 0) {
    await supabase.from("association_media_buyers").insert(
      links.map((association_id) => ({ association_id, media_buyer_id: id }))
    );
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}/edit`);
  return {};
}

/**
 * Permanently removes the user. Goes through the auth admin API (not a raw
 * `profiles` delete) so the `auth.users` row goes with it — `profiles.id`
 * cascades from that, and from there the FK cascade set up in migration
 * 20260101000011 removes everything the profile authored.
 */
export async function deleteUser(id: string): Promise<ActionState> {
  const admin = await requireAdmin();

  if (admin.id === id) return { error: "لا يمكنك حذف حسابك" };
  if (await wouldStrandTheAccount(id, false, false)) {
    return { error: "لا يمكن حذف آخر مشرف فعّال" };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(id);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  revalidatePath("/statistics");
  revalidatePath("/dashboard");
  return {};
}

export async function toggleUserActive(id: string, isActive: boolean): Promise<ActionState> {
  const admin = await requireAdmin();

  if (admin.id === id && !isActive) return { error: "لا يمكنك تعطيل حسابك" };

  const supabase = await createClient();
  const { data: target } = await supabase.from("profiles").select("role").eq("id", id).single();

  if (await wouldStrandTheAccount(id, target?.role === "admin", isActive)) {
    return { error: "لا يمكن تعطيل آخر مشرف فعّال" };
  }

  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return {};
}
