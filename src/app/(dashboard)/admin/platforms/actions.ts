"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { platformSchema } from "@/lib/validations/association";
import type { ActionState } from "../associations/actions";

export async function createPlatform(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = platformSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("platforms").insert(parsed.data);
  if (error) return { error: error.message };

  revalidatePath("/admin/platforms");
  return {};
}

export async function togglePlatformActive(id: string, isActive: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("platforms").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/platforms");
}
