-- Statistics entries: one row per (association, platform, media buyer, period).

create table statistics_entries (
  id uuid primary key default gen_random_uuid(),
  association_id uuid not null references associations(id),
  platform_id uuid not null references platforms(id),
  created_by uuid not null references profiles(id),
  period_start date not null,
  period_end date not null,
  currency_code char(3) not null default 'USD',
  budget numeric(14, 2) not null default 0,
  amount_spent numeric(14, 2) not null default 0,
  donation_count integer not null default 0,
  donation_value numeric(14, 2) not null default 0,
  advertising_return numeric(14, 2) not null default 0,
  association_return numeric(14, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint statistics_entries_period_valid check (period_end >= period_start),
  constraint statistics_entries_budget_nonneg check (budget >= 0),
  constraint statistics_entries_amount_spent_nonneg check (amount_spent >= 0),
  constraint statistics_entries_donation_count_nonneg check (donation_count >= 0),
  constraint statistics_entries_donation_value_nonneg check (donation_value >= 0),
  constraint statistics_entries_advertising_return_nonneg check (advertising_return >= 0),
  constraint statistics_entries_association_return_nonneg check (association_return >= 0),
  constraint statistics_entries_currency_code_format check (currency_code ~ '^[A-Z]{3}$'),

  constraint statistics_entries_unique_period
    unique (association_id, platform_id, created_by, period_start, period_end)
);

create index idx_statistics_entries_association on statistics_entries(association_id);
create index idx_statistics_entries_platform on statistics_entries(platform_id);
create index idx_statistics_entries_created_by on statistics_entries(created_by);
create index idx_statistics_entries_period on statistics_entries(period_start, period_end);

create trigger statistics_entries_set_updated_at
  before update on statistics_entries
  for each row
  execute function set_updated_at();

-- Cross-table integrity that a plain CHECK cannot express: the chosen
-- platform must be enabled for the chosen association, and the author must
-- be an assigned media buyer for that association (or an admin).
create or replace function enforce_statistics_entry_links()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  author_role user_role;
begin
  if not exists (
    select 1 from association_platforms ap
    where ap.association_id = new.association_id
      and ap.platform_id = new.platform_id
  ) then
    raise exception 'PLATFORM_NOT_LINKED: platform % is not enabled for association %',
      new.platform_id, new.association_id
      using errcode = '23514';
  end if;

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

create trigger statistics_entries_enforce_links
  before insert or update on statistics_entries
  for each row
  execute function enforce_statistics_entry_links();
