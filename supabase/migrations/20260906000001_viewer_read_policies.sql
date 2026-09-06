-- Reading rights for the viewer role.
--
-- The split is deliberate: `is_admin()` keeps guarding every write, so adding
-- the viewer to the select policies below is the whole grant. A viewer sees
-- what an admin sees — every association, platform and entry, regardless of
-- who authored it — and can change none of it.

create or replace function can_read_all()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('admin', 'viewer')
      and is_active = true
  );
$$;

-- profiles: a viewer reads every account, because the entry tables name their
-- author and the report filters list the media buyers.
drop policy if exists profiles_select on profiles;
create policy profiles_select on profiles
  for select using (can_read_all() or id = auth.uid());

drop policy if exists associations_select on associations;
create policy associations_select on associations
  for select using (can_read_all() or is_assigned_to_association(id));

drop policy if exists platforms_select on platforms;
create policy platforms_select on platforms
  for select using (
    can_read_all()
    or exists (
      select 1
      from association_platforms ap
      join association_media_buyers amb on amb.association_id = ap.association_id
      where ap.platform_id = platforms.id
        and amb.media_buyer_id = auth.uid()
    )
  );

drop policy if exists association_platforms_select on association_platforms;
create policy association_platforms_select on association_platforms
  for select using (can_read_all() or is_assigned_to_association(association_id));

drop policy if exists association_media_buyers_select on association_media_buyers;
create policy association_media_buyers_select on association_media_buyers
  for select using (can_read_all() or media_buyer_id = auth.uid());

drop policy if exists statistics_entries_select on statistics_entries;
create policy statistics_entries_select on statistics_entries
  for select using (can_read_all() or created_by = auth.uid());

drop policy if exists store_sales_entries_select on store_sales_entries;
create policy store_sales_entries_select on store_sales_entries
  for select using (can_read_all() or created_by = auth.uid());

-- The own-row delete policies stay keyed to authorship; a viewer authors
-- nothing, so they match no row.
