create extension if not exists pgcrypto;

create table if not exists public.integration_sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  status text not null default 'planned',
  auth_type text not null default 'oauth2',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.integration_sources(id) on delete cascade,
  status text not null default 'queued',
  started_at timestamptz,
  finished_at timestamptz,
  records_read integer not null default 0,
  records_written integer not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.source_records (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.integration_sources(id) on delete cascade,
  external_id text not null,
  record_type text not null,
  payload jsonb not null,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, record_type, external_id)
);

create table if not exists public.dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null unique,
  label text not null,
  value numeric not null default 0,
  unit text not null default 'count',
  source_slug text,
  calculated_at timestamptz not null default now()
);

alter table public.integration_sources enable row level security;
alter table public.sync_runs enable row level security;
alter table public.source_records enable row level security;
alter table public.dashboard_metrics enable row level security;

create policy "Allow authenticated dashboard reads on integration sources"
  on public.integration_sources for select
  to authenticated
  using (true);

create policy "Allow authenticated dashboard reads on sync runs"
  on public.sync_runs for select
  to authenticated
  using (true);

create policy "Allow authenticated dashboard reads on metrics"
  on public.dashboard_metrics for select
  to authenticated
  using (true);

insert into public.integration_sources (slug, display_name, status, auth_type)
values
  ('hubspot', 'HubSpot', 'ready_for_credentials', 'private_app_or_oauth2'),
  ('myob', 'MYOB', 'ready_for_oauth', 'oauth2'),
  ('keap', 'Keap', 'ready_for_oauth', 'oauth2'),
  ('monday', 'Monday', 'ready_for_api_token', 'api_token_or_oauth2')
on conflict (slug) do update
set
  display_name = excluded.display_name,
  status = excluded.status,
  auth_type = excluded.auth_type,
  updated_at = now();
