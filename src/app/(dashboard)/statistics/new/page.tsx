import { getAvailableAssociationsWithPlatforms } from "@/lib/data/statistics-options";
import { PageHeading } from "@/components/layout/page-heading";
import { StatisticsForm } from "../statistics-form";
import { createStatisticsEntry } from "../actions";

export default async function NewStatisticsPage() {
  const associations = await getAvailableAssociationsWithPlatforms();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="statistics.new" />
      <StatisticsForm associations={associations} action={createStatisticsEntry} />
    </div>
  );
}
