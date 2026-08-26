import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/layout/page-heading";
import { NewLinkButton } from "@/components/layout/new-link-button";
import { AssociationsTable } from "./associations-table";

export default async function AssociationsPage() {
  const supabase = await createClient();
  const { data: associations } = await supabase
    .from("associations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        titleKey="associations.title"
        action={<NewLinkButton href="/admin/associations/new" labelKey="associations.new" />}
      />
      <AssociationsTable associations={associations ?? []} />
    </div>
  );
}
