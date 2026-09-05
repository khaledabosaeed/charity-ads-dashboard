-- Leftover USD labels are the old column default, not dollar books.
-- Relabel them as SAR to match the operating currency.

alter table store_sales_entries
  alter column currency_code set default 'SAR';

update statistics_entries
  set currency_code = 'SAR'
  where currency_code = 'USD';

update store_sales_entries
  set currency_code = 'SAR'
  where currency_code = 'USD';
