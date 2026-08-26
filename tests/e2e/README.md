# E2E tests (Playwright)

These specs need a running app connected to a live Supabase instance — they
cannot run in an environment without Docker/Supabase (see project README).

## Setup before running

1. `npx supabase start && npx supabase db reset` (applies migrations + seed).
2. Create two test users and set env vars the specs read:
   - An admin: run the bootstrap steps in the README, then
     `TEST_ADMIN_EMAIL` / `TEST_ADMIN_PASSWORD`.
   - A media buyer: create via the admin UI (or `auth.admin.createUser` +
     a `profiles` row with `role='media_buyer'`), then
     `TEST_MEDIA_BUYER_EMAIL` / `TEST_MEDIA_BUYER_PASSWORD`.
3. `npm run dev` in one terminal.
4. `npm run test:e2e` in another.
