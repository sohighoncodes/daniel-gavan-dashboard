export type Tone = "good" | "warn" | "bad" | "neutral" | "blue" | "gold";
export type Deal = {
  id: string;
  company: string;
  contact: string;
  stage: string;
  value: number;
  proposalDate: string;
  expectedClose: string;
  closeDate: string;
  lastComms: string;
  consultants: string[];
  source: string;
  type: string;
  created: string;
  status: "open" | "won" | "lost";
  term?: string;
  lossReason?: string;
  reviewDone?: boolean;
  reviewer?: string;
  comments?: string;
};
export type Invoice = {
  id: string;
  company: string;
  consultant: string;
  engagement: string;
  amount: number;
  issued: string;
  due: string;
  status: "Overdue" | "Outstanding" | "Paid" | "Pending" | "Credit in advance";
  timing: string;
};

export const consultants = [
  { id: "dg", name: "Daniel Gavan", initials: "DG", role: "Principal", target: 398000 },
  { id: "at", name: "Andrew Taylor", initials: "AT", role: "Senior Consultant", target: 300000 },
  { id: "sc", name: "Sarah Chen", initials: "SC", role: "Senior Consultant", target: 300000 },
  { id: "mo", name: "Michael O'Brien", initials: "MO", role: "Senior Consultant", target: 300000 },
  { id: "ps", name: "Priya Sharma", initials: "PS", role: "Consultant", target: 200000 },
  { id: "jh", name: "James Holloway", initials: "JH", role: "Consultant", target: 200000 },
  { id: "ew", name: "Emma Whitfield", initials: "EW", role: "Consultant", target: 180000 },
  { id: "nr", name: "Nathan Reid", initials: "NR", role: "Consultant", target: 160000 },
  { id: "ob", name: "Olivia Bennett", initials: "OB", role: "Consultant", target: 150000 },
  { id: "mw", name: "Marcus Webb", initials: "MW", role: "Associate", target: 130000 },
  { id: "sl", name: "Sophie Lambert", initials: "SL", role: "Associate", target: 120000 },
  { id: "tf", name: "Tom Fitzgerald", initials: "TF", role: "Associate", target: 110000 },
  { id: "ip", name: "Isabella Park", initials: "IP", role: "Associate", target: 100000 },
  { id: "rm", name: "Ryan Mitchell", initials: "RM", role: "Associate", target: 95000 },
  { id: "cg", name: "Charlotte Greene", initials: "CG", role: "Associate", target: 90000 }
];

export const companies = [
  { id: "meridian", name: "Meridian Capital Partners", owner: "dg", annualRevenue: 684000, health: "Healthy", nps: 82, servicesLive: 3, expansion: 180000 },
  { id: "ardenvale", name: "Ardenvale Banking Group", owner: "at", annualRevenue: 612000, health: "Healthy", nps: 74, servicesLive: 2, expansion: 240000 },
  { id: "brunderly", name: "Brunderly Resources", owner: "sc", annualRevenue: 548000, health: "Watch", nps: 61, servicesLive: 2, expansion: 160000 },
  { id: "harborline", name: "Harborline", owner: "dg", annualRevenue: 498000, health: "Healthy", nps: 79, servicesLive: 3, expansion: 120000 },
  { id: "northbridge", name: "Northbridge Energy", owner: "mo", annualRevenue: 442000, health: "At risk", nps: 48, servicesLive: 1, expansion: 300000 },
  { id: "stratton", name: "Stratton Tech Group", owner: "ps", annualRevenue: 396000, health: "Healthy", nps: 85, servicesLive: 2, expansion: 140000 },
  { id: "catalyst", name: "Catalyst Health Networks", owner: "ew", annualRevenue: 352000, health: "Watch", nps: 58, servicesLive: 1, expansion: 190000 },
  { id: "coverdale", name: "Coverdale Bank", owner: "at", annualRevenue: 318000, health: "Healthy", nps: 71, servicesLive: 2, expansion: 130000 },
  { id: "wilshire", name: "Wilshire Property Trust", owner: "nr", annualRevenue: 284000, health: "Healthy", nps: 76, servicesLive: 2, expansion: 95000 },
  { id: "quaylan", name: "Quaylan Airways", owner: "sc", annualRevenue: 246000, health: "Watch", nps: 55, servicesLive: 1, expansion: 150000 },
  { id: "raven", name: "Ravensbourne Holdings", owner: "dg", annualRevenue: 340000, health: "Healthy", nps: 77, servicesLive: 2, expansion: 85000 },
  { id: "apex", name: "Apex Insurance Group", owner: "dg", annualRevenue: 385000, health: "Healthy", nps: 73, servicesLive: 2, expansion: 110000 },
  { id: "pennifold", name: "Pennifold Wealth Management", owner: "mo", annualRevenue: 385000, health: "Healthy", nps: 69, servicesLive: 2, expansion: 90000 },
  { id: "clearwater", name: "Clearwater Foods Australia", owner: "mo", annualRevenue: 285000, health: "Watch", nps: 63, servicesLive: 1, expansion: 70000 },
  { id: "aureus", name: "Aureus Pharmaceuticals", owner: "ip", annualRevenue: 172000, health: "At risk", nps: 42, servicesLive: 1, expansion: 60000 },
  { id: "brightford", name: "Brightford Holdings", owner: "at", annualRevenue: 312000, health: "Healthy", nps: 71, servicesLive: 2, expansion: 70000 },
  { id: "kingsford", name: "Kingsford Energy Co", owner: "dg", annualRevenue: 264000, health: "Healthy", nps: 72, servicesLive: 2, expansion: 68000 },
  { id: "caversham", name: "Caversham Capital", owner: "at", annualRevenue: 198000, health: "Healthy", nps: 68, servicesLive: 1, expansion: 38000 },
  { id: "whitestone", name: "Whitestone Industries", owner: "sc", annualRevenue: 420000, health: "Healthy", nps: 75, servicesLive: 2, expansion: 84000 },
  { id: "brigadier", name: "Brigadier Insurance", owner: "mo", annualRevenue: 430000, health: "Healthy", nps: 70, servicesLive: 2, expansion: 112000 },
  { id: "cordell", name: "Cordell Industrial", owner: "dg", annualRevenue: 187000, health: "Lost", nps: 44, servicesLive: 0, expansion: 0 },
  { id: "norwood", name: "Norwood Retail Group", owner: "rm", annualRevenue: 62000, health: "Lost", nps: 38, servicesLive: 0, expansion: 0 }
];

