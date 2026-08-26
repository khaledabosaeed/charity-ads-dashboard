import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/env";

/**
 * Service-role client. Server-only (import "server-only" fails the build if
 * this ever ends up in a client bundle). Use exclusively inside Server
 * Actions that have already verified the caller is an active admin — never
 * call this before that check.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
