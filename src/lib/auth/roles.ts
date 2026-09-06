import type { Dictionary } from "@/i18n/dictionary";
import type { UserRole } from "@/types/domain";

/**
 * Three roles, two axes. `admin` owns the account structure; `media_buyer`
 * authors entries for the associations they are assigned; `viewer` reads the
 * whole portfolio and writes nothing.
 *
 * These mirror the RLS predicates one-for-one — `canReadAll` is `can_read_all()`
 * and `canWrite` is what the write policies allow — so the interface never
 * offers a control the database would refuse.
 */

/** Sees every association, platform and entry, whoever authored it. */
export function canReadAll(role: UserRole): boolean {
  return role === "admin" || role === "viewer";
}

/** May create, edit or delete entries. */
export function canWrite(role: UserRole): boolean {
  return role !== "viewer";
}

/** Read-only account: every edit surface is hidden from it. */
export function isViewer(role: UserRole): boolean {
  return role === "viewer";
}

/** The role's name in the reader's language — one table, three call sites. */
export function roleLabel(role: UserRole, dict: Dictionary): string {
  if (role === "admin") return dict.nav.roleAdmin;
  if (role === "viewer") return dict.nav.roleViewer;
  return dict.nav.roleMediaBuyer;
}
