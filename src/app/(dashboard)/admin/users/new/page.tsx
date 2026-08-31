import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/layout/page-heading";
import { UserForm } from "../user-form";
import { createUser } from "../actions";

export default async function NewUserPage() {
  const supabase = await createClient();
  const { data: associations } = await supabase
    .from("associations")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="users.new" />
      <UserForm associations={associations ?? []} action={createUser} mode="create" />
    </div>
  );
}
