import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/layout/page-heading";
import { MediaBuyerForm } from "../../media-buyer-form";
import { updateMediaBuyer } from "../../actions";

export default async function EditMediaBuyerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: profile }, { data: associations }, { data: linked }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).eq("role", "media_buyer").single(),
    supabase.from("associations").select("*").order("name"),
    supabase.from("association_media_buyers").select("association_id").eq("media_buyer_id", id),
  ]);

  if (!profile) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="mediaBuyers.edit" />
      <MediaBuyerForm
        profile={profile}
        associations={associations ?? []}
        selectedAssociationIds={(linked ?? []).map((l) => l.association_id)}
        action={updateMediaBuyer.bind(null, id)}
        showPassword={false}
      />
    </div>
  );
}
