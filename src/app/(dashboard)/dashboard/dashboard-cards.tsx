"use client";

import { useI18n } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMetric, remainingBudget, roas } from "@/lib/calculations/statistics";
import type { StatisticsEntryWithRelations } from "@/types/domain";

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((acc, item) => acc + pick(item), 0);
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

export function DashboardCards({ entries }: { entries: StatisticsEntryWithRelations[] }) {
  const { dict } = useI18n();

  const totalBudget = sum(entries, (e) => e.budget);
  const totalSpent = sum(entries, (e) => e.amount_spent);
  const totalDonationCount = sum(entries, (e) => e.donation_count);
  const totalDonationValue = sum(entries, (e) => e.donation_value);
  const totalAdvertisingReturn = sum(entries, (e) => e.advertising_return);
  const totalAssociationReturn = sum(entries, (e) => e.association_return);

  const roasValues = entries
    .map((e) => roas(e.advertising_return, e.amount_spent))
    .filter((v): v is number => v !== null);
  const avgRoas = roasValues.length > 0 ? roasValues.reduce((a, b) => a + b, 0) / roasValues.length : null;

  const cards = [
    { label: dict.dashboard.totalBudget, value: formatNumber(totalBudget) },
    { label: dict.dashboard.totalSpent, value: formatNumber(totalSpent) },
    { label: dict.dashboard.remainingBudget, value: formatNumber(remainingBudget(totalBudget, totalSpent)) },
    { label: dict.dashboard.donationCount, value: formatNumber(totalDonationCount) },
    { label: dict.dashboard.donationValue, value: formatNumber(totalDonationValue) },
    { label: dict.dashboard.advertisingReturn, value: formatNumber(totalAdvertisingReturn) },
    { label: dict.dashboard.associationReturn, value: formatNumber(totalAssociationReturn) },
    { label: dict.dashboard.avgRoas, value: formatMetric(avgRoas, (n) => n.toFixed(2)) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader>
            <CardTitle>{c.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
