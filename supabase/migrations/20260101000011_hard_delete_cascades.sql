-- Makes hard delete of an association or user actually work.
--
-- Data that belongs to the thing being deleted cascades with it; a field
-- that only records who happened to create/assign an otherwise-unrelated
-- row is cleared instead, so deleting a person never silently deletes
-- something else they merely touched.

-- Owned data: cascades.
alter table statistics_entries drop constraint if exists statistics_entries_association_id_fkey;
alter table statistics_entries
  add constraint statistics_entries_association_id_fkey
  foreign key (association_id) references associations(id) on delete cascade;

alter table statistics_entries drop constraint if exists statistics_entries_created_by_fkey;
alter table statistics_entries
  add constraint statistics_entries_created_by_fkey
  foreign key (created_by) references profiles(id) on delete cascade;

alter table store_sales_entries drop constraint if exists store_sales_entries_association_id_fkey;
alter table store_sales_entries
  add constraint store_sales_entries_association_id_fkey
  foreign key (association_id) references associations(id) on delete cascade;

alter table store_sales_entries drop constraint if exists store_sales_entries_created_by_fkey;
alter table store_sales_entries
  add constraint store_sales_entries_created_by_fkey
  foreign key (created_by) references profiles(id) on delete cascade;

-- Attribution only: cleared, not cascaded.
alter table associations drop constraint if exists associations_created_by_fkey;
alter table associations
  add constraint associations_created_by_fkey
  foreign key (created_by) references profiles(id) on delete set null;

alter table association_media_buyers drop constraint if exists association_media_buyers_assigned_by_fkey;
alter table association_media_buyers
  add constraint association_media_buyers_assigned_by_fkey
  foreign key (assigned_by) references profiles(id) on delete set null;

alter table audit_logs drop constraint if exists audit_logs_actor_id_fkey;
alter table audit_logs
  add constraint audit_logs_actor_id_fkey
  foreign key (actor_id) references profiles(id) on delete set null;
