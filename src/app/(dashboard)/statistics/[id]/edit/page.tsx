import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAvailableAssociationsWithPlatforms } from "@/lib/data/statistics-options";
import { PageHeading } from "@/components/layout/page-heading";
import { StatisticsForm } from "../../statistics-form";
import { updateStatisticsEntry } from "../../actions";

export default async function EditStatisticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: entry }, associations] = await Promise.all([
    supabase.from("statistics_entries").select("*").eq("id", id).single(),
    getAvailableAssociationsWithPlatforms(),
  ]);

  if (!entry) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="statistics.edit" />
      <StatisticsForm associations={associations} entry={entry} action={updateStatisticsEntry.bind(null, id)} />
    </div>
  );
}
