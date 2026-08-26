-- Row Level Security: enabled on every public table, no exceptions.

alter table profiles enable row level security;
alter table associations enable row level security;
alter table platforms enable row level security;
alter table association_platforms enable row level security;
alter table association_media_buyers enable row level security;
alter table statistics_entries enable row level security;
alter table audit_logs enable row level security;

-- profiles: admin full access; a user always sees their own row.
create policy profiles_select on profiles
  for select using (is_admin() or id = auth.uid());

create policy profiles_insert_admin on profiles
  for insert with check (is_admin());

create policy profiles_update_admin on profiles
  for update using (is_admin()) with check (is_admin());

create policy profiles_delete_admin on profiles
  for delete using (is_admin());

-- associations: admin full access; media buyer reads only assigned ones.
create policy associations_select on associations
  for select using (is_admin() or is_assigned_to_association(id));

create policy associations_insert_admin on associations
  for insert with check (is_admin());

create policy associations_update_admin on associations
  for update using (is_admin()) with check (is_admin());

create policy associations_delete_admin on associations
  for delete using (is_admin());

-- platforms: admin full access; media buyer reads platforms of their associations.
create policy platforms_select on platforms
  for select using (
    is_admin()
    or exists (
      select 1
      from association_platforms ap
      join association_media_buyers amb on amb.association_id = ap.association_id
      where ap.platform_id = platforms.id
        and amb.media_buyer_id = auth.uid()
    )
  );

create policy platforms_insert_admin on platforms
  for insert with check (is_admin());

create policy platforms_update_admin on platforms
  for update using (is_admin()) with check (is_admin());

create policy platforms_delete_admin on platforms
  for delete using (is_admin());

-- association_platforms: admin manages links; media buyer reads links for own associations.
create policy association_platforms_select on association_platforms
  for select using (is_admin() or is_assigned_to_association(association_id));

create policy association_platforms_insert_admin on association_platforms
  for insert with check (is_admin());

create policy association_platforms_update_admin on association_platforms
  for update using (is_admin()) with check (is_admin());

create policy association_platforms_delete_admin on association_platforms
  for delete using (is_admin());

-- association_media_buyers: admin manages links; media buyer sees their own assignments.
create policy association_media_buyers_select on association_media_buyers
  for select using (is_admin() or media_buyer_id = auth.uid());

create policy association_media_buyers_insert_admin on association_media_buyers
  for insert with check (is_admin());

create policy association_media_buyers_update_admin on association_media_buyers
  for update using (is_admin()) with check (is_admin());

create policy association_media_buyers_delete_admin on association_media_buyers
  for delete using (is_admin());

-- statistics_entries: admin full access; media buyer reads/creates/edits only
-- their own entries, and only while still linked to the association + platform.
create policy statistics_entries_select on statistics_entries
  for select using (is_admin() or created_by = auth.uid());

create policy statistics_entries_insert on statistics_entries
  for insert with check (
    is_admin()
    or (
      created_by = auth.uid()
      and is_assigned_to_association(association_id)
      and is_platform_linked(association_id, platform_id)
    )
  );

create policy statistics_entries_update on statistics_entries
  for update using (
    is_admin()
    or (created_by = auth.uid() and is_assigned_to_association(association_id))
  )
  with check (
    is_admin()
    or (
      created_by = auth.uid()
      and is_assigned_to_association(association_id)
      and is_platform_linked(association_id, platform_id)
    )
  );

-- Only admins may delete statistics entries (media buyer has no delete policy at all).
create policy statistics_entries_delete_admin on statistics_entries
  for delete using (is_admin());

-- audit_logs: admin read-only from the client; inserts happen only via the
-- SECURITY DEFINER trigger function, which bypasses RLS.
create policy audit_logs_select_admin on audit_logs
  for select using (is_admin());
