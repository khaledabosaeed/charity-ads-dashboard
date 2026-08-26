"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError, FormItem, FormLabel } from "@/components/forms/field";
import type { ActionState } from "../associations/actions";
import type { Association, Profile } from "@/types/domain";

export function MediaBuyerForm({
  profile,
  associations,
  selectedAssociationIds = [],
  action,
  showPassword,
}: {
  profile?: Profile;
  associations: Association[];
  selectedAssociationIds?: string[];
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  showPassword: boolean;
}) {
  const { dict } = useI18n();
  const [state, formAction, isPending] = useActionState(action, {});
  const [selected, setSelected] = useState(new Set(selectedAssociationIds));

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <FormItem>
        <FormLabel htmlFor="fullName" required>
          {dict.mediaBuyers.fullName}
        </FormLabel>
        <Input id="fullName" name="fullName" defaultValue={profile?.full_name} required />
        <FormError message={state.fieldErrors?.fullName} />
      </FormItem>

      {showPassword ? (
        <>
          <FormItem>
            <FormLabel htmlFor="email" required>
              {dict.mediaBuyers.email}
            </FormLabel>
            <Input id="email" name="email" type="email" required />
            <FormError message={state.fieldErrors?.email} />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="password" required>
              {dict.mediaBuyers.password}
            </FormLabel>
            <Input id="password" name="password" type="password" required minLength={8} />
            <FormError message={state.fieldErrors?.password} />
          </FormItem>
        </>
      ) : (
        <FormItem>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={profile?.is_active ?? true} />
            {dict.common.active}
          </label>
        </FormItem>
      )}

      <FormItem>
        <FormLabel>{dict.mediaBuyers.associationsAssigned}</FormLabel>
        <div className="flex flex-col gap-2 rounded-md border border-border p-3">
          {associations.length === 0 ? (
            <span className="text-sm text-muted-foreground">{dict.common.noData}</span>
          ) : (
            associations.map((a) => (
              <label key={a.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="associationIds"
                  value={a.id}
                  checked={selected.has(a.id)}
                  onChange={() => {
                    const next = new Set(selected);
                    if (next.has(a.id)) next.delete(a.id);
                    else next.add(a.id);
                    setSelected(next);
                  }}
                />
                {a.name}
              </label>
            ))
          )}
        </div>
      </FormItem>

      <FormError message={state.error} />
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? dict.common.loading : dict.common.save}
      </Button>
    </form>
  );
}
