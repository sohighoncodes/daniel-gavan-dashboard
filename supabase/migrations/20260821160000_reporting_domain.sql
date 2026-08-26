create table if not exists public.consultants (
  id text primary key,
  full_name text not null,
  initials text not null,
  role text not null,
  revenue_target numeric not null default 0
);

create table if not exists public.companies (
  id text primary key,
  name text not null,
  owner_id text references public.consultants(id),
  annual_revenue numeric not null default 0,
  health_status text not null default 'Healthy',
  nps_score integer,
  services_live integer not null default 0,
  expansion_value numeric not null default 0,
  source_system text not null default 'hubspot'
);

create table if not exists public.contacts (
  id text primary key,
  company_id text not null references public.companies(id),
  owner_id text references public.consultants(id),
  first_name text not null,
  last_name text not null,
  title text,
  email text,
  last_activity_days integer not null default 0,
  source_system text not null default 'hubspot'
);

create table if not exists public.deal_stages (
  id text primary key,
  label text not null,
  probability integer not null,
  display_order integer not null
);

create table if not exists public.deals (
  id text primary key,
  company_id text not null references public.companies(id),
  contact_id text references public.contacts(id),
  stage_id text not null references public.deal_stages(id),
  value numeric not null,
  proposal_date date,
  expected_close_date date,
  close_date date,
  last_comms_date date,
  source text,
  deal_type text,
  status text not null,
  term text,
  loss_reason text,
  loss_review_done boolean,
  loss_reviewer text,
  loss_comments text,
  source_system text not null default 'hubspot'
);

create table if not exists public.deal_consultants (
  deal_id text not null references public.deals(id) on delete cascade,
  consultant_id text not null references public.consultants(id),
  primary key (deal_id, consultant_id)
);

create table if not exists public.projects (
  id text primary key,
  deal_id text not null references public.deals(id),
  project_name text not null,
  progress_pct integer not null,
  rag_status text not null,
  next_milestone text,
  lead_consultant_id text references public.consultants(id),
  start_date date,
  margin_pct numeric,
  source_system text not null default 'monday'
);

create table if not exists public.project_milestones (
  id bigserial primary key,
  project_id text not null references public.projects(id) on delete cascade,
  title text not null,
  due_label text not null,
  status text not null
);

create table if not exists public.invoices (
  id text primary key,
  company_id text references public.companies(id),
  consultant_id text references public.consultants(id),
  engagement text not null,
  amount numeric not null,
  issued_date date,
  due_date date,
  status text not null,
  timing_label text,
  source_system text not null default 'myob'
);

create table if not exists public.job_change_alerts (
  id bigserial primary key,
  contact_name text not null,
  previous_company text,
  previous_role text,
  new_company text,
  new_role text,
  source_system text not null default 'keep'
);

create table if not exists public.dashboard_seed_notes (
  id bigserial primary key,
  note_key text not null unique,
  note text not null
);

alter table public.consultants enable row level security;
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.deal_stages enable row level security;
alter table public.deals enable row level security;
alter table public.deal_consultants enable row level security;
alter table public.projects enable row level security;
alter table public.project_milestones enable row level security;
alter table public.invoices enable row level security;
alter table public.job_change_alerts enable row level security;
alter table public.dashboard_seed_notes enable row level security;

create policy "Authenticated reporting read consultants" on public.consultants for select to authenticated using (true);
create policy "Authenticated reporting read companies" on public.companies for select to authenticated using (true);
create policy "Authenticated reporting read contacts" on public.contacts for select to authenticated using (true);
create policy "Authenticated reporting read deal stages" on public.deal_stages for select to authenticated using (true);
create policy "Authenticated reporting read deals" on public.deals for select to authenticated using (true);
create policy "Authenticated reporting read deal consultants" on public.deal_consultants for select to authenticated using (true);
create policy "Authenticated reporting read projects" on public.projects for select to authenticated using (true);
create policy "Authenticated reporting read milestones" on public.project_milestones for select to authenticated using (true);
create policy "Authenticated reporting read invoices" on public.invoices for select to authenticated using (true);
create policy "Authenticated reporting read job changes" on public.job_change_alerts for select to authenticated using (true);
create policy "Authenticated reporting read seed notes" on public.dashboard_seed_notes for select to authenticated using (true);

