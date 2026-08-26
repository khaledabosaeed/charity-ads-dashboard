-- Enums, shared trigger helper, and profiles table.

create extension if not exists "pgcrypto";

create type user_role as enum ('admin', 'media_buyer');

-- Shared updated_at trigger, reused by every table that has that column.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'media_buyer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is 'App-level user profile, 1:1 with auth.users. Role + active flag drive all authorization.';

create trigger profiles_set_updated_at
  before update on profiles
  for each row
  execute function set_updated_at();
