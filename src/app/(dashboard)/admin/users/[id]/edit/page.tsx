import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeading } from "@/components/layout/page-heading";
import { UserForm } from "../../user-form";
import { updateUser } from "../../actions";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await requireAdmin();
  const supabase = await createClient();

  const [{ data: profile }, { data: associations }, { data: linked }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.from("associations").select("*").order("name"),
    supabase.from("association_media_buyers").select("association_id").eq("media_buyer_id", id),
  ]);

  if (!profile) notFound();

  const { data: authUser } = await createAdminClient().auth.admin.getUserById(id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="users.edit" />
      <UserForm
        profile={profile}
        email={authUser.user?.email ?? ""}
        associations={associations ?? []}
        selectedAssociationIds={(linked ?? []).map((l) => l.association_id)}
        action={updateUser.bind(null, id)}
        mode="edit"
        editingSelf={admin.id === id}
      />
    </div>
  );
}
