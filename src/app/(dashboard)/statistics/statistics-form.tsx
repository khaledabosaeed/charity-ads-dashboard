"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormError, FormItem, FormLabel } from "@/components/forms/field";
import { getDefaultCurrency } from "@/lib/env";
import type { AssociationOption } from "@/lib/data/statistics-options";
import type { StatisticsEntry } from "@/types/domain";
import type { ActionState } from "./actions";

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
  const [associationId, setAssociationId] = useState(entry?.association_id ?? associations[0]?.id ?? "");

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  const selectedAssociation = associations.find((a) => a.id === associationId);
  const platformOptions = selectedAssociation?.platforms ?? [];

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <input type="hidden" name="associationId" value={associationId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormItem>
          <FormLabel required>{dict.statistics.association}</FormLabel>
          <Select value={associationId} onValueChange={setAssociationId}>
            <SelectTrigger>
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {associations.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormError message={state.fieldErrors?.associationId} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="platformId" required>
            {dict.statistics.platform}
          </FormLabel>
          <select
            id="platformId"
            name="platformId"
            defaultValue={entry?.platform_id}
            className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
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
          </select>
          <FormError message={state.fieldErrors?.platformId} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="periodStart" required>
            {dict.statistics.periodStart}
          </FormLabel>
          <Input
            id="periodStart"
            name="periodStart"
            type="date"
            defaultValue={entry?.period_start}
            required
          />
          <FormError message={state.fieldErrors?.periodStart} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="periodEnd" required>
            {dict.statistics.periodEnd}
          </FormLabel>
          <Input id="periodEnd" name="periodEnd" type="date" defaultValue={entry?.period_end} required />
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
            className="uppercase"
            defaultValue={entry?.currency_code ?? getDefaultCurrency()}
            required
          />
          <FormError message={state.fieldErrors?.currencyCode} />
        </FormItem>

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
      </div>

      <FormItem>
        <FormLabel htmlFor="notes">
          {dict.common.notes} ({dict.common.optional})
        </FormLabel>
        <Textarea id="notes" name="notes" defaultValue={entry?.notes ?? ""} rows={3} />
        <FormError message={state.fieldErrors?.notes} />
      </FormItem>

      <FormError message={state.error} />
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? dict.common.loading : dict.common.save}
      </Button>
    </form>
  );
}
