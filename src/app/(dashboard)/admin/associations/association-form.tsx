"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError, FormItem, FormLabel } from "@/components/forms/field";
import type { ActionState } from "./actions";
import type { Association } from "@/types/domain";

export function AssociationForm({
  association,
  action,
}: {
  association?: Association;
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const { dict } = useI18n();
  const [state, formAction, isPending] = useActionState(action, {});

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <FormItem>
        <FormLabel htmlFor="name" required>
          {dict.associations.name}
        </FormLabel>
        <Input id="name" name="name" defaultValue={association?.name} required />
        <FormError message={state.fieldErrors?.name} />
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="code">{dict.associations.code}</FormLabel>
        <Input id="code" name="code" defaultValue={association?.code ?? ""} />
        <FormError message={state.fieldErrors?.code} />
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="description">{dict.associations.description}</FormLabel>
        <Textarea id="description" name="description" defaultValue={association?.description ?? ""} />
        <FormError message={state.fieldErrors?.description} />
      </FormItem>
      <FormError message={state.error} />
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? dict.common.loading : dict.common.save}
      </Button>
    </form>
  );
}
