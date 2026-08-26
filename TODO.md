# TODO — Charity Ads Dashboard MVP

1. [x] Inspect project, versions, write plan.
2. [x] Supabase clients (browser/server/admin), env validation, middleware.
3. [x] Migrations + seed + RLS policies.
4. [x] Hand-written database types.
5. [x] Auth (login) + route protection helpers.
6. [x] Admin: associations, platforms, media buyers, linking.
7. [x] Statistics: validations, calculations, CRUD pages/actions.
8. [x] Dashboard: aggregates, filters, chart.
9. [x] Audit log page.
10. [x] Tests (vitest unit + playwright e2e specs — e2e not run, see README).
11. [x] Lint, typecheck, test, build — all pass.
12. [x] README with setup, first-admin, decisions/open items.

Note: Docker/Supabase local runtime unavailable in this sandbox — migrations/types are hand-authored;
the user must run `supabase start && supabase db reset && supabase gen types ...` and the Playwright/
RLS-live tests themselves. See README "Setup" and "Known limitations" sections.
