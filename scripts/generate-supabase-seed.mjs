import {
  companies,
  consultants,
  contacts,
  dealStages,
  deals,
  invoices,
  jobChanges,
  milestones,
  projects
} from "../lib/mock-data.ts";
import { writeFile } from "node:fs/promises";

const monthNumber = new Map([
  ["Jan", 1],
  ["Feb", 2],
  ["Mar", 3],
  ["Apr", 4],
  ["May", 5],
  ["Jun", 6],
  ["Jul", 7],
  ["Aug", 8],
  ["Sep", 9],
  ["Oct", 10],
  ["Nov", 11],
  ["Dec", 12]
]);

const sql = [];

function q(value) {
  if (value === null || value === undefined || value === "") return "null";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function dateValue(value, defaultYear) {
  if (!value) return null;
  const clean = value.split(" · ")[0].trim();
  const [dayRaw, monthRaw, explicitYear] = clean.split(/\s+/);
  const month = monthNumber.get(monthRaw);
  if (!month) return null;
  const day = Number(dayRaw);
  const year = explicitYear ? Number(explicitYear) : defaultYear ?? (month >= 7 ? 2025 : 2026);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function values(rows) {
  return rows.map((row) => `  (${row.map(q).join(", ")})`).join(",\n");
}

function insert(table, columns, rows, conflict, updateColumns = columns) {
  if (!rows.length) return;
  sql.push(`insert into public.${table} (${columns.join(", ")}) values\n${values(rows)}\n${conflictClause(conflict, updateColumns)};\n`);
}

function conflictClause(conflict, updateColumns) {
  if (!conflict) return "on conflict do nothing";
  const updates = updateColumns
    .filter((column) => !conflict.includes(column))
    .map((column) => `${column} = excluded.${column}`)
    .join(", ");
  return `on conflict (${conflict.join(", ")}) do update set ${updates}`;
}

sql.push(`-- Generated from lib/mock-data.ts by scripts/generate-supabase-seed.mjs.
-- Run: pnpm supabase:seed:generate

insert into public.integration_sources (slug, display_name, status, auth_type) values
  ('hubspot', 'HubSpot', 'ready_for_credentials', 'private_app_or_oauth2'),
  ('myob', 'MYOB', 'ready_for_oauth', 'oauth2'),
  ('keap', 'Keep', 'ready_for_oauth', 'oauth2'),
  ('monday', 'Monday.com', 'ready_for_api_token', 'api_token_or_oauth2')
on conflict (slug) do update set
  display_name = excluded.display_name,
  status = excluded.status,
  auth_type = excluded.auth_type,
  updated_at = now();
`);

insert(
  "consultants",
  ["id", "full_name", "initials", "role", "revenue_target"],
  consultants.map((row) => [row.id, row.name, row.initials, row.role, row.target]),
  ["id"]
);

insert(
  "companies",
  ["id", "name", "owner_id", "annual_revenue", "health_status", "nps_score", "services_live", "expansion_value"],
  companies.map((row) => [row.id, row.name, row.owner, row.annualRevenue, row.health, row.nps, row.servicesLive, row.expansion]),
  ["id"]
);

insert(
  "deal_stages",
  ["id", "label", "probability", "display_order"],
  [
    ...dealStages.map((row, index) => [row.id, row.label, row.probability, index + 1]),
    ["lost", "Closed lost", 0, dealStages.length + 1]
  ],
  ["id"]
);

insert(
  "contacts",
  ["id", "company_id", "owner_id", "first_name", "last_name", "title", "email", "last_activity_days"],
  contacts.map((row) => [row.id, row.company, row.owner, row.first, row.last, row.title, row.email, row.lastActivityDays]),
  ["id"]
);

insert(
  "deals",
  ["id", "company_id", "contact_id", "stage_id", "value", "proposal_date", "expected_close_date", "close_date", "last_comms_date", "source", "deal_type", "status", "term", "loss_reason", "loss_review_done", "loss_reviewer", "loss_comments"],
  deals.map((row) => [
    row.id,
    row.company,
    row.contact || null,
    row.stage,
    row.value,
    dateValue(row.proposalDate, 2026),
    dateValue(row.expectedClose, 2026),
    dateValue(row.closeDate, 2026),
    dateValue(row.lastComms, 2026),
    row.source,
    row.type,
    row.status,
    row.term,
    row.lossReason,
    row.reviewDone,
    row.reviewer,
    row.comments
  ]),
  ["id"]
);

sql.push("delete from public.deal_consultants;\n");
insert(
  "deal_consultants",
  ["deal_id", "consultant_id"],
  deals.flatMap((row) => row.consultants.map((consultant) => [row.id, consultant])),
  null
);

insert(
  "projects",
  ["id", "deal_id", "project_name", "progress_pct", "rag_status", "next_milestone", "lead_consultant_id", "start_date", "margin_pct"],
  projects.map((row) => [row.id, row.deal, row.name, row.progress, row.rag, row.next, row.lead, dateValue(row.start, 2026), row.margin]),
  ["id"]
);

sql.push("delete from public.project_milestones;\n");
insert(
  "project_milestones",
  ["project_id", "title", "due_label", "status"],
  milestones.map((row) => [row.project, row.title, row.due, row.status]),
  null
);

insert(
  "invoices",
  ["id", "company_id", "consultant_id", "engagement", "amount", "issued_date", "due_date", "status", "timing_label"],
  invoices.map((row) => [row.id, row.company, row.consultant, row.engagement, row.amount, dateValue(row.issued, 2026), dateValue(row.due, 2026), row.status, row.timing]),
  ["id"]
);

sql.push("delete from public.job_change_alerts;\n");
insert(
  "job_change_alerts",
  ["contact_name", "previous_company", "previous_role", "new_company", "new_role"],
  jobChanges.map((row) => [row.contact, row.previousCompany, row.previousRole, row.newCompany, row.newRole]),
  null
);

insert(
  "dashboard_seed_notes",
  ["note_key", "note"],
  [
    ["scenario", "Connected test data for Maximus dashboard prototype. HubSpot owns CRM/deals/marketing, Monday.com owns delivery, MYOB owns invoicing, Keep owns job-change alerts."],
    ["period", "Scenario spans FY26 in full: 1 Jul 2025 to 30 Jun 2026, with Q4 FY26 (1 Apr - 30 Jun 2026) carrying the richest mockup-fidelity detail. Values are fictional but internally connected."],
    ["generator", "This file is generated from lib/mock-data.ts so the local demo and Supabase seed stay aligned."]
  ],
  ["note_key"]
);

await writeFile("supabase/seed.sql", `${sql.join("\n").trim()}\n`);

const summary = {
  consultants: consultants.length,
  companies: companies.length,
  contacts: contacts.length,
  deals: deals.length,
  dealConsultants: deals.reduce((sum, row) => sum + row.consultants.length, 0),
  projects: projects.length,
  milestones: milestones.length,
  invoices: invoices.length,
  jobChanges: jobChanges.length
};

console.log(`Generated supabase/seed.sql: ${JSON.stringify(summary)}`);
