-- Order count: a raw per-entry input, tracked alongside donation_count.

alter table statistics_entries
  add column order_count integer not null default 0;

alter table statistics_entries
  add constraint statistics_entries_order_count_nonneg check (order_count >= 0);
