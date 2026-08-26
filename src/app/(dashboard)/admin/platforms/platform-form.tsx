"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError, FormItem, FormLabel } from "@/components/forms/field";
import { createPlatform } from "./actions";

export function PlatformForm() {
  const { dict } = useI18n();
  const [state, formAction, isPending] = useActionState(createPlatform, {});

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <Card className="max-w-lg">
      <CardContent className="pt-4">
        <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <FormItem className="flex-1">
            <FormLabel htmlFor="name" required>
              {dict.platforms.name}
            </FormLabel>
            <Input id="name" name="name" required />
            <FormError message={state.fieldErrors?.name} />
          </FormItem>
          <FormItem className="flex-1">
            <FormLabel htmlFor="slug" required>
              {dict.platforms.slug}
            </FormLabel>
            <Input id="slug" name="slug" placeholder="my-platform" required />
            <FormError message={state.fieldErrors?.slug} />
          </FormItem>
          <Button type="submit" disabled={isPending}>
            {dict.platforms.new}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
