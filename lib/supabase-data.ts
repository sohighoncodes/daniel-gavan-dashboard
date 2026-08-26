import { supabase } from "./supabase-client";
import { companies, consultants, contacts, deals, invoices, jobChanges, milestones, projects, type Deal, type Invoice } from "./mock-data";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(value: string | null): string {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}

function replaceAll<T>(target: T[], next: T[]) {
  target.length = 0;
  target.push(...next);
}

// Fetches the reporting tables from Supabase and, if every table returns data,
// overwrites the mock-data arrays in place so the whole dashboard (which reads
// those module-level arrays directly) switches to live data on the next render.
export async function loadFromSupabase(): Promise<boolean> {
  if (!supabase) {
    console.warn("[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY missing — client was never created.");
    return false;
  }

  const [
    consultantsRes, companiesRes, contactsRes,
    dealsRes, dealConsultantsRes,
    projectsRes, milestonesRes, invoicesRes, jobChangesRes
  ] = await Promise.all([
    supabase.from("consultants").select("*"),
    supabase.from("companies").select("*"),
    supabase.from("contacts").select("*"),
    supabase.from("deals").select("*"),
    supabase.from("deal_consultants").select("*"),
    supabase.from("projects").select("*"),
    supabase.from("project_milestones").select("*"),
    supabase.from("invoices").select("*"),
    supabase.from("job_change_alerts").select("*")
  ]);

  const named = [
    ["consultants", consultantsRes], ["companies", companiesRes], ["contacts", contactsRes],
    ["deals", dealsRes], ["deal_consultants", dealConsultantsRes],
    ["projects", projectsRes], ["project_milestones", milestonesRes], ["invoices", invoicesRes], ["job_change_alerts", jobChangesRes]
  ] as const;

  for (const [name, res] of named) {
    if (res.error) console.error(`[supabase] ${name} fetch failed:`, res.error.message);
    else console.info(`[supabase] ${name}: ${res.data?.length ?? 0} rows`);
  }

  if (named.some(([, res]) => res.error) || !dealsRes.data?.length) return false;

  const consultantsByDeal = new Map<string, string[]>();
  for (const row of dealConsultantsRes.data ?? []) {
    const list = consultantsByDeal.get(row.deal_id) ?? [];
    list.push(row.consultant_id);
    consultantsByDeal.set(row.deal_id, list);
  }

  replaceAll(consultants, (consultantsRes.data ?? []).map((row) => ({
    id: row.id,
    name: row.full_name,
    initials: row.initials,
    role: row.role,
    target: row.revenue_target
  })));

  replaceAll(companies, (companiesRes.data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    owner: row.owner_id,
    annualRevenue: row.annual_revenue,
    health: row.health_status,
    nps: row.nps_score,
    servicesLive: row.services_live,
    expansion: row.expansion_value
  })));

  replaceAll(contacts, (contactsRes.data ?? []).map((row) => ({
    id: row.id,
    company: row.company_id,
    first: row.first_name,
    last: row.last_name,
    title: row.title,
    email: row.email,
    owner: row.owner_id,
    lastActivityDays: row.last_activity_days
  })));

  replaceAll(deals, (dealsRes.data ?? []).map((row): Deal => {
    const proposalDate = fmtDate(row.proposal_date);
    return {
      id: row.id,
      company: row.company_id,
      contact: row.contact_id ?? "",
      stage: row.stage_id,
      value: row.value,
      proposalDate,
      expectedClose: fmtDate(row.expected_close_date),
      closeDate: fmtDate(row.close_date),
      lastComms: fmtDate(row.last_comms_date),
      consultants: consultantsByDeal.get(row.id) ?? [],
      source: row.source ?? "",
      type: row.deal_type ?? "",
      created: proposalDate || fmtDate(row.expected_close_date) || fmtDate(row.last_comms_date),
      status: row.status,
      term: row.term ?? undefined,
      lossReason: row.loss_reason ?? undefined,
      reviewDone: row.loss_review_done ?? undefined,
      reviewer: row.loss_reviewer ?? undefined,
      comments: row.loss_comments ?? undefined
    };
  }));

  replaceAll(projects, (projectsRes.data ?? []).map((row) => ({
    id: row.id,
    deal: row.deal_id,
    name: row.project_name,
    progress: row.progress_pct,
    rag: row.rag_status,
    next: row.next_milestone,
    lead: row.lead_consultant_id,
    start: fmtDate(row.start_date),
    margin: row.margin_pct
  })));

  replaceAll(milestones, (milestonesRes.data ?? []).map((row) => ({
    project: row.project_id,
    title: row.title,
    due: row.due_label,
    status: row.status
  })));

  replaceAll(invoices, (invoicesRes.data ?? []).map((row): Invoice => ({
    id: row.id,
    company: row.company_id,
    consultant: row.consultant_id,
    engagement: row.engagement,
    amount: row.amount,
    issued: fmtDate(row.issued_date),
    due: fmtDate(row.due_date),
    status: row.status,
    timing: row.timing_label ?? ""
  })));

  replaceAll(jobChanges, (jobChangesRes.data ?? []).map((row) => ({
    contact: row.contact_name,
    previousCompany: row.previous_company,
    previousRole: row.previous_role,
    newCompany: row.new_company,
    newRole: row.new_role
  })));

  return true;
}
