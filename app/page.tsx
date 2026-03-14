"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Leaf, Zap, Globe, BarChart3, Shield, ChevronRight,
  ArrowRight, Play, CheckCircle2, TrendingDown, Clock,
} from "lucide-react";

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const step = to / 60;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, to);
      setValue(Math.round(current));
      if (current >= to) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [to]);
  return <span>{value.toLocaleString()}{suffix}</span>;
}

const FEATURES = [
  { icon: Globe,       color: "#22c55e", title: "Carbon-Aware Routing",   desc: "Real-time grid data from 50+ cloud regions. Route jobs to cleanest compute zones automatically." },
  { icon: Clock,       color: "#0ea5e9", title: "Temporal Optimization",  desc: "Schedule workloads at low-carbon hours. Renewable peaks are predictable — exploit them." },
  { icon: BarChart3,   color: "#a78bfa", title: "Full Explainability",    desc: "Every decision logged. Audit trail of why each region was chosen, what was traded off." },
  { icon: Shield,      color: "#f59e0b", title: "Constraint-Aware",       desc: "Deadlines, cost caps, region restrictions respected. Optimization without surprises." },
  { icon: TrendingDown,color: "#22c55e", title: "Cost Neutral",           desc: "Most optimizations save money by moving workloads off-peak. Green doesn't mean expensive." },
  { icon: Zap,         color: "#0ea5e9", title: "Instant Integration",    desc: "REST API with a single POST. Drop into any CI/CD, Airflow DAG, or MLOps pipeline." },
];

const WORKFLOW = [
  { step: "01", title: "Define Your Job",    desc: "Enter runtime, hardware, deadline, and cost limits via UI or API call." },
  { step: "02", title: "Grid Analysis",      desc: "GreenOps fetches live carbon intensity from regional grid operators worldwide." },
  { step: "03", title: "Optimization Engine",desc: "OR-Tools optimizer finds the cleanest feasible region + time slot under all constraints." },
  { step: "04", title: "Execute & Track",    desc: "One-click dispatch. Emissions saved tracked in real-time on your dashboard." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8f5e8] overflow-hidden">
      <nav className="fixed top-0 w-full border-b border-[rgba(34,197,94,0.08)] bg-[rgba(10,15,10,0.9)] backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#0a0f0a]" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white tracking-tight">GreenOps Autopilot</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#6b8f6b]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-[#6b8f6b] hover:text-white transition-colors">Sign in</Link>
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22c55e] text-[#0a0f0a] text-sm font-semibold hover:bg-[#16a34a] transition-all">
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-24 px-6 grid-bg">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(34,197,94,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.08)] text-xs text-[#22c55e] font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] pulse-green" />
            Carbon Intensity API · Live Grid Data · 50+ Regions
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Run AI workloads<br />
            <span className="gradient-text">without the carbon guilt</span>
          </h1>
          <p className="text-lg text-[#6b8f6b] leading-relaxed max-w-2xl mx-auto mb-10">
            GreenOps Autopilot schedules compute jobs to the cleanest region and time slot automatically — cutting CO₂ by up to 99% with zero performance compromise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/planner" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#22c55e] text-[#0a0f0a] font-bold text-base hover:bg-[#16a34a] transition-all hover:scale-105 active:scale-100">
              <Zap className="w-5 h-5" />Plan your first job
            </Link>
            <Link href="/plan/demo-llm-training" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-[rgba(34,197,94,0.3)] text-[#22c55e] font-semibold text-base hover:bg-[rgba(34,197,94,0.08)] transition-all">
              <Play className="w-5 h-5" />See live demo
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-[#4a6b4a]">
            {["No credit card required","API-first design","GDPR compliant"].map(t => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#22c55e]" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(34,197,94,0.08)] py-12 px-6 bg-[#0d1a0d]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 97, suffix: "%",   label: "Max CO₂ reduction" },
            { value: 50, suffix: "+",   label: "Cloud regions supported" },
            { value: 24, suffix: "k+",  label: "kg CO₂ saved to date" },
            { value: 15, suffix: "min", label: "Grid data freshness" },
          ].map(({ value, suffix, label }) => (
            <div key={label}>
              <div className="text-4xl font-black text-white mb-1 gradient-text"><AnimatedCounter to={value} suffix={suffix} /></div>
              <div className="text-sm text-[#6b8f6b]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#22c55e] mb-3">Features</div>
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need to go green</h2>
            <p className="text-[#6b8f6b] max-w-xl mx-auto">A complete stack for carbon-aware compute scheduling, from job spec to audit report.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="glass-card p-6 group hover:border-[rgba(34,197,94,0.25)] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-[#6b8f6b] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6 bg-[#0d1a0d]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#22c55e] mb-3">Workflow</div>
            <h2 className="text-4xl font-bold text-white mb-4">Four steps to net-zero compute</h2>
          </div>
          <div className="space-y-4">
            {WORKFLOW.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-6 p-6 rounded-xl border border-[rgba(34,197,94,0.08)] bg-[rgba(34,197,94,0.03)] hover:border-[rgba(34,197,94,0.2)] transition-all group">
                <div className="text-4xl font-black text-[rgba(34,197,94,0.2)] group-hover:text-[rgba(34,197,94,0.4)] transition-colors w-14 shrink-0 font-mono">{step}</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{title}</h3>
                  <p className="text-sm text-[#6b8f6b]">{desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity self-center" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl font-black text-white mb-4">Start saving carbon today</h2>
              <p className="text-[#6b8f6b] mb-8">Connect your first job in under 5 minutes. No infra changes required.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#22c55e] text-[#0a0f0a] font-bold hover:bg-[#16a34a] transition-all hover:scale-105">
                  Open Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/plan/demo-llm-training" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-[rgba(34,197,94,0.3)] text-[#22c55e] font-semibold hover:bg-[rgba(34,197,94,0.08)] transition-all">
                  View demo plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(34,197,94,0.08)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#22c55e] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#0a0f0a]" />
            </div>
            <span className="text-sm text-[#6b8f6b]">GreenOps Autopilot · Built for a greener cloud</span>
          </div>
          <div className="flex gap-6 text-xs text-[#4a6b4a]">
            {["Privacy","Terms","Docs","GitHub"].map(l => <a key={l} href="#" className="hover:text-[#22c55e] transition-colors">{l}</a>)}
          </div>
          <div className="text-xs text-[#4a6b4a]">Powered by Electricity Maps API · Data updated every 15m</div>
        </div>
      </footer>
    </div>
  );
}