export const contacts = [
  { id: "janet", company: "meridian", first: "Janet", last: "Holmes", title: "CFO", email: "janet.holmes@meridian.com.au", owner: "dg", lastActivityDays: 2 },
  { id: "robert", company: "apex", first: "Robert", last: "Kane", title: "COO", email: "robert.kane@apexinsure.com.au", owner: "dg", lastActivityDays: 3 },
  { id: "mark", company: "harborline", first: "Mark", last: "Davies", title: "MD", email: "mark.davies@harborline.com.au", owner: "dg", lastActivityDays: 4 },
  { id: "jamesliu", company: "stratton", first: "James", last: "Liu", title: "CTO", email: "james.liu@strattontech.com.au", owner: "ps", lastActivityDays: 1 },
  { id: "peter", company: "pennifold", first: "Peter", last: "Vance", title: "COO", email: "peter.vance@pennifold.com.au", owner: "mo", lastActivityDays: 12 },
  { id: "tom", company: "brightford", first: "Tom", last: "Reed", title: "Partner", email: "tom.reed@brightford.com.au", owner: "at", lastActivityDays: 7 },
  { id: "olivia", company: "raven", first: "Olivia", last: "Hart", title: "CFO", email: "olivia.hart@ravensbourne.com.au", owner: "dg", lastActivityDays: 5 },
  { id: "david", company: "aureus", first: "David", last: "Chen", title: "VP People", email: "david.chen@aureuspharma.com.au", owner: "ip", lastActivityDays: 38 },
  { id: "hugh", company: "northbridge", first: "Hugh", last: "Bennett", title: "COO", email: "hugh.bennett@northbridge.com.au", owner: "mo", lastActivityDays: 30 },
  { id: "rebecca", company: "brightford", first: "Rebecca", last: "Lawson", title: "Chief People Officer", email: "rebecca.lawson@meridian.com.au", owner: "dg", lastActivityDays: 9 },
  { id: "danielokafor", company: "cordell", first: "Daniel", last: "Okafor", title: "Chief Operating Officer", email: "daniel.okafor@harborline.com.au", owner: "sc", lastActivityDays: 11 },
  { id: "sophie", company: "apex", first: "Sophie", last: "Nguyen", title: "Head of Talent", email: "sophie.nguyen@apexinsure.com.au", owner: "sc", lastActivityDays: 14 }
];

