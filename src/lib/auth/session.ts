import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/domain";

/**
 * Loads the current auth user + their profile row. Returns null if there is
 * no session, no profile row, or the profile is deactivated (is_active =
 * false) — a disabled user is treated as unauthenticated everywhere.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile || !profile.is_active) return null;

  return profile;
}

/** Redirects to /login if there is no active session/profile. */
export async function requireActiveUser(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

/** Redirects to /forbidden if the current user is not an active admin. */
export async function requireAdmin(): Promise<Profile> {
  const profile = await requireActiveUser();
  if (profile.role !== "admin") redirect("/forbidden");
  return profile;
}

/**
 * Redirects to /forbidden unless the current user holds one of `roles`. The
 * sidebar already routes each role to its own sheets; this is the guard for
 * anyone who types the address instead.
 */
export async function requireRoles(...roles: UserRole[]): Promise<Profile> {
  const profile = await requireActiveUser();
  if (!roles.includes(profile.role)) redirect("/forbidden");
  return profile;
}
