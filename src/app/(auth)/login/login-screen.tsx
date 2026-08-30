"use client";

import { useI18n } from "@/i18n";
import { Mark } from "@/components/brand/mark";
import { Stamp } from "@/components/brand/lockup";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LoginForm } from "./login-form";

/**
 * A vertical dimension ladder: a hairline with tick serifs, each tick naming one
 * of the quantities this product measures. It is the drawing's own furniture,
 * carrying real product terms rather than decoration.
 */
function DimensionLadder() {
  const { dict } = useI18n();
  const ticks = [
    dict.statistics.budget,
    dict.statistics.amountSpent,
    dict.statistics.remaining,
    dict.statistics.advertisingReturn,
  ];
  return (
    <div className="relative hidden ps-5 lg:block">
      <span className="absolute inset-y-1 start-0 w-px bg-rail-ink/25" aria-hidden="true" />
      <ul className="flex flex-col gap-5">
        {ticks.map((t) => (
          <li key={t} className="relative">
            <span
              className="absolute -start-5 top-1/2 h-px w-3 -translate-y-1/2 bg-rail-ink/40"
              aria-hidden="true"
            />
            <span className="annot text-rail-ink-2">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LoginScreen() {
  const { dict } = useI18n();

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] lg:grid-cols-[1.05fr_1fr] lg:grid-rows-1">
      {/* the amber field — colour owning a whole region */}
      <section className="rail relative isolate flex flex-col justify-between overflow-hidden bg-rail px-6 py-8 sm:px-10 lg:py-12">
        {/* the mark, blown up as the sheet's watermark and bled off the edge */}
        <Mark
          tower="var(--rail-ink)"
          ground="var(--rail-ink)"
          className="pointer-events-none absolute -bottom-10 -start-20 hidden h-80 w-80 opacity-[0.11] sm:block lg:-bottom-14 lg:-start-28 lg:h-[30rem] lg:w-[30rem]"
        />

        <div className="relative flex items-center gap-3">
          <Stamp size={44} />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold leading-tight text-rail-ink">
              مؤسسة الشرق الذكي التجارية
            </span>
            <span className="annot">{dict.appName}</span>
          </span>
        </div>

        <div className="relative mt-10 flex items-end gap-12 lg:mt-0 xl:gap-16">
          <div className="max-w-md">
            <p className="text-3xl font-semibold leading-[1.25] tracking-tight text-rail-ink sm:text-4xl lg:text-[2.75rem]">
              {dict.login.brandLine}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-rail-ink-2">
              {dict.login.brandSupport}
            </p>
          </div>
          <DimensionLadder />
        </div>

        {/* the datum: zero, everywhere — including here */}
        <div className="relative mt-10 lg:mt-12">
          <div className="rule-in h-0.5 w-full bg-datum" aria-hidden="true" />
          <p className="annot mt-2">0</p>
        </div>
      </section>

      {/* the paper — the sheet you sign in on */}
      <section className="board-grid relative flex items-center justify-center bg-paper px-4 py-12 sm:px-8">
        <div className="absolute end-3 top-3 flex items-center gap-1 sm:end-5 sm:top-5">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <div className="border border-line-2 bg-paper-raised">
            <div className="border-b border-line px-6 py-5">
              <h1 className="text-xl font-semibold tracking-tight text-ink">
                {dict.login.title}
              </h1>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-2">
                {dict.login.subtitle}
              </p>
            </div>
            <div className="px-6 py-6">
              <LoginForm />
            </div>
          </div>

          <p className="annot mt-4 text-center text-ink-3">{dict.login.tagline}</p>
        </div>
      </section>
    </div>
  );
}
