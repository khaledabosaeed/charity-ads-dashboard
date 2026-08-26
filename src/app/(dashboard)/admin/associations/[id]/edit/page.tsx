import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/layout/page-heading";
import { AssociationForm } from "../../association-form";
import { updateAssociation } from "../../actions";
import { AssociationLinks } from "./association-links";

export default async function EditAssociationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: association }, { data: platforms }, { data: mediaBuyers }, { data: linkedPlatforms }, { data: linkedBuyers }] =
    await Promise.all([
      supabase.from("associations").select("*").eq("id", id).single(),
      supabase.from("platforms").select("*").order("name"),
      supabase.from("profiles").select("*").eq("role", "media_buyer").order("full_name"),
      supabase.from("association_platforms").select("platform_id").eq("association_id", id),
      supabase.from("association_media_buyers").select("media_buyer_id").eq("association_id", id),
    ]);

  if (!association) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeading titleKey="associations.edit" />
      <AssociationForm association={association} action={updateAssociation.bind(null, id)} />
      <AssociationLinks
        associationId={id}
        platforms={platforms ?? []}
        mediaBuyers={mediaBuyers ?? []}
        selectedPlatformIds={(linkedPlatforms ?? []).map((p) => p.platform_id)}
        selectedMediaBuyerIds={(linkedBuyers ?? []).map((b) => b.media_buyer_id)}
      />
    </div>
  );
}
