"use client";

import type { ReactNode } from "react";
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  Database,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share2,
  SquareCheck,
  UserPlus,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  companies,
  companyName,
  consultantInitials,
  consultants,
  contactName,
  contacts,
  dealStages,
  deals,
  emailMetrics,
  invoices,
  jobChanges,
  leadSources,
  milestones,
  money,
  projects,
  tasks,
  toneFor,
  topContent,
  websiteStats
} from "@/lib/mock-data";
import { loadFromSupabase } from "@/lib/supabase-data";
import styles from "./page.module.css";

type TabId = "executive" | "pipeline" | "marketing" | "engagements" | "consultant" | "invoicing" | "accounts";
type DateRange = string;
type OwnerFilter = "all" | string;
type StatusFilter = "all" | "open" | "won" | "lost" | "Overdue" | "Outstanding" | "Paid" | "Pending" | "Credit in advance";
type DrawerRecord = {
  title: string;
  source: "HubSpot" | "Monday.com" | "MYOB" | "Keep" | "Supabase";
  table: string;
  fields: Array<[string, ReactNode]>;
  related?: Array<[string, ReactNode]>;
};
type Row = { id: string; cells: ReactNode[]; record?: DrawerRecord };
type Toast = { title: string; detail: string } | null;

const tabs: Array<{ id: TabId; label: string; title: string; eyebrow: string; hero: string; context: string }> = [
  { id: "executive", label: "Executive Overview", title: "Executive Overview · Maximus", eyebrow: "Executive Overview", hero: "The view from above.", context: "Reporting · 1 Apr to 30 Jun" },
  { id: "pipeline", label: "Sales Pipeline", title: "Sales Pipeline · Maximus", eyebrow: "Sales Pipeline", hero: "Where the deals sit.", context: "Active deals · weighted forecast" },
  { id: "marketing", label: "Marketing", title: "Marketing · Maximus", eyebrow: "VMC · Value-Makers Club", hero: "Members & momentum.", context: "Subscriptions · analytics · EDM" },
  { id: "engagements", label: "Engagements (HubSpot & Monday.com)", title: "Engagements (HubSpot & Monday.com)", eyebrow: "Engagements · Delivery", hero: "Doing the work.", context: "Deals connected to Monday projects" },
  { id: "consultant", label: "Consultant Dashboard", title: "Consultant Dashboard · Maximus", eyebrow: "Consultant · Book of Fellowship", hero: "My followership of clients.", context: "Daniel Gavan · personal view" },
  { id: "invoicing", label: "Invoicing", title: "Invoicing · Executive View", eyebrow: "Invoicing · Executive", hero: "The money in motion.", context: "MYOB invoices · receivables" },
  { id: "accounts", label: "Accounts & Expansion", title: "Account Management & Expansion · Maximus", eyebrow: "Account Management · Expansion", hero: "Growing the book.", context: "Accounts · retention · whitespace" }
];

