import React, { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  AutoPilot AI — Operations Hub                                      */
/*  PIN-gated internal dashboard. All data lives in localStorage.      */
/* ------------------------------------------------------------------ */

// ---------- Color tokens ----------
const C = {
  bg: "#09090b",
  surface: "#111113",
  card: "#18181b",
  border: "#27272a",
  text: "#f4f4f5",
  muted: "#71717a",
  green: "#22c55e",
  greenDim: "rgba(34,197,94,0.12)",
  greenBorder: "rgba(34,197,94,0.3)",
  orange: "#f97316",
  orangeDim: "rgba(249,115,22,0.10)",
  red: "#ef4444",
};

// ---------- LocalStorage helpers ----------
const LS_KEYS = {
  leads: "autopilot_leads",
  clients: "autopilot_clients",
  outreach: "autopilot_outreach",
  content: "autopilot_content",
  docs: "autopilot_docs",
  activity: "autopilot_activity",
};

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function saveLS(key, value, onError) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (onError) onError(e);
    return false;
  }
}
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const fmtTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

// ---------- Seed data ----------
const SEED_LEADS = [
  { id: uid(), name: "Rajesh Kumar", business: "Kumar Properties", type: "Real Estate", source: "LinkedIn", status: "Contacted", whatsapp: "+919876500001", notes: "", lastContact: todayISO() },
  { id: uid(), name: "Sneha Joshi", business: "StyleCart", type: "E-commerce", source: "Landing Page", status: "New", whatsapp: "+919876500002", notes: "", lastContact: todayISO() },
  { id: uid(), name: "Amit Mehta", business: "QuickHire Solutions", type: "Recruitment", source: "Instagram", status: "Call Booked", whatsapp: "+919876500003", notes: "", lastContact: todayISO() },
];
const SEED_CLIENTS = [
  {
    id: uid(),
    name: "Rajesh Kumar",
    business: "Kumar Properties",
    type: "Real Estate",
    pkg: "Growth",
    setupFee: 35000,
    setupPaid: true,
    retainer: 12000,
    retainerStatus: "Active",
    startDate: todayISO(),
    automations: ["99acres lead capture → WhatsApp"],
    nextCheckIn: "",
    notes: "",
    setupLink: "",
    retainerLink: "",
  },
];
const SEED_OUTREACH = [
  { id: uid(), name: "Rajesh Kumar", platform: "LinkedIn", msgType: "First DM", date: daysAgo(2), response: true, notes: "" },
  { id: uid(), name: "Priya Sharma", platform: "Instagram", msgType: "First DM", date: daysAgo(2), response: false, notes: "" },
  { id: uid(), name: "Amit Patel", platform: "LinkedIn", msgType: "Follow-up", date: daysAgo(1), response: false, notes: "" },
  { id: uid(), name: "Sneha Joshi", platform: "Email", msgType: "Audit Offer", date: todayISO(), response: true, notes: "From landing page form" },
  { id: uid(), name: "Vikram Singh", platform: "LinkedIn", msgType: "First DM", date: todayISO(), response: false, notes: "" },
];
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const POST_1 = `Real estate agents lose 40% of leads because of slow follow-up.

The average response time to a new inquiry: 3 hours.
The time a lead stays warm: 2 hours.

You're always one hour too late.

Here's what fixing this looks like:
→ Lead fills your form on 99acres
→ WhatsApp message sent automatically in 60 seconds
→ Agent gets a Slack alert immediately
→ Follow-up scheduled for Day 3 and Day 7

Zero manual work. Zero missed leads.

I built this system for a Mumbai real estate agency this week.
DM me if you want to see the workflow.`;

const POST_2 = `One of our automations costs ₹15,000/month to run.
It replaced work that would cost ₹20,000/month in salary.

It works at 2am.
It never calls in sick.
It never makes a tired mistake.
It never asks for a raise.

The math is obvious.
Most business owners still haven't done it.

Which task in your business could be running on autopilot right now?`;

const POST_3 = `I built a lead automation for a real estate agency this week.

Here's exactly what it does:
→ Lead fills 99acres inquiry form
→ Personalised WhatsApp sent in 60 seconds
→ Lead saved to a spreadsheet automatically
→ Follow-up message goes on Day 3 and Day 7
→ Agent gets a daily summary report at 8pm every night

Total manual work for the agent: 0 hours per week.
Total cost of the system: ₹12,000/month.
Cost of doing it manually with staff: ₹25,000/month.

If you run a real estate agency and want to see the exact workflow, drop a comment or DM me.`;

const POST_4 = `You don't need a tech team to automate your business.

These 4 tools do the heavy lifting:
→ n8n — connects every app you use to every other app
→ WhatsApp API — automates your most important channel
→ Airtable — replaces your messy Excel spreadsheets
→ OpenAI API — the brain that reads, writes, and decides

Total cost to run all four: under ₹5,000/month.
Total time saved per week: 15+ hours.

The question isn't whether to automate.
It's which task you automate first.

What would you automate if you could?`;

const POST_5 = `6 months ago I didn't know what an API was.
Today I build systems that run businesses on autopilot.

What changed: I stopped watching videos about automation and started building automations.

Day 1: Watched tutorials. Built nothing.
Day 7: Built my first workflow. It broke immediately.
Day 14: Fixed it. It actually worked.
Day 21: Showed it to a business owner.
Day 30: First person paid me to build one for them.

The gap between 'interested in AI automation' and 'making money from it' is 30 days of building.

Not 6 months of learning.
Not a ₹50,000 course.
Not waiting until you feel ready.

30 days. What are you waiting for?`;

const SEED_CONTENT = [
  { id: uid(), title: "The 2-Hour Lead Window", platform: "LinkedIn", status: "Ready", postedOn: "", note: "", body: POST_1 },
  { id: uid(), title: "The ₹15,000 vs ₹20,000 Math", platform: "LinkedIn", status: "Ready", postedOn: "", note: "", body: POST_2 },
  { id: uid(), title: "What I Built This Week", platform: "LinkedIn", status: "Ready", postedOn: "", note: "", body: POST_3 },
  { id: uid(), title: "Tools That Run Your Business", platform: "LinkedIn", status: "Ready", postedOn: "", note: "", body: POST_4 },
  { id: uid(), title: "30 Days From Zero", platform: "LinkedIn", status: "Ready", postedOn: "", note: "", body: POST_5 },
];

