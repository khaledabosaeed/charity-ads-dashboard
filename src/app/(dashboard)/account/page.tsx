import { requireActiveUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/layout/page-heading";
import { AccountForm } from "./account-form";

/** Anyone signed in may change their own address and password — admins included. */
export default async function AccountPage() {
  const profile = await requireActiveUser();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="users.account" />
      <AccountForm
        email={user?.email ?? ""}
        name={profile.full_name}
        role={profile.role}
      />
    </div>
  );
}