const dateRangeOptions = [
  { id: "week-2026-06-01", kind: "week", label: "Week · 1-7 Jun 2026", start: utcDate(2026, 6, 1), end: utcDate(2026, 6, 7) },
  { id: "week-2026-05-18", kind: "week", label: "Week · 18-24 May 2026", start: utcDate(2026, 5, 18), end: utcDate(2026, 5, 24) },
  { id: "week-2026-04-06", kind: "week", label: "Week · 6-12 Apr 2026", start: utcDate(2026, 4, 6), end: utcDate(2026, 4, 12) },
  { id: "week-2026-02-16", kind: "week", label: "Week · 16-22 Feb 2026", start: utcDate(2026, 2, 16), end: utcDate(2026, 2, 22) },
  { id: "month-2025-07", kind: "month", label: "Jul 2025", start: utcDate(2025, 7, 1), end: utcDate(2025, 7, 31) },
  { id: "month-2025-08", kind: "month", label: "Aug 2025", start: utcDate(2025, 8, 1), end: utcDate(2025, 8, 31) },
  { id: "month-2025-09", kind: "month", label: "Sep 2025", start: utcDate(2025, 9, 1), end: utcDate(2025, 9, 30) },
  { id: "month-2025-10", kind: "month", label: "Oct 2025", start: utcDate(2025, 10, 1), end: utcDate(2025, 10, 31) },
  { id: "month-2025-11", kind: "month", label: "Nov 2025", start: utcDate(2025, 11, 1), end: utcDate(2025, 11, 30) },
  { id: "month-2025-12", kind: "month", label: "Dec 2025", start: utcDate(2025, 12, 1), end: utcDate(2025, 12, 31) },
  { id: "month-2026-01", kind: "month", label: "Jan 2026", start: utcDate(2026, 1, 1), end: utcDate(2026, 1, 31) },
  { id: "month-2026-02", kind: "month", label: "Feb 2026", start: utcDate(2026, 2, 1), end: utcDate(2026, 2, 28) },
  { id: "month-2026-03", kind: "month", label: "Mar 2026", start: utcDate(2026, 3, 1), end: utcDate(2026, 3, 31) },
  { id: "month-2026-04", kind: "month", label: "Apr 2026", start: utcDate(2026, 4, 1), end: utcDate(2026, 4, 30) },
  { id: "month-2026-05", kind: "month", label: "May 2026", start: utcDate(2026, 5, 1), end: utcDate(2026, 5, 31) },
  { id: "month-2026-06", kind: "month", label: "Jun 2026", start: utcDate(2026, 6, 1), end: utcDate(2026, 6, 30) },
  { id: "quarter-q1", kind: "quarter", label: "Q1 FY26 · Jul-Sep", start: utcDate(2025, 7, 1), end: utcDate(2025, 9, 30) },
  { id: "quarter-q2", kind: "quarter", label: "Q2 FY26 · Oct-Dec", start: utcDate(2025, 10, 1), end: utcDate(2025, 12, 31) },
  { id: "quarter-q3", kind: "quarter", label: "Q3 FY26 · Jan-Mar", start: utcDate(2026, 1, 1), end: utcDate(2026, 3, 31) },
  { id: "quarter-q4", kind: "quarter", label: "Q4 FY26 · Apr-Jun", start: utcDate(2026, 4, 1), end: utcDate(2026, 6, 30) },
  { id: "ytd", kind: "year", label: "FY26 · Jul 2025-Jun 2026", start: utcDate(2025, 7, 1), end: utcDate(2026, 6, 30) }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("executive");
  const [dateRange, setDateRange] = useState<DateRange>("quarter-q4");
  const [owner, setOwner] = useState<OwnerFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [drawer, setDrawer] = useState<DrawerRecord | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [showSources, setShowSources] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<"mock" | "supabase">("mock");
  const tab = tabs.find((item) => item.id === activeTab) ?? tabs[0];

  useEffect(() => {
    const handler = (event: Event) => setDrawer((event as CustomEvent<DrawerRecord>).detail);
    window.addEventListener("open-dashboard-record", handler);
    return () => window.removeEventListener("open-dashboard-record", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadFromSupabase().then((loaded) => {
      if (!cancelled) {
        if (loaded) setDataSource("supabase");
        else console.warn("[supabase] loadFromSupabase() returned false — check the console above for which table failed, or whether env vars are missing.");
      }
    }).catch((error) => {
      console.error("[supabase] loadFromSupabase() threw — staying on the local mock dataset.", error);
    });
    return () => { cancelled = true; };
  }, []);

  const filteredDeals = useMemo(() => deals.filter((deal) => {
    const ownerMatch = owner === "all" || deal.consultants.includes(owner);
    const statusMatch = status === "all" || ["open", "won", "lost"].includes(status) ? status === "all" || deal.status === status : true;
    return ownerMatch && statusMatch && dealInRange(deal, dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dataSource forces a recompute once Supabase data replaces the mock arrays in place
  }), [dateRange, owner, status, dataSource]);

  const filteredInvoices = useMemo(() => invoices.filter((invoice) => {
    const ownerMatch = owner === "all" || invoice.consultant === owner;
    const statusMatch = status === "all" || ["open", "won", "lost"].includes(status) ? true : invoice.status === status;
    return ownerMatch && statusMatch && invoiceInRange(invoice, dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dataSource forces a recompute once Supabase data replaces the mock arrays in place
  }), [dateRange, owner, status, dataSource]);

  const setDemoToast = (title: string, detail: string) => setToast({ title, detail });
  const clearFilters = () => {
    setOwner("all");
    setStatus("all");
    setDateRange("quarter-q4");
    setDemoToast("Filters cleared", "All dashboard cards are now reading from the full connected mock dataset.");
  };
  const setRange = (value: DateRange) => {
    setDateRange(value);
    setDemoToast("Date range changed", `Dashboard recalculated for ${rangeLabel(value)}.`);
  };

  return (
    <main className={styles.app}>
      <TopBar onAction={(label) => setDemoToast(label, `${label} opened against the dashboard workspace.`)} />
      <section className={styles.heading}>
        <div>
          <div className={styles.breadcrumb}>Reports › Dashboards › Maximus</div>
          <h1>{tab.title} <span>Private to team</span></h1>
          <p>Connected demo · Supabase reporting tables · HubSpot, Monday, MYOB and Keep records are represented below</p>
        </div>
        <div className={styles.headingActions}>
          <button type="button" onClick={() => setShowSources((value) => !value)}><Database size={17} /> Sources</button>
          <button type="button" onClick={() => setDemoToast("Share link copied", "Demo share URL copied for Daniel Gavan dashboard.")}><Share2 size={17} /> Share</button>
          <button type="button" onClick={() => setAction("Dashboard actions")}>Actions <ChevronDown size={16} /></button>
          <button className={styles.addReport} type="button" onClick={() => setAction("Add report")}>Add report</button>
        </div>
      </section>
      <nav className={styles.tabs} aria-label="Dashboard tabs">
        {tabs.map((item) => (
          <button className={item.id === activeTab ? styles.tabActive : ""} key={item.id} onClick={() => setActiveTab(item.id)} type="button">
            {item.label}
          </button>
        ))}
      </nav>
      <FilterStrip activeTab={activeTab} dateRange={dateRange} owner={owner} status={status} dataSource={dataSource} setDateRange={setRange} setOwner={setOwner} setStatus={setStatus} clearFilters={clearFilters} />
      <section className={styles.canvas}>
        <Hero eyebrow={tab.eyebrow} title={tab.hero} context={tab.context} dateRange={dateRange} onPeriod={setRange} />
        {showSources && <SourceMap />}
        {activeTab === "executive" && <Executive deals={filteredDeals} invoices={filteredInvoices} onOpen={setDrawer} />}
        {activeTab === "pipeline" && <Pipeline deals={filteredDeals} onOpen={setDrawer} />}
        {activeTab === "marketing" && <Marketing deals={filteredDeals} onOpen={setDrawer} />}
        {activeTab === "engagements" && <Engagements onOpen={setDrawer} />}
        {activeTab === "consultant" && <Consultant deals={filteredDeals.filter((deal) => deal.consultants.includes("dg"))} onOpen={setDrawer} onAction={setAction} />}
        {activeTab === "invoicing" && <Invoicing invoices={filteredInvoices} onOpen={setDrawer} setStatus={setStatus} />}
        {activeTab === "accounts" && <Accounts deals={filteredDeals} onOpen={setDrawer} />}
      </section>
      {drawer && <RecordDrawer record={drawer} onClose={() => setDrawer(null)} />}
      {action && <ActionModal action={action} onClose={() => setAction(null)} onSave={(detail) => { setAction(null); setDemoToast("Demo write captured", detail); }} />}
      {toast && <ToastCard toast={toast} onClose={() => setToast(null)} />}
    </main>
  );
}

function TopBar({ onAction }: { onAction: (label: string) => void }) {
  return (
    <header className={styles.topbar}>
      <button className={styles.logo} type="button" onClick={() => onAction("Workspace home")}><span>H</span><strong>HubSpot</strong></button>
      <nav>
        {["Contacts", "Conversations", "Marketing", "Sales", "Service", "Automation", "Reports", "Library"].map((item) => (
          <button className={item === "Reports" ? styles.topActive : ""} key={item} onClick={() => onAction(item)} type="button">{item}</button>
        ))}
      </nav>
      <button className={styles.profile} type="button" onClick={() => onAction("Profile menu")}><Search size={19} /><span>D</span><b>Daniel G.</b></button>
    </header>
  );
}

function FilterStrip({ activeTab, dateRange, owner, status, dataSource, setDateRange, setOwner, setStatus, clearFilters }: {
  activeTab: TabId;
  dateRange: DateRange;
  owner: OwnerFilter;
  status: StatusFilter;
  dataSource: "mock" | "supabase";
  setDateRange: (value: DateRange) => void;
  setOwner: (value: OwnerFilter) => void;
  setStatus: (value: StatusFilter) => void;
  clearFilters: () => void;
}) {
  const statusOptions = activeTab === "invoicing"
    ? ["all", "Overdue", "Outstanding", "Paid", "Pending", "Credit in advance"]
    : ["all", "open", "won", "lost"];

  return (
    <section className={styles.filterStrip}>
      <strong>Filter:</strong>
      <label>Date range <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
        <optgroup label="Demo weeks">{dateRangeOptions.filter((option) => option.kind === "week").map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</optgroup>
        <optgroup label="Months">{dateRangeOptions.filter((option) => option.kind === "month").map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</optgroup>
        <optgroup label="Quarters">{dateRangeOptions.filter((option) => option.kind === "quarter").map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</optgroup>
        <optgroup label="Full year">{dateRangeOptions.filter((option) => option.kind === "year").map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</optgroup>
      </select></label>
      <label>Owner <select value={owner} onChange={(event) => setOwner(event.target.value)}><option value="all">All</option>{consultants.map((consultant) => <option key={consultant.id} value={consultant.id}>{consultant.name}</option>)}</select></label>
      <label>Status <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>{statusOptions.map((item) => <option key={item} value={item}>{item === "all" ? "All" : item}</option>)}</select></label>
      <button type="button" onClick={clearFilters}>Reset</button>
      <span className={styles.drill}>Click any card, record, metric or chart segment to open the source records</span>
      <span className={styles.sync}><RefreshCw size={16} /> {dataSource === "supabase" ? "Live sync complete · Supabase reporting tables loaded" : "Demo sync complete · FY26 mock dataset loaded"}</span>
    </section>
  );
}

function Hero({ eyebrow, title, context, dateRange, onPeriod }: { eyebrow: string; title: string; context: string; dateRange: DateRange; onPeriod: (period: DateRange) => void }) {
  const words = title.split(" ");
  const last = words.pop() ?? "";
  const periods: Array<[DateRange, string, string]> = [["week-2026-06-01", "Week", "week"], ["month-2026-06", "Monthly", "month"], ["quarter-q4", "Quarter", "quarter"], ["ytd", "YTD", "year"]];
  const selectedKind = dateRangeOptions.find((option) => option.id === dateRange)?.kind;
  const selectedPeriod = rangeLabel(dateRange);
  return (
    <section className={styles.hero}>
      <div>
        <p>MAXIMUS · INTERNATIONAL <span>IMAGE WIDGET · TOP OF DASHBOARD</span></p>
        <div className={styles.heroEyebrow}>— {eyebrow}</div>
        <h2>{words.join(" ")} <em>{last}</em></h2>
      </div>
      <aside>
        <div className={styles.period}>{periods.map(([value, label, kind]) => <button className={selectedKind === kind ? styles.selected : ""} key={value} onClick={() => onPeriod(value)} type="button">{label}</button>)}</div>
        <strong>{selectedPeriod}</strong>
        <small>{context}<br />HubSpot · Monday · MYOB · Keep</small>
      </aside>
    </section>
  );
}

function Executive({ deals: sourceDeals, invoices: sourceInvoices, onOpen }: { deals: typeof deals; invoices: typeof invoices; onOpen: (record: DrawerRecord) => void }) {
  const open = sourceDeals.filter((deal) => deal.status === "open");
  const won = sourceDeals.filter((deal) => deal.status === "won");
  const contracted = sourceDeals.filter((deal) => deal.status !== "lost").reduce((sum, deal) => sum + deal.value, 0);
  const weighted = weightedValue(open);
  const collected = sourceInvoices.filter((invoice) => ["Paid", "Outstanding"].includes(invoice.status)).reduce((sum, invoice) => sum + invoice.amount, 0);
  return (
    <>
      <KpiGrid items={[
        kpi("Contracted Revenue · YTD", "Signed contract value", money(contracted), `${sourceDeals.length} deal rows from HubSpot`, "good", recordForTable("Contracted revenue backing rows", "HubSpot", "deals", sourceDeals)),
        kpi("Weighted · Pipeline", "Probability adjusted", money(weighted), `${open.length} open deals`, "good", recordForTable("Weighted pipeline calculation", "HubSpot", "deals + deal_stages", open)),
        kpi("Collected · Revenue", "MYOB receipts + outstanding", money(collected), `${sourceInvoices.length} invoice rows`, "good", recordForTable("Revenue collection rows", "MYOB", "invoices", sourceInvoices)),
        kpi("Close · Won", "Q2 to date", money(sumBy(won, "value")), `${won.length} closed-won deals`, "good", recordForTable("Closed-won deal rows", "HubSpot", "deals", won))
      ]} onOpen={onOpen} />
      <TwoColumn left={<StageDistribution deals={sourceDeals} onOpen={onOpen} />} right={<MetricList title="Key · Metrics" rows={[["Weighted Pipeline", money(weighted), "from stage probabilities"], ["Active Engagements", String(projects.length), "Monday projects"], ["Win Rate", `${Math.round((won.length / Math.max(sourceDeals.length, 1)) * 100)}%`, "won / all filtered deals"], ["Avg Deal Size", money(Math.round(sumBy(sourceDeals, "value") / Math.max(sourceDeals.length, 1))), "filtered average"]]} onOpen={onOpen} />} />
      <Report title="Recent Leads · Last 14 Days" subtitle="All new leads · most recent first · includes allocated & awaiting allocation">
        <DataTable columns={["Company", "First name", "Last name", "Title", "Received", "Source", "Lead type", "Consultant"]} rows={leadRows()} />
      </Report>
      <TwoColumn left={<SimpleList title="Top · Lead Sources" rows={leadSources} source="HubSpot" table="marketing_sources" />} right={<Forecast onOpen={onOpen} />} />
      <Insight title="Reading the signal.">Every number above now opens its backing records. The demo is still seeded data, but it is connected by company, contact, consultant, deal, project and invoice IDs.</Insight>
    </>
  );
}

function Pipeline({ deals: sourceDeals, onOpen }: { deals: typeof deals; onOpen: (record: DrawerRecord) => void }) {
  const open = sourceDeals.filter((deal) => deal.status === "open");
  const won = sourceDeals.filter((deal) => deal.status === "won");
  return (
    <>
      <KpiGrid items={[
        kpi("Total Open Deals", "Unweighted", money(sumBy(open, "value")), `${open.length} deals`, "neutral", recordForTable("Open deals", "HubSpot", "deals", open)),
        kpi("Weighted · Pipeline", "Probability adjusted", money(weightedValue(open)), "calculated from deal_stages", "good", recordForTable("Weighted deal rows", "HubSpot", "deals + deal_stages", open)),
        kpi("Win Rate", "Filtered period", `${Math.round((won.length / Math.max(sourceDeals.length, 1)) * 100)}%`, `${won.length} of ${sourceDeals.length}`, "good", recordForTable("Win-rate backing rows", "HubSpot", "deals", sourceDeals)),
        kpi("Avg Cycle", "Created to closed", "42d", "demo benchmark", "good", recordForTable("Sales-cycle source fields", "HubSpot", "deals", sourceDeals))
      ]} onOpen={onOpen} />
      <StageDistribution deals={sourceDeals} onOpen={onOpen} />
      <DealTables deals={sourceDeals} />
    </>
  );
}

function Marketing({ deals: sourceDeals, onOpen }: { deals: typeof deals; onOpen: (record: DrawerRecord) => void }) {
  const marketingRows = sourceDeals
    .filter((deal) => ["Website form", "LinkedIn (Organic)", "Referral · Partner", "Event · Speaking", "Content · Download", "VMC Upgrade"].includes(deal.source))
    .slice(0, 12);
  return (
    <>
      <KpiGrid items={[
        kpi("Active · Members", "VMC total", "1,847", "subscription object", "good", sourceRecord("VMC subscriptions", "HubSpot", "subscriptions", [["Active members", "1,847"], ["MRR", "$187K"]])),
        kpi("Website · Sessions", "Both sites · Q2", "15.8K", "analytics rows", "good", sourceRecord("Website analytics", "HubSpot", "website_analytics", [["maximus.com.au sessions", "11,240"], ["valuemakers.com.au sessions", "4,580"]])),
        kpi("Retention", "Gross · rolling 12 mo", "94.2%", "-18 churned", "good", sourceRecord("Retention calculation", "HubSpot", "subscriptions", [["Gross retention", "94.2%"], ["Churned this quarter", "18"]])),
        kpi("Website · Leads", "Filtered period", String(marketingRows.length), `${sourceDeals.length} deal rows scanned`, "good", recordForTable("Marketing opportunities", "HubSpot", "deals", marketingRows))
      ]} onOpen={onOpen} />
      <Report title="Marketing-Sourced · Pipeline" subtitle="Sales opportunities that originated from marketing leads · summarised by selected date range">
        <KpiGrid compact items={[kpi("Number of Deals", "", String(marketingRows.length), "", "gold", recordForTable("Marketing-sourced deals", "HubSpot", "deals", marketingRows)), kpi("Total Value", "", money(sumBy(marketingRows, "value")), "", "gold", recordForTable("Marketing-sourced value", "HubSpot", "deals", marketingRows)), kpi("Average Deal Size", "", money(Math.round(sumBy(marketingRows, "value") / Math.max(marketingRows.length, 1))), "", "gold", recordForTable("Average deal source", "HubSpot", "deals", marketingRows)), kpi("Weighted Value", "", money(weightedValue(marketingRows.filter((deal) => deal.status === "open"))), "", "good", recordForTable("Weighted marketing pipeline", "HubSpot", "deals + deal_stages", marketingRows))]} onOpen={onOpen} />
        <DataTable columns={["Sales stage", "Deals", "Total value", "Avg deal", "% of value"]} rows={stageSummaryRows(marketingRows)} />
      </Report>
      <Report title="Marketing-Sourced · Opportunities" subtitle="Click a row to open the HubSpot deal plus related contact/company">
        <DataTable columns={["Company", "Sales stage", "Value", "Consultant", "Source", "Created"]} rows={dealRows(marketingRows)} />
      </Report>
      <TwoColumn left={<WebsiteCard stat={websiteStats[0]} onOpen={onOpen} />} right={<WebsiteCard stat={websiteStats[1]} onOpen={onOpen} />} />
      <TwoColumn left={<SimpleList title="Email Marketing · EDM" rows={emailMetrics} source="HubSpot" table="email_events" />} right={<SimpleList title="Top · Content" rows={topContent} source="HubSpot" table="content_analytics" />} />
    </>
  );
}

function Engagements({ onOpen }: { onOpen: (record: DrawerRecord) => void }) {
  const green = projects.filter((project) => project.rag === "Green");
  const amber = projects.filter((project) => project.rag === "Amber");
  const red = projects.filter((project) => project.rag === "Red");
  return (
    <>
      <KpiGrid items={[
        kpi("On Track · Green", "Monday status", String(green.length), `${money(projectDealValue(green))} in delivery`, "good", recordForTable("Green delivery projects", "Monday.com", "projects", green)),
        kpi("Watch · Amber", "Monday status", String(amber.length), `${money(projectDealValue(amber))} needs review`, "warn", recordForTable("Amber delivery projects", "Monday.com", "projects", amber)),
        kpi("Intervene · Red", "Monday status", String(red.length), `${money(projectDealValue(red))} at risk`, "bad", recordForTable("Red delivery projects", "Monday.com", "projects", red)),
        kpi("Client · NPS", "Q2 · n=487", "+72", "company NPS samples", "good", recordForTable("NPS source rows", "HubSpot", "companies", companies))
      ]} onOpen={onOpen} />
      <TwoColumn left={<ProjectList onOpen={onOpen} />} right={<UpcomingProjects onOpen={onOpen} />} />
      <TwoColumn left={<MarginCard onOpen={onOpen} />} right={<MilestoneCard onOpen={onOpen} />} />
      <Insight title="Where to look this week.">Click Stonehaven, any RAG card, or any milestone: the drawer shows how a HubSpot deal and Monday project connect.</Insight>
    </>
  );
}

function Consultant({ deals: personalDeals, onOpen, onAction }: { deals: typeof deals; onOpen: (record: DrawerRecord) => void; onAction: (label: string) => void }) {
  return (
    <>
      <KpiGrid items={[
        kpi("My Total Contacts", "In my book", String(contacts.filter((contact) => contact.owner === "dg").length), "HubSpot contacts owned by Daniel", "good", recordForTable("Daniel's contacts", "HubSpot", "contacts", contacts.filter((contact) => contact.owner === "dg"))),
        kpi("My Accounts", "Companies I own", String(companies.filter((company) => company.owner === "dg").length), "company.owner_id = dg", "good", recordForTable("Daniel's accounts", "HubSpot", "companies", companies.filter((company) => company.owner === "dg"))),
        kpi("My Dormant Contacts", "No contact 30+ days", String(contacts.filter((contact) => contact.owner === "dg" && contact.lastActivityDays >= 30).length), "needs attention", "bad", recordForTable("Dormant contacts", "HubSpot", "contacts", contacts.filter((contact) => contact.lastActivityDays >= 30))),
        kpi("My Conversations", "Logged this quarter", "412", "activity rollup", "good", sourceRecord("Conversation activity", "HubSpot", "engagements", [["Calls", "118"], ["Meetings", "88"], ["1:1 emails", "206"]])),
        kpi("My Outbound Pursuits", "EDM & sequences", "842", "38% open rate", "blue", sourceRecord("Outbound pursuits", "HubSpot", "email_events", [["Sends", "842"], ["Opened", "320"], ["Replied", "64"]]))
      ]} onOpen={onOpen} />
      <QuickActions onAction={onAction} />
      <Report title="My · Upcoming & Overdue" subtitle="Tasks, meetings & appointments · overdue first">
        <DataTable columns={["Type", "Action & summary", "Company · contact", "Due date", "Open"]} rows={tasks.map((task, index) => ({ id: `${task.type}-${index}`, cells: [task.type, `${task.summary} — ${task.detail}`, `${companyName(task.company)} · ${contactName(task.contact)}`, `${task.due} · ${task.timing}`, "Open record"], record: taskRecord(task) }))} />
      </Report>
      <DealTables deals={personalDeals} personal />
      <Report title="Movers · New Roles" subtitle="Contacts in my book who changed role · synced from LinkedIn via Keep">
        <DataTable columns={["Contact", "Previous company", "Previous role", "New company", "New role", "Record"]} rows={jobChanges.map((row) => ({ id: row.contact, cells: [row.contact, row.previousCompany, row.previousRole, row.newCompany, row.newRole, "Open alert"], record: sourceRecord(row.contact, "Keep", "job_change_alerts", Object.entries(row)) }))} />
      </Report>
      <InvoicingMini onOpen={onOpen} />
    </>
  );
}

function Invoicing({ invoices: sourceInvoices, onOpen, setStatus }: { invoices: typeof invoices; onOpen: (record: DrawerRecord) => void; setStatus: (status: StatusFilter) => void }) {
  const overdue = sourceInvoices.filter((invoice) => invoice.status === "Overdue");
  const outstanding = sourceInvoices.filter((invoice) => ["Outstanding", "Overdue"].includes(invoice.status));
  return (
    <>
      <div className={styles.localFilter}><b>FILTER INVOICING</b><button type="button"><CalendarDays size={16} /> Invoice period <strong>{sourceInvoices.length} matching rows</strong></button>{["Overdue", "Outstanding", "Paid"].map((item) => <button key={item} type="button" onClick={() => setStatus(item as StatusFilter)}>Show {item}</button>)}</div>
      <KpiGrid items={[
        kpi("Total Invoiced", "FY to date", money(sumBy(sourceInvoices, "amount")), `${sourceInvoices.length} invoice rows`, "good", recordForTable("All invoice rows", "MYOB", "invoices", sourceInvoices)),
        kpi("Revenue Received", "Collected · FYTD", money(sumBy(sourceInvoices.filter((invoice) => invoice.status === "Paid"), "amount")), "paid invoices", "good", recordForTable("Paid invoice rows", "MYOB", "invoices", sourceInvoices.filter((invoice) => invoice.status === "Paid"))),
        kpi("Outstanding", "Receivable", money(sumBy(outstanding, "amount")), `${outstanding.length} open invoices`, "neutral", recordForTable("Outstanding invoices", "MYOB", "invoices", outstanding)),
        kpi("Overdue", "Past due date", money(sumBy(overdue, "amount")), `${overdue.length} overdue invoices`, "bad", recordForTable("Overdue invoices", "MYOB", "invoices", overdue)),
        kpi("Pending", "WIP · to bill", money(sumBy(sourceInvoices.filter((invoice) => invoice.status === "Pending"), "amount")), "ready to bill", "warn", recordForTable("Pending invoices", "MYOB", "invoices", sourceInvoices.filter((invoice) => invoice.status === "Pending"))),
        kpi("Credit in Advance", "Prepaid", money(sumBy(sourceInvoices.filter((invoice) => invoice.status === "Credit in advance"), "amount")), "prepayments", "blue", recordForTable("Credit in advance ledger", "MYOB", "invoices", sourceInvoices.filter((invoice) => invoice.status === "Credit in advance")))
      ]} onOpen={onOpen} />
      <AgingBar invoices={sourceInvoices} onOpen={onOpen} />
      <Report title="Outstanding & Overdue Invoices" subtitle="Click an invoice to open MYOB source data plus related company and consultant">
        <DataTable columns={["Company", "Consultant", "Engagement", "Amount", "Issued", "Due date", "Status", "Timing"]} rows={invoiceRows(sourceInvoices)} />
      </Report>
      <TwoColumn left={<SimpleList title="Credit in Advance · Ledger" rows={[["Brigadier Insurance", "Annual 360 · FY27", "$112K"], ["Whitestone Industries", "Leadership series", "$84K"], ["Kingsford Energy Co", "Multi-year programme", "$68K"], ["Ravensbourne Holdings", "Exec programme", "$54K"]]} source="MYOB" table="credit_ledger" />} right={<MetricList title="Collection · Health" rows={[["Days Sales Outstanding", "39d", "target <= 45"], ["Collection Rate", "96.1%", "target >= 95%"], ["Avg Days to Pay", "41d", "across paid invoices"], ["Overdue Ratio", "21.8%", "% of receivables overdue"]]} onOpen={onOpen} />} />
    </>
  );
}

function Accounts({ deals: sourceDeals, onOpen }: { deals: typeof deals; onOpen: (record: DrawerRecord) => void }) {
  const activeAccounts = companies.filter((company) => !["Lost"].includes(company.health));
  const atRisk = companies.filter((company) => company.health === "At risk");
  return (
    <>
      <KpiGrid items={[
        kpi("Active Accounts", "Managed · firm-wide", String(activeAccounts.length), "company.health != Lost", "good", recordForTable("Active accounts", "HubSpot", "companies", activeAccounts)),
        kpi("Account Revenue · YTD", "Existing accounts", money(sumBy(activeAccounts, "annualRevenue")), "company annual revenue", "good", recordForTable("Account revenue rows", "HubSpot", "companies", activeAccounts)),
        kpi("Net Revenue Retention", "Expansion vs churn", "112%", "ARR bridge below", "good", sourceRecord("NRR calculation", "Supabase", "account_growth_snapshot", [["Starting ARR", "$5.92M"], ["Expansion", "+$1.18M"], ["Churn", "-$0.31M"], ["Current ARR", "$6.63M"]])),
        kpi("Expansion Pipeline", "Open upsell & cross-sell", money(sumBy(sourceDeals.filter((deal) => deal.status === "open"), "value")), "open opportunity rows", "good", recordForTable("Expansion pipeline deals", "HubSpot", "deals", sourceDeals.filter((deal) => deal.status === "open"))),
        kpi("At-Risk Accounts", "Health = red", String(atRisk.length), `${money(sumBy(atRisk, "annualRevenue"))} revenue exposed`, "bad", recordForTable("At-risk accounts", "HubSpot", "companies", atRisk))
      ]} onOpen={onOpen} />
      <Report title="Key Accounts · Health & Value" subtitle="Top managed accounts · revenue, relationship health & expansion potential">
        <DataTable columns={["Account", "Owner", "Annual rev.", "Health", "Last engagement", "NPS", "Services", "Expansion"]} rows={companyRows(companies.slice(0, 12))} />
      </Report>
      <Report title="Expansion Opportunities · Pipeline" subtitle="Upsell & cross-sell deals into existing accounts">
        <DataTable columns={["Account", "Opportunity", "Type", "Value", "Stage", "Consultant", "Exp. close"]} rows={dealRows(sourceDeals.filter((deal) => deal.status === "open"), "account")} />
      </Report>
      <ThreeColumn onOpen={onOpen} />
      <Report title="Account Growth · Net Revenue Retention" subtitle="Trailing 12 months · existing accounts only">
        <button className={styles.nrr} type="button" onClick={() => onOpen(sourceRecord("Account growth bridge", "Supabase", "account_growth_snapshot", [["Starting ARR", "$5.92M"], ["Expansion", "+$1.18M"], ["Churn", "-$0.31M"], ["Contraction", "-$0.16M"], ["Current ARR", "$6.63M"]]))}><span>Starting ARR · 12 months ago <b>$5.92M</b></span><span>+ Expansion · upsell + cross-sell <b className={styles.goodText}>+$1.18M</b></span><span>- Churn · lost accounts <b className={styles.badText}>-$0.31M</b></span><span>- Contraction · reduced scope <b className={styles.badText}>-$0.16M</b></span><strong>= Current ARR <b>$6.63M</b></strong></button>
      </Report>
    </>
  );
}

function KpiGrid({ items, compact = false, onOpen }: { items: ReturnType<typeof kpi>[]; compact?: boolean; onOpen: (record: DrawerRecord) => void }) {
  return <section className={`${styles.kpis} ${compact ? styles.compactKpis : ""}`}>{items.map((item) => <button className={styles.kpi} data-tone={item.tone} key={item.title} onClick={() => onOpen(item.record)} type="button"><h3>{item.title}</h3>{item.subtitle && <p>{item.subtitle}</p>}<strong>{item.value}</strong>{item.note && <small>{item.note}</small>}</button>)}</section>;
}

function Report({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <section className={styles.report}><div className={styles.reportHead}><div><h2>{title}</h2><p>{subtitle}</p></div><button type="button" title={`Open ${title} options`}><MoreHorizontal size={22} /></button></div>{children}</section>;
}

function DataTable({ columns, rows }: { columns: string[]; rows: Row[] }) {
  return <div className={styles.tableWrap}><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{row.cells.map((cell, cellIndex) => <td key={`${row.id}-${cellIndex}`}>{row.record && cellIndex === 0 ? <button type="button" onClick={() => row.record && openRecordFromButton(row.record)}>{cell}</button> : cell}</td>)}</tr>)}</tbody></table></div>;
}

function openRecordFromButton(record: DrawerRecord) {
  window.dispatchEvent(new CustomEvent("open-dashboard-record", { detail: record }));
}

function StageDistribution({ deals: sourceDeals, onOpen }: { deals: typeof deals; onOpen: (record: DrawerRecord) => void }) {
  const stageRows = dealStages.map((stage) => {
    const stageDeals = sourceDeals.filter((deal) => deal.stage === stage.id);
    return { ...stage, count: stageDeals.length, value: sumBy(stageDeals, "value"), deals: stageDeals };
  });
  return <Report title="Pipeline · Stage Distribution" subtitle="Click a segment to filter into source deals"><div className={styles.stageBar}>{stageRows.map((stage) => <button key={stage.id} onClick={() => onOpen(recordForTable(`${stage.label} deals`, "HubSpot", "deals", stage.deals))} style={{ background: stage.color, flex: Math.max(stage.count, 1) }} type="button"><b>{stage.count}</b></button>)}</div><div className={styles.stageLegend}>{stageRows.map((stage) => <button key={stage.id} onClick={() => onOpen(recordForTable(`${stage.label} source`, "HubSpot", "deals + deal_stages", stage.deals))} type="button"><b>{stage.label} · {stage.probability}%</b><small>{stage.count} deals · {money(stage.value)}</small></button>)}</div></Report>;
}

function DealTables({ deals: sourceDeals, personal = false }: { deals: typeof deals; personal?: boolean }) {
  return <>
    <Report title={personal ? "My Open Deals" : "All Open Deals"} subtitle="Sorted by sales stage · highest probability first · excludes signed contracts">
      <DataTable columns={["Company", "Sales stage", "Proposal", "Exp. close", "Value", "Prob.", "Last comms", "Consultant"]} rows={dealRows(sourceDeals.filter((deal) => deal.status === "open"))} />
    </Report>
    <Report title={personal ? "My Won Deals" : "Won · Deals"} subtitle="Closed-won · Q2 · now in delivery">
      <DataTable columns={["Company", "Sales stage", "Won date", "Value", "Term", "Consultant"]} rows={sourceDeals.filter((deal) => deal.status === "won").map((deal) => ({ id: deal.id, cells: [companyName(deal.company), stageLabel(deal.stage), deal.closeDate || "", money(deal.value), deal.term || "", deal.consultants.map(consultantInitials).join(" · ")], record: dealRecord(deal) }))} />
    </Report>
    <Report title={personal ? "My Lost Deals" : "Lost · Deals"} subtitle="Closed-lost · Q2 · with external project loss review">
      <DataTable columns={["Company", "Stage reached", "Value", "Loss date", "Reason", "Review done", "Reviewer", "Comments"]} rows={sourceDeals.filter((deal) => deal.status === "lost").map((deal) => ({ id: deal.id, cells: [companyName(deal.company), stageLabel(deal.stage), money(deal.value), deal.closeDate || "", deal.lossReason || "", deal.reviewDone ? "Yes" : "No", deal.reviewer || "-", deal.comments || ""], record: dealRecord(deal) }))} />
    </Report>
  </>;
}

function ProjectList({ onOpen }: { onOpen: (record: DrawerRecord) => void }) {
  return <Report title="Projects · In Delivery" subtitle="Closed-won deals x Monday status · target 25 active">{projects.map((project) => <button className={styles.projectRow} key={project.id} onClick={() => onOpen(projectRecord(project))} type="button"><div><h3>{project.name}</h3><p>{project.next} · {consultantInitials(project.lead)} · margin {project.margin}%</p></div><div className={styles.progress}><span style={{ width: `${project.progress}%` }} data-tone={toneFor(project.rag)} /></div><b>{project.progress}%</b><em data-tone={toneFor(project.rag)}>{project.rag}</em></button>)}</Report>;
}

function UpcomingProjects({ onOpen }: { onOpen: (record: DrawerRecord) => void }) {
  return <Report title="Upcoming · Projects" subtitle="Signed deals scheduled to start · readiness RAG">{projects.slice(0, 5).map((project) => <button className={styles.upcoming} key={project.id} onClick={() => onOpen(projectRecord(project))} type="button"><h3>{companyName(deals.find((deal) => deal.id === project.deal)?.company ?? "")}</h3><p>Starts {project.start} · Next: {project.next}</p><em data-tone={toneFor(project.rag)}>{project.rag}</em></button>)}</Report>;
}

function MarginCard({ onOpen }: { onOpen: (record: DrawerRecord) => void }) {
  return <Report title="Engagement · Margin" subtitle="Realised gross · Q2 · target 60%"><button className={styles.plainBlock} type="button" onClick={() => onOpen(recordForTable("Engagement margin rows", "Monday.com", "projects", projects))}><div className={styles.bigMetric}>64.2%</div><p className={styles.goodText}>+ 4.2 pts vs target · $2.19M gross profit</p><div className={styles.marginBands}><span><b>71%</b>Top quartile</span><span><b>64%</b>Median</span><span><b className={styles.badText}>42%</b>Bottom Q.</span></div></button></Report>;
}

function MilestoneCard({ onOpen }: { onOpen: (record: DrawerRecord) => void }) {
  return <Report title="Milestones · This Week" subtitle="From Monday · synced">{milestones.map((item) => <button className={styles.upcoming} key={item.title} onClick={() => onOpen(sourceRecord(item.title, "Monday.com", "project_milestones", Object.entries(item)))} type="button"><h3>{item.title}</h3><p>{item.due}</p><em data-tone={toneFor(item.status)}>{item.status}</em></button>)}</Report>;
}

function QuickActions({ onAction }: { onAction: (label: string) => void }) {
  const actions = [[UserPlus, "New Contact"], [BarChart3, "New Company"], [Plus, "New Deal"], [Send, "Send Email"], [SquareCheck, "Create Task"], [CalendarDays, "Create Meeting"], [Search, "Search Contacts"]] as const;
  return <Report title="Quick · Actions" subtitle="Common HubSpot CRM tasks · one click"><div className={styles.quick}>{actions.map(([Icon, label]) => <button key={label} type="button" onClick={() => onAction(label)}><Icon size={24} /><span>{label}</span></button>)}</div></Report>;
}

function InvoicingMini({ onOpen }: { onOpen: (record: DrawerRecord) => void }) {
  return <><Report title="Billing · Invoicing & Collections" subtitle="My clients · Maximus invoices on completion of work"><KpiGrid compact items={[
    kpi("Pending Invoicing", "", money(sumBy(invoices.filter((invoice) => invoice.status === "Pending"), "amount")), "Work complete · to bill", "warn", recordForTable("Pending invoicing", "MYOB", "invoices", invoices.filter((invoice) => invoice.status === "Pending"))),
    kpi("Outstanding", "", money(sumBy(invoices.filter((invoice) => invoice.status === "Outstanding"), "amount")), "Awaiting payment", "neutral", recordForTable("Outstanding invoices", "MYOB", "invoices", invoices.filter((invoice) => invoice.status === "Outstanding"))),
    kpi("Overdue", "", money(sumBy(invoices.filter((invoice) => invoice.status === "Overdue"), "amount")), "Past due date", "bad", recordForTable("Overdue invoices", "MYOB", "invoices", invoices.filter((invoice) => invoice.status === "Overdue"))),
    kpi("Revenue Received", "", money(sumBy(invoices.filter((invoice) => invoice.status === "Paid"), "amount")), "Collected FYTD", "good", recordForTable("Paid invoices", "MYOB", "invoices", invoices.filter((invoice) => invoice.status === "Paid")))
  ]} onOpen={onOpen} /><DataTable columns={["Company", "Engagement", "Amount", "Issued", "Due date", "Status", "Notes"]} rows={invoiceRows(invoices.slice(4, 10))}/></Report><AgingBar invoices={invoices} onOpen={onOpen} /></>;
}

function AgingBar({ invoices: sourceInvoices, onOpen }: { invoices: typeof invoices; onOpen: (record: DrawerRecord) => void }) {
  const buckets = [
    ["Overdue", sourceInvoices.filter((invoice) => invoice.status === "Overdue")],
    ["Due this week", sourceInvoices.filter((invoice) => invoice.timing.includes("2d"))],
    ["Due 8-30d", sourceInvoices.filter((invoice) => invoice.timing.includes("16d") || invoice.timing.includes("20d"))],
    ["Pending", sourceInvoices.filter((invoice) => invoice.status === "Pending")],
    ["Credit", sourceInvoices.filter((invoice) => invoice.status === "Credit in advance")]
  ] as const;
  return <Report title="Receivables · Aging by Due Date" subtitle="Click any bucket to open the invoice rows"><div className={styles.aging}>{buckets.map(([label, rows]) => <button key={label} onClick={() => onOpen(recordForTable(`${label} invoice bucket`, "MYOB", "invoices", rows))} style={{ flex: Math.max(sumBy(rows, "amount"), 1) }} type="button">{money(sumBy(rows, "amount"))}</button>)}</div><div className={styles.agingLabels}>{buckets.map(([label]) => <b key={label}>{label}</b>)}</div></Report>;
}

function MetricList({ title, rows, onOpen }: { title: string; rows: string[][]; onOpen: (record: DrawerRecord) => void }) {
  return <Report title={title} subtitle="Quarter to date vs target"><div className={styles.metricList}>{rows.map((row) => <button key={row[0]} onClick={() => onOpen(sourceRecord(row[0], "Supabase", "metric_snapshots", [["Metric", row[0]], ["Value", row[1]], ["Comparison", row[2]]]))} type="button"><p>{row[0]}<small>{row[2]}</small></p><b>{row[1]}</b></button>)}</div></Report>;
}

function SimpleList({ title, rows, source, table }: { title: string; rows: string[][]; source: DrawerRecord["source"]; table: string }) {
  const columns = rows[0]?.length === 4 ? ["Source", "Revenue", "Target", "% tgt"] : rows[0]?.length === 3 ? ["Client", "Applied to", "Value"] : ["Metric", "Q2", "Vs Q1"];
  return <Report title={title} subtitle="Click a row to inspect the source table"><DataTable columns={columns} rows={rows.map((row, index) => ({ id: `${title}-${index}`, cells: row, record: sourceRecord(row[0], source, table, row.map((value, fieldIndex) => [columns[fieldIndex] ?? `Field ${fieldIndex + 1}`, value])) }))} /></Report>;
}

function WebsiteCard({ stat, onOpen }: { stat: typeof websiteStats[number]; onOpen: (record: DrawerRecord) => void }) {
  return <Report title={`Traffic · ${stat.domain}`} subtitle="HubSpot traffic analytics · Q2"><KpiGrid compact items={[
    kpi("Sessions", "", stat.sessions.toLocaleString(), "", "neutral", sourceRecord(`${stat.domain} sessions`, "HubSpot", "website_analytics", [["Sessions", stat.sessions], ["Domain", stat.domain]])),
    kpi("New Visitors", "", stat.visitors.toLocaleString(), "", "neutral", sourceRecord(`${stat.domain} visitors`, "HubSpot", "website_analytics", [["Visitors", stat.visitors], ["Domain", stat.domain]])),
    kpi("Page Views", "", stat.pageViews.toLocaleString(), "", "neutral", sourceRecord(`${stat.domain} page views`, "HubSpot", "website_analytics", [["Page views", stat.pageViews], ["Domain", stat.domain]]))
  ]} onOpen={onOpen} /><div className={styles.sourceBars}>{stat.sources.map(([label, value]) => <button key={String(label)} onClick={() => onOpen(sourceRecord(String(label), "HubSpot", "website_analytics", [["Source", label], ["Share", `${value}%`], ["Domain", stat.domain]]))} type="button"><b>{label}</b><i><em style={{ width: `${value}%` }} /></i><strong>{value}%</strong></button>)}</div></Report>;
}

function Forecast({ onOpen }: { onOpen: (record: DrawerRecord) => void }) {
  return <Report title="Forecast · Q3" subtitle="Weighted commit vs $1.80M target"><button className={styles.plainBlock} onClick={() => onOpen(recordForTable("Q3 forecast source deals", "HubSpot", "deals", deals.filter((deal) => deal.status === "open")))} type="button"><div className={styles.bigMetric}>$1.94M</div><p className={styles.goodText}>+ 7.8% vs target · 108% achieved</p><div className={styles.confidence}><span style={{ width: "72%" }} /></div></button></Report>;
}

function ThreeColumn({ onOpen }: { onOpen: (record: DrawerRecord) => void }) {
  return <section className={styles.three}><SimpleList title="Whitespace · Service Coverage" rows={[["Meridian Capital", "3 live", "+ Leadership"], ["Ardenvale Banking", "2 live", "+ Culture"], ["Brunderly Resources", "2 live", "+ Coaching"], ["Northbridge Energy", "1 live", "+ Recovery"]]} source="HubSpot" table="service_coverage" /><MetricList title="Account Health · Distribution" rows={[["Healthy", "118", "83%"], ["Watch", "17", "12%"], ["At risk", "7", "5%"]]} onOpen={onOpen} /><SimpleList title="Renewals · Next 90 Days" rows={[["Coverdale Bank", "$318K", "High"], ["Wilshire Property Trust", "$284K", "High"], ["Catalyst Health Networks", "$352K", "Medium"], ["Quaylan Airways", "$246K", "At risk"]]} source="HubSpot" table="renewals" /></section>;
}

function SourceMap() {
  const rows = [
    ["HubSpot", "companies, contacts, deals, deal_stages", `${companies.length + contacts.length + deals.length + dealStages.length} records`, "CRM pipeline"],
    ["Monday.com", "projects, project_milestones", `${projects.length + milestones.length} records`, "Delivery RAG"],
    ["MYOB", "invoices", `${invoices.length} records`, "Billing and receivables"],
    ["Keep", "job_change_alerts", `${jobChanges.length} records`, "Role-change alerts"]
  ];
  return <Report title="Connected Source Map" subtitle="This is the demo evidence layer: every dashboard object maps to a source table and seeded records"><DataTable columns={["Source", "Tables", "Rows", "Purpose"]} rows={rows.map((row) => ({ id: row[0], cells: row, record: sourceRecord(`${row[0]} connector`, row[0] as DrawerRecord["source"], row[1], [["Rows", row[2]], ["Purpose", row[3]], ["Demo state", "Seeded locally and ready for Supabase upload"]] ) }))} /></Report>;
}

function Insight({ title, children }: { title: string; children: ReactNode }) {
  return <section className={styles.insight}><p>RICH-TEXT WIDGET · EDITORIAL INSIGHT</p><h2>{title}</h2><div>{children}</div></section>;
}

function TwoColumn({ left, right }: { left: ReactNode; right: ReactNode }) {
  return <section className={styles.two}>{left}{right}</section>;
}

function RecordDrawer({ record, onClose }: { record: DrawerRecord; onClose: () => void }) {
  return (
    <aside className={styles.drawer} aria-label="Source record detail">
      <div className={styles.drawerHead}><div><p>{record.source} · {record.table}</p><h2>{record.title}</h2></div><button type="button" onClick={onClose}><X size={20} /></button></div>
      <div className={styles.badges}><span>{record.source}</span><span>{record.table}</span><span>Seeded demo row</span></div>
      <dl>{record.fields.map(([key, value]) => <div key={String(key)}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
      {record.related && <><h3>Related records</h3><dl>{record.related.map(([key, value]) => <div key={String(key)}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></>}
    </aside>
  );
}

function ActionModal({ action, onClose, onSave }: { action: string; onClose: () => void; onSave: (detail: string) => void }) {
  return <div className={styles.modalShade}><section className={styles.modal}><button className={styles.modalClose} type="button" onClick={onClose}><X size={18} /></button><h2>{action}</h2><p>This is a working demo action. It captures a draft write locally, ready to become a HubSpot/Supabase insert once integrations are connected.</p><label>Record name<input defaultValue={action === "New Deal" ? "New leadership programme opportunity" : action} /></label><label>Owner<select defaultValue="dg">{consultants.map((consultant) => <option key={consultant.id} value={consultant.id}>{consultant.name}</option>)}</select></label><div className={styles.modalActions}><button type="button" onClick={onClose}>Cancel</button><button type="button" onClick={() => onSave(`${action} draft saved to the demo activity log.`)}>Save demo record</button></div></section></div>;
}

function ToastCard({ toast, onClose }: { toast: NonNullable<Toast>; onClose: () => void }) {
  return <div className={styles.toast}><button type="button" onClick={onClose}><X size={16} /></button><strong>{toast.title}</strong><p>{toast.detail}</p></div>;
}

function kpi(title: string, subtitle: string, value: string, note: string, tone: string, record: DrawerRecord) {
  return { title, subtitle, value, note, tone, record };
}

function dealRows(sourceDeals: typeof deals, mode: "pipeline" | "account" = "pipeline"): Row[] {
  return sourceDeals.map((deal) => {
    const cells = mode === "account"
      ? [companyName(deal.company), deal.type, deal.source.includes("Referral") ? "Upsell" : "Cross-sell", money(deal.value), stageLabel(deal.stage), deal.consultants.map(consultantInitials).join(" · "), deal.expectedClose]
      : [companyName(deal.company), stageLabel(deal.stage), deal.proposalDate || "-", deal.expectedClose, money(deal.value), `${stageProbability(deal.stage)}%`, deal.lastComms, deal.consultants.map(consultantInitials).join(" · ")];
    return { id: deal.id, cells, record: dealRecord(deal) };
  });
}

function invoiceRows(sourceInvoices: typeof invoices): Row[] {
  return sourceInvoices.map((invoice) => ({ id: invoice.id, cells: [companyName(invoice.company), consultantInitials(invoice.consultant), invoice.engagement, money(invoice.amount), invoice.issued || "-", invoice.due || "-", invoice.status, invoice.timing], record: invoiceRecord(invoice) }));
}

function companyRows(sourceCompanies: typeof companies): Row[] {
  return sourceCompanies.map((company, index) => ({ id: company.id, cells: [company.name, consultantName(company.owner), money(company.annualRevenue), company.health, ["4 days ago", "1 week ago", "3 weeks ago", "6 days ago", "5 weeks ago"][index % 5], `+${company.nps}`, `${company.servicesLive} of 4`, money(company.expansion)], record: companyRecord(company) }));
}

function leadRows(): Row[] {
  const rows = [
    ["Harborline Group", "Olivia", "Hartley", "GM People & Culture", "07 Jun", "Website form", "Leadership Development", "Awaiting allocation"],
    ["Telvana", "Raj", "Patel", "Head of Talent", "06 Jun", "Website form", "High Performance Culture", "Awaiting allocation"],
    ["Wattleworth Group", "Sarah", "Nguyen", "Chief People Officer", "05 Jun", "Referral", "Organisational Performance", "Daniel Gavan"],
    ["Ardenvale Banking Group", "James", "Carter", "Executive GM", "04 Jun", "Website form", "Executive & Leadership Coaching", "Andrew Taylor"],
    ["Quaylan Airways", "Emily", "Watson", "L&D Director", "03 Jun", "LinkedIn", "Leadership Development", "Awaiting allocation"]
  ];
  return rows.map((row) => ({ id: row.join("-"), cells: row, record: sourceRecord(row[0], "HubSpot", "contacts + leads", row.map((value, index) => [["Company", "First name", "Last name", "Title", "Received", "Source", "Lead type", "Consultant"][index], value])) }));
}

function stageSummaryRows(sourceDeals: typeof deals): Row[] {
  const total = Math.max(sumBy(sourceDeals, "value"), 1);
  return dealStages.map((stage) => {
    const stageDeals = sourceDeals.filter((deal) => deal.stage === stage.id);
    const value = sumBy(stageDeals, "value");
    return { id: stage.id, cells: [stage.label, String(stageDeals.length), money(value), money(Math.round(value / Math.max(stageDeals.length, 1))), `${Math.round((value / total) * 100)}%`], record: recordForTable(`${stage.label} marketing rows`, "HubSpot", "deals", stageDeals) };
  });
}

function dealRecord(deal: typeof deals[number]): DrawerRecord {
  const company = companies.find((item) => item.id === deal.company);
  const contact = contacts.find((item) => item.id === deal.contact);
  return {
    title: companyName(deal.company),
    source: "HubSpot",
    table: "deals",
    fields: [["Deal ID", deal.id], ["Company ID", deal.company], ["Contact ID", deal.contact], ["Stage", stageLabel(deal.stage)], ["Probability", `${stageProbability(deal.stage)}%`], ["Value", money(deal.value)], ["Status", deal.status], ["Source", deal.source], ["Consultants", deal.consultants.map(consultantInitials).join(" · ")]],
    related: [["Company", company?.name ?? deal.company], ["Contact", contact ? `${contact.first} ${contact.last} · ${contact.title}` : "-"], ["Project", projects.find((project) => project.deal === deal.id)?.name ?? "No Monday project yet"], ["Invoice rows", String(invoices.filter((invoice) => invoice.company === deal.company).length)]]
  };
}

function invoiceRecord(invoice: typeof invoices[number]): DrawerRecord {
  return {
    title: `${companyName(invoice.company)} · ${invoice.engagement}`,
    source: "MYOB",
    table: "invoices",
    fields: [["Invoice ID", invoice.id], ["Company ID", invoice.company], ["Consultant ID", invoice.consultant], ["Amount", money(invoice.amount)], ["Issued", invoice.issued || "-"], ["Due", invoice.due || "-"], ["Status", invoice.status], ["Timing", invoice.timing]],
    related: [["Company", companyName(invoice.company)], ["Consultant", consultantName(invoice.consultant)], ["Related deals", String(deals.filter((deal) => deal.company === invoice.company).length)]]
  };
}

function companyRecord(company: typeof companies[number]): DrawerRecord {
  return {
    title: company.name,
    source: "HubSpot",
    table: "companies",
    fields: [["Company ID", company.id], ["Owner", consultantName(company.owner)], ["Annual revenue", money(company.annualRevenue)], ["Health", company.health], ["NPS", `+${company.nps}`], ["Services live", `${company.servicesLive} of 4`], ["Expansion value", money(company.expansion)]],
    related: [["Contacts", String(contacts.filter((contact) => contact.company === company.id).length)], ["Deals", String(deals.filter((deal) => deal.company === company.id).length)], ["Invoices", String(invoices.filter((invoice) => invoice.company === company.id).length)]]
  };
}

function projectRecord(project: typeof projects[number]): DrawerRecord {
  const deal = deals.find((item) => item.id === project.deal);
  return {
    title: project.name,
    source: "Monday.com",
    table: "projects",
    fields: [["Project ID", project.id], ["Deal ID", project.deal], ["Progress", `${project.progress}%`], ["RAG", project.rag], ["Next milestone", project.next], ["Lead", consultantName(project.lead)], ["Start", project.start], ["Margin", `${project.margin}%`]],
    related: [["HubSpot deal", deal ? `${companyName(deal.company)} · ${money(deal.value)}` : "-"], ["Milestones", milestones.filter((milestone) => milestone.project === project.id).map((milestone) => milestone.title).join(", ") || "-"]]
  };
}

function taskRecord(task: typeof tasks[number]): DrawerRecord {
  return sourceRecord(task.summary, "HubSpot", "tasks", [["Type", task.type], ["Detail", task.detail], ["Company", companyName(task.company)], ["Contact", contactName(task.contact)], ["Due", task.due], ["Timing", task.timing]]);
}

function recordForTable(title: string, source: DrawerRecord["source"], table: string, rows: Array<Record<string, unknown>>): DrawerRecord {
  return sourceRecord(title, source, table, [["Rows", rows.length], ["Record IDs", rows.map((row) => String(row.id ?? row.name ?? row.title)).join(", ") || "-"], ["Demo truth", "These rows are imported from lib/mock-data.ts and shaped to match the Supabase reporting tables."]]);
}

function sourceRecord(title: string, source: DrawerRecord["source"], table: string, fields: Array<[string, ReactNode]>): DrawerRecord {
  return { title, source, table, fields };
}

function weightedValue(sourceDeals: typeof deals) {
  return sourceDeals.reduce((sum, deal) => sum + deal.value * (stageProbability(deal.stage) / 100), 0);
}

function dealInRange(deal: typeof deals[number], range: DateRange) {
  const date = firstDate([deal.closeDate, deal.created, deal.proposalDate, deal.expectedClose, deal.lastComms]);
  return date ? isWithinRange(date, range) : range === "ytd";
}

function invoiceInRange(invoice: typeof invoices[number], range: DateRange) {
  const date = firstDate([invoice.issued, invoice.due]);
  return date ? isWithinRange(date, range) : range === "quarter-q4" || range === "ytd";
}

function firstDate(values: Array<string | undefined>) {
  for (const value of values) {
    const parsed = parseDemoDate(value);
    if (parsed) return parsed;
  }
  return null;
}

function parseDemoDate(value?: string) {
  if (!value || value === "-") return null;
  const match = value.match(/^(\d{1,2})\s([A-Za-z]{3})(?:\s(\d{4}))?$/);
  if (!match) return null;
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(match[2]);
  if (month < 0) return null;
  const year = match[3] ? Number(match[3]) : month >= 6 ? 2025 : 2026;
  return new Date(Date.UTC(year, month, Number(match[1])));
}

function isWithinRange(date: Date, range: DateRange) {
  const option = dateRangeOptions.find((item) => item.id === range) ?? dateRangeOptions.find((item) => item.id === "quarter-q4");
  if (!option) return true;
  const time = date.getTime();
  return time >= option.start.getTime() && time <= option.end.getTime();
}

function rangeLabel(range: DateRange) {
  return dateRangeOptions.find((option) => option.id === range)?.label ?? "selected period";
}

function utcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day));
}

function projectDealValue(sourceProjects: typeof projects) {
  return sourceProjects.reduce((sum, project) => sum + (deals.find((deal) => deal.id === project.deal)?.value ?? 0), 0);
}

function sumBy<T extends Record<string, unknown>>(rows: T[], field: keyof T) {
  return rows.reduce((sum, row) => sum + (typeof row[field] === "number" ? row[field] as number : 0), 0);
}

function stageLabel(id: string) {
  return dealStages.find((stage) => stage.id === id)?.label ?? id;
}

function stageProbability(id: string) {
  return dealStages.find((stage) => stage.id === id)?.probability ?? 0;
}

function consultantName(id: string) {
  return consultants.find((consultant) => consultant.id === id)?.name ?? id;
}