export const dealStages = [
  { id: "identified", label: "Opportunity identified", probability: 10, color: "#cdb05f" },
  { id: "solution", label: "Solution development & Pricing Optimisation", probability: 20, color: "#d8bd77" },
  { id: "proposal", label: "Proposal submitted", probability: 50, color: "#dfc885" },
  { id: "planning", label: "Planning & Contract Optimisation", probability: 80, color: "#c6a157" },
  { id: "awaiting", label: "Awaiting signed contract", probability: 90, color: "#b18b46" },
  { id: "won", label: "Contract Won", probability: 100, color: "#10bca6" }
];

const q4Deals: Deal[] = [
  { id: "d1", company: "meridian", contact: "janet", stage: "awaiting", value: 420000, proposalDate: "12 Apr", expectedClose: "28 May", closeDate: "", lastComms: "02 Jun", consultants: ["dg", "at"], source: "LinkedIn (Organic)", type: "Leadership Development", created: "24 Apr", status: "open" },
  { id: "d2", company: "apex", contact: "robert", stage: "awaiting", value: 385000, proposalDate: "15 Apr", expectedClose: "30 May", closeDate: "", lastComms: "01 Jun", consultants: ["dg", "sc"], source: "Website form", type: "Executive Coaching", created: "21 Apr", status: "open" },
  { id: "d3", company: "brightford", contact: "tom", stage: "awaiting", value: 312000, proposalDate: "18 Apr", expectedClose: "24 May", closeDate: "", lastComms: "28 May", consultants: ["at", "ps"], source: "Referral · Partner", type: "High Performance Culture", created: "20 Apr", status: "open" },
  { id: "d4", company: "harborline", contact: "mark", stage: "planning", value: 285000, proposalDate: "20 Apr", expectedClose: "14 Jun", closeDate: "", lastComms: "03 Jun", consultants: ["dg", "mo"], source: "Website form", type: "High Performance Culture", created: "29 May", status: "open" },
  { id: "d5", company: "northbridge", contact: "hugh", stage: "planning", value: 264000, proposalDate: "22 Apr", expectedClose: "18 Jun", closeDate: "", lastComms: "30 May", consultants: ["sc", "ew"], source: "Direct (Inbound)", type: "Culture sprint", created: "19 May", status: "open" },
  { id: "d6", company: "stratton", contact: "jamesliu", stage: "planning", value: 240000, proposalDate: "25 Apr", expectedClose: "10 Jun", closeDate: "", lastComms: "04 Jun", consultants: ["dg", "jh"], source: "Event · Speaking", type: "Leadership Development", created: "28 May", status: "open" },
  { id: "d7", company: "catalyst", contact: "sophie", stage: "planning", value: 218000, proposalDate: "26 Apr", expectedClose: "06 Jun", closeDate: "", lastComms: "29 May", consultants: ["at", "nr"], source: "Website form", type: "Organisational Performance", created: "30 May", status: "open" },
  { id: "d8", company: "pennifold", contact: "peter", stage: "proposal", value: 385000, proposalDate: "02 May", expectedClose: "28 Jun", closeDate: "", lastComms: "27 May", consultants: ["dg", "sc"], source: "Referral · Partner", type: "Strategy offsite", created: "09 May", status: "open" },
  { id: "d9", company: "wilshire", contact: "tom", stage: "proposal", value: 324000, proposalDate: "04 May", expectedClose: "20 Jun", closeDate: "", lastComms: "26 May", consultants: ["at", "mw"], source: "LinkedIn (Organic)", type: "Diagnostic", created: "05 May", status: "open" },
  { id: "d10", company: "clearwater", contact: "peter", stage: "proposal", value: 285000, proposalDate: "06 May", expectedClose: "30 Jun", closeDate: "", lastComms: "25 May", consultants: ["mo", "ob"], source: "Direct (Inbound)", type: "Workshop series", created: "03 May", status: "open" },
  { id: "d11", company: "aureus", contact: "david", stage: "identified", value: 172000, proposalDate: "", expectedClose: "30 Jul", closeDate: "", lastComms: "18 May", consultants: ["dg", "ip"], source: "Content · Download", type: "Diagnostic prepaid", created: "22 May", status: "open" },
  { id: "d12", company: "raven", contact: "olivia", stage: "won", value: 340000, proposalDate: "18 Apr", expectedClose: "23 Jun", closeDate: "22 May", lastComms: "03 Jun", consultants: ["dg", "at"], source: "Referral · Partner", type: "Exec Programme", created: "15 Apr", status: "won", term: "12-month programme" },
  { id: "d13", company: "kingsford", contact: "robert", stage: "won", value: 264000, proposalDate: "12 Apr", expectedClose: "20 May", closeDate: "09 May", lastComms: "26 May", consultants: ["dg", "mo"], source: "Website form", type: "Diagnostic phase", created: "02 Apr", status: "won", term: "9-month programme" },
  { id: "d14", company: "caversham", contact: "olivia", stage: "won", value: 198000, proposalDate: "08 Apr", expectedClose: "12 May", closeDate: "02 May", lastComms: "18 May", consultants: ["at", "ps"], source: "Event · AHRI", type: "Advisory retainer", created: "26 Mar", status: "won", term: "4-month diagnostic" },
  { id: "d15", company: "cordell", contact: "danielokafor", stage: "proposal", value: 187000, proposalDate: "14 Mar", expectedClose: "02 May", closeDate: "14 Mar", lastComms: "08 Apr", consultants: ["dg"], source: "Direct (Inbound)", type: "Organisational Performance", created: "18 Feb", status: "lost", lossReason: "Lost to incumbent", reviewDone: true, reviewer: "AT", comments: "Incumbent discounted 30% at final stage" },
  { id: "d16", company: "norwood", contact: "danielokafor", stage: "identified", value: 62000, proposalDate: "", expectedClose: "02 May", closeDate: "02 May", lastComms: "18 Apr", consultants: ["rm"], source: "Website form", type: "Leadership Development", created: "28 Mar", status: "lost", lossReason: "No decision", reviewDone: false, reviewer: "", comments: "Sponsor departed; no replacement" }
];

