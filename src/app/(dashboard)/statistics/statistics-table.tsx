"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/layout/empty-state";
import { avgDonationValue, formatMetric, remainingBudget, roas, spendPercentage } from "@/lib/calculations/statistics";
import type { StatisticsEntryWithRelations } from "@/types/domain";

function money(n: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

export function StatisticsTable({ entries }: { entries: StatisticsEntryWithRelations[] }) {
  const { dict } = useI18n();

  if (entries.length === 0) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{dict.statistics.association}</TableHead>
          <TableHead>{dict.statistics.platform}</TableHead>
          <TableHead>{dict.statistics.period}</TableHead>
          <TableHead>{dict.statistics.budget}</TableHead>
          <TableHead>{dict.statistics.amountSpent}</TableHead>
          <TableHead>{dict.statistics.remaining}</TableHead>
          <TableHead>{dict.statistics.spendPct}</TableHead>
          <TableHead>{dict.statistics.roas}</TableHead>
          <TableHead>{dict.statistics.avgDonation}</TableHead>
          <TableHead>{dict.statistics.associationReturn}</TableHead>
          <TableHead>{dict.statistics.createdBy}</TableHead>
          <TableHead>{dict.common.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((e) => (
          <TableRow key={e.id}>
            <TableCell className="font-medium">{e.association?.name ?? "—"}</TableCell>
            <TableCell>{e.platform?.name ?? "—"}</TableCell>
            <TableCell className="whitespace-nowrap text-xs">
              {e.period_start} — {e.period_end}
            </TableCell>
            <TableCell>{money(e.budget, e.currency_code)}</TableCell>
            <TableCell>{money(e.amount_spent, e.currency_code)}</TableCell>
            <TableCell>{money(remainingBudget(e.budget, e.amount_spent), e.currency_code)}</TableCell>
            <TableCell>{spendPercentage(e.budget, e.amount_spent).toFixed(1)}%</TableCell>
            <TableCell>
              {formatMetric(roas(e.advertising_return, e.amount_spent), (n) => n.toFixed(2))}
            </TableCell>
            <TableCell>
              {formatMetric(avgDonationValue(e.donation_value, e.donation_count), (n) =>
                money(n, e.currency_code)
              )}
            </TableCell>
            <TableCell>{money(e.association_return, e.currency_code)}</TableCell>
            <TableCell>{e.author?.full_name ?? "—"}</TableCell>
            <TableCell>
              <Button asChild size="sm" variant="outline">
                <Link href={`/statistics/${e.id}/edit`}>{dict.common.edit}</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
