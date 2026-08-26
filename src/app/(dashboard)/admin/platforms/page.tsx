import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/layout/page-heading";
import { PlatformForm } from "./platform-form";
import { PlatformsTable } from "./platforms-table";

export default async function PlatformsPage() {
  const supabase = await createClient();
  const { data: platforms } = await supabase.from("platforms").select("*").order("name");

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="platforms.title" />
      <PlatformForm />
      <PlatformsTable platforms={platforms ?? []} />
    </div>
  );
}
