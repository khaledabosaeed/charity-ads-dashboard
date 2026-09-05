-- Correcting migration 20260101000012: the single day-level manual figure is
-- "عائد الجمعية" (association return), not a separate "actual income" concept.

alter table store_sales_entries rename column actual_income to association_return;
alter table store_sales_entries
  rename constraint store_sales_entries_actual_income_nonneg
  to store_sales_entries_association_return_nonneg;
