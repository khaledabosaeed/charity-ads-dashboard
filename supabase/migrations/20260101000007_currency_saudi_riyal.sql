-- The books are kept in Saudi riyals: the operating company, the associations
-- and every campaign budget are riyal-denominated. Only the unit an entry is
-- labelled with changes here — no figure is converted.

alter table statistics_entries
  alter column currency_code set default 'SAR';

-- Existing rows carry the old 'USD' default rather than a real dollar book.
-- Drop this statement before running the migration if any entry was genuinely
-- recorded in dollars, since it relabels rather than converts.
update statistics_entries
  set currency_code = 'SAR'
  where currency_code = 'USD';
