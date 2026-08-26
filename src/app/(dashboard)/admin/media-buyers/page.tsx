import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/layout/page-heading";
import { NewLinkButton } from "@/components/layout/new-link-button";
import { MediaBuyersTable } from "./media-buyers-table";

export default async function MediaBuyersPage() {
  const supabase = await createClient();
  const { data: mediaBuyers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "media_buyer")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        titleKey="mediaBuyers.title"
        action={<NewLinkButton href="/admin/media-buyers/new" labelKey="mediaBuyers.new" />}
      />
      <MediaBuyersTable mediaBuyers={mediaBuyers ?? []} />
    </div>
  );
}
