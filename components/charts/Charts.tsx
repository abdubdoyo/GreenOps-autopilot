/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Legend
} from "recharts";
const WEEKLY_SAVINGS: any[] = [];
const REGION_EMISSIONS_CHART: any[] = [];

const TOOLTIP_STYLE = {
  backgroundColor: "#0d1a0d",
  border: "1px solid rgba(34,197,94,0.2)",
  borderRadius: "8px",
  color: "#e8f5e8",
  fontSize: "12px",
};

const fmtWeekly = (v: any, name: any) => [
  name === "co2Saved" ? `${Number(v).toLocaleString()} kg` : `$${v}`,
  name === "co2Saved" ? "CO₂ Saved" : "Cost Saved",
];
const fmtBar   = (v: any) => [`${v} gCO₂/kWh`, "Carbon Intensity"];
const fmtCO2   = (v: any) => [`${Number(v).toFixed(2)} kg CO₂`, ""];
const fmtLegend = (v: any) => <span style={{ color: "#9ca3af" }}>{v}</span>;

export function WeeklySavingsChart() {
  return (
    <div className="glass-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b]">Weekly CO₂ Savings</h3>
        <p className="text-xs text-[#4a6b4a] mt-1">kg CO₂eq avoided by optimization engine</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={WEEKLY_SAVINGS} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.06)" />
          <XAxis dataKey="week" tick={{ fill: "#6b8f6b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6b8f6b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={fmtWeekly} />
          <Area type="monotone" dataKey="co2Saved"  stroke="#22c55e" strokeWidth={2} fill="url(#co2Grad)"  dot={false} />
          <Area type="monotone" dataKey="costSaved" stroke="#0ea5e9" strokeWidth={2} fill="url(#costGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-xs text-[#6b8f6b]">
          <span className="w-3 h-0.5 bg-[#22c55e] inline-block rounded" />CO₂ Saved (kg)
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#6b8f6b]">
          <span className="w-3 h-0.5 bg-[#0ea5e9] inline-block rounded" />Cost Saved ($)
        </span>
      </div>
    </div>
  );
}

export function RegionEmissionsChart() {
  return (
    <div className="glass-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b]">Carbon Intensity by Region</h3>
        <p className="text-xs text-[#4a6b4a] mt-1">gCO₂eq/kWh — lower is cleaner</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={REGION_EMISSIONS_CHART} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.06)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6b8f6b", fontSize: 10 }}
            axisLine={false} tickLine={false}
            angle={-35} textAnchor="end" interval={0}
          />
          <YAxis tick={{ fill: "#6b8f6b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={fmtBar} />
          <Bar dataKey="carbonIntensity" radius={[4, 4, 0, 0]}>
            {REGION_EMISSIONS_CHART.map((entry, i) => (
              <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BaselineVsOptimizedChart({ baseline, optimized }: { baseline: number; optimized: number }) {
  const data = [
    { name: "Baseline",  co2: baseline,  fill: "#ef4444" },
    { name: "Optimized", co2: optimized, fill: "#22c55e" },
  ];
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.06)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "#6b8f6b", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#6b8f6b", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={fmtCO2} />
        <Bar dataKey="co2" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OptimizationRadar({ data }: { data: { metric: string; baseline: number; optimized: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(34,197,94,0.1)" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: "#6b8f6b", fontSize: 11 }} />
        <Radar name="Baseline"  dataKey="baseline"  stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={1.5} />
        <Radar name="Optimized" dataKey="optimized" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={1.5} />
        <Legend wrapperStyle={{ fontSize: "12px", color: "#6b8f6b" }} formatter={fmtLegend} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