const monthlyDealSeeds = [
  { key: "jul25", mon: "Jul", year: 2025, companies: ["coverdale", "harborline", "aureus"], contacts: ["tom", "mark", "david"], stages: ["won", "proposal", "lost"], statuses: ["won", "open", "lost"], values: [318000, 145000, 72000], consultants: [["at"], ["dg", "jh"], ["ip"]], sources: ["Website form", "LinkedIn (Organic)", "Content · Download"], types: ["Leadership 360", "High Performance Culture", "Diagnostic"], note: "winter reset" },
  { key: "aug25", mon: "Aug", year: 2025, companies: ["quaylan", "brightford", "northbridge"], contacts: ["sophie", "tom", "hugh"], stages: ["planning", "won", "identified"], statuses: ["open", "won", "open"], values: [150000, 276000, 92000], consultants: [["sc"], ["at", "ps"], ["mo"]], sources: ["Referral · Partner", "Event · Speaking", "Direct (Inbound)"], types: ["Executive Coaching", "Culture sprint", "Organisational Performance"], note: "late winter pipeline" },
  { key: "sep25", mon: "Sep", year: 2025, companies: ["meridian", "whitestone", "stratton"], contacts: ["janet", "rebecca", "jamesliu"], stages: ["won", "awaiting", "proposal"], statuses: ["won", "open", "open"], values: [684000, 420000, 190000], consultants: [["dg", "at"], ["sc"], ["ps", "jh"]], sources: ["LinkedIn (Organic)", "Referral · Partner", "Website form"], types: ["Leadership Development", "Leadership series", "Tech leadership"], note: "strong close month" },
  { key: "oct25", mon: "Oct", year: 2025, companies: ["catalyst", "raven", "pennifold"], contacts: ["sophie", "olivia", "peter"], stages: ["solution", "won", "planning"], statuses: ["open", "won", "open"], values: [210000, 340000, 185000], consultants: [["ew"], ["dg", "at"], ["mo"]], sources: ["Website form", "Referral · Partner", "Direct (Inbound)"], types: ["Org performance diagnostic", "Exec Programme", "Strategy offsite"], note: "new FY momentum" },
  { key: "nov25", mon: "Nov", year: 2025, companies: ["ardenvale", "brunderly", "clearwater"], contacts: ["tom", "danielokafor", "peter"], stages: ["awaiting", "proposal", "lost"], statuses: ["open", "open", "lost"], values: [240000, 160000, 83000], consultants: [["at"], ["sc"], ["mo", "ob"]], sources: ["Event · AHRI", "Website form", "Direct (Inbound)"], types: ["Executive Coaching", "High Performance Culture", "Workshop series"], note: "mixed conversion" },
  { key: "dec25", mon: "Dec", year: 2025, companies: ["brigadier", "wilshire", "norwood"], contacts: ["robert", "tom", "danielokafor"], stages: ["won", "solution", "lost"], statuses: ["won", "open", "lost"], values: [430000, 95000, 62000], consultants: [["mo", "jh"], ["nr"], ["rm"]], sources: ["VMC Upgrade", "LinkedIn (Organic)", "Website form"], types: ["Annual 360", "Diagnostic", "Leadership Development"], note: "holiday slowdown" },
  { key: "jan26", mon: "Jan", year: 2026, companies: ["harborline", "apex", "coverdale"], contacts: ["mark", "robert", "tom"], stages: ["planning", "won", "identified"], statuses: ["open", "won", "open"], values: [225000, 385000, 87000], consultants: [["dg"], ["dg", "sc"], ["at"]], sources: ["Website form", "Referral · Partner", "Content · Download"], types: ["Group Exec Programme", "Executive Coaching", "Leadership pulse"], note: "restart after break" },
  { key: "feb26", mon: "Feb", year: 2026, companies: ["stratton", "quaylan", "cordell"], contacts: ["jamesliu", "sophie", "danielokafor"], stages: ["won", "proposal", "lost"], statuses: ["won", "open", "lost"], values: [240000, 150000, 187000], consultants: [["ps", "jh"], ["sc"], ["dg"]], sources: ["Event · Speaking", "Website form", "Direct (Inbound)"], types: ["Leadership Development", "Executive & Leadership Coaching", "Organisational Performance"], note: "loss review spike" },
  { key: "mar26", mon: "Mar", year: 2026, companies: ["meridian", "aureus", "caversham"], contacts: ["janet", "david", "olivia"], stages: ["awaiting", "identified", "won"], statuses: ["open", "open", "won"], values: [390000, 172000, 198000], consultants: [["dg"], ["ip"], ["at", "ps"]], sources: ["LinkedIn (Organic)", "Content · Download", "Event · AHRI"], types: ["Leadership Development", "Diagnostic prepaid", "Advisory retainer"], note: "Q3 build" },
  { key: "apr26", mon: "Apr", year: 2026, companies: ["kingsford", "whitestone", "brightford"], contacts: ["robert", "rebecca", "tom"], stages: ["won", "proposal", "awaiting"], statuses: ["won", "open", "open"], values: [264000, 420000, 312000], consultants: [["dg", "mo"], ["sc"], ["at", "ps"]], sources: ["Website form", "Referral · Partner", "Referral · Partner"], types: ["Diagnostic phase", "Leadership offsite", "High Performance Culture"], note: "Q4 opens" },
  { key: "may26", mon: "May", year: 2026, companies: ["raven", "clearwater", "northbridge"], contacts: ["olivia", "peter", "hugh"], stages: ["won", "proposal", "planning"], statuses: ["won", "open", "open"], values: [340000, 285000, 264000], consultants: [["dg", "at"], ["mo", "ob"], ["sc", "ew"]], sources: ["Referral · Partner", "Direct (Inbound)", "Direct (Inbound)"], types: ["Exec Programme", "Workshop series", "Culture sprint"], note: "collections pressure" },
  { key: "jun26", mon: "Jun", year: 2026, companies: ["meridian", "apex", "harborline"], contacts: ["janet", "robert", "mark"], stages: ["awaiting", "awaiting", "planning"], statuses: ["open", "open", "open"], values: [420000, 385000, 285000], consultants: [["dg", "at"], ["dg", "sc"], ["dg", "mo"]], sources: ["LinkedIn (Organic)", "Website form", "Website form"], types: ["Leadership Development", "Executive Coaching", "High Performance Culture"], note: "EOFY close-outs" }
] as const;

