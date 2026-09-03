-- Row Level Security for store_sales_entries, mirroring statistics_entries:
-- admin full access; media buyer reads/creates/edits only their own rows
-- while still assigned to the association; delete is admin-only.

alter table store_sales_entries enable row level security;

create policy store_sales_entries_select on store_sales_entries
  for select using (is_admin() or created_by = auth.uid());

create policy store_sales_entries_insert on store_sales_entries
  for insert with check (
    is_admin()
    or (created_by = auth.uid() and is_assigned_to_association(association_id))
  );

create policy store_sales_entries_update on store_sales_entries
  for update using (
    is_admin()
    or (created_by = auth.uid() and is_assigned_to_association(association_id))
  )
  with check (
    is_admin()
    or (created_by = auth.uid() and is_assigned_to_association(association_id))
  );

create policy store_sales_entries_delete_admin on store_sales_entries
  for delete using (is_admin());
