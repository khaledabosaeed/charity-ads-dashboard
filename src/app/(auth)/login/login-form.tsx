"use client";

import { useActionState } from "react";
import { useI18n } from "@/i18n";
import { loginAction, type LoginState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError, FormItem, FormLabel } from "@/components/forms/field";

const initialState: LoginState = {};

export function LoginForm() {
  const { dict } = useI18n();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  const errorMessage =
    state.error === "account_disabled"
      ? dict.login.accountDisabled
      : state.error === "invalid_credentials"
        ? dict.login.invalidCredentials
        : state.error === "generic"
          ? dict.login.genericError
          : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormItem>
        <FormLabel htmlFor="email" required>
          {dict.login.email}
        </FormLabel>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </FormItem>
      <FormItem>
        <FormLabel htmlFor="password" required>
          {dict.login.password}
        </FormLabel>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </FormItem>
      <FormError message={errorMessage} />
      <Button type="submit" disabled={isPending} className="mt-2">
        {isPending ? dict.login.submitting : dict.login.submit}
      </Button>
    </form>
  );
}