const annualDeals: Deal[] = monthlyDealSeeds.flatMap((seed, monthIndex) => seed.companies.map((company, dealIndex) => {
  const status = seed.statuses[dealIndex] as Deal["status"];
  const stage = status === "won" ? "won" : seed.stages[dealIndex];
  const createdDay = 3 + dealIndex * 6;
  const proposalDay = 10 + dealIndex * 5;
  const closeDay = 20 + dealIndex * 3;
  return {
    id: `fy26-${seed.key}-${dealIndex + 1}`,
    company,
    contact: seed.contacts[dealIndex],
    stage,
    value: seed.values[dealIndex],
    proposalDate: stage === "identified" ? "" : `${proposalDay} ${seed.mon} ${seed.year}`,
    expectedClose: `${Math.min(closeDay + 9, 28)} ${seed.mon} ${seed.year}`,
    closeDate: status === "open" ? "" : `${closeDay} ${seed.mon} ${seed.year}`,
    lastComms: `${Math.min(closeDay + 5, 28)} ${seed.mon} ${seed.year}`,
    consultants: [...seed.consultants[dealIndex]],
    source: seed.sources[dealIndex],
    type: seed.types[dealIndex],
    created: `${createdDay} ${seed.mon} ${seed.year}`,
    status,
    term: status === "won" ? (monthIndex % 3 === 0 ? "12-month programme" : monthIndex % 3 === 1 ? "6-month engagement" : "4-month diagnostic") : undefined,
    lossReason: status === "lost" ? (monthIndex % 2 === 0 ? "Budget deferred" : "Lost to incumbent") : undefined,
    reviewDone: status === "lost" ? monthIndex % 2 === 0 : undefined,
    reviewer: status === "lost" ? consultantInitials(seed.consultants[dealIndex][0]) : undefined,
    comments: status === "lost" ? `${seed.note}; post-loss follow-up required` : undefined
  };
}));

