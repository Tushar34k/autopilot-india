import React, { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hours, setHours] = useState(0);
  const [biz, setBiz] = useState(0);
  const [flipped, setFlipped] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Real Estate",
    task: "",
    phone: "",
  });
  const formRef = useRef(null);

  // Animated counters on mount
  useEffect(() => {
    const duration = 1800;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setHours(Math.floor(ease * 10000));
      setBiz(Math.floor(ease * 47));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scrollToForm = (e) => {
    if (e) e.preventDefault();
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const toggleFlip = (k) => setFlipped((s) => ({ ...s, [k]: !s[k] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const navLinks = [
    { label: "How It Works", id: "how" },
    { label: "Results", id: "results" },
    { label: "Pricing", id: "pricing" },
    { label: "Contact", id: "audit" },
  ];

  const services = [
    { icon: "🔔", title: "Lead Capture & Instant Response", desc: "Catch every lead the moment it lands." },
    { icon: "💬", title: "WhatsApp Follow-Up Sequences", desc: "Automated nudges until they reply." },
    { icon: "📧", title: "Email Automation & Nurture", desc: "Personalised sequences that close." },
    { icon: "📊", title: "Daily Business Reports", desc: "Numbers in your pocket every morning." },
    { icon: "🤖", title: "Customer Support Chatbot", desc: "Answers 24/7, escalates the rest." },
    { icon: "📋", title: "Internal Workflow Automation", desc: "Kill copy-paste tasks for good." },
  ];

  const cases = [
    {
      id: "re",
      tag: "Real Estate Agency",
      before: "Following up with leads manually, 3-hour delay, 40% leads go cold.",
      after: "WhatsApp sent in 60 seconds, 0 leads missed, agent saves 15 hrs/week.",
    },
    {
      id: "ec",
      tag: "E-commerce Brand",
      before: "200 customer emails answered manually per day, 2 support staff, ₹40,000/month cost.",
      after: "Handles 85% of queries instantly, 1 staff reviews edge cases, cost: ₹18,000/month.",
    },
    {
      id: "rec",
      tag: "Recruitment Firm",
      before: "Screening 500 CVs manually per job posting, takes 3 days.",
      after: "Shortlisted in 20 minutes, recruiter only reviews top 10%.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-mono antialiased selection:bg-[#22c55e] selection:text-black">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#09090b]/80 border-b border-zinc-800">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold tracking-tight text-lg">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]"></span>
            </span>
            AutoPilot AI
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            {navLinks.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={scrollTo(l.id)} className="hover:text-[#22c55e] transition-colors">
                {l.label}
              </a>
            ))}
            <button onClick={scrollToForm} className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-4 py-2 rounded-full text-sm transition-colors">
              Get Free Audit
            </button>
          </div>
          <button className="md:hidden text-zinc-200" onClick={() => setMenuOpen((s) => !s)} aria-label="Toggle menu">
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-zinc-200 transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-zinc-200 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-zinc-200 transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-[#09090b] px-5 py-4 space-y-3">
            {navLinks.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={scrollTo(l.id)} className="block text-zinc-300 hover:text-[#22c55e]">
                {l.label}
              </a>
            ))}
            <button onClick={scrollToForm} className="w-full bg-[#22c55e] text-black font-semibold py-2 rounded-full">
              Get Free Audit
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#22c55e 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/60 to-[#09090b] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#22c55e] rounded-full blur-[140px] opacity-20" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#f97316] rounded-full blur-[140px] opacity-10" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900/60 px-3 py-1 rounded-full text-xs text-zinc-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            Built for Indian SMBs
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] max-w-5xl">
            Your Business Runs 24/7.{" "}
            <span className="text-[#22c55e]">Do Your Operations?</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            We build AI automations that replace manual work — no salary, no sick days, no human error.
            A <span className="text-zinc-100 font-semibold">₹15,000/month</span> system that outperforms a{" "}
            <span className="text-zinc-100 font-semibold">₹20,000/month</span> hire.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={scrollToForm} className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-6 py-3.5 rounded-full transition-colors shadow-[0_0_30px_-5px_#22c55e]">
              Get Free Workflow Audit →
            </button>
            <a href="#how" onClick={scrollTo("how")} className="border border-zinc-700 hover:border-[#22c55e] hover:text-[#22c55e] text-zinc-200 font-semibold px-6 py-3.5 rounded-full transition-colors text-center">
              See How It Works
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-8 max-w-xl">
            <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-zinc-500">Hours Saved</div>
              <div className="mt-2 text-3xl sm:text-4xl font-bold text-[#22c55e]">
                {hours.toLocaleString("en-IN")}+
              </div>
            </div>
            <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-zinc-500">Businesses Automated</div>
              <div className="mt-2 text-3xl sm:text-4xl font-bold text-[#f97316]">{biz}+</div>
            </div>
          </div>

          <div className="mt-14">
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Works with</div>
            <div className="flex flex-wrap gap-2">
              {["WhatsApp", "Instagram", "Gmail", "Google Sheets", "Shopify", "99acres"].map((b) => (
                <span key={b} className="px-3 py-1.5 text-xs border border-zinc-800 bg-zinc-900/60 rounded-md text-zinc-300">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl">
          You're <span className="text-[#f97316]">Losing Money</span> Every Day You Do This Manually
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            { icon: "⏱️", stat: "2 days", text: "Leads go cold in 2 hours. You reply in 2 days." },
            { icon: "💸", stat: "₹0/hour", text: "You hired staff to do copy-paste tasks worth ₹0/hour." },
            { icon: "⚠️", stat: "Right now", text: "Your competitor is automating. You're still on WhatsApp manually." },
          ].map((c, i) => (
            <div key={i} className="relative rounded-2xl p-6 border border-[#f97316]/30 bg-gradient-to-br from-[#f97316]/10 via-zinc-900/40 to-transparent">
              <div className="text-3xl">{c.icon}</div>
              <div className="mt-4 text-2xl font-bold text-[#f97316]">{c.stat}</div>
              <div className="mt-2 text-zinc-300">{c.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 border-t border-zinc-900">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl">
          We Build Your <span className="text-[#22c55e]">24/7 Digital Workforce</span>
        </h2>

        <div className="mt-12 grid md:grid-cols-4 gap-4">
          {[
            "We Audit Your Workflow",
            "We Map the Automation",
            "We Build & Test It",
            "It Runs Forever",
          ].map((step, i) => (
            <div key={i} className="relative border border-zinc-800 bg-zinc-900/40 rounded-2xl p-5">
              <div className="text-xs text-[#22c55e] font-bold">STEP 0{i + 1}</div>
              <div className="mt-2 font-semibold text-lg">{step}</div>
              {i < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 text-[#22c55e] text-xl">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Workflow diagram */}
        <div className="mt-14 border border-zinc-800 rounded-2xl p-6 sm:p-10 bg-zinc-900/30 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[640px] gap-2">
            {["New Lead", "Processes", "WhatsApp Sent", "Lead Saved", "Follow-up Scheduled"].map((n, i, a) => (
              <React.Fragment key={n}>
                <div className="flex flex-col items-center">
                  <div
                    className="relative h-14 w-14 rounded-full border-2 border-[#22c55e] flex items-center justify-center bg-[#22c55e]/10"
                    style={{ animation: `pulse 2s ${i * 0.25}s infinite` }}
                  >
                    <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
                  </div>
                  <div className="mt-3 text-xs sm:text-sm text-zinc-300 text-center max-w-[100px]">{n}</div>
                </div>
                {i < a.length - 1 && (
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-[#22c55e] to-[#22c55e]/30 relative">
                    <span className="absolute -top-[3px] right-0 h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <style>{`
            @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6) } 50% { box-shadow: 0 0 0 14px rgba(34,197,94,0) } }
          `}</style>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 border-t border-zinc-900">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl">
          What Happens When You <span className="text-[#22c55e]">Automate</span>
        </h2>
        <p className="mt-4 text-zinc-500 text-sm">Tap any card to flip between Before and After.</p>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {cases.map((c) => {
            const showAfter = !!flipped[c.id];
            return (
              <button
                key={c.id}
                onClick={() => toggleFlip(c.id)}
                className={`text-left rounded-2xl p-6 border transition-all duration-300 ${
                  showAfter
                    ? "border-[#22c55e] bg-[#22c55e]/5 shadow-[0_0_40px_-15px_#22c55e]"
                    : "border-[#f97316]/40 bg-[#f97316]/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-widest text-zinc-400">{c.tag}</div>
                  <div className={`text-[10px] px-2 py-1 rounded-full font-bold ${showAfter ? "bg-[#22c55e] text-black" : "bg-[#f97316] text-black"}`}>
                    {showAfter ? "AFTER" : "BEFORE"}
                  </div>
                </div>
                <div className="mt-6 text-lg leading-relaxed text-zinc-100 min-h-[120px]">
                  {showAfter ? c.after : c.before}
                </div>
                <div className="mt-4 text-xs text-zinc-500">Tap to flip ↺</div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { k: "15 hrs/week", v: "Average time saved per client" },
            { k: "60 seconds", v: "Average lead response time" },
            { k: "85%", v: "Reduction in manual support queries" },
          ].map((m) => (
            <div key={m.k} className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#22c55e]">{m.k}</div>
              <div className="mt-2 text-sm text-zinc-400">{m.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 border-t border-zinc-900">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl">
          The Systems We <span className="text-[#22c55e]">Build For You</span>
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.title} className="group border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 hover:border-[#22c55e] transition-colors">
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-4 font-semibold text-lg">{s.title}</div>
              <div className="mt-2 text-sm text-zinc-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 border-t border-zinc-900">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
        <p className="mt-4 text-zinc-400">Setup fee + monthly retainer. Cancel anytime with 30 days notice.</p>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            {
              name: "STARTER",
              setup: "₹15,000",
              monthly: "₹5,000",
              features: ["1 core automation", "Lead capture + WhatsApp response", "3-day delivery", "Monthly maintenance", "Email support"],
            },
            {
              name: "GROWTH",
              setup: "₹35,000",
              monthly: "₹12,000",
              featured: true,
              features: ["3 full automations", "Complete lead → follow-up → reporting stack", "Intelligent automated responses", "WhatsApp + Email coverage", "Monthly strategy call"],
            },
            {
              name: "SCALE",
              setup: "₹75,000",
              monthly: "₹25,000",
              features: ["Full automation stack", "Custom chatbot trained on your business", "CRM integration", "Analytics dashboard", "Weekly calls + priority support"],
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-7 border bg-zinc-900/40 ${
                p.featured ? "border-[#22c55e] shadow-[0_0_50px_-15px_#22c55e] md:-translate-y-2" : "border-zinc-800"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#22c55e] text-black text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="text-xs tracking-widest text-zinc-400">{p.name}</div>
              <div className="mt-4">
                <div className="text-3xl font-bold">{p.setup}</div>
                <div className="text-xs text-zinc-500 mt-1">one-time setup</div>
              </div>
              <div className="mt-3">
                <div className="text-xl font-semibold text-[#22c55e]">+ {p.monthly}<span className="text-sm text-zinc-500">/month</span></div>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[#22c55e]">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={scrollToForm}
                className={`mt-7 w-full py-3 rounded-full font-semibold transition-colors ${
                  p.featured
                    ? "bg-[#22c55e] text-black hover:bg-[#16a34a]"
                    : "border border-zinc-700 hover:border-[#22c55e] hover:text-[#22c55e]"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-400">Not sure which plan? Get a free audit and we'll recommend exactly what you need.</p>
          <button onClick={scrollToForm} className="mt-4 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-6 py-3 rounded-full">
            Get My Free Recommendation
          </button>
        </div>
      </section>

      {/* AUDIT FORM */}
      <section id="audit" ref={formRef} className="px-5 sm:px-8 py-20 sm:py-28 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#22c55e] via-[#22c55e]/40 to-[#f97316] rounded-3xl blur-xl opacity-40" />
          <div className="relative rounded-3xl border border-[#22c55e]/40 bg-[#09090b] p-7 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Find Out Exactly Where You're Losing <span className="text-[#22c55e]">Time and Money</span>
            </h2>
            <p className="mt-3 text-zinc-400">
              We'll audit your current workflow for free and show you 3 automations you could build this month.
            </p>

            {submitted ? (
              <div className="mt-10 border border-[#22c55e] bg-[#22c55e]/10 rounded-2xl p-8 text-center">
                <div className="text-4xl">✓</div>
                <div className="mt-3 text-xl font-semibold text-[#22c55e]">Audit request received</div>
                <p className="mt-2 text-zinc-300">
                  Thanks {form.name || "there"} — we'll reach you on WhatsApp within 4 hours with your free workflow breakdown.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-widest">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-2 w-full bg-zinc-900 border border-zinc-800 focus:border-[#22c55e] outline-none rounded-xl px-4 py-3 text-zinc-100"
                    placeholder="Your full name"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="text-xs text-zinc-400 uppercase tracking-widest">Business Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="mt-2 w-full bg-zinc-900 border border-zinc-800 focus:border-[#22c55e] outline-none rounded-xl px-4 py-3 text-zinc-100"
                  >
                    <option>Real Estate</option>
                    <option>E-commerce</option>
                    <option>Recruitment</option>
                    <option>Marketing Agency</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-widest">Biggest time-wasting task</label>
                  <textarea
                    required
                    rows={3}
                    value={form.task}
                    onChange={(e) => setForm({ ...form, task: e.target.value })}
                    className="mt-2 w-full bg-zinc-900 border border-zinc-800 focus:border-[#22c55e] outline-none rounded-xl px-4 py-3 text-zinc-100"
                    placeholder="e.g. manually replying to lead inquiries on WhatsApp"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-widest">WhatsApp number</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-2 w-full bg-zinc-900 border border-zinc-800 focus:border-[#22c55e] outline-none rounded-xl px-4 py-3 text-zinc-100"
                    placeholder="+91 98xxxxxxxx"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-4 rounded-xl text-lg transition-colors shadow-[0_0_40px_-10px_#22c55e]">
                    Request My Free Audit
                  </button>
                </div>
              </form>
            )}

            <p className="mt-6 text-sm text-zinc-400 text-center">
              ⚡ We respond within 4 hours. No pitch. Just a genuine audit.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 px-5 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] animate-pulse" />
              AutoPilot AI
            </div>
            <p className="mt-3 text-sm text-zinc-500 max-w-sm">
              Built with automation. Delivered by people who care about your results.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-[#22c55e]">Privacy Policy</a>
            <a href="#" className="hover:text-[#22c55e]">Terms</a>
            <a href="#audit" onClick={scrollTo("audit")} className="hover:text-[#22c55e]">Contact</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-[#22c55e] inline-flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.06c.53-1 1.83-2.06 3.77-2.06C21.4 8.64 22 11 22 14.07V21h-4v-6.16c0-1.47-.03-3.36-2.05-3.36-2.05 0-2.36 1.6-2.36 3.25V21h-4z"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-zinc-900 text-xs text-zinc-600">
          © {new Date().getFullYear()} AutoPilot AI. All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp contact button */}
      <a
        href="https://wa.me/91XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 h-14 w-14 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform"
        style={{ backgroundColor: "#25D366", animation: "wa-bounce 5s ease-in-out infinite" }}
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" style={{ animationDuration: "2.5s" }} />
        <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" className="relative">
          <path d="M19.11 17.36c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM16 3C8.83 3 3 8.83 3 16c0 2.28.6 4.49 1.75 6.45L3 29l6.74-1.71A12.9 12.9 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3zm0 23.5c-1.95 0-3.86-.52-5.53-1.5l-.4-.24-4 1.01 1.07-3.9-.26-.4A10.46 10.46 0 0 1 5.5 16C5.5 10.21 10.21 5.5 16 5.5S26.5 10.21 26.5 16 21.79 26.5 16 26.5z"/>
        </svg>
        <style>{`
          @keyframes wa-bounce {
            0%, 85%, 100% { transform: translateY(0); }
            88% { transform: translateY(-10px); }
            91% { transform: translateY(0); }
            94% { transform: translateY(-6px); }
            97% { transform: translateY(0); }
          }
        `}</style>
      </a>
    </div>
  );
}