const SEED_DOCS = {
  agreement: {
    clientName: "",
    businessName: "",
    date: todayISO(),
    pkg: "Growth",
    setupFee: "35,000",
    retainer: "12,000",
    services: "Lead capture → WhatsApp automation; Daily reporting workflow",
  },
  paymentLinks: {
    starterSetup: "",
    starterRetainer: "",
    growthSetup: "",
    growthRetainer: "",
    scaleSetup: "",
    scaleRetainer: "",
  },
};

// ---------- Shared UI primitives ----------
function Badge({ children, color = "zinc" }) {
  const map = {
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    yellow: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    orange: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    "orange-bright": "bg-orange-500/25 text-orange-200 border-orange-500/50",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    green: "bg-green-500/15 text-green-300 border-green-500/40",
    red: "bg-red-500/10 text-red-300/80 border-red-500/30",
    zinc: "bg-zinc-700/30 text-zinc-300 border-zinc-700",
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md border ${map[color] || map.zinc}`}>
      {children}
    </span>
  );
}

const STATUS_COLOR = {
  New: "blue",
  Contacted: "yellow",
  "Call Booked": "orange",
  "Demo Sent": "purple",
  Negotiating: "orange-bright",
  Won: "green",
  Lost: "red",
};
const STATUSES = ["New", "Contacted", "Call Booked", "Demo Sent", "Negotiating", "Won", "Lost"];

function Modal({ open, onClose, title, children, maxW = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative w-full ${maxW} rounded-2xl border max-h-[90vh] overflow-y-auto`}
        style={{ background: C.card, borderColor: C.border }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <h3 className="font-semibold text-zinc-100">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-zinc-500">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
const inputCls = "w-full bg-[#09090b] border border-[#27272a] focus:border-[#22c55e] outline-none rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600";
const btnPrimary = "inline-flex items-center justify-center gap-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50";
const btnGhost = "inline-flex items-center justify-center gap-1.5 border border-[#27272a] hover:border-zinc-600 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors";
const btnDanger = "inline-flex items-center justify-center gap-1.5 bg-[#ef4444] hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors";

function EmptyState({ icon, title, hint, action }) {
  return (
    <div className="border border-dashed rounded-2xl p-10 text-center" style={{ borderColor: C.border }}>
      <div className="text-3xl">{icon}</div>
      <div className="mt-2 font-semibold text-zinc-200">{title}</div>
      {hint && <div className="mt-1 text-sm text-zinc-500">{hint}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem("autopilot_unlocked") === "1"; } catch { return false; }
  });
  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;
  return <Dashboard />;
}

// ---------- PIN gate ----------
function PinGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pin === "2626") {
      try { sessionStorage.setItem("autopilot_unlocked", "1"); } catch {}
      onUnlock();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-mono" style={{ background: C.bg, color: C.text }}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}.shake{animation:shake .45s ease}`}</style>
      <form
        onSubmit={submit}
        className={`w-full max-w-sm rounded-2xl border p-8 ${shake ? "shake" : ""}`}
        style={{ background: C.card, borderColor: C.border }}
      >
        <div className="flex items-center gap-2 justify-center">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.green }} />
          <span className="font-bold text-lg">AutoPilot AI</span>
        </div>
        <h1 className="mt-6 text-xl font-semibold text-center">Enter PIN</h1>
        <p className="text-center text-sm text-zinc-500 mt-1">Operations Hub access</p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => { setPin(e.target.value); setErr(false); }}
          className="mt-6 w-full bg-[#09090b] border border-[#27272a] focus:border-[#22c55e] outline-none rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em]"
          placeholder="••••"
          maxLength={6}
        />
        {err && <div className="mt-3 text-sm text-center text-[#ef4444]">Incorrect PIN</div>}
        <button type="submit" className={`${btnPrimary} w-full mt-6 py-3`}>Unlock</button>
        <a href="/" className="block text-center text-xs text-zinc-500 hover:text-zinc-200 mt-4">← Back to site</a>
      </form>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
const TABS = ["Overview", "Lead CRM", "Clients", "Outreach", "Content", "Documents"];

