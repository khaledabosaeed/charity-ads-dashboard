-- Run this AFTER creating the first user through Supabase Auth (dashboard
-- "Add user", or `supabase.auth.admin.createUser` from a one-off script) and
-- after they have a row in `profiles` (created automatically only via the
-- admin media-buyer creation flow in this app — for the very first user you
-- must insert it yourself, since no admin exists yet to use that flow).
--
-- Replace the email below and run against your project (SQL editor on
-- Supabase Cloud, or `psql` / `supabase db execute` locally). Matching is
-- case-insensitive: Supabase stores auth.users.email lower-cased, so an exact
-- `=` against a capitalised address silently inserts nothing.

-- 1) Ensure a profile row exists for the auth user (skip if already present):
insert into profiles (id, full_name, role, is_active)
select id, coalesce(raw_user_meta_data->>'full_name', email), 'admin', true
from auth.users
where lower(email) = lower('Cmarketer613@gmail.com')
on conflict (id) do update set role = 'admin', is_active = true;