export const deals: Deal[] = [...annualDeals, ...q4Deals];

export const projects = [
  { id: "p1", deal: "d12", name: "Ravensbourne · Exec Programme", progress: 72, rag: "Green", next: "Milestone 7 due 22 May", lead: "dg", start: "10 Jun", margin: 68 },
  { id: "p2", deal: "d4", name: "Harborline · Group Exec Programme", progress: 72, rag: "Green", next: "Module 7 launch", lead: "dg", start: "17 Jun", margin: 71 },
  { id: "p3", deal: "d5", name: "Marrendale · Banking Offsite", progress: 60, rag: "Green", next: "Milestone 4 due 14 Jun", lead: "dg", start: "24 Jun", margin: 64 },
  { id: "p4", deal: "d2", name: "Apturra Software · Engineering Leaders", progress: 40, rag: "Amber", next: "Discovery sprint · wk 1", lead: "at", start: "03 Jun", margin: 58 },
  { id: "p5", deal: "d7", name: "Stonehaven Mutual · Executive Coaching", progress: 25, rag: "Red", next: "Milestone 2 overdue 12 days", lead: "at", start: "03 Jun", margin: 42 },
  { id: "p6", deal: "d6", name: "Realto Media Group · 360 Rollout", progress: 92, rag: "Green", next: "Milestone 9 due 07 May", lead: "jh", start: "15 Jun", margin: 73 }
];

export const milestones = [
  { project: "p2", title: "Harborline · Module 7 launch", due: "Mon", status: "ready" },
  { project: "p3", title: "Telvana · Survey close", due: "Wed", status: "on" },
  { project: "p6", title: "Realto · Final reports", due: "Thu", status: "draft" },
  { project: "p5", title: "Stonehaven Mutual · Recovery call", due: "Fri", status: "urgent" }
];

const q4Invoices: Invoice[] = [
  { id: "i1", company: "northbridge", consultant: "sc", engagement: "Culture sprint", amount: 96000, issued: "18 Apr", due: "18 May", status: "Overdue", timing: "20d overdue" },
  { id: "i2", company: "catalyst", consultant: "at", engagement: "Leadership 360", amount: 72000, issued: "26 Apr", due: "26 May", status: "Overdue", timing: "12d overdue" },
  { id: "i3", company: "clearwater", consultant: "ob", engagement: "Workshop series", amount: 38000, issued: "22 Apr", due: "22 May", status: "Overdue", timing: "16d overdue" },
  { id: "i4", company: "kingsford", consultant: "dg", engagement: "Diagnostic phase", amount: 48000, issued: "02 May", due: "01 Jun", status: "Overdue", timing: "6d overdue" },
  { id: "i5", company: "pennifold", consultant: "mo", engagement: "Strategy offsite", amount: 64000, issued: "10 May", due: "09 Jun", status: "Outstanding", timing: "due in 2d" },
  { id: "i6", company: "raven", consultant: "dg", engagement: "Exec programme · M1", amount: 85000, issued: "24 May", due: "23 Jun", status: "Outstanding", timing: "due in 16d" },
  { id: "i7", company: "harborline", consultant: "mo", engagement: "Mobilisation", amount: 44000, issued: "28 May", due: "27 Jun", status: "Outstanding", timing: "due in 20d" },
  { id: "i8", company: "meridian", consultant: "dg", engagement: "Mobilisation", amount: 40000, issued: "28 May", due: "27 Jun", status: "Outstanding", timing: "due in 20d" },
  { id: "i9", company: "whitestone", consultant: "sc", engagement: "Leadership offsite", amount: 42000, issued: "28 Apr", due: "28 May", status: "Paid", timing: "paid 26 May" },
  { id: "i10", company: "caversham", consultant: "at", engagement: "Phase 1 · complete", amount: 52000, issued: "", due: "", status: "Pending", timing: "work complete · to invoice" },
  { id: "i11", company: "brigadier", consultant: "mo", engagement: "Annual 360 · FY27", amount: 112000, issued: "", due: "", status: "Credit in advance", timing: "prepaid before EOFY" }
];

