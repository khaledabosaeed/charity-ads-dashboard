"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/layout/empty-state";
import { formatMoney, formatCount, formatPercent, formatPeriod } from "@/lib/format";
import {
  avgDonationValue,
  formatMetric,
  remainingBudget,
  roas,
  spendPercentage,
} from "@/lib/calculations/statistics";
import { cn } from "@/lib/utils";
import type { StatisticsEntryWithRelations } from "@/types/domain";

/** The schedule. Figure columns are tabular and end-aligned so digits stack. */
export function StatisticsTable({ entries }: { entries: StatisticsEntryWithRelations[] }) {
  const { dict } = useI18n();

  if (entries.length === 0) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead pinned>{dict.statistics.association}</TableHead>
          <TableHead>{dict.statistics.platform}</TableHead>
          <TableHead>{dict.statistics.period}</TableHead>
          <TableHead numeric>{dict.statistics.budget}</TableHead>
          <TableHead numeric>{dict.statistics.amountSpent}</TableHead>
          <TableHead numeric>{dict.statistics.remaining}</TableHead>
          <TableHead numeric>{dict.statistics.spendPct}</TableHead>
          <TableHead numeric>{dict.statistics.roas}</TableHead>
          <TableHead numeric>{dict.statistics.avgDonation}</TableHead>
          <TableHead numeric>{dict.statistics.donationCount}</TableHead>
          <TableHead numeric>{dict.statistics.associationReturn}</TableHead>
          <TableHead>{dict.statistics.createdBy}</TableHead>
          <TableHead>
            <span className="sr-only">{dict.common.actions}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((e) => {
          const remaining = remainingBudget(e.budget, e.amount_spent);
          const pct = spendPercentage(e.budget, e.amount_spent);
          const over = remaining < 0;
          const r = roas(e.advertising_return, e.amount_spent);

          return (
            <TableRow key={e.id}>
              <TableCell pinned className="font-medium">{e.association?.name ?? "—"}</TableCell>
              <TableCell className="text-ink-2">{e.platform?.name ?? "—"}</TableCell>
              <TableCell className="figure whitespace-nowrap text-[0.8125rem] text-ink-2">
                {formatPeriod(e.period_start, e.period_end)}
              </TableCell>
              <TableCell numeric>{formatMoney(e.budget, e.currency_code)}</TableCell>
              <TableCell numeric className="text-amber-ink">
                {formatMoney(e.amount_spent, e.currency_code)}
              </TableCell>
              <TableCell numeric className={cn(over ? "font-semibold text-alarm" : "text-datum")}>
                {formatMoney(remaining, e.currency_code)}
              </TableCell>
              <TableCell numeric className={cn(over && "font-semibold text-alarm")}>
                {formatPercent(pct)}
              </TableCell>
              <TableCell numeric className={cn(r !== null && r >= 1 && "text-datum")}>
                {formatMetric(r, (n) => `${n.toFixed(2)}×`)}
              </TableCell>
              <TableCell numeric>
                {formatMetric(avgDonationValue(e.donation_value, e.donation_count), (n) =>
                  formatMoney(n, e.currency_code)
                )}
              </TableCell>
              <TableCell numeric>{formatCount(e.donation_count)}</TableCell>
              <TableCell numeric>{formatMoney(e.association_return, e.currency_code)}</TableCell>
              <TableCell className="whitespace-nowrap text-ink-2">
                {e.author?.full_name ?? "—"}
              </TableCell>
              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/statistics/${e.id}/edit`}>{dict.common.edit}</Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