function Dashboard() {
  const [tab, setTab] = useState("Overview");
  const [leads, setLeads] = useState(() => loadLS(LS_KEYS.leads, SEED_LEADS));
  const [clients, setClients] = useState(() => loadLS(LS_KEYS.clients, SEED_CLIENTS));
  const [outreach, setOutreach] = useState(() => loadLS(LS_KEYS.outreach, SEED_OUTREACH));
  const [content, setContent] = useState(() => loadLS(LS_KEYS.content, SEED_CONTENT));
  const [docs, setDocs] = useState(() => loadLS(LS_KEYS.docs, SEED_DOCS));
  const [activity, setActivity] = useState(() => loadLS(LS_KEYS.activity, []));
  const [toast, setToast] = useState(null);
  const [clearOpen, setClearOpen] = useState(false);

  // Persist on change
  useEffect(() => { saveLS(LS_KEYS.leads, leads, () => showToast("Save failed", "red")); }, [leads]);
  useEffect(() => { saveLS(LS_KEYS.clients, clients, () => showToast("Save failed", "red")); }, [clients]);
  useEffect(() => { saveLS(LS_KEYS.outreach, outreach, () => showToast("Save failed", "red")); }, [outreach]);
  useEffect(() => { saveLS(LS_KEYS.content, content, () => showToast("Save failed", "red")); }, [content]);
  useEffect(() => { saveLS(LS_KEYS.docs, docs, () => showToast("Save failed", "red")); }, [docs]);
  useEffect(() => { saveLS(LS_KEYS.activity, activity, () => showToast("Save failed", "red")); }, [activity]);

  const showToast = (msg, color = "green") => {
    setToast({ msg, color, id: uid() });
    setTimeout(() => setToast(null), 3000);
  };

  const logActivity = (icon, desc) => {
    setActivity((a) => [{ id: uid(), at: new Date().toISOString(), icon, desc }, ...a].slice(0, 50));
  };

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const clearAll = () => {
    Object.values(LS_KEYS).forEach((k) => { try { localStorage.removeItem(k); } catch {} });
    setLeads(SEED_LEADS);
    setClients(SEED_CLIENTS);
    setOutreach(SEED_OUTREACH);
    setContent(SEED_CONTENT);
    setDocs(SEED_DOCS);
    setActivity([]);
    setClearOpen(false);
    showToast("All data reset", "green");
  };

  return (
    <div className="min-h-screen font-mono" style={{ background: C.bg, color: C.text }}>
      {/* Top bar */}
      <header className="border-b sticky top-0 z-30 backdrop-blur" style={{ borderColor: C.border, background: "rgba(9,9,11,0.85)" }}>
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: C.green }} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: C.green }} />
            </span>
            <span className="font-bold text-sm sm:text-base">AutoPilot AI <span className="text-zinc-500 font-normal">— Operations Hub</span></span>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-400">
            <span className="hidden sm:inline">{today}</span>
            <a href="/" className="hover:text-zinc-100">← Back to site</a>
          </div>
        </div>
        {/* Tab nav */}
        <div className="max-w-7xl mx-auto px-3 sm:px-5 overflow-x-auto">
          <div className="flex gap-1">
            {TABS.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative whitespace-nowrap px-4 py-3 text-sm transition-colors ${active ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  {t}
                  {active && <span className="absolute left-3 right-3 -bottom-px h-0.5 rounded-t" style={{ background: C.green }} />}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-5 py-8">
        {tab === "Overview" && (
          <OverviewTab
            leads={leads} clients={clients} outreach={outreach}
            activity={activity} onTab={setTab}
            onAddLead={(l) => { setLeads((s) => [l, ...s]); logActivity("➕", `New lead: ${l.name}`); showToast("Lead added"); }}
            onLogOutreach={(o) => { setOutreach((s) => [o, ...s]); logActivity("📤", `Outreach to ${o.name}`); showToast("Outreach logged"); }}
          />
        )}
        {tab === "Lead CRM" && (
          <LeadCRMTab
            leads={leads} setLeads={setLeads}
            log={logActivity} toast={showToast}
          />
        )}
        {tab === "Clients" && (
          <ClientsTab
            clients={clients} setClients={setClients}
            log={logActivity} toast={showToast}
          />
        )}
        {tab === "Outreach" && (
          <OutreachTab
            outreach={outreach} setOutreach={setOutreach}
            log={logActivity} toast={showToast}
          />
        )}
        {tab === "Content" && (
          <ContentTab content={content} setContent={setContent} toast={showToast} log={logActivity} />
        )}
        {tab === "Documents" && (
          <DocumentsTab docs={docs} setDocs={setDocs} toast={showToast} />
        )}

        {/* Footer */}
        <div className="mt-16 pt-6 border-t flex items-center justify-between text-xs text-zinc-600" style={{ borderColor: C.border }}>
          <span>AutoPilot AI Operations Hub · Local-only data</span>
          <button onClick={() => setClearOpen(true)} className="text-[#ef4444] hover:underline">Clear all data</button>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          key={toast.id}
          className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg font-medium text-sm text-white animate-[slidein_.3s_ease]"
          style={{ background: toast.color === "red" ? C.red : C.green }}
        >
          {toast.msg}
        </div>
      )}
      <style>{`@keyframes slidein{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Clear-all modal */}
      <Modal open={clearOpen} onClose={() => setClearOpen(false)} title="Clear all data?">
        <p className="text-sm text-zinc-300">
          This wipes every lead, client, outreach log, content post and document field, and reloads the seed examples. This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button className={btnGhost} onClick={() => setClearOpen(false)}>Cancel</button>
          <button className={btnDanger} onClick={clearAll}>Yes, wipe everything</button>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// TAB 1 — OVERVIEW
// ============================================================
function OverviewTab({ leads, clients, outreach, activity, onTab, onAddLead, onLogOutreach }) {
  const [leadOpen, setLeadOpen] = useState(false);
  const [outOpen, setOutOpen] = useState(false);

  const activeClients = clients.filter((c) => c.retainerStatus === "Active");
  const mrr = activeClients.reduce((s, c) => s + Number(c.retainer || 0), 0);
  const weekAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().slice(0, 10); })();
  const thisWeekOutreach = outreach.filter((o) => o.date >= weekAgo).length;

  const cards = [
    { label: "Total Leads", value: leads.length, accent: C.green },
    { label: "Active Clients", value: activeClients.length, accent: C.green },
    { label: "Outreach This Week", value: thisWeekOutreach, accent: C.orange },
    { label: "Monthly Recurring Revenue", value: fmtINR(mrr), accent: C.green },
  ];

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border p-5" style={{ background: C.card, borderColor: C.border }}>
            <div className="text-xs uppercase tracking-widest text-zinc-500">{c.label}</div>
            <div className="mt-2 text-3xl font-bold" style={{ color: c.accent }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border p-5" style={{ background: C.card, borderColor: C.border }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Activity</h2>
            <span className="text-xs text-zinc-500">Last 10</span>
          </div>
          <div className="mt-4 divide-y" style={{ borderColor: C.border }}>
            {activity.length === 0 ? (
              <div className="text-sm text-zinc-500 py-8 text-center">No activity yet. Add a lead to get started.</div>
            ) : activity.slice(0, 10).map((a) => (
              <div key={a.id} className="flex items-center gap-3 py-3 text-sm">
                <span className="text-lg w-6 text-center">{a.icon}</span>
                <span className="text-zinc-200 flex-1">{a.desc}</span>
                <span className="text-xs text-zinc-500">{fmtTime(a.at)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border p-5 space-y-3" style={{ background: C.card, borderColor: C.border }}>
          <h2 className="font-semibold">Quick Actions</h2>
          <button className={`${btnPrimary} w-full`} onClick={() => setLeadOpen(true)}>+ Add Lead</button>
          <button className={`${btnGhost} w-full`} onClick={() => setOutOpen(true)}>+ Log Outreach</button>
          <button className={`${btnGhost} w-full`} onClick={() => onTab("Content")}>View Content</button>
        </div>
      </div>

      <LeadFormModal
        open={leadOpen} onClose={() => setLeadOpen(false)}
        onSave={(l) => { onAddLead(l); setLeadOpen(false); }}
      />
      <OutreachFormModal
        open={outOpen} onClose={() => setOutOpen(false)}
        onSave={(o) => { onLogOutreach(o); setOutOpen(false); }}
      />
    </div>
  );
}

// ============================================================
// TAB 2 — LEAD CRM
// ============================================================
function LeadCRMTab({ leads, setLeads, log, toast }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);

  const filtered = leads.filter((l) => {
    const matchQ = !q || l.name.toLowerCase().includes(q.toLowerCase()) || (l.business || "").toLowerCase().includes(q.toLowerCase());
    const matchF = filter === "All" || l.status === filter;
    return matchQ && matchF;
  });

  const remove = (id) => {
    if (!window.confirm("Delete this lead?")) return;
    setLeads((s) => s.filter((l) => l.id !== id));
    log("🗑️", "Lead deleted");
    toast("Lead deleted");
  };
  const updateStatus = (id, status) => {
    setLeads((s) => s.map((l) => l.id === id ? { ...l, status, lastContact: todayISO() } : l));
    log("🔄", `Lead status → ${status}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <button className={btnPrimary} onClick={() => setAddOpen(true)}>+ Add Lead</button>
        <input className={`${inputCls} max-w-xs`} placeholder="Search name or business…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${inputCls} max-w-xs`} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="text-xs text-zinc-500 ml-auto">{filtered.length} of {leads.length}</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="👥" title="No leads match" hint="Adjust filters or add your first lead." action={<button className={btnPrimary} onClick={() => setAddOpen(true)}>+ Add Lead</button>} />
      ) : (
        <div className="rounded-2xl border overflow-x-auto" style={{ background: C.card, borderColor: C.border }}>
          <table className="w-full text-sm min-w-[900px]">
            <thead className="text-xs uppercase tracking-widest text-zinc-500">
              <tr className="border-b" style={{ borderColor: C.border }}>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Business</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">WhatsApp</th>
                <th className="text-left px-4 py-3">Last Contact</th>
                <th className="text-left px-4 py-3">Notes</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b hover:bg-zinc-900/40" style={{ borderColor: C.border }}>
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3 text-zinc-300">{l.business} <span className="text-zinc-500 text-xs">· {l.type}</span></td>
                  <td className="px-4 py-3 text-zinc-400">{l.source}</td>
                  <td className="px-4 py-3">
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                      className="bg-transparent border border-[#27272a] rounded px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <div className="mt-1"><Badge color={STATUS_COLOR[l.status]}>{l.status}</Badge></div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{l.whatsapp}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{l.lastContact}</td>
                  <td className="px-4 py-3 text-zinc-500 max-w-[200px] truncate">{l.notes || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`https://wa.me/${(l.whatsapp || "").replace(/[^0-9]/g, "")}`}
                        target="_blank" rel="noreferrer"
                        className="text-[#25D366] hover:underline text-xs" title="Send WhatsApp"
                      >WA</a>
                      <button className="text-zinc-400 hover:text-zinc-100 text-xs" onClick={() => setEditLead(l)}>Edit</button>
                      <button className="text-[#ef4444] hover:underline text-xs" onClick={() => remove(l.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LeadFormModal
        open={addOpen} onClose={() => setAddOpen(false)}
        onSave={(l) => { setLeads((s) => [l, ...s]); log("➕", `New lead: ${l.name}`); toast("Lead added"); setAddOpen(false); }}
      />
      <LeadFormModal
        open={!!editLead} onClose={() => setEditLead(null)} initial={editLead}
        onSave={(l) => { setLeads((s) => s.map((x) => x.id === l.id ? l : x)); log("✏️", `Lead edited: ${l.name}`); toast("Lead updated"); setEditLead(null); }}
      />
    </div>
  );
}

function LeadFormModal({ open, onClose, onSave, initial }) {
  const [f, setF] = useState(() => initial || {
    id: uid(), name: "", business: "", type: "Real Estate", source: "LinkedIn",
    whatsapp: "", notes: "", status: "New", lastContact: todayISO(),
  });
  useEffect(() => { if (open) setF(initial || { id: uid(), name: "", business: "", type: "Real Estate", source: "LinkedIn", whatsapp: "", notes: "", status: "New", lastContact: todayISO() }); }, [open, initial]);

  const submit = (e) => { e.preventDefault(); if (!f.name.trim()) return; onSave(f); };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Lead" : "Add Lead"}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name"><input className={inputCls} required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Business name"><input className={inputCls} value={f.business} onChange={(e) => setF({ ...f, business: e.target.value })} /></Field>
          <Field label="Business type">
            <select className={inputCls} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
              {["Real Estate", "E-commerce", "Recruitment", "Marketing Agency", "Other"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Source">
            <select className={inputCls} value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })}>
              {["LinkedIn", "Instagram", "Referral", "Landing Page", "Cold Email", "Other"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="WhatsApp number"><input type="tel" className={inputCls} value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} placeholder="+91 98765 00000" /></Field>
          <Field label="Status">
            <select className={inputCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Notes"><textarea rows={3} className={inputCls} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={btnPrimary}>{initial ? "Save changes" : "Add lead"}</button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================================
// TAB 3 — CLIENTS
// ============================================================
function ClientsTab({ clients, setClients, log, toast }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editC, setEditC] = useState(null);

  const activeMRR = clients.filter((c) => c.retainerStatus === "Active").reduce((s, c) => s + Number(c.retainer || 0), 0);

  const updateField = (id, key, value) => setClients((s) => s.map((c) => c.id === id ? { ...c, [key]: value } : c));
  const archive = (id) => {
    if (!window.confirm("Archive this client?")) return;
    setClients((s) => s.map((c) => c.id === id ? { ...c, retainerStatus: "Cancelled" } : c));
    log("📦", "Client archived"); toast("Client archived");
  };

  const pkgColor = { Starter: "blue", Growth: "green", Scale: "orange" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Clients</h2>
        <button className={btnPrimary} onClick={() => setAddOpen(true)}>+ Add Client</button>
      </div>

      {clients.length === 0 ? (
        <EmptyState icon="💼" title="No clients yet" hint="Add your first paying client." action={<button className={btnPrimary} onClick={() => setAddOpen(true)}>+ Add Client</button>} />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {clients.map((c) => (
            <div key={c.id} className="rounded-2xl border p-5" style={{ background: C.card, borderColor: C.border }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-zinc-100">{c.name}</div>
                  <div className="text-sm text-zinc-400">{c.business} · {c.type}</div>
                </div>
                <Badge color={pkgColor[c.pkg] || "zinc"}>{c.pkg}</Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-zinc-500 uppercase">Setup</div>
                  <div>{fmtINR(c.setupFee)} {c.setupPaid ? <span className="text-[#22c55e]">✓ Paid</span> : <span className="text-[#f97316]">⏳ Pending</span>}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase">Retainer</div>
                  <div>{fmtINR(c.retainer)}/mo · <Badge color={c.retainerStatus === "Active" ? "green" : c.retainerStatus === "Paused" ? "yellow" : "red"}>{c.retainerStatus}</Badge></div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase">Start</div>
                  <div>{c.startDate}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase">Next check-in</div>
                  <input type="date" value={c.nextCheckIn || ""} onChange={(e) => updateField(c.id, "nextCheckIn", e.target.value)} className={inputCls} />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-zinc-500 uppercase mb-1">Automations</div>
                <textarea
                  rows={2} className={inputCls}
                  value={(c.automations || []).join("\n")}
                  onChange={(e) => updateField(c.id, "automations", e.target.value.split("\n").filter(Boolean))}
                />
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <Field label="Setup fee link">
                  <input className={inputCls} placeholder="Paste Razorpay link" value={c.setupLink || ""} onChange={(e) => updateField(c.id, "setupLink", e.target.value)} />
                </Field>
                <Field label="Retainer link">
                  <input className={inputCls} placeholder="Paste Razorpay link" value={c.retainerLink || ""} onChange={(e) => updateField(c.id, "retainerLink", e.target.value)} />
                </Field>
              </div>

              <div className="mt-4">
                <div className="text-xs text-zinc-500 uppercase mb-1">Notes</div>
                <textarea rows={2} className={inputCls} value={c.notes || ""} onChange={(e) => updateField(c.id, "notes", e.target.value)} />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className={btnGhost} onClick={() => setEditC(c)}>Edit</button>
                <button className={btnDanger} onClick={() => archive(c.id)}>Archive</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MRR calculator */}
      <div className="rounded-2xl border p-5" style={{ background: C.surface, borderColor: C.border }}>
        <h3 className="font-semibold">Monthly Revenue Calculator</h3>
        <div className="mt-3 grid sm:grid-cols-3 gap-4 text-sm">
          <div><div className="text-zinc-500 text-xs uppercase">Current MRR</div><div className="text-2xl font-bold text-[#22c55e]">{fmtINR(activeMRR)}</div></div>
          <div><div className="text-zinc-500 text-xs uppercase">Projected @ 5 clients</div><div className="text-2xl font-bold text-zinc-200">{fmtINR(activeMRR ? (activeMRR / Math.max(1, clients.filter(c => c.retainerStatus === "Active").length)) * 5 : 60000)}</div></div>
          <div><div className="text-zinc-500 text-xs uppercase">Projected @ 10 clients</div><div className="text-2xl font-bold text-zinc-200">{fmtINR(activeMRR ? (activeMRR / Math.max(1, clients.filter(c => c.retainerStatus === "Active").length)) * 10 : 120000)}</div></div>
        </div>
      </div>

      <ClientFormModal
        open={addOpen} onClose={() => setAddOpen(false)}
        onSave={(c) => { setClients((s) => [c, ...s]); log("🆕", `Client added: ${c.name}`); toast("Client saved"); setAddOpen(false); }}
      />
      <ClientFormModal
        open={!!editC} onClose={() => setEditC(null)} initial={editC}
        onSave={(c) => { setClients((s) => s.map((x) => x.id === c.id ? c : x)); log("✏️", `Client updated: ${c.name}`); toast("Client updated"); setEditC(null); }}
      />
    </div>
  );
}

function ClientFormModal({ open, onClose, onSave, initial }) {
  const blank = {
    id: uid(), name: "", business: "", type: "Real Estate", pkg: "Growth",
    setupFee: 35000, setupPaid: false, retainer: 12000, retainerStatus: "Active",
    startDate: todayISO(), notes: "", automations: [], nextCheckIn: "", setupLink: "", retainerLink: "",
  };
  const [f, setF] = useState(() => initial || blank);
  useEffect(() => { if (open) setF(initial || blank); /* eslint-disable-next-line */ }, [open, initial]);

  const submit = (e) => { e.preventDefault(); if (!f.name.trim()) return; onSave({ ...f, setupFee: Number(f.setupFee), retainer: Number(f.retainer) }); };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Client" : "Add Client"} maxW="max-w-2xl">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Client name"><input required className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Business name"><input className={inputCls} value={f.business} onChange={(e) => setF({ ...f, business: e.target.value })} /></Field>
          <Field label="Business type">
            <select className={inputCls} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
              {["Real Estate", "E-commerce", "Recruitment", "Marketing Agency", "Other"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Package">
            <select className={inputCls} value={f.pkg} onChange={(e) => setF({ ...f, pkg: e.target.value })}>
              {["Starter", "Growth", "Scale"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Setup fee (₹)"><input type="number" className={inputCls} value={f.setupFee} onChange={(e) => setF({ ...f, setupFee: e.target.value })} /></Field>
          <Field label="Setup fee status">
            <select className={inputCls} value={f.setupPaid ? "Paid" : "Pending"} onChange={(e) => setF({ ...f, setupPaid: e.target.value === "Paid" })}>
              <option>Paid</option><option>Pending</option>
            </select>
          </Field>
          <Field label="Monthly retainer (₹)"><input type="number" className={inputCls} value={f.retainer} onChange={(e) => setF({ ...f, retainer: e.target.value })} /></Field>
          <Field label="Retainer start date"><input type="date" className={inputCls} value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} /></Field>
        </div>
        <Field label="Notes"><textarea rows={3} className={inputCls} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={btnPrimary}>{initial ? "Save changes" : "Add client"}</button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================================
// TAB 4 — OUTREACH
// ============================================================
function OutreachTab({ outreach, setOutreach, log, toast }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);

  const today = todayISO();
  const weekAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().slice(0, 10); })();
  const todayCount = outreach.filter((o) => o.date === today).length;
  const weekCount = outreach.filter((o) => o.date >= weekAgo).length;
  const responseRate = outreach.length ? Math.round((outreach.filter((o) => o.response).length / outreach.length) * 100) : 0;
  const platforms = {};
  outreach.forEach((o) => { platforms[o.platform] = (platforms[o.platform] || 0) + (o.response ? 1 : 0); });
  const bestPlatform = Object.entries(platforms).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  const goal = 10;
  const progress = Math.min(100, Math.round((todayCount / goal) * 100));

  const remove = (id) => {
    if (!window.confirm("Delete this entry?")) return;
    setOutreach((s) => s.filter((o) => o.id !== id));
    toast("Entry deleted");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-5" style={{ background: C.card, borderColor: C.border }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase text-zinc-500">Today's outreach goal</div>
            <div className="text-2xl font-bold mt-1">{todayCount} <span className="text-zinc-500 text-base">/ {goal}</span></div>
          </div>
          <button className={btnPrimary} onClick={() => setOpen(true)}>+ Log Outreach</button>
        </div>
        <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: C.border }}>
          <div className="h-full transition-all" style={{ width: `${progress}%`, background: C.green }} />
        </div>
        <div className="mt-3 flex gap-6 text-xs text-zinc-500">
          <span>This week: <span className="text-zinc-200">{weekCount}</span></span>
          <span>All-time: <span className="text-zinc-200">{outreach.length}</span></span>
        </div>
      </div>

      {outreach.length === 0 ? (
        <EmptyState icon="📤" title="No outreach yet" hint="Log your first DM to start tracking response rates." action={<button className={btnPrimary} onClick={() => setOpen(true)}>+ Log Outreach</button>} />
      ) : (
        <div className="rounded-2xl border overflow-x-auto" style={{ background: C.card, borderColor: C.border }}>
          <table className="w-full text-sm min-w-[800px]">
            <thead className="text-xs uppercase tracking-widest text-zinc-500">
              <tr className="border-b" style={{ borderColor: C.border }}>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Platform</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Response</th>
                <th className="text-left px-4 py-3">Notes</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {outreach.map((o) => (
                <tr key={o.id} className={`border-b ${o.response ? "bg-[#22c55e]/5" : ""}`} style={{ borderColor: C.border }}>
                  <td className="px-4 py-3 text-zinc-400">{o.date}</td>
                  <td className="px-4 py-3 font-medium">{o.name}</td>
                  <td className="px-4 py-3">{o.platform}</td>
                  <td className="px-4 py-3 text-zinc-400">{o.msgType}</td>
                  <td className="px-4 py-3">{o.response ? <Badge color="green">Replied</Badge> : <Badge color="zinc">No reply</Badge>}</td>
                  <td className="px-4 py-3 text-zinc-500 max-w-[240px] truncate">{o.notes || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-zinc-400 hover:text-zinc-100 text-xs mr-3" onClick={() => setEdit(o)}>Edit</button>
                    <button className="text-[#ef4444] hover:underline text-xs" onClick={() => remove(o.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-2xl border p-5 grid sm:grid-cols-4 gap-4" style={{ background: C.surface, borderColor: C.border }}>
        <div><div className="text-xs uppercase text-zinc-500">Sent this week</div><div className="text-2xl font-bold mt-1">{weekCount}</div></div>
        <div><div className="text-xs uppercase text-zinc-500">Response rate</div><div className="text-2xl font-bold mt-1 text-[#22c55e]">{responseRate}%</div></div>
        <div><div className="text-xs uppercase text-zinc-500">Calls booked</div><div className="text-2xl font-bold mt-1">{outreach.filter((o) => o.response).length}</div></div>
        <div><div className="text-xs uppercase text-zinc-500">Best platform</div><div className="text-2xl font-bold mt-1 text-[#f97316]">{bestPlatform}</div></div>
      </div>

      <OutreachFormModal open={open} onClose={() => setOpen(false)} onSave={(o) => { setOutreach((s) => [o, ...s]); log("📤", `Outreach to ${o.name}`); toast("Outreach logged"); setOpen(false); }} />
      <OutreachFormModal open={!!edit} initial={edit} onClose={() => setEdit(null)} onSave={(o) => { setOutreach((s) => s.map((x) => x.id === o.id ? o : x)); toast("Updated"); setEdit(null); }} />
    </div>
  );
}

function OutreachFormModal({ open, onClose, onSave, initial }) {
  const blank = { id: uid(), name: "", platform: "LinkedIn", msgType: "First DM", date: todayISO(), response: false, notes: "" };
  const [f, setF] = useState(() => initial || blank);
  useEffect(() => { if (open) setF(initial || blank); /* eslint-disable-next-line */ }, [open, initial]);
  const submit = (e) => { e.preventDefault(); if (!f.name.trim()) return; onSave(f); };
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Outreach" : "Log Outreach"}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Prospect name"><input required className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Platform">
            <select className={inputCls} value={f.platform} onChange={(e) => setF({ ...f, platform: e.target.value })}>
              {["LinkedIn", "Instagram", "Email", "WhatsApp", "Other"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Message type">
            <select className={inputCls} value={f.msgType} onChange={(e) => setF({ ...f, msgType: e.target.value })}>
              {["First DM", "Follow-up", "Audit Offer", "Demo Share"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Date sent"><input type="date" className={inputCls} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
          <Field label="Response received">
            <select className={inputCls} value={f.response ? "Yes" : "No"} onChange={(e) => setF({ ...f, response: e.target.value === "Yes" })}>
              <option>No</option><option>Yes</option>
            </select>
          </Field>
        </div>
        <Field label="Notes"><textarea rows={3} className={inputCls} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></Field>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" className={btnPrimary}>{initial ? "Save" : "Log entry"}</button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================================
// TAB 5 — CONTENT CALENDAR
// ============================================================
const CONTENT_STATUSES = ["Ready", "Posted", "Scheduled"];

function ContentTab({ content, setContent, toast, log }) {
  const [selectedId, setSelectedId] = useState(content[0]?.id || null);
  const [addOpen, setAddOpen] = useState(false);
  const selected = content.find((c) => c.id === selectedId) || content[0];

  useEffect(() => { if (!content.find((c) => c.id === selectedId) && content[0]) setSelectedId(content[0].id); }, [content, selectedId]);

  const cycleStatus = (id) => {
    setContent((s) => s.map((c) => {
      if (c.id !== id) return c;
      const next = CONTENT_STATUSES[(CONTENT_STATUSES.indexOf(c.status) + 1) % CONTENT_STATUSES.length];
      return { ...c, status: next };
    }));
  };
  const markPosted = (id) => {
    setContent((s) => s.map((c) => c.id === id ? { ...c, status: "Posted", postedOn: todayISO() } : c));
    log("📣", `Post marked posted: ${content.find((c) => c.id === id)?.title}`);
    toast("Marked posted");
  };
  const updateNote = (id, note) => setContent((s) => s.map((c) => c.id === id ? { ...c, note } : c));
  const copyPost = (body) => {
    try { navigator.clipboard.writeText(body); toast("Copied to clipboard"); } catch { toast("Copy failed", "red"); }
  };
  const remove = (id) => {
    if (!window.confirm("Delete this post?")) return;
    setContent((s) => s.filter((c) => c.id !== id));
    toast("Post deleted");
  };

  const statusColor = (s) => s === "Posted" ? "green" : s === "Scheduled" ? "orange" : "blue";

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Posts</h2>
          <button className="text-xs text-[#22c55e] hover:underline" onClick={() => setAddOpen(true)}>+ Add</button>
        </div>
        {content.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`w-full text-left rounded-xl border p-3 transition ${selected?.id === c.id ? "border-[#22c55e]" : "hover:border-zinc-600"}`}
            style={{ background: C.card, borderColor: selected?.id === c.id ? C.green : C.border }}
          >
            <div className="text-sm font-medium text-zinc-100 truncate">{c.title}</div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500">
              <Badge color={statusColor(c.status)}>{c.status}</Badge>
              <span>{c.platform}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border p-5" style={{ background: C.card, borderColor: C.border }}>
        {!selected ? (
          <EmptyState icon="📝" title="No posts" hint="Add a post to get started." />
        ) : (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-zinc-500 uppercase">{selected.platform}</div>
                <h3 className="text-xl font-semibold mt-1">{selected.title}</h3>
                {selected.postedOn && <div className="text-xs text-zinc-500 mt-1">Posted on {selected.postedOn}</div>}
              </div>
              <button onClick={() => cycleStatus(selected.id)} title="Click to cycle status">
                <Badge color={statusColor(selected.status)}>{selected.status} ↻</Badge>
              </button>
            </div>
            <pre className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200 bg-[#09090b] border rounded-xl p-5 font-mono" style={{ borderColor: C.border }}>{selected.body}</pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className={btnPrimary} onClick={() => copyPost(selected.body)}>Copy Post</button>
              <button className={btnGhost} onClick={() => markPosted(selected.id)}>Mark as Posted</button>
              <button className="ml-auto text-[#ef4444] text-xs hover:underline" onClick={() => remove(selected.id)}>Delete</button>
            </div>
            <div className="mt-4">
              <Field label="Engagement note">
                <input className={inputCls} value={selected.note || ""} onChange={(e) => updateNote(selected.id, e.target.value)} placeholder="e.g. 48 likes, 6 comments, 2 DMs" />
              </Field>
            </div>
          </div>
        )}
      </div>

      <PostFormModal open={addOpen} onClose={() => setAddOpen(false)} onSave={(p) => { setContent((s) => [p, ...s]); toast("Post added"); setAddOpen(false); }} />
    </div>
  );
}

function PostFormModal({ open, onClose, onSave }) {
  const [f, setF] = useState({ id: uid(), title: "", platform: "LinkedIn", status: "Ready", postedOn: "", note: "", body: "" });
  useEffect(() => { if (open) setF({ id: uid(), title: "", platform: "LinkedIn", status: "Ready", postedOn: "", note: "", body: "" }); }, [open]);
  const submit = (e) => { e.preventDefault(); if (!f.title.trim()) return; onSave(f); };
  return (
    <Modal open={open} onClose={onClose} title="Add Post" maxW="max-w-2xl">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Title"><input required className={inputCls} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Platform">
            <select className={inputCls} value={f.platform} onChange={(e) => setF({ ...f, platform: e.target.value })}>
              {["LinkedIn", "Instagram", "Twitter", "Email"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
              {CONTENT_STATUSES.map((x) => <option key={x}>{x}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Body"><textarea rows={10} className={inputCls} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} /></Field>
        <div className="flex justify-end gap-2"><button type="button" className={btnGhost} onClick={onClose}>Cancel</button><button type="submit" className={btnPrimary}>Add Post</button></div>
      </form>
    </Modal>
  );
}

// ============================================================
// TAB 6 — DOCUMENTS
// ============================================================
const CALL_SCRIPT = `BEFORE THE CALL (5 min prep):
□ Research their business on LinkedIn/Instagram
□ Note 1-2 specific things about their operation
□ Have n8n demo workflow ready to screen share
□ Open a blank Notion doc to take notes

OPENING (2 min):
"Thanks for making time, [Name]. I'll keep this to 20 minutes — I want to be respectful of your time.

Quick context: I build automation systems specifically for [their niche]. Before I say anything about what I do, I want to understand your situation first. Is that okay?"

DISCOVERY QUESTIONS (12 min):
Ask these in order. Listen more than you talk.

1. "Walk me through what happens right now when a new lead or inquiry comes in."
2. "Which part of that process takes the most time for you or your team?"
3. "What happens if you don't follow up within an hour — do you typically lose those leads?"
4. "How many leads per month do you get roughly from [platform]?"
5. "If you could remove one task from your week tomorrow, what would it be?"

Note their answers. Do not pitch yet.

TRANSITION (1 min):
"Based on what you've told me, I can see 2-3 places where you're losing time and probably leads. What I'd like to do is put together a quick workflow map for your specific situation and send you a short video walkthrough. Would that be useful to see?"

CLOSE (2 min):
If yes: "Perfect. I'll send that over within 24 hours. To build it accurately, can I confirm — you're currently using [platform] for leads and [tool] for follow-up, right?"

If hesitant: "Completely understand. Even if we don't work together, the audit will show you exactly where the gaps are. Zero obligation."

AFTER THE CALL:
□ Log in outreach tracker immediately
□ Update lead status to "Call Booked → Demo Sent"
□ Build their specific Loom demo within 24 hours
□ Send Loom link + 2-line message on WhatsApp`;

function buildAgreement(a) {
  return `SERVICE AGREEMENT

This agreement is between AutoPilot AI ("Agency") and ${a.clientName || "[CLIENT NAME]"} of ${a.businessName || "[BUSINESS NAME]"} ("Client"), effective ${a.date || "[DATE]"}.

1. SERVICES
The Agency will design, build, and deploy the following automation systems for the Client:
${a.services || "[SERVICES LIST]"}

Delivery timeline: 5 business days from receipt of full payment and required access credentials.

2. PAYMENT TERMS
Setup Fee: ₹${a.setupFee || "[SETUP FEE]"} — 50% due before work begins, 50% due on delivery.
Monthly Retainer: ₹${a.retainer || "[MONTHLY RETAINER]"}/month — due on the 1st of each month via auto-debit or manual transfer.
Late payments beyond 7 days may result in service suspension.

3. MONTHLY RETAINER INCLUDES
- Monitoring of all active automation systems
- Up to 2 minor modifications per month
- Bug fixes for automations built by the Agency
- Monthly check-in call (Growth and Scale packages)

4. CANCELLATION
Either party may cancel with 30 days written notice sent via WhatsApp or email. No refunds on setup fees once work has commenced.

5. INTELLECTUAL PROPERTY
All data, leads, and business information belongs to the Client. Automation workflow templates and system architecture remain the intellectual property of the Agency. The Agency may reuse workflow structures for other clients while keeping all Client data private.

6. LIABILITY
The Agency is not liable for downtime or failures caused by third-party services including but not limited to WhatsApp Business API, Google, OpenAI, or Airtable. The Agency will make reasonable efforts to restore service within 24 hours of any reported failure.

7. CONFIDENTIALITY
Both parties agree not to share confidential business information of the other party with third parties.

8. GOVERNING LAW
This agreement is governed by the laws of India. Any disputes will be resolved in the courts of [your city], India.

Signed:
Agency: _________________ Date: _________
AutoPilot AI

Client: _________________ Date: _________
${a.clientName || "[CLIENT NAME]"}, ${a.businessName || "[BUSINESS NAME]"}`;
}

function DocumentsTab({ docs, setDocs, toast }) {
  const [docTab, setDocTab] = useState("agreement");
  const copy = (text) => { try { navigator.clipboard.writeText(text); toast("Copied to clipboard"); } catch { toast("Copy failed", "red"); } };
  const a = docs.agreement;
  const setA = (key, value) => setDocs((d) => ({ ...d, agreement: { ...d.agreement, [key]: value } }));
  const setLink = (key, value) => setDocs((d) => ({ ...d, paymentLinks: { ...d.paymentLinks, [key]: value } }));

  const docTabs = [
    { id: "agreement", label: "Service Agreement" },
    { id: "script", label: "Discovery Call Script" },
    { id: "links", label: "Payment Links" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b pb-2" style={{ borderColor: C.border }}>
        {docTabs.map((t) => (
          <button key={t.id} onClick={() => setDocTab(t.id)} className={`px-3 py-1.5 rounded-lg text-sm ${docTab === t.id ? "bg-[#22c55e] text-black font-semibold" : "text-zinc-400 hover:text-zinc-100"}`}>{t.label}</button>
        ))}
      </div>

      {docTab === "agreement" && (
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <div className="rounded-2xl border p-5 space-y-3" style={{ background: C.card, borderColor: C.border }}>
            <h3 className="font-semibold mb-1">Fill fields</h3>
            <Field label="Client name"><input className={inputCls} value={a.clientName} onChange={(e) => setA("clientName", e.target.value)} /></Field>
            <Field label="Business name"><input className={inputCls} value={a.businessName} onChange={(e) => setA("businessName", e.target.value)} /></Field>
            <Field label="Date"><input type="date" className={inputCls} value={a.date} onChange={(e) => setA("date", e.target.value)} /></Field>
            <Field label="Package">
              <select className={inputCls} value={a.pkg} onChange={(e) => setA("pkg", e.target.value)}>
                {["Starter", "Growth", "Scale"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Setup fee (₹)"><input className={inputCls} value={a.setupFee} onChange={(e) => setA("setupFee", e.target.value)} /></Field>
            <Field label="Monthly retainer (₹)"><input className={inputCls} value={a.retainer} onChange={(e) => setA("retainer", e.target.value)} /></Field>
            <Field label="Services list"><textarea rows={3} className={inputCls} value={a.services} onChange={(e) => setA("services", e.target.value)} /></Field>
          </div>
          <div className="rounded-2xl border p-5" style={{ background: C.card, borderColor: C.border }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Service Agreement — AutoPilot AI</h3>
              <button className={btnPrimary} onClick={() => copy(buildAgreement(a))}>Copy Full Agreement</button>
            </div>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-200 bg-[#09090b] border rounded-xl p-5" style={{ borderColor: C.border }}>{buildAgreement(a)}</pre>
          </div>
        </div>
      )}

      {docTab === "script" && (
        <div className="rounded-2xl border p-5" style={{ background: C.card, borderColor: C.border }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Discovery Call Script — 20 Minutes</h3>
            <button className={btnPrimary} onClick={() => copy(CALL_SCRIPT)}>Copy Script</button>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200 bg-[#09090b] border rounded-xl p-5" style={{ borderColor: C.border }}>{CALL_SCRIPT}</pre>
        </div>
      )}

      {docTab === "links" && (
        <div className="rounded-2xl border p-5" style={{ background: C.card, borderColor: C.border }}>
          <h3 className="font-semibold">Payment Links — Quick Reference</h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {[
              ["starterSetup", "Starter Setup (₹15,000)"],
              ["starterRetainer", "Starter Retainer (₹5,000/mo)"],
              ["growthSetup", "Growth Setup (₹35,000)"],
              ["growthRetainer", "Growth Retainer (₹12,000/mo)"],
              ["scaleSetup", "Scale Setup (₹75,000)"],
              ["scaleRetainer", "Scale Retainer (₹25,000/mo)"],
            ].map(([k, label]) => (
              <Field key={k} label={label}>
                <div className="flex gap-2">
                  <input className={inputCls} placeholder="Paste Razorpay link" value={docs.paymentLinks[k]} onChange={(e) => setLink(k, e.target.value)} />
                  {docs.paymentLinks[k] && <button type="button" className={btnGhost} onClick={() => copy(docs.paymentLinks[k])}>Copy</button>}
                </div>
              </Field>
            ))}
          </div>
          <p className="mt-5 text-xs text-zinc-500">
            Create these links on razorpay.com → Payment Links → Create Link. Paste here. Send the relevant link when a client confirms.
          </p>
        </div>
      )}
    </div>
  );
}
