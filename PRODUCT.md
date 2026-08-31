# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two confirmed roles, both internal to the operating company:

- **Admin** — staff at مؤسسة الشرق الذكي التجارية who own the account structure. They create and edit associations (الجمعيات), media-buyer accounts, and ad platforms; link associations to platforms and to media buyers; read the audit log; and review consolidated performance across every association.
- **Media buyer (ميديا باير)** — the person actually running paid campaigns for one or more assigned charities. Their job is recurring data entry plus self-monitoring: after each reporting period they log budget, amount spent, donation count, donation value, advertising return, and association return for one association/platform pair, then read back whether the campaign is performing.

Both roles work in Arabic by default (RTL), with an English toggle. Desk work, office lighting, mostly desktop; mobile is a real but secondary access path for checking numbers.

## Product Purpose

A private back-office dashboard for tracking the performance of paid advertising campaigns run on behalf of charity organizations. It answers, per association / platform / period: how much budget was committed, how much was spent, what remains, how many donations came in and at what value, and what return the advertising and the association each earned. Success is that a media buyer can log a period in under a minute and that an admin can see the whole portfolio's spend-versus-return without exporting anything.

## Positioning

Not a generic ad-analytics tool. It is scoped to the charity-advertising relationship specifically: the unit of record is an association's campaign on a platform over a period, and it tracks the two-sided return (advertising return and the association's own return) that a generic ROAS dashboard has no concept of. Row-level security means a media buyer sees only the associations assigned to them, which is a permission model the business relationship requires, not a feature.

## Operating Context

- Routes: `/login`; the media buyer's four sheets `/entry`, `/daily`, `/platforms`, `/associations`; the admin's `/dashboard`, `/statistics` (+ `/statistics/new`, `/statistics/[id]/edit`), `/associations/[id]`, and `/admin/associations`, `/admin/users`, `/admin/platforms`, `/admin/audit-logs`. `/` sends each role to its own landing sheet.
- A media buyer's day is entered on `/entry` as one sheet per day: date + association, then spend and advertising return for every linked platform at once, saved in a single stroke. Each platform line is stored as an ordinary statistics entry whose period is that single day, so the day sheet and the full per-period form write the same record; re-saving a day corrects it rather than duplicating it.
- The dashboard is a filtered view (association, platform, date from/to) over the same statistics entries the statistics page lists, plus aggregate cards, a spend-versus-return time chart, and the ten latest entries.
- Entry is form-driven and repetitive: the same eight numeric fields per period.
- Every write is audit-logged; admins read that log.
- Account management is one screen, `/admin/users`: an admin creates either kind of account (admin or media buyer), changes any account's email and password, and assigns associations to media buyers only. Anyone signed in changes their own email and password at `/account`, where the current password is re-checked first. The last active admin cannot be demoted or disabled, and no admin can demote or disable themselves.
- Locale is cookie-persisted; `dir` flips between `rtl` and `ltr` at the `<html>` level, so every layout decision must be direction-agnostic (logical properties, not left/right).

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config`), Supabase (auth + Postgres + RLS), server actions for all mutations, `react-hook-form` + `zod`, `recharts` for charts, `sonner` for toasts, `lucide-react` for icons, Radix primitives under `src/components/ui`.
- Derived metrics live in `src/lib/calculations/statistics.ts`: remaining budget, spend percentage, ROAS, average donation. These are product truth and must not be recomputed inline in views.
- The books are kept in Saudi riyals: currency stays configurable (`NEXT_PUBLIC_DEFAULT_CURRENCY`, default `SAR`) and values are stored per entry with an ISO code, but the unit is read as ر.س in Arabic and SAR in English.
- Arabic is the default locale; all copy lives in `src/i18n/dictionaries/{ar,en}.ts` and both dictionaries must stay in sync with the `Dictionary` type.
- Confirmed decision: the app ships **both light and dark themes with an explicit user toggle** in the app chrome, persisted, rather than following the OS silently.
- Confirmed decision: the restyle covers the **whole app** — tokens, login, shell, dashboard, statistics, and admin screens.

## Brand Commitments

- The operating company is **مؤسسة الشرق الذكي التجارية**. Its logo — a stepped amber/gold tower rising above a green ground-swoosh, with the Arabic wordmark set beneath — is a binding asset and becomes the app's identity (confirmed by the user).
- Sampled brand colors from the supplied logo: amber `#E59731` (with `#ECAC5C` and `#F3CFA1` as lighter steps in the mark) and green `#55B583` / darker `#219A61`.
- Source asset supplied at low resolution as a JPEG with a white background; it must be reproduced cleanly (vector or transparent raster) rather than placed as-is over colored surfaces.
- The product name shown to users remains **لوحة إعلانات الجمعيات** / "Charity Ads Dashboard", read as the product line beneath the company mark.
- Arabic-first. Arabic is not a translation of the English here; the English is the secondary locale.

## Evidence on Hand

- Full working implementation in `src/`, including six Supabase migrations, RLS policies, seed data, and a Playwright auth spec.
- The company logo at `~/Downloads/WhatsApp Image 2026-08-29 at 12.54.41 PM.jpeg` (low-res JPEG, white matte).
- No real campaign data, no customer list, no pricing, no testimonials, and no performance benchmarks exist. Nothing of that kind may be invented in UI copy; sample figures shown in design work are synthetic and must be labeled as such.
- Four screenshots of the current UI were referenced in the request but did not arrive; the incumbent look is read from source code instead.

## Product Principles

1. **The number is the interface.** Every screen exists to get a figure in or a figure out. Decoration that competes with a numeral has failed.
2. **Arabic-first, direction-agnostic.** RTL is the default reading, and no layout may assume a side.
3. **Permission is visible.** A media buyer and an admin see genuinely different products; the interface should never imply access a role does not have.
4. **Repetition deserves speed.** Logging a period is a recurring chore — the entry path is optimized for the fifth time someone does it, not the first.
5. **Never invent a figure.** Empty is empty; the interface states absence rather than filling it.

## Accessibility & Inclusion

- Full RTL/LTR parity is a hard requirement.
- Both themes must hold WCAG AA contrast for text and for the numerals that carry the product's meaning; the brand amber is a light color and may not be used as small text on white.
- Form fields keep visible labels, required markers, and error text tied to the field.
