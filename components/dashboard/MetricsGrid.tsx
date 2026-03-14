"use client";
import { TrendingUp, TrendingDown, Leaf, DollarSign, BarChart2, Activity } from "lucide-react";
import { DashboardMetrics } from "@/lib/types";
import { formatCO2, formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  change?: number;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
}

function MetricCard({ label, value, subtext, change, icon, color = "#22c55e", delay = 0 }: MetricCardProps) {
  const isPositive = (change ?? 0) >= 0;
  return (
    <div
      className="glass-card p-6 relative overflow-hidden group hover:border-[rgba(34,197,94,0.25)] transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Accent glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        style={{ background: `radial-gradient(ellipse at top left, ${color}08 0%, transparent 60%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          {change !== undefined && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                isPositive
                  ? "bg-[rgba(34,197,94,0.1)] text-[#22c55e]"
                  : "bg-[rgba(239,68,68,0.1)] text-[#ef4444]"
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
        </div>

        <div className="text-3xl font-bold text-white tabular-nums mb-1">{value}</div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#6b8f6b] mb-1">{label}</div>
        {subtext && <div className="text-xs text-[#4a6b4a]">{subtext}</div>}
      </div>
    </div>
  );
}

export function MetricsGrid({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Jobs Analyzed"
        value={metrics.totalJobsAnalyzed.toLocaleString()}
        subtext={`${metrics.activeJobs} currently active`}
        change={12.4}
        icon={<BarChart2 className="w-5 h-5" />}
        color="#0ea5e9"
        delay={0}
      />
      <MetricCard
        label="CO₂ Saved"
        value={formatCO2(metrics.totalCO2SavedKg)}
        subtext="vs baseline execution"
        change={18.2}
        icon={<Leaf className="w-5 h-5" />}
        color="#22c55e"
        delay={100}
      />
      <MetricCard
        label="Avg Optimization"
        value={formatPercent(metrics.avgOptimizationRate)}
        subtext="carbon reduction rate"
        change={5.7}
        icon={<Activity className="w-5 h-5" />}
        color="#22c55e"
        delay={200}
      />
      <MetricCard
        label="Cost Delta"
        value={formatCurrency(Math.abs(metrics.totalCostDeltaUSD))}
        subtext={metrics.totalCostDeltaUSD < 0 ? "net savings" : "net premium"}
        change={-8.1}
        icon={<DollarSign className="w-5 h-5" />}
        color="#eab308"
        delay={300}
      />
    </div>
  );
}