const monthlyInvoiceSeeds = [
  { mon: "Jul", year: 2025, rows: [["coverdale", "at", "Leadership 360", 76000, "Paid", "paid 31 Jul"], ["harborline", "dg", "Culture sprint", 48000, "Outstanding", "due in 9d"]] },
  { mon: "Aug", year: 2025, rows: [["brightford", "at", "Culture programme", 82000, "Paid", "paid 29 Aug"], ["quaylan", "sc", "Executive coaching", 42000, "Pending", "work complete · to invoice"]] },
  { mon: "Sep", year: 2025, rows: [["meridian", "dg", "Leadership development", 142000, "Paid", "paid 27 Sep"], ["whitestone", "sc", "Leadership series", 94000, "Outstanding", "due in 14d"]] },
  { mon: "Oct", year: 2025, rows: [["raven", "dg", "Exec programme · M1", 85000, "Paid", "paid 25 Oct"], ["catalyst", "ew", "Org performance diagnostic", 52000, "Overdue", "8d overdue"]] },
  { mon: "Nov", year: 2025, rows: [["ardenvale", "at", "Executive coaching", 68000, "Outstanding", "due in 11d"], ["brunderly", "sc", "High performance culture", 44000, "Pending", "scope approved · to bill"]] },
  { mon: "Dec", year: 2025, rows: [["brigadier", "mo", "Annual 360", 112000, "Credit in advance", "prepaid before Christmas"], ["wilshire", "nr", "Diagnostic", 38000, "Paid", "paid 22 Dec"]] },
  { mon: "Jan", year: 2026, rows: [["apex", "dg", "Executive coaching", 96000, "Paid", "paid 30 Jan"], ["harborline", "dg", "Group exec mobilisation", 54000, "Outstanding", "due in 18d"]] },
  { mon: "Feb", year: 2026, rows: [["stratton", "ps", "Leadership development", 64000, "Paid", "paid 26 Feb"], ["quaylan", "sc", "Executive coaching", 50000, "Overdue", "15d overdue"]] },
  { mon: "Mar", year: 2026, rows: [["caversham", "at", "Advisory retainer", 52000, "Paid", "paid 25 Mar"], ["aureus", "ip", "Diagnostic prepaid", 24000, "Credit in advance", "prepaid diagnostic"]] },
  { mon: "Apr", year: 2026, rows: [["kingsford", "dg", "Diagnostic phase", 48000, "Overdue", "6d overdue"], ["whitestone", "sc", "Leadership offsite", 42000, "Paid", "paid 26 May"]] },
  { mon: "May", year: 2026, rows: [["raven", "dg", "Exec programme · M1", 85000, "Outstanding", "due in 16d"], ["clearwater", "ob", "Workshop series", 38000, "Overdue", "16d overdue"]] },
  { mon: "Jun", year: 2026, rows: [["meridian", "dg", "Mobilisation", 40000, "Outstanding", "due in 20d"], ["harborline", "mo", "Mobilisation", 44000, "Pending", "work complete · to invoice"]] }
] as const;

const annualInvoices: Invoice[] = monthlyInvoiceSeeds.flatMap((seed, monthIndex) => seed.rows.map((row, rowIndex) => ({
  id: `fy26-inv-${seed.mon.toLowerCase()}-${rowIndex + 1}`,
  company: row[0],
  consultant: row[1],
  engagement: row[2],
  amount: row[3],
  issued: row[4] === "Pending" || row[4] === "Credit in advance" ? "" : `${5 + rowIndex * 9} ${seed.mon} ${seed.year}`,
  due: row[4] === "Pending" || row[4] === "Credit in advance" ? "" : `${Math.min(25 + rowIndex * 3, 28)} ${seed.mon} ${seed.year}`,
  status: row[4],
  timing: `${row[5]} · month ${monthIndex + 1}`
})));

export const invoices: Invoice[] = [...annualInvoices, ...q4Invoices];

export const marketingOpportunities = deals
  .filter((deal) => ["Website form", "LinkedIn (Organic)", "Referral · Partner", "Event · Speaking", "Content · Download"].includes(deal.source))
  .slice(0, 12);

export const websiteStats = [
  { domain: "maximus.com.au", sessions: 11240, visitors: 8420, pageViews: 32180, avgSession: "1m 48s", bounceRate: "38.2%", contacts: 87, sources: [["Organic search", 38], ["Direct traffic", 24], ["Email marketing", 16], ["Social media", 13], ["Referrals", 9]] },
  { domain: "valuemakers.com.au", sessions: 4580, visitors: 3260, pageViews: 12940, avgSession: "2m 12s", bounceRate: "31.9%", contacts: 34, sources: [["Direct traffic", 32], ["Organic search", 27], ["Email marketing", 20], ["Social media", 14], ["Referrals", 7]] }
];

