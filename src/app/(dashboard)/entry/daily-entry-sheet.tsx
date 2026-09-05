"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { NativeSelect, NumberInput } from "@/components/ui/input";
import { DateField } from "@/components/ui/date-field";
import { FormItem, FormLabel } from "@/components/forms/field";
import { DimensionCell, DimensionGrid, RuledHeading, TitleBlock } from "@/components/drawing";
import { EmptyState } from "@/components/layout/empty-state";
import { currencyMark, formatCount, formatNumber } from "@/lib/format";
import { formatMetric, roas } from "@/lib/calculations/statistics";
import type { AssociationOption } from "@/lib/data/statistics-options";
import type { MediaBuyerOption } from "@/lib/data/report-entries";
import { saveDailySheet, type DailySheetState } from "./actions";

export type DayLine = {
  platformId: string;
  amountSpent: number;
  advertisingReturn: number;
  orderCount: number;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** A blank reads as empty, not as zero, until it is filled. */
function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * One platform's line on the sheet: the two figures that are actually collected
 * every day, with the reading they produce ruled underneath as they are typed.
 */
function PlatformLine({
  name,
  platformId,
  defaults,
  unit,
  onChange,
}: {
  name: string;
  platformId: string;
  defaults: { spend: number; revenue: number; orders: number };
  unit: string;
  onChange: (line: DayLine) => void;
}) {
  const { dict, locale } = useI18n();
  const [spend, setSpend] = useState(String(defaults.spend || ""));
  const [revenue, setRevenue] = useState(String(defaults.revenue || ""));
  const [orders, setOrders] = useState(String(defaults.orders || ""));

  const r = roas(toNumber(revenue), toNumber(spend));

  function push(next: { spend?: string; revenue?: string; orders?: string }) {
    onChange({
      platformId,
      amountSpent: toNumber(next.spend ?? spend),
      advertisingReturn: toNumber(next.revenue ?? revenue),
      orderCount: toNumber(next.orders ?? orders),
    });
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="truncate text-[0.9375rem] font-semibold text-ink">{name}</h3>
        <span className="annot shrink-0">{currencyMark(unit, locale)}</span>
      </div>

      <FormItem>
        <FormLabel htmlFor={`spend:${platformId}`}>{dict.statistics.amountSpent}</FormLabel>
        <NumberInput
          id={`spend:${platformId}`}
          name={`spend:${platformId}`}
          placeholder="0"
          value={spend}
          onChange={(e) => {
            setSpend(e.target.value);
            push({ spend: e.target.value });
          }}
        />
      </FormItem>

      <FormItem>
        <FormLabel htmlFor={`revenue:${platformId}`}>{dict.statistics.advertisingReturn}</FormLabel>
        <NumberInput
          id={`revenue:${platformId}`}
          name={`revenue:${platformId}`}
          placeholder="0"
          value={revenue}
          onChange={(e) => {
            setRevenue(e.target.value);
            push({ revenue: e.target.value });
          }}
        />
      </FormItem>

      <FormItem>
        <FormLabel htmlFor={`orders:${platformId}`}>{dict.statistics.orderCount}</FormLabel>
        <NumberInput
          id={`orders:${platformId}`}
          name={`orders:${platformId}`}
          integer
          placeholder="0"
          value={orders}
          onChange={(e) => {
            setOrders(e.target.value);
            push({ orders: e.target.value });
          }}
        />
      </FormItem>

      <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-line pt-3">
        <span className="annot">{dict.statistics.roas}</span>
        <span
          className={
            "figure text-lg font-semibold leading-none " +
            (r === null ? "text-ink-3" : r >= 1 ? "text-datum" : "text-alarm")
          }
        >
          {formatMetric(r, (n) => `${n.toFixed(2)}×`)}
        </span>
      </div>
    </div>
  );
}

/**
 * The day sheet. The three reference fields — day, media buyer, association —
 * sit in one band at the top and reload the sheet from the record the moment
 * one of them changes; no apply button, because choosing the day *is* the
 * request. Everything below is a single form saved in one stroke, so the save
 * button can live up in the title block beside the heading.
 */
export function DailyEntrySheet({
  associations,
  mediaBuyers,
  date,
  associationId,
  mediaBuyerId,
  buyerName,
  lines,
  currency,
  associationReturn: associationReturnDefault,
}: {
  associations: AssociationOption[];
  /** Empty for a media buyer: they can only ever file their own day. */
  mediaBuyers: MediaBuyerOption[];
  date: string;
  associationId: string;
  mediaBuyerId: string;
  buyerName: string;
  lines: DayLine[];
  currency: string;
  /** The association's own return for the day — one value, no platform. */
  associationReturn?: number;
}) {
  const { dict, locale } = useI18n();
  const router = useRouter();
  const [navigating, startNavigation] = useTransition();
  const [state, formAction, isPending] = useActionState<DailySheetState, FormData>(
    saveDailySheet,
    {}
  );
  const lastToast = useRef<number | undefined>(undefined);

  const platforms = associations.find((a) => a.id === associationId)?.platforms ?? [];

  const defaults = useMemo(() => {
    const map = new Map(lines.map((l) => [l.platformId, l]));
    return (platformId: string) => ({
      spend: map.get(platformId)?.amountSpent ?? 0,
      revenue: map.get(platformId)?.advertisingReturn ?? 0,
      orders: map.get(platformId)?.orderCount ?? 0,
    });
  }, [lines]);

  /* The running day, held here so the summary reads while the sheet is filled.
     Changing any reference field remounts the sheet (the page keys it), so this
     state is seeded once and never has to chase its own props. */
  const [draft, setDraft] = useState<Record<string, DayLine>>(() =>
    Object.fromEntries(lines.map((l) => [l.platformId, l]))
  );

  const [associationReturn, setAssociationReturn] = useState(
    String(associationReturnDefault || "")
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);
    else if (state.at && state.at !== lastToast.current) {
      lastToast.current = state.at;
      toast.success(dict.common.savedSuccessfully);
    }
  }, [state, dict]);

  /** Any reference field changing re-draws the sheet from the record. */
  function redraw(next: { date?: string; associationId?: string; mediaBuyerId?: string }) {
    const query = new URLSearchParams({
      date: next.date ?? date,
      associationId: next.associationId ?? associationId,
    });
    const buyer = next.mediaBuyerId ?? mediaBuyerId;
    if (mediaBuyers.length > 0 && buyer) query.set("mediaBuyerId", buyer);
    startNavigation(() => router.push(`/entry?${query.toString()}`));
  }

  const day = platforms.map(
    (p) => draft[p.id] ?? { platformId: p.id, amountSpent: 0, advertisingReturn: 0, orderCount: 0 }
  );
  const totalSpend = day.reduce((acc, l) => acc + l.amountSpent, 0);
  const totalRevenue = day.reduce((acc, l) => acc + l.advertisingReturn, 0);
  const totalOrders = day.reduce((acc, l) => acc + l.orderCount, 0);
  const dayRoas = roas(toNumber(associationReturn), totalSpend);
  const busy = isPending || navigating;

  return (
    /* One form for the whole day — the title block's save button included, so
       the reference band and every platform line are committed in one stroke. */
    <form action={formAction} className="flex flex-col gap-6">
      <TitleBlock
        title={dict.daily.entryTitle}
        extent={`${dict.daily.greeting} ${buyerName}`}
        revision={date}
        action={
          <Button
            type="submit"
              pending={isPending}
            disabled={busy || platforms.length === 0}
          >
            <Save className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {isPending ? dict.daily.saving : dict.daily.saveDay}
          </Button>
        }
      />

      {/* the reference band: which day, whose books, which association */}
      <div className="border border-line bg-paper-raised">
        <div className="grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-3">
          <FormItem>
            <FormLabel htmlFor="date" required>
              {dict.daily.date}
            </FormLabel>
            <DateField
              id="date"
              name="date"
              defaultValue={date}
              required
              onValueChange={(value) => {
                if (ISO.test(value) && value !== date) redraw({ date: value });
              }}
            />
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="mediaBuyerId">{dict.daily.mediaBuyer}</FormLabel>
            {mediaBuyers.length > 0 ? (
              <NativeSelect
                id="mediaBuyerId"
                value={mediaBuyerId}
                onChange={(e) => redraw({ mediaBuyerId: e.target.value })}
              >
                {mediaBuyers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </NativeSelect>
            ) : (
              /* A media buyer files their own day and no one else's. */
              <NativeSelect id="mediaBuyerId" value={mediaBuyerId} disabled onChange={() => {}}>
                <option value={mediaBuyerId}>{buyerName}</option>
              </NativeSelect>
            )}
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="associationId" required>
              {dict.statistics.association}
            </FormLabel>
            <NativeSelect
              id="associationId"
              value={associationId}
              onChange={(e) => redraw({ associationId: e.target.value })}
            >
              {associations.length === 0 ? <option value="">{dict.daily.choose}</option> : null}
              {associations.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </NativeSelect>
          </FormItem>
        </div>
      </div>

      {associations.length === 0 ? (
        <EmptyState message={dict.daily.noAssociations} />
      ) : platforms.length === 0 ? (
        <EmptyState message={dict.daily.noPlatforms} />
      ) : null}

      {/* The band's selects only steer the sheet; what is filed is what the
          server drew it from. */}
      <input type="hidden" name="associationId" value={associationId} />
      <input type="hidden" name="mediaBuyerId" value={mediaBuyerId} />
      <input type="hidden" name="currencyCode" value={currency} />

      {platforms.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            <RuledHeading>{dict.daily.platformsData}</RuledHeading>
            <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {platforms.map((p) => (
                <div key={p.id} className="bg-paper-raised">
                  <PlatformLine
                    name={p.name}
                    platformId={p.id}
                    defaults={defaults(p.id)}
                    unit={currency}
                    onChange={(line) => setDraft((prev) => ({ ...prev, [p.id]: line }))}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-3 bg-paper-raised px-4 py-4 sm:px-5">
                <FormItem>
                  <FormLabel htmlFor="associationReturn" className="text-[0.9375rem] font-semibold text-ink">
                    {dict.statistics.associationReturn}
                  </FormLabel>
                  <NumberInput
                    id="associationReturn"
                    name="associationReturn"
                    placeholder="0"
                    value={associationReturn}
                    onChange={(e) => setAssociationReturn(e.target.value)}
                  />
                </FormItem>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <RuledHeading>{dict.daily.daySummary}</RuledHeading>
            <DimensionGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
              <DimensionCell
                label={dict.daily.totalRevenue}
                value={formatNumber(totalRevenue)}
                note={currencyMark(currency, locale)}
                tone="datum"
              />
              <DimensionCell
                label={dict.daily.totalSpend}
                value={formatNumber(totalSpend)}
                note={currencyMark(currency, locale)}
                tone="amber"
              />
              <DimensionCell
                label={dict.daily.overallRoas}
                value={formatMetric(dayRoas, (n) => `${n.toFixed(2)}×`)}
                tone={dayRoas !== null && dayRoas >= 1 ? "datum" : "ink"}
              />
              <DimensionCell label={dict.daily.totalOrders} value={formatCount(totalOrders)} />
              <DimensionCell
                label={dict.statistics.associationReturn}
                value={formatNumber(toNumber(associationReturn))}
                note={currencyMark(currency, locale)}
                tone="datum"
              />
            </DimensionGrid>
          </div>
        </>
      ) : null}
    </form>
  );
}
