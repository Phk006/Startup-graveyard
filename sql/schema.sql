-- THE GRAVEYARD starter schema (Supabase PostgreSQL + PostGIS)
create extension if not exists postgis;
create extension if not exists pgcrypto;

do $$ begin
  create type public.failure_classification as enum ('formal_bankruptcy','insolvency','liquidation','shutdown','distressed_acquisition','restructuring','product_discontinuation','business_collapse','unknown');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.verification_status as enum ('unverified','needs_review','partially_verified','verified');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.location_precision as enum ('exact_address','neighbourhood','city_approximate','country_only','unknown');
exception when duplicate_object then null; end $$;

create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null,
  aliases text[] not null default '{}', description text, industry text, founded_date date,
  founded_year integer check (founded_year is null or founded_year between 1800 and 2026),
  failure_classification public.failure_classification not null default 'unknown',
  failure_event_date date, failure_summary text, failure_causes text[] not null default '{}',
  founders text[] not null default '{}', verification_status public.verification_status not null default 'unverified',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (failure_event_date is null or (failure_event_date >= date '2000-01-01' and failure_event_date <= date '2026-12-31'))
);

create table if not exists public.startup_locations (
  id uuid primary key default gen_random_uuid(), startup_id uuid not null references public.startups(id) on delete cascade,
  location_type text not null check (location_type in ('founding_office','original_operating_location','historical_headquarters','final_headquarters','registered_office','city_reference')),
  address text, neighbourhood text, city text, region text, country text,
  latitude double precision, longitude double precision, geom geography(point,4326),
  precision public.location_precision not null default 'unknown', coordinate_source_url text,
  geocoder_provider text, geocoder_result_id text, geocoded_at timestamptz, valid_from date, valid_to date,
  created_at timestamptz not null default now(),
  check (latitude is null or latitude between -90 and 90),
  check (longitude is null or longitude between -180 and 180),
  check ((latitude is null) = (longitude is null)),
  check (precision not in ('exact_address','neighbourhood','city_approximate') or latitude is not null)
);
create index if not exists startup_locations_geom_idx on public.startup_locations using gist (geom);
create index if not exists startups_failure_date_idx on public.startups (failure_event_date);
create index if not exists startups_industry_idx on public.startups (industry);

create or replace function public.sync_startup_location_geom()
returns trigger language plpgsql as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.geom := st_setsrid(st_makepoint(new.longitude,new.latitude),4326)::geography;
  else new.geom := null; end if;
  return new;
end; $$;
drop trigger if exists startup_location_geom_sync on public.startup_locations;
create trigger startup_location_geom_sync before insert or update of latitude,longitude
on public.startup_locations for each row execute function public.sync_startup_location_geom();

create table if not exists public.startup_events (
  id uuid primary key default gen_random_uuid(), startup_id uuid not null references public.startups(id) on delete cascade,
  event_type text not null, event_date date, announced_at date, title text not null, description text,
  verification_status public.verification_status not null default 'unverified', created_at timestamptz not null default now()
);
create index if not exists startup_events_company_date_idx on public.startup_events (startup_id,event_date);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(), startup_id uuid references public.startups(id) on delete cascade,
  source_title text, publisher text, source_url text not null, publication_date date,
  accessed_at timestamptz not null default now(), source_type text not null, supports text[] not null default '{}',
  unique (startup_id,source_url)
);

create table if not exists public.funding_rounds (
  id uuid primary key default gen_random_uuid(), startup_id uuid not null references public.startups(id) on delete cascade,
  round_type text, funding_date date, amount numeric, currency char(3), investors text[] not null default '{}',
  source_id uuid references public.sources(id) on delete set null, created_at timestamptz not null default now()
);

create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(), source_name text not null, started_at timestamptz not null default now(),
  completed_at timestamptz, candidates_discovered integer not null default 0, records_added integer not null default 0,
  records_updated integer not null default 0, duplicates_found integer not null default 0,
  errors jsonb not null default '[]'::jsonb, status text not null default 'running'
);

alter table public.startups enable row level security;
alter table public.startup_locations enable row level security;
alter table public.startup_events enable row level security;
alter table public.funding_rounds enable row level security;
alter table public.sources enable row level security;
alter table public.ingestion_runs enable row level security;

drop policy if exists "public can read verified startups" on public.startups;
create policy "public can read verified startups" on public.startups for select using (verification_status = 'verified');
drop policy if exists "public can read verified locations" on public.startup_locations;
create policy "public can read verified locations" on public.startup_locations for select using (exists (select 1 from public.startups s where s.id = startup_id and s.verification_status = 'verified'));
drop policy if exists "public can read verified events" on public.startup_events;
create policy "public can read verified events" on public.startup_events for select using (verification_status = 'verified' and exists (select 1 from public.startups s where s.id = startup_id and s.verification_status = 'verified'));
drop policy if exists "public can read sources for verified startups" on public.sources;
create policy "public can read sources for verified startups" on public.sources for select using (startup_id is not null and exists (select 1 from public.startups s where s.id = startup_id and s.verification_status = 'verified'));
-- No public insert/update/delete policies. Use trusted server-side admin operations.
