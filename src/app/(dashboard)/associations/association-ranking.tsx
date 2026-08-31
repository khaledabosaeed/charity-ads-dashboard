"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/layout/empty-state";
import { currencyMark, formatCount, formatNumber } from "@/lib/format";
import { formatMetric } from "@/lib/calculations/statistics";
import type { Rollup } from "@/lib/calculations/rollup";

export type AssociationReading = { id: string; label: string; totals: Rollup };

/** The standings: associations ranked by what the advertising returned. */
export function AssociationRanking({
  readings,
  unit,
}: {
  readings: AssociationReading[];
  unit: string | null;
}) {
  const { dict, locale } = useI18n();

  if (readings.length === 0) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead numeric>{dict.daily.rank}</TableHead>
          <TableHead pinned>{dict.statistics.association}</TableHead>
          <TableHead numeric>{dict.statistics.amountSpent}</TableHead>
          <TableHead numeric>{dict.statistics.advertisingReturn}</TableHead>
          <TableHead numeric>{dict.statistics.roas}</TableHead>
          <TableHead numeric>{dict.daily.activeDays}</TableHead>
          <TableHead>
            <span className="sr-only">{dict.common.actions}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {readings.map((reading, index) => {
          const r = reading.totals.roas;
          return (
            <TableRow key={reading.id}>
              <TableCell numeric className="text-ink-3">
                {formatCount(index + 1)}
              </TableCell>
              <TableCell pinned className="font-medium">
                {reading.label}
              </TableCell>
              <TableCell numeric className="text-amber-ink">
                {formatNumber(reading.totals.spend)}
                {unit ? <span className="ms-1 text-[0.6875rem] text-ink-3">{currencyMark(unit, locale)}</span> : null}
              </TableCell>
              <TableCell numeric className="text-datum">
                {formatNumber(reading.totals.revenue)}
                {unit ? <span className="ms-1 text-[0.6875rem] text-ink-3">{currencyMark(unit, locale)}</span> : null}
              </TableCell>
              <TableCell numeric>
                <Badge variant={r === null ? "muted" : r >= 1 ? "success" : "destructive"}>
                  <span className="figure">{formatMetric(r, (n) => `${n.toFixed(2)}×`)}</span>
                </Badge>
              </TableCell>
              <TableCell numeric>{formatCount(reading.totals.activeDays)}</TableCell>
              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/associations/${reading.id}`}>{dict.daily.view}</Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
