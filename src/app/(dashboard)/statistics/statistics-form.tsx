"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect } from "@/components/ui/input";
import { DateField } from "@/components/ui/date-field";
import { Textarea } from "@/components/ui/textarea";
import { FormError, FormItem, FormLabel } from "@/components/forms/field";
import { SectionBand } from "@/components/drawing";
import { formatNumber, formatPercent } from "@/lib/format";
import { remainingBudget, spendPercentage } from "@/lib/calculations/statistics";
import { getDefaultCurrency } from "@/lib/env";
import type { AssociationOption } from "@/lib/data/statistics-options";
import type { StatisticsEntry } from "@/types/domain";
import type { ActionState } from "./actions";

/** A ruled group on the sheet. The chore is repetitive; the grouping is the map. */
function FieldGroup({
  legend,
  children,
  className,
}: {
  legend: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className="border border-line bg-paper-raised">
      <legend className="annot ms-4 bg-paper-raised px-2">{legend}</legend>
      <div className={className ?? "grid gap-5 px-4 pb-5 pt-2 sm:grid-cols-2 sm:px-5"}>
        {children}
      </div>
    </fieldset>
  );
}

export function StatisticsForm({
  associations,
  entry,
  action,
}: {
  associations: AssociationOption[];
  entry?: StatisticsEntry;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const { dict } = useI18n();
  const [state, formAction, isPending] = useActionState(action, {});
  const [associationId, setAssociationId] = useState(
    entry?.association_id ?? associations[0]?.id ?? ""
  );
  /* The signature interaction: the cut is drawn while you type, so the reading
     is visible before the record is committed. */
  const [budget, setBudget] = useState(entry?.budget ?? 0);
  const [spent, setSpent] = useState(entry?.amount_spent ?? 0);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  const platformOptions = associations.find((a) => a.id === associationId)?.platforms ?? [];
  const remaining = remainingBudget(budget, spent);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      <input type="hidden" name="associationId" value={associationId} />

      <FieldGroup legend={dict.statistics.groupReference}>
        <FormItem>
          <FormLabel htmlFor="associationSelect" required>
            {dict.statistics.association}
          </FormLabel>
          <NativeSelect
            id="associationSelect"
            value={associationId}
            onChange={(e) => setAssociationId(e.target.value)}
          >
            {associations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </NativeSelect>
          <FormError message={state.fieldErrors?.associationId} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="platformId" required>
            {dict.statistics.platform}
          </FormLabel>
          <NativeSelect
            id="platformId"
            name="platformId"
            defaultValue={entry?.platform_id ?? ""}
            required
          >
            <option value="" disabled>
              —
            </option>
            {platformOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </NativeSelect>
          <FormError message={state.fieldErrors?.platformId} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="periodStart" required>
            {dict.statistics.periodStart}
          </FormLabel>
          <DateField
            id="periodStart"
            name="periodStart"
            defaultValue={entry?.period_start}
            required
          />
          <FormError message={state.fieldErrors?.periodStart} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="periodEnd" required>
            {dict.statistics.periodEnd}
          </FormLabel>
          <DateField
            id="periodEnd"
            name="periodEnd"
            defaultValue={entry?.period_end}
            required
          />
          <FormError message={state.fieldErrors?.periodEnd} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="currencyCode" required>
            {dict.statistics.currency}
          </FormLabel>
          <Input
            id="currencyCode"
            name="currencyCode"
            maxLength={3}
            dir="ltr"
            className="figure uppercase"
            defaultValue={entry?.currency_code ?? getDefaultCurrency()}
            required
          />
          <FormError message={state.fieldErrors?.currencyCode} />
        </FormItem>
      </FieldGroup>

      <FieldGroup legend={dict.statistics.groupFigures}>
        <FormItem>
          <FormLabel htmlFor="budget" required>
            {dict.statistics.budget}
          </FormLabel>
          <Input
            id="budget"
            name="budget"
            type="number"
            min={0}
            step="0.01"
            defaultValue={entry?.budget ?? 0}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
            required
          />
          <FormError message={state.fieldErrors?.budget} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="amountSpent" required>
            {dict.statistics.amountSpent}
          </FormLabel>
          <Input
            id="amountSpent"
            name="amountSpent"
            type="number"
            min={0}
            step="0.01"
            defaultValue={entry?.amount_spent ?? 0}
            onChange={(e) => setSpent(Number(e.target.value) || 0)}
            required
          />
          <FormError message={state.fieldErrors?.amountSpent} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="donationCount" required>
            {dict.statistics.donationCount}
          </FormLabel>
          <Input
            id="donationCount"
            name="donationCount"
            type="number"
            min={0}
            step="1"
            defaultValue={entry?.donation_count ?? 0}
            required
          />
          <FormError message={state.fieldErrors?.donationCount} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="donationValue" required>
            {dict.statistics.donationValue}
          </FormLabel>
          <Input
            id="donationValue"
            name="donationValue"
            type="number"
            min={0}
            step="0.01"
            defaultValue={entry?.donation_value ?? 0}
            required
          />
          <FormError message={state.fieldErrors?.donationValue} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="advertisingReturn" required>
            {dict.statistics.advertisingReturn}
          </FormLabel>
          <Input
            id="advertisingReturn"
            name="advertisingReturn"
            type="number"
            min={0}
            step="0.01"
            defaultValue={entry?.advertising_return ?? 0}
            required
          />
          <FormError message={state.fieldErrors?.advertisingReturn} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="associationReturn" required>
            {dict.statistics.associationReturn}
          </FormLabel>
          <Input
            id="associationReturn"
            name="associationReturn"
            type="number"
            min={0}
            step="0.01"
            defaultValue={entry?.association_return ?? 0}
            required
          />
          <FormError message={state.fieldErrors?.associationReturn} />
        </FormItem>

        {/* the cut, drawn live */}
        <div className="sm:col-span-2">
          <p className="annot mb-2">{dict.statistics.livePreview}</p>
          <SectionBand
            animate={false}
            budgetLabel={dict.statistics.budget}
            budgetValue={formatNumber(budget)}
            spentLabel={dict.statistics.amountSpent}
            spentValue={formatNumber(spent)}
            remainingLabel={dict.statistics.remaining}
            remainingValue={formatNumber(Math.abs(remaining))}
            overrunLabel={dict.dashboard.overrun}
            budget={budget}
            spent={spent}
            percentText={`${formatPercent(spendPercentage(budget, spent))} ${dict.dashboard.spendReading}`}
          />
        </div>
      </FieldGroup>

      <FormItem>
        <FormLabel htmlFor="notes">
          {dict.common.notes} <span className="text-ink-3">({dict.common.optional})</span>
        </FormLabel>
        <Textarea id="notes" name="notes" defaultValue={entry?.notes ?? ""} rows={3} />
        <FormError message={state.fieldErrors?.notes} />
      </FormItem>

      <FormError message={state.error} />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending} pending={isPending}>
          {isPending ? dict.common.loading : dict.common.save}
        </Button>
      </div>
    </form>
  );
}
