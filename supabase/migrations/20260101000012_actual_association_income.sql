-- The association's actual real income for the day — one value per
-- (association, media buyer, period), same shape as the store-sales figures
-- already on this table, and distinct from the per-platform association_return
-- on statistics_entries (that one is entered once per platform; this one is
-- entered once for the whole day).

alter table store_sales_entries
  add column actual_income numeric(14, 2) not null default 0;

alter table store_sales_entries
  add constraint store_sales_entries_actual_income_nonneg check (actual_income >= 0);
