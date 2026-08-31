# لوحة إعلانات الجمعيات | Charity Ads Dashboard

لوحة تحكم عربية (RTL) لإدارة الجمعيات والميديا باير والإحصائيات الإعلانية، مبنية بـ Next.js App
Router وSupabase (Postgres + Auth + RLS). / An Arabic (RTL) admin dashboard for managing
charities, media buyers, and ad statistics, built on Next.js App Router and Supabase.

## Stack

Next.js 16 (App Router, TypeScript), Supabase (Postgres, Auth, RLS), Tailwind CSS v4, hand-built
shadcn/ui-style components (+ a few Radix primitives for accessible dialog/dropdown/select/tabs),
Zod, React Hook Form, Recharts, `@tanstack/react-table` (installed, available for future table
upgrades), Vitest + Testing Library, Playwright.

## 1. Setup

### 1.1 Create/link a Supabase project

- Cloud: create a project at supabase.com, or
- Local: `npx supabase start` (requires Docker).

### 1.2 Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # or NEXT_PUBLIC_SUPABASE_ANON_KEY on older projects
SUPABASE_SERVICE_ROLE_KEY=              # server-only, never exposed to the browser
NEXT_PUBLIC_APP_NAME=لوحة إعلانات الجمعيات
NEXT_PUBLIC_DEFAULT_CURRENCY=SAR
```

`src/lib/env.ts` throws a clear error naming the missing variable the first time any code path
needs it — nothing fails silently.

### 1.3 Apply migrations + seed

```bash
npx supabase start          # local Postgres via Docker
npx supabase db reset       # applies supabase/migrations/*.sql, then supabase/seed.sql
```

Against a cloud project instead: `npx supabase link` then `npx supabase db push`, and run
`supabase/seed.sql` once via the SQL editor.

### 1.4 Generate types (optional, replaces the hand-written ones)

```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```

`src/types/database.types.ts` is hand-authored to exactly match the migrations and to the shape
`gen types` produces, so this command is a safe drop-in replacement once you have a live instance.

### 1.5 Create the first admin

No admin exists yet, so nothing can use the in-app "create media buyer" flow to make one. Steps:

1. Create the user in Supabase Auth (Dashboard → Authentication → Add user, or
   `supabase.auth.admin.createUser` from a one-off script) with an email + password.
2. Run `supabase/make_first_admin.sql` against your project (replace the placeholder email first)
   — it inserts/updates their `profiles` row with `role = 'admin'`.
3. Log in at `/login` with that email/password.

### 1.6 Run the app

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`.

## 2. Tests

```bash
npm run test         # vitest unit/component tests
npm run test:watch   # watch mode
npm run test:e2e     # playwright — see "Known limitations" below
```

## 3. Verification commands

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

All four were run and passing as of this build (see the delivery summary in the PR/commit
message for exact output). `npm run test:e2e` and the RLS checks in `tests/rls/README.md` require
a live Supabase instance and were **not** run here — see below.

## 4. Known limitations / what still needs a live Supabase instance

This build sandbox has no Docker, so `supabase start`, `supabase db reset`, and
`supabase gen types` could not actually be executed here. As a result:

- **Migrations and RLS policies are hand-written and never applied to a real database in this
  session.** They follow the spec closely and are internally consistent (checked by re-reading),
  but only a real `supabase db reset` run will prove they apply cleanly.
- **`src/types/database.types.ts` is hand-written**, not generated. Structured to match
  `gen types` output 1:1; re-generating from a live instance is a safe drop-in.
- **Playwright specs (`tests/e2e/`) and the RLS checks (`tests/rls/`) are written but not run.**
  They document exactly what to verify and how; run them yourself after step 1.3 and 1.5 above.
- **`unrs-resolver`** flagged a pending install script during `npm install`
  (`npm warn allow-scripts`) — not run, since it wasn't required for this build to succeed; review
  before approving if you use `npm approve-scripts`.

