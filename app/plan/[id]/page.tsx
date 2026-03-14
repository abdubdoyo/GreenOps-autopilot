"use client";
import { use, useState } from "react";
import { DashboardLayout } from "@/components/layout/Nav";
import { Button, Badge, Card, ProgressBar, Separator } from "@/components/ui";
import { BaselineVsOptimizedChart, OptimizationRadar } from "@/components/charts/Charts";
import { DEMO_SCENARIOS } from "@/lib/mock-data/scenarios";
import { formatCO2, formatCurrency, formatDateTime, getCarbonLabel, co2ToCarEquivalent } from "@/lib/utils";
import {
  CheckCircle2, ChevronDown, ChevronUp, Download, Play,
  Leaf, DollarSign, Clock, Globe, Zap, Shield, Info,
  MapPin, TrendingDown, Award,
} from "lucide-react";

function CompareCard({
  label, isBaseline, co2, cost, region, carbonIntensity, startTime,
}: {
  label: string; isBaseline: boolean; co2: number; cost: number;
  region: string; carbonIntensity: number; startTime: string;
}) {
  const cl = getCarbonLabel(carbonIntensity);
  return (
    <div className={`rounded-xl p-6 border ${
      isBaseline
        ? "border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.04)]"
        : "border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.06)] glow-green"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-bold uppercase tracking-widest ${
          isBaseline ? "text-[#ef4444]" : "text-[#22c55e]"
        }`}>{label}</span>
        {!isBaseline && (
          <Badge variant="green">
            <Award className="w-3 h-3" />
            Recommended
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isBaseline ? "bg-[rgba(239,68,68,0.1)]" : "bg-[rgba(34,197,94,0.1)]"
          }`}>
            <Leaf className={`w-4 h-4 ${isBaseline ? "text-[#ef4444]" : "text-[#22c55e]"}`} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tabular-nums">{formatCO2(co2)}</div>
            <div className="text-xs text-[#6b8f6b]">CO₂ equivalent</div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-[10px] text-[#6b8f6b] uppercase tracking-wide mb-0.5">Est. Cost</div>
            <div className="font-mono font-semibold text-white">{formatCurrency(cost)}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#6b8f6b] uppercase tracking-wide mb-0.5">Carbon Grid</div>
            <div className="font-mono text-xs" style={{ color: cl.color }}>
              {carbonIntensity} gCO₂/kWh
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#6b8f6b] uppercase tracking-wide mb-0.5">Region</div>
            <div className="text-xs text-white font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#6b8f6b]" />
              {region.split("(").pop()?.replace(")", "") ?? region}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#6b8f6b] uppercase tracking-wide mb-0.5">Start Time</div>
            <div className="text-xs text-white font-mono">{formatDateTime(startTime)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${cl.color}15`,
              color: cl.color,
              border: `1px solid ${cl.color}30`,
            }}
          >
            {cl.label}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditLog({ entries }: { entries: typeof DEMO_SCENARIOS[0]["optimizedPlan"]["auditLog"] }) {
  return (
    <div className="relative pl-4">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#22c55e] via-[rgba(34,197,94,0.3)] to-transparent" />
      <div className="space-y-6">
        {entries.map((entry, i) => {
          const impactColor = entry.impact === "high" ? "#22c55e" : entry.impact === "medium" ? "#eab308" : "#6b8f6b";
          return (
            <div key={entry.id} className="relative">
              <div
                className="absolute -left-[17px] top-0 w-3 h-3 rounded-full border-2 border-[#0a0f0a]"
                style={{ backgroundColor: impactColor }}
              />
              <div className="pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-white">{entry.step}</span>
                  <Badge variant={entry.impact === "high" ? "green" : entry.impact === "medium" ? "yellow" : "ghost"}>
                    {entry.impact}
                  </Badge>
                </div>
                <div className="text-sm font-medium text-[#86efac] mb-1">{entry.decision}</div>
                <div className="text-xs text-[#6b8f6b] leading-relaxed">{entry.reasoning}</div>
                <div className="text-[10px] text-[#4a6b4a] mt-1 font-mono">
                  Step {i + 1} of {entries.length}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssumptionsDrawer({ assumptions }: { assumptions: typeof DEMO_SCENARIOS[0]["optimizedPlan"]["assumptions"] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[rgba(34,197,94,0.1)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[rgba(34,197,94,0.04)] hover:bg-[rgba(34,197,94,0.08)] transition-colors text-sm font-medium text-[#6b8f6b]"
      >
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#22c55e]" />
          Calculation Assumptions ({assumptions.length})
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="p-6 space-y-3 border-t border-[rgba(34,197,94,0.1)]">
          {assumptions.map((a) => (
            <div key={a.id} className="flex items-start gap-4">
              <Badge variant={a.confidence === "high" ? "green" : a.confidence === "medium" ? "yellow" : "ghost"} className="mt-0.5 shrink-0">
                {a.confidence}
              </Badge>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#86efac]">{a.category}: <span className="text-white font-normal">{a.description}</span></div>
                <div className="text-xs text-[#6b8f6b] font-mono mt-0.5">{a.value}</div>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-[#4a6b4a] pt-2 border-t border-[rgba(34,197,94,0.06)]">
            All calculations are estimates. Actual emissions may vary based on real-time grid conditions, hardware utilization, and datacenter cooling efficiency.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PlanResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);

  // Find scenario – fall back to first demo
  const scenario =
    DEMO_SCENARIOS.find((s) => s.id === id) ?? DEMO_SCENARIOS[0];

  const { jobSpec, baselinePlan, optimizedPlan } = scenario;

  const radarData = [
    { metric: "Carbon Score", baseline: 5, optimized: 98 },
    { metric: "Cost Efficiency", baseline: 85, optimized: 78 },
    { metric: "Speed", baseline: 90, optimized: 82 },
    { metric: "Availability", baseline: 95, optimized: 90 },
    { metric: "Reliability", baseline: 95, optimized: 92 },
  ];

  async function handleExecute() {
    setExecuting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setExecuting(false);
    setExecuted(true);
  }

  return (
    <DashboardLayout title="Plan Results">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{jobSpec.name}</h2>
              <Badge variant="green">
                <Leaf className="w-3 h-3" />
                Optimized
              </Badge>
            </div>
            <p className="text-sm text-[#6b8f6b]">
              {scenario.description}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="md">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={executing}
              onClick={handleExecute}
              disabled={executed}
            >
              {executed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Plan Executing
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Execute Plan
                </>
              )}
            </Button>
          </div>
        </div>

        {executed && (
          <div className="p-4 rounded-xl border border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.08)] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
            <div>
              <div className="text-sm font-semibold text-white">Plan dispatched to {optimizedPlan.region.name}</div>
              <div className="text-xs text-[#6b8f6b]">
                Job scheduled to start {formatDateTime(optimizedPlan.startTime)} · Saving {formatCO2(optimizedPlan.co2SavedKg)} CO₂
              </div>
            </div>
          </div>
        )}

        {/* Hero Saving Stat */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "CO₂ Reduction",
              value: `${optimizedPlan.co2SavedPercent.toFixed(1)}%`,
              sub: `${formatCO2(optimizedPlan.co2SavedKg)} saved`,
              icon: <TrendingDown className="w-5 h-5" />,
              color: "#22c55e",
            },
            {
              label: "Carbon Intensity",
              value: `${optimizedPlan.region.carbonIntensity}g`,
              sub: "gCO₂eq/kWh",
              icon: <Leaf className="w-5 h-5" />,
              color: "#22c55e",
            },
            {
              label: "Cost Delta",
              value: formatCurrency(Math.abs(optimizedPlan.costDeltaUSD)),
              sub: "premium for green run",
              icon: <DollarSign className="w-5 h-5" />,
              color: "#eab308",
            },
            {
              label: "Confidence",
              value: `${optimizedPlan.confidenceScore}%`,
              sub: "optimizer certainty",
              icon: <Shield className="w-5 h-5" />,
              color: "#0ea5e9",
            },
          ].map(({ label, value, sub, icon, color }) => (
            <Card key={label} className="text-center py-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
              >
                <span style={{ color }}>{icon}</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums" style={{ color }}>{value}</div>
              <div className="text-[10px] font-semibold text-[#6b8f6b] uppercase tracking-wider mt-0.5">{label}</div>
              <div className="text-[10px] text-[#4a6b4a] mt-0.5">{sub}</div>
            </Card>
          ))}
        </div>

        {/* CO2 equivalency */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.12)]">
          <span className="text-2xl">🌍</span>
          <div className="flex-1">
            <span className="text-sm text-[#86efac] font-medium">
              Saving {formatCO2(optimizedPlan.co2SavedKg)} CO₂ is equivalent to&nbsp;
            </span>
            <span className="text-sm text-white font-semibold">
              {co2ToCarEquivalent(optimizedPlan.co2SavedKg)}
            </span>
            <span className="text-sm text-[#86efac]"> in a petrol car, or&nbsp;</span>
            <span className="text-sm text-white font-semibold">
              {(optimizedPlan.co2SavedKg / 0.2).toFixed(0)} trees growing for a year
            </span>
          </div>
        </div>

        {/* Side by side plan comparison */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b] mb-4">Plan Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <CompareCard
              label="Baseline Execution"
              isBaseline
              co2={baselinePlan.estimatedCO2kg}
              cost={baselinePlan.estimatedCostUSD}
              region={baselinePlan.region.name}
              carbonIntensity={baselinePlan.carbonIntensityGCO2}
              startTime={baselinePlan.startTime}
            />
            <CompareCard
              label="Optimized Plan"
              isBaseline={false}
              co2={optimizedPlan.estimatedCO2kg}
              cost={optimizedPlan.estimatedCostUSD}
              region={optimizedPlan.region.name}
              carbonIntensity={optimizedPlan.carbonIntensityGCO2}
              startTime={optimizedPlan.startTime}
            />
          </div>
        </div>

        {/* Chart + Radar */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b] mb-4">
              Emissions Comparison
            </h3>
            <BaselineVsOptimizedChart
              baseline={baselinePlan.estimatedCO2kg}
              optimized={optimizedPlan.estimatedCO2kg}
            />
            <div className="mt-3 text-xs text-[#6b8f6b] text-center">
              kg CO₂eq — {optimizedPlan.co2SavedPercent.toFixed(1)}% reduction achieved
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b] mb-2">
              Multi-Dimension Score
            </h3>
            <OptimizationRadar data={radarData} />
          </Card>
        </div>

        {/* Alternative Regions */}
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b] mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            All Evaluated Regions
          </h3>
          <div className="space-y-3">
            {optimizedPlan.alternativeRegions.map((alt) => {
              const cl = getCarbonLabel(alt.region.carbonIntensity);
              const isSelected = alt.rank === 1;
              return (
                <div
                  key={alt.region.id}
                  className={`flex items-center gap-4 p-3 rounded-lg border ${
                    isSelected
                      ? "border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.06)]"
                      : "border-[rgba(34,197,94,0.06)] bg-[#111a11]"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0f0a]"
                    style={{ backgroundColor: alt.rank === 1 ? "#22c55e" : alt.rank === 2 ? "#eab308" : "#4a6b4a" }}
                  >
                    {alt.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      {alt.region.name}
                      {isSelected && <Badge variant="green">Selected</Badge>}
                    </div>
                    <div className="text-xs text-[#6b8f6b]">{alt.region.provider.toUpperCase()} · {alt.region.renewablePercent}% renewable</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono" style={{ color: cl.color }}>
                      {formatCO2(alt.co2Kg)}
                    </div>
                    <div className="text-xs text-[#6b8f6b]">{formatCurrency(alt.costUSD)}</div>
                  </div>
                  <div className="w-20">
                    <ProgressBar
                      value={100 - (alt.region.carbonIntensity / 450) * 100}
                      color={cl.color}
                    />
                    <div className="text-[9px] text-[#4a6b4a] mt-0.5 text-right">{cl.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Audit Log */}
        <Card>
          <div className="mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b]">
              Optimizer Audit Log
            </h3>
            <p className="text-xs text-[#4a6b4a] mt-1">
              Every decision made by the optimization engine, fully transparent
            </p>
          </div>
          <AuditLog entries={optimizedPlan.auditLog} />
        </Card>

        {/* Assumptions */}
        <AssumptionsDrawer assumptions={optimizedPlan.assumptions} />

        {/* Footer actions */}
        <div className="flex gap-4 pb-8">
          <Button variant="primary" size="lg" className="flex-1" loading={executing} onClick={handleExecute} disabled={executed}>
            {executed ? <><CheckCircle2 className="w-4 h-4" /> Executing in {optimizedPlan.region.name}</> : <><Play className="w-4 h-4" /> Execute Optimized Plan</>}
          </Button>
          <Button variant="secondary" size="lg">
            <Download className="w-4 h-4" />
            Export PDF Report
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
