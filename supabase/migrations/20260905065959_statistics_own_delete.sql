-- Media buyers may delete the rows they themselves filed. Admin delete
-- policies from 0006 / 0010 stay in place for everyone else's rows.

create policy statistics_entries_delete_own on statistics_entries
  for delete using (created_by = auth.uid());

create policy store_sales_entries_delete_own on store_sales_entries
  for delete using (created_by = auth.uid());
