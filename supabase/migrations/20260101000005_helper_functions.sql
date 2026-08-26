-- Security-definer helpers used by RLS policies. SECURITY DEFINER + a fixed
-- search_path avoids RLS recursion when these read `profiles`.

create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

create or replace function is_active_user()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and is_active = true
  );
$$;

create or replace function is_assigned_to_association(association_uuid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from association_media_buyers
    where association_id = association_uuid
      and media_buyer_id = auth.uid()
  );
$$;

create or replace function is_platform_linked(association_uuid uuid, platform_uuid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from association_platforms
    where association_id = association_uuid
      and platform_id = platform_uuid
  );
$$;
