import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeading } from "@/components/layout/page-heading";
import { NewLinkButton } from "@/components/layout/new-link-button";
import { UsersTable, type UserRow } from "./users-table";
import type { Profile } from "@/types/domain";

/** Every account on the system — admins included, since an admin may add one. */
export default async function UsersPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("role")
    .order("created_at", { ascending: false });

  /* Addresses live in auth, not in the profile table, so they are read with the
     service-role client — after the admin check above, never before. */
  const { data: authUsers } = await createAdminClient().auth.admin.listUsers({ perPage: 1000 });
  const emailById = new Map(authUsers.users.map((u) => [u.id, u.email ?? ""]));

  const users: UserRow[] = ((profiles as Profile[]) ?? []).map((profile) => ({
    ...profile,
    email: emailById.get(profile.id) ?? "",
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        titleKey="users.title"
        action={<NewLinkButton href="/admin/users/new" labelKey="users.new" />}
      />
      <UsersTable users={users} currentUserId={admin.id} />
    </div>
  );
}
