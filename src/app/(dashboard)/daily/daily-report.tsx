"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DimensionCell, DimensionGrid, RuledHeading } from "@/components/drawing";
import { EmptyState } from "@/components/layout/empty-state";
import { DeleteStatisticsButton } from "@/app/(dashboard)/statistics/delete-statistics-button";
import { currencyMark, formatCount, formatMoney, formatNumber } from "@/lib/format";
import { formatMetric, roas } from "@/lib/calculations/statistics";
import { rollup, unifiedCurrency } from "@/lib/calculations/rollup";
import { cn } from "@/lib/utils";
import type { StatisticsEntryWithRelations } from "@/types/domain";

/** The day's reading, then the day's lines. Newest day at the top. */
export function DailyReport({ entries }: { entries: StatisticsEntryWithRelations[] }) {
  const { dict, locale } = useI18n();

  const totals = rollup(entries);
  const unit = unifiedCurrency(entries);
  const rows = [...entries].reverse();

  return (
    <div className="flex flex-col gap-6">
      <DimensionGrid className="grid-cols-2 sm:grid-cols-4 lg:grid-cols-4">
        <DimensionCell
          label={dict.daily.totalSpend}
          value={formatNumber(totals.spend)}
          note={unit ? currencyMark(unit, locale) : null}
          tone="amber"
        />
        <DimensionCell
          label={dict.daily.totalRevenue}
          value={formatNumber(totals.revenue)}
          note={unit ? currencyMark(unit, locale) : null}
          tone="datum"
        />
        <DimensionCell
          label={dict.daily.overallRoas}
          value={formatMetric(totals.roas, (n) => `${n.toFixed(2)}×`)}
          tone={totals.roas !== null && totals.roas >= 1 ? "datum" : "ink"}
        />
        <DimensionCell label={dict.daily.entriesCount} value={formatCount(totals.entries)} />
      </DimensionGrid>

      <div className="flex flex-col gap-3">
        <RuledHeading>{dict.daily.lines}</RuledHeading>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead pinned>{dict.daily.day}</TableHead>
                <TableHead>{dict.statistics.association}</TableHead>
                <TableHead>{dict.statistics.platform}</TableHead>
                <TableHead numeric>{dict.statistics.amountSpent}</TableHead>
                <TableHead numeric>{dict.statistics.advertisingReturn}</TableHead>
                <TableHead numeric>{dict.statistics.roas}</TableHead>
                <TableHead>{dict.daily.mediaBuyer}</TableHead>
                <TableHead>
                  <span className="sr-only">{dict.common.actions}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((e) => {
                const r = roas(e.advertising_return, e.amount_spent);
                return (
                  <TableRow key={e.id}>
                    <TableCell pinned className="figure whitespace-nowrap font-medium">
                      {e.period_start}
                    </TableCell>
                    <TableCell className="font-medium">{e.association?.name ?? "—"}</TableCell>
                    <TableCell className="text-ink-2">{e.platform?.name ?? "—"}</TableCell>
                    <TableCell numeric className="text-amber-ink">
                      {formatMoney(e.amount_spent, e.currency_code, locale)}
                    </TableCell>
                    <TableCell numeric className="text-datum">
                      {formatMoney(e.advertising_return, e.currency_code, locale)}
                    </TableCell>
                    <TableCell
                      numeric
                      className={cn(r !== null && (r >= 1 ? "text-datum" : "text-alarm"))}
                    >
                      {formatMetric(r, (n) => `${n.toFixed(2)}×`)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-ink-2">
                      {e.author?.full_name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/statistics/${e.id}/edit`}>{dict.common.edit}</Link>
                        </Button>
                        <DeleteStatisticsButton id={e.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
