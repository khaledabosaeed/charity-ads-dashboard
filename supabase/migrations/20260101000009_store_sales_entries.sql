-- Store sales entries: actual online-store performance, kept distinct from the
-- pixel-reported donation figures on statistics_entries. One row per
-- (association, media buyer, period) — no platform dimension, since store
-- sales aren't attributed to a single ad platform.

create table store_sales_entries (
  id uuid primary key default gen_random_uuid(),
  association_id uuid not null references associations(id),
  created_by uuid not null references profiles(id),
  period_start date not null,
  period_end date not null,
  currency_code char(3) not null default 'USD',
  order_count integer not null default 0,
  sales_value numeric(14, 2) not null default 0,
  visit_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint store_sales_entries_period_valid check (period_end >= period_start),
  constraint store_sales_entries_order_count_nonneg check (order_count >= 0),
  constraint store_sales_entries_sales_value_nonneg check (sales_value >= 0),
  constraint store_sales_entries_visit_count_nonneg check (visit_count >= 0),
  constraint store_sales_entries_currency_code_format check (currency_code ~ '^[A-Z]{3}$'),

  constraint store_sales_entries_unique_period
    unique (association_id, created_by, period_start, period_end)
);

create index idx_store_sales_entries_association on store_sales_entries(association_id);
create index idx_store_sales_entries_created_by on store_sales_entries(created_by);
create index idx_store_sales_entries_period on store_sales_entries(period_start, period_end);

create trigger store_sales_entries_set_updated_at
  before update on store_sales_entries
  for each row
  execute function set_updated_at();

-- The author must be an assigned media buyer for the association (or an admin).
-- No platform to check here, unlike statistics_entries.
create or replace function enforce_store_sales_entry_links()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  author_role user_role;
begin
  select role into author_role from profiles where id = new.created_by;

  if author_role is distinct from 'admin' and not exists (
    select 1 from association_media_buyers amb
    where amb.association_id = new.association_id
      and amb.media_buyer_id = new.created_by
  ) then
    raise exception 'MEDIA_BUYER_NOT_ASSIGNED: user % is not assigned to association %',
      new.created_by, new.association_id
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger store_sales_entries_enforce_links
  before insert or update on store_sales_entries
  for each row
  execute function enforce_store_sales_entry_links();
