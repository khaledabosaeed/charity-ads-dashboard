-- Run this AFTER creating the first user through Supabase Auth (dashboard
-- "Add user", or `supabase.auth.admin.createUser` from a one-off script) and
-- after they have a row in `profiles` (created automatically only via the
-- admin media-buyer creation flow in this app — for the very first user you
-- must insert it yourself, since no admin exists yet to use that flow).
--
-- Replace the email below and run against your project (SQL editor on
-- Supabase Cloud, or `psql` / `supabase db execute` locally).

-- 1) Ensure a profile row exists for the auth user (skip if already present):
insert into profiles (id, full_name, role, is_active)
select id, coalesce(raw_user_meta_data->>'full_name', email), 'admin', true
from auth.users
where email = 'REPLACE_WITH_FIRST_ADMIN_EMAIL@example.com'
on conflict (id) do update set role = 'admin', is_active = true;
