-- The dashboard app connects with the public/anon key (no login flow), which
-- Postgres sees as the `anon` role. The original policies only granted
-- `authenticated`, so every read silently returned zero rows. Widen the same
-- read-only policies to also cover `anon`.

alter policy "Allow authenticated dashboard reads on integration sources" on public.integration_sources to anon, authenticated;
alter policy "Allow authenticated dashboard reads on sync runs" on public.sync_runs to anon, authenticated;
alter policy "Allow authenticated dashboard reads on metrics" on public.dashboard_metrics to anon, authenticated;

alter policy "Authenticated reporting read consultants" on public.consultants to anon, authenticated;
alter policy "Authenticated reporting read companies" on public.companies to anon, authenticated;
alter policy "Authenticated reporting read contacts" on public.contacts to anon, authenticated;
alter policy "Authenticated reporting read deal stages" on public.deal_stages to anon, authenticated;
alter policy "Authenticated reporting read deals" on public.deals to anon, authenticated;
alter policy "Authenticated reporting read deal consultants" on public.deal_consultants to anon, authenticated;
alter policy "Authenticated reporting read projects" on public.projects to anon, authenticated;
alter policy "Authenticated reporting read milestones" on public.project_milestones to anon, authenticated;
alter policy "Authenticated reporting read invoices" on public.invoices to anon, authenticated;
alter policy "Authenticated reporting read job changes" on public.job_change_alerts to anon, authenticated;
alter policy "Authenticated reporting read seed notes" on public.dashboard_seed_notes to anon, authenticated;