export const jobChanges = [
  { contact: "Rebecca Lawson", previousCompany: "Brightford Holdings", previousRole: "Head of People", newCompany: "Meridian Capital Partners", newRole: "Chief People Officer" },
  { contact: "Daniel Okafor", previousCompany: "Cordell Industrial", previousRole: "GM Operations", newCompany: "Harbour Bridge Ventures", newRole: "Chief Operating Officer" },
  { contact: "Sophie Nguyen", previousCompany: "Foxford Mutual", previousRole: "L&D Manager", newCompany: "Apex Insurance Group", newRole: "Head of Talent" },
  { contact: "Marcus Bellamy", previousCompany: "Lakeside Construction", previousRole: "Project Director", newCompany: "Stratton Tech Group", newRole: "VP Delivery" },
  { contact: "Hannah Pereira", previousCompany: "Norwood Retail Group", previousRole: "HR Business Partner", newCompany: "Clearwater Foods Australia", newRole: "People & Culture Director" }
];

export const tasks = [
  { type: "Task", summary: "Chase signed contract", detail: "Proposal accepted verbally 12 days ago — paperwork outstanding.", company: "raven", contact: "janet", due: "02 Jun", timing: "5d overdue" },
  { type: "Meeting", summary: "Reschedule Q2 strategic review", detail: "Quarterly review was not attended by the client.", company: "northbridge", contact: "robert", due: "04 Jun", timing: "3d overdue" },
  { type: "Appointment", summary: "Coaching session — make-up", detail: "Executive coaching slot missed by the client last week.", company: "pennifold", contact: "peter", due: "05 Jun", timing: "2d overdue" },
  { type: "Task", summary: "Prepare diagnostic report", detail: "Collate survey data for the leadership diagnostic.", company: "harborline", contact: "mark", due: "09 Jun", timing: "in 2 days" },
  { type: "Meeting", summary: "Programme kickoff workshop", detail: "Opening session of the 12-month leadership programme.", company: "meridian", contact: "janet", due: "10 Jun", timing: "in 3 days" },
  { type: "Task", summary: "Send proposal — strategy offsite", detail: "Issue the proposal to the COO for sign-off.", company: "apex", contact: "robert", due: "12 Jun", timing: "in 5 days" }
];

export const emailMetrics = [
  ["Outbound emails sent", "Campaigns + sequences", "18,420", "↑ 12%"],
  ["Open rate", "Across all delivered sends", "42.8%", "↑ 6%"],
  ["Click-through rate", "Unique clicks / delivered", "9.4%", "↑ 14%"],
  ["EDM responses", "Replies + meeting requests", "312", "↑ 22%"],
  ["Unsubscribe rate", "Per send · lower is better", "0.7%", "↓ 0.2 pts"],
  ["Leads from email", "Captured to pipeline", "38", "↑ 18%"]
];

export const topContent = [
  ["Leadership through ambiguity", "1,284"],
  ["The reckoning conversation", "967"],
  ["Strategy & decisiveness", "842"],
  ["First 90 days · exec", "534"]
];

export const leadSources = [
  ["LinkedIn (Organic)", "$842K", "$700K", "120%"],
  ["Referral · Partner", "$612K", "$500K", "122%"],
  ["Direct (Inbound)", "$481K", "$400K", "120%"],
  ["VMC Upgrade", "$314K", "$250K", "126%"],
  ["Event · Speaking", "$218K", "$150K", "145%"]
];

export function money(value: number) {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 2)}M`;
  return `$${Math.round(value / 1000)}K`;
}

export function companyName(id: string) {
  return companies.find((company) => company.id === id)?.name ?? id;
}

export function consultantInitials(id: string) {
  return consultants.find((consultant) => consultant.id === id)?.initials ?? id.toUpperCase();
}

export function contactName(id: string) {
  const contact = contacts.find((item) => item.id === id);
  return contact ? `${contact.first} ${contact.last} · ${contact.title}` : id;
}

export function toneFor(value: string): Tone {
  if (["Green", "Healthy", "Paid", "ready", "on", "Yes"].includes(value)) return "good";
  if (["Amber", "Watch", "Outstanding", "draft", "Medium"].includes(value)) return "warn";
  if (["Red", "At risk", "Overdue", "urgent", "No"].includes(value)) return "bad";
  return "neutral";
}
