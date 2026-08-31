"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError, FormItem, FormLabel } from "@/components/forms/field";
import { RuledHeading } from "@/components/drawing";
import { updateAccount, type AccountState } from "./actions";
import type { UserRole } from "@/types/database.types";

/** Your own plate on the title block: the address you sign in with, and the key. */
export function AccountForm({
  email,
  name,
  role,
}: {
  email: string;
  name: string;
  role: UserRole;
}) {
  const { dict } = useI18n();
  const [state, formAction, isPending] = useActionState<AccountState, FormData>(updateAccount, {});
  const announced = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    else if (state.at && state.at !== announced.current) {
      announced.current = state.at;
      toast.success(state.emailPending ? dict.users.emailPending : dict.common.savedSuccessfully);
    }
  }, [state, dict]);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-6">
      <div className="border border-line bg-paper-raised px-4 py-3 sm:px-5">
        <p className="text-[0.9375rem] font-semibold text-ink">{name}</p>
        <p className="annot mt-0.5">
          {role === "admin" ? dict.nav.roleAdmin : dict.nav.roleMediaBuyer}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <RuledHeading>{dict.users.credentials}</RuledHeading>

        <FormItem>
          <FormLabel htmlFor="email">{dict.users.email}</FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="username"
            defaultValue={email}
          />
          <FormError message={state.fieldErrors?.email} />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="password">{dict.users.newPassword}</FormLabel>
          <Input
            id="password"
            name="password"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            minLength={8}
          />
          <FormError message={state.fieldErrors?.password} />
          <p className="annot">{dict.users.blankKeeps}</p>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="currentPassword" required>
            {dict.users.currentPassword}
          </FormLabel>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            dir="ltr"
            autoComplete="current-password"
            required
          />
          <FormError message={state.fieldErrors?.currentPassword} />
        </FormItem>
      </div>

      <FormError message={state.error} />
      <Button type="submit" disabled={isPending} pending={isPending} className="w-fit">
        {isPending ? dict.common.loading : dict.common.save}
      </Button>
    </form>
  );
}
