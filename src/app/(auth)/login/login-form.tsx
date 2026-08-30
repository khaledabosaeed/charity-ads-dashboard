"use client";

import { useActionState } from "react";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/i18n";
import { loginAction, type LoginState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel } from "@/components/forms/field";

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
    <form action={formAction} className="flex flex-col gap-5">
      <FormItem>
        <FormLabel htmlFor="email" required>
          {dict.login.email}
        </FormLabel>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          required
          aria-invalid={errorMessage ? true : undefined}
        />
      </FormItem>

      <FormItem>
        <FormLabel htmlFor="password" required>
          {dict.login.password}
        </FormLabel>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          required
          aria-invalid={errorMessage ? true : undefined}
        />
      </FormItem>

      {/* The correction note: struck onto the sheet in the drawing's red. */}
      {errorMessage ? (
        <p
          role="alert"
          className="ink-in flex items-start gap-2 border border-alarm/40 bg-alarm-wash px-3 py-2.5 text-[0.8125rem] leading-snug text-alarm"
        >
          <AlertTriangle className="mt-px h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} pending={isPending} className="mt-1 w-full">
        {isPending ? dict.login.submitting : dict.login.submit}
      </Button>
    </form>
  );
}
