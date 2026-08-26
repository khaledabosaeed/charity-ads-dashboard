import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/layout/page-heading";
import { MediaBuyerForm } from "../media-buyer-form";
import { createMediaBuyer } from "../actions";

export default async function NewMediaBuyerPage() {
  const supabase = await createClient();
  const { data: associations } = await supabase
    .from("associations")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="mediaBuyers.new" />
      <MediaBuyerForm associations={associations ?? []} action={createMediaBuyer} showPassword />
    </div>
  );
}