## 5. Decisions taken for this MVP (documented per spec §16, "اختر أبسط قرار مناسب")

- **i18n**: no i18n library — a small custom dictionary (`src/i18n/dictionaries/{ar,en}.ts`) +
  React context + a `locale` cookie, toggled from the topbar. Arabic is the default and drives
  `dir="rtl"`; English is a secondary locale, not a route segment.
- **shadcn/ui**: the interactive `npx shadcn add` CLI can't run in this environment, so the small
  set of needed primitives (`src/components/ui/*`) is hand-written in the same file
  shape/conventions shadcn generates, using Tailwind + a few Radix primitives (dialog,
  dropdown-menu, select, tabs, label) for accessibility. No extra runtime deps beyond those.
- **Data tables**: `@tanstack/react-table` is installed per spec but the MVP tables are plain
  server-rendered HTML tables with server-side filters (search params) to keep the surface area
  small and the risk low within the build window. Swapping in tanstack for client-side
  sort/paginate is a follow-up, not a blocker.
- **Cross-table validation (platform-belongs-to-association, media-buyer-assigned-to-association)**
  is enforced by a `BEFORE INSERT OR UPDATE` trigger on `statistics_entries`
  (`enforce_statistics_entry_links`) in addition to Zod and RLS — a plain `CHECK` constraint can't
  reference other tables, so this is the closest DB-level equivalent, satisfying "نفّذ التحقق
  مرتين" in spirit (validated in three places: Zod, RLS `WITH CHECK`, and this trigger).
- **Email confirmation** for media-buyer accounts created by admins: set `email_confirm: true` on
  creation (`src/app/(dashboard)/admin/media-buyers/actions.ts`) so they can log in immediately
  without a confirmation email step — simplest MVP choice, since admins are creating these
  accounts directly and vouching for the email.
- **Password reset flow**: out of scope for this MVP (not requested); admins can deactivate an
  account but there's no self-service "forgot password" page yet.

## 6. Project structure

```text
src/
  app/
    (auth)/login/                 # public login page + server actions
    (dashboard)/                  # gated by requireActiveUser() in layout.tsx
      dashboard/                  # aggregated cards + chart + latest entries
      statistics/                 # list/new/edit, RLS-scoped
      associations/[id]/          # shared association detail page
      admin/                      # gated again by requireAdmin() in layout.tsx
        associations/ media-buyers/ platforms/ audit-logs/
    forbidden/                    # permission-error page
  components/
    ui/                           # hand-built shadcn-style primitives
    layout/                       # sidebar, topbar, page heading, empty state
    forms/                        # shared form field helpers
  lib/
    supabase/{browser,server,admin,middleware}.ts
    auth/session.ts                # getCurrentProfile/requireActiveUser/requireAdmin
    permissions/                   # re-exports auth/session for the spec's suggested path
    validations/                   # Zod schemas (statistics, associations, media buyers)
    calculations/                  # remainingBudget/spendPercentage/roas/avgDonationValue
    data/statistics-options.ts     # RLS-scoped association+platform options for forms
  i18n/                            # dictionary-based ar/en
  types/                           # database.types.ts (hand-written) + domain.ts
supabase/
  migrations/                      # 0001-0006, applied in order
  seed.sql                         # 3 starter platforms
  make_first_admin.sql             # first-admin bootstrap
tests/
  e2e/                             # Playwright specs (need a live instance, see tests/e2e/README.md)
  rls/                             # RLS verification checklist (needs a live instance)
```

## 7. Open items for the project owner

- Real Supabase project credentials for staging/production.
- Whether media-buyer accounts should require email confirmation before first login (currently
  auto-confirmed by the admin-creation flow — see §5).
- Whether a self-service password reset page is needed before this ships to real media buyers.
- Running `supabase db reset` + `npx playwright test` + the RLS checklist against a real instance
  before considering this production-ready — this was not possible in the build sandbox.
