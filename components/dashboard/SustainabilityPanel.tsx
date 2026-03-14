"use client";
import { TrendingUp, TrendingDown, Leaf, Zap, Globe, Award } from "lucide-react";
import { SUSTAINABILITY_METRICS } from "@/lib/mock-data/scenarios";
import { cn } from "@/lib/utils";

function InsightItem({ metric }: { metric: typeof SUSTAINABILITY_METRICS[0] }) {
  const isGood = metric.isPositive
    ? metric.trend === "up"
    : metric.trend === "down";

  return (
    <div className="flex items-center gap-4 py-3 border-b border-[rgba(34,197,94,0.06)] last:border-0">
      <div className="flex-1">
        <div className="text-xs text-[#6b8f6b] mb-0.5">{metric.label}</div>
        <div className="text-lg font-bold text-white tabular-nums">
          {metric.value.toLocaleString()}
          <span className="text-sm font-normal text-[#6b8f6b] ml-1">{metric.unit}</span>
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          isGood
            ? "bg-[rgba(34,197,94,0.1)] text-[#22c55e]"
            : "bg-[rgba(239,68,68,0.1)] text-[#ef4444]"
        )}
      >
        {isGood ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(metric.change).toFixed(1)}%
      </div>
    </div>
  );
}

export function SustainabilityPanel() {
  return (
    <div className="glass-card p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b]">Sustainability Insights</h3>
        <p className="text-xs text-[#4a6b4a] mt-0.5">vs. last 30 days</p>
      </div>

      <div>
        {SUSTAINABILITY_METRICS.map((m) => (
          <InsightItem key={m.id} metric={m} />
        ))}
      </div>

      {/* Achievement cards */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.12)]">
          <Award className="w-5 h-5 text-[#22c55e] shrink-0" />
          <div>
            <div className="text-xs font-semibold text-white">Green Grid Champion</div>
            <div className="text-[10px] text-[#6b8f6b]">&gt;90% jobs routed to clean regions this week</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(14,165,233,0.06)] border border-[rgba(14,165,233,0.12)]">
          <Globe className="w-5 h-5 text-[#0ea5e9] shrink-0" />
          <div>
            <div className="text-xs font-semibold text-white">Carbon Neutral Track</div>
            <div className="text-[10px] text-[#6b8f6b]">On pace for net-zero compute by Q3</div>
          </div>
        </div>
      </div>

      {/* CO2 equivalencies */}
      <div className="p-4 rounded-xl bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.1)]">
        <div className="text-xs font-semibold text-[#6b8f6b] uppercase tracking-widest mb-3 flex items-center gap-2">
          <Leaf className="w-3 h-3" />
          Your impact this month
        </div>
        <div className="space-y-2">
          {[
            { icon: "🌳", label: "Trees worth of CO₂", value: "406" },
            { icon: "🚗", label: "km not driven", value: "33,122" },
            { icon: "✈️", label: "flight hours avoided", value: "12.4" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-[#6b8f6b]">{icon} {label}</span>
              <span className="text-xs font-mono font-bold text-[#22c55e]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="text-[10px] text-[#4a6b4a]">
          Data sourced from{" "}
          <span className="text-[#22c55e]">Electricity Maps API</span> · Updated every 15 min
        </div>
      </div>
    </div>
  );
}
