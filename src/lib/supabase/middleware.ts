import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/env";

/**
 * Refreshes the Supabase auth session cookie on every request. This is only
 * a convenience layer — real page/action authorization happens server-side
 * via src/lib/permissions (see AGENTS spec: never rely on middleware/UI
 * hiding alone for access control).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}
