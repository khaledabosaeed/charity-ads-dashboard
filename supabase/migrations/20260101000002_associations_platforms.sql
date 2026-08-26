-- Associations (charities), ad platforms, and the two link tables.

create table associations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  description text,
  is_active boolean not null default true,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger associations_set_updated_at
  before update on associations
  for each row
  execute function set_updated_at();

create table platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table association_platforms (
  association_id uuid not null references associations(id) on delete cascade,
  platform_id uuid not null references platforms(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (association_id, platform_id)
);

create table association_media_buyers (
  association_id uuid not null references associations(id) on delete cascade,
  media_buyer_id uuid not null references profiles(id) on delete cascade,
  assigned_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  primary key (association_id, media_buyer_id)
);

create index idx_association_platforms_platform on association_platforms(platform_id);
create index idx_association_media_buyers_media_buyer on association_media_buyers(media_buyer_id);
