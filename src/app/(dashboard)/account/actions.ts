"use server";

import { revalidatePath } from "next/cache";
import { requireActiveUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { accountSchema } from "@/lib/validations/user";

export type AccountState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Set on a successful save so the form can announce it once. */
  at?: number;
  /** Supabase may hold a new address until its confirmation link is followed. */
  emailPending?: boolean;
};

function fieldErrorsFrom(error: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Your own address and password. The current password is re-checked first: a
 * session cookie on an unattended screen must not be enough to take the account
 * over. This runs on the caller's own session — never the service-role client —
 * so it is exactly as privileged as the person sitting there.
 */
export async function updateAccount(
  _prev: AccountState,
  formData: FormData
): Promise<AccountState> {
  await requireActiveUser();

  const parsed = accountSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { error: "تعذّر قراءة بيانات الحساب" };

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });
  if (reauthError) {
    return { fieldErrors: { currentPassword: "كلمة المرور الحالية غير صحيحة" } };
  }

  const emailChanged = Boolean(parsed.data.email && parsed.data.email !== user.email);
  if (!emailChanged && !parsed.data.password) {
    return { fieldErrors: { email: "لا يوجد تغيير لحفظه" } };
  }

  const { error } = await supabase.auth.updateUser({
    ...(emailChanged ? { email: parsed.data.email } : {}),
    ...(parsed.data.password ? { password: parsed.data.password } : {}),
  });

  if (error) return { error: error.message };

  revalidatePath("/account");
  return { at: Date.now(), emailPending: emailChanged };
}
