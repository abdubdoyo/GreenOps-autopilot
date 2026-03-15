"use client";
import { use, useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Nav";
import { Button, Badge, Card, ProgressBar, Separator } from "@/components/ui";
import { BaselineVsOptimizedChart, OptimizationRadar } from "@/components/charts/Charts";
import { DEMO_SCENARIOS } from "@/lib/mock-data/scenarios";
import { formatCO2, formatCurrency, formatDateTime, getCarbonLabel, co2ToCarEquivalent } from "@/lib/utils";
import { PlanResponse, GeminiExplanation } from "@/lib/types";
import {
  CheckCircle2, ChevronDown, ChevronUp, Download, Play,
  Leaf, DollarSign, Clock, Globe, Zap, Shield, Info,
  MapPin, TrendingDown, Award, Sparkles, RefreshCw, ListPlus,
} from "lucide-react";
import { addToQueue, isJobInQueue, isJobExecuted } from "@/lib/store/execution";

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

// ── AI Explanation Panel ──────────────────────────────────────────────────────
function AIExplanationPanel({
  explanation,
  source,
  onRerun,
  rerunLoading,
}: {
  explanation: GeminiExplanation;
  source: "live" | "cached" | "fallback" | "static";
  onRerun?: () => void;
  rerunLoading?: boolean;
}) {
  const recBadge = {
    PROCEED: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.4)" },
    REVIEW: { color: "#eab308", bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.4)" },
    RECONSIDER: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)" },
  }[explanation.recommendation];

  const sourceLabel = {
    live: { icon: "🟢", text: "Live carbon data" },
    cached: { icon: "🟡", text: "Cached (15 min)" },
    fallback: { icon: "⚪", text: "Static estimates" },
    static: { icon: "⚪", text: "Static estimates" },
  }[source];

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6b8f6b] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#22c55e]" />
          AI Sustainability Analysis
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#4a6b4a] flex items-center gap-1">
            {sourceLabel.icon} {sourceLabel.text}
          </span>
          {onRerun && (
            <button
              onClick={onRerun}
              disabled={rerunLoading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[rgba(34,197,94,0.2)] text-[#6b8f6b] hover:border-[rgba(34,197,94,0.4)] hover:text-white transition-all text-[11px] disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${rerunLoading ? "animate-spin" : ""}`} />
              {rerunLoading ? "Thinking..." : "Re-run AI"}
            </button>
          )}
          <div
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: recBadge.bg, color: recBadge.color, border: `1px solid ${recBadge.border}` }}
          >
            {explanation.recommendation}
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-[#86efac] leading-relaxed mb-5">{explanation.summary}</p>

      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Why this region */}
        <div className="p-4 rounded-xl bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.1)]">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#22c55e] mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Why This Region
          </div>
          <p className="text-xs text-[#a7c5a7] leading-relaxed">{explanation.whyThisRegion}</p>
        </div>

        {/* Tradeoffs */}
        <div className="p-4 rounded-xl bg-[rgba(234,179,8,0.04)] border border-[rgba(234,179,8,0.1)]">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#eab308] mb-2 flex items-center gap-1">
            <Info className="w-3 h-3" /> Tradeoffs
          </div>
          <p className="text-xs text-[#a7c5a7] leading-relaxed">{explanation.tradeoffs}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-5">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[#6b8f6b] mb-3">Recommendations</div>
        <div className="space-y-2">
          {explanation.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[#22c55e]">{i + 1}</span>
              </div>
              <p className="text-xs text-[#a7c5a7] leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fun fact + confidence */}
      <div className="flex gap-3">
        <div className="flex-1 p-3 rounded-lg bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.08)]">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-[#6b8f6b] mb-1">🌍 CO₂ Equivalency</div>
          <p className="text-xs text-[#86efac]">{explanation.funFact}</p>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-[rgba(14,165,233,0.04)] border border-[rgba(14,165,233,0.08)]">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-[#4a8fa8] mb-1">📊 Confidence</div>
          <p className="text-xs text-[#7ab8cc]">{explanation.confidenceNote}</p>
        </div>
      </div>
    </Card>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function PlanResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [planResponse, setPlanResponse] = useState<PlanResponse | null>(null);
  const [rerunLoading, setRerunLoading] = useState(false);

  // Load plan: sessionStorage → /api/demo for demo IDs → static mock
  useEffect(() => {
    const stored = sessionStorage.getItem("greenops_plan");
    if (stored) {
      try {
        const data = JSON.parse(stored) as PlanResponse;
        // Use stored data if jobId matches OR it's a real (non-demo) plan
        if (!id.startsWith("demo-") || data.optimizedPlan.jobId === id) {
          setPlanResponse(data);
          return;
        }
      } catch {/* ignore parse errors */}
    }

    // For demo routes, fetch live from /api/demo to get fresh Gemini explanation
    if (id.startsWith("demo-")) {
      fetch("/api/demo")
        .then((r) => r.json())
        .then((data: PlanResponse) => setPlanResponse(data))
        .catch(() => { /* use static fallback below */ });
    }
  }, [id]);

  async function handleRerunAI() {
    if (!planResponse) return;
    setRerunLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobSpec: planResponse.jobSpec,
          baselinePlan: planResponse.baselinePlan,
          optimizedPlan: planResponse.optimizedPlan,
          rankedRegions: planResponse.optimizedPlan.alternativeRegions?.map((a, i) => ({
            region: a.region,
            energyKwh: planResponse.optimizedPlan.energyKwh,
            co2Kg: a.co2Kg,
            costUSD: a.costUSD,
            score: 1 - i * 0.1,
            rank: a.rank,
          })) ?? [],
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setPlanResponse((prev) => prev ? { ...prev, explanation: data.explanation } : prev);
      }
    } catch (err) {
      console.error("Failed to re-run AI:", err);
    } finally {
      setRerunLoading(false);
    }
  }

  const [inQueue, setInQueue] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);

  useEffect(() => {
    if (!planResponse) return;
    setInQueue(isJobInQueue(planResponse.optimizedPlan.jobId));
    setIsExecuted(isJobExecuted(planResponse.optimizedPlan.jobId));

    const handleUpdate = () => {
      setInQueue(isJobInQueue(planResponse.optimizedPlan.jobId));
      setIsExecuted(isJobExecuted(planResponse.optimizedPlan.jobId));
    };
    window.addEventListener("greenops_storage_update", handleUpdate);
    return () => window.removeEventListener("greenops_storage_update", handleUpdate);
  }, [planResponse]);

  async function handleAddToQueue() {
    if (!planResponse) return;
    setExecuting(true);
    await new Promise((r) => setTimeout(r, 800));
    addToQueue(planResponse);
    setExecuting(false);
    setExecuted(true);
  }

  if (!planResponse) return (
    <DashboardLayout title="Loading...">
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#22c55e] animate-spin" />
      </div>
    </DashboardLayout>
  );

  const { jobSpec, baselinePlan, optimizedPlan, explanation, source } = planResponse;

  const radarData = [
    { metric: "Carbon Score", baseline: Math.round((1 - baselinePlan.carbonIntensityGCO2 / 500) * 100), optimized: Math.round((1 - optimizedPlan.carbonIntensityGCO2 / 500) * 100) },
    { metric: "Cost Efficiency", baseline: 85, optimized: optimizedPlan.costDeltaUSD > 0 ? 78 : 90 },
    { metric: "Speed", baseline: 90, optimized: 82 },
    { metric: "Availability", baseline: baselinePlan.region.availabilityScore, optimized: optimizedPlan.region.availabilityScore },
    { metric: "Reliability", baseline: 95, optimized: 92 },
  ];

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
              Carbon-optimized execution plan for {jobSpec.workloadType} workload
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
              onClick={handleAddToQueue}
              disabled={executed || inQueue || isExecuted}
            >
              {isExecuted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully Executed
                </>
              ) : inQueue || executed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  In Pipeline
                </>
              ) : (
                <>
                  <ListPlus className="w-4 h-4" />
                  Add to Execution Pipeline
                </>
              )}
            </Button>
          </div>
        </div>

        {(executed || inQueue || isExecuted) && (
          <div className="p-4 rounded-xl border border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.08)] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
            <div>
              <div className="text-sm font-semibold text-white">
                {isExecuted 
                  ? `Job completed in ${optimizedPlan.region.name}` 
                  : `Job added to execution pipeline for ${optimizedPlan.region.name}`}
              </div>
              <div className="text-xs text-[#6b8f6b]">
                {isExecuted 
                  ? `Completed at ${formatDateTime(new Date().toISOString())}`
                  : `Job scheduled to start ${formatDateTime(optimizedPlan.startTime)} · Saving ${formatCO2(optimizedPlan.co2SavedKg)} CO₂`}
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

        {/* AI Explanation Panel */}
        {explanation && (
          <AIExplanationPanel
            explanation={explanation}
            source={source}
            onRerun={handleRerunAI}
            rerunLoading={rerunLoading}
          />
        )}

        <div className="flex gap-4 pb-8">
          <Button 
            variant="primary" 
            size="lg" 
            className="flex-1" 
            loading={executing} 
            onClick={handleAddToQueue} 
            disabled={executed || inQueue || isExecuted}
          >
            {isExecuted ? (
              <><CheckCircle2 className="w-4 h-4" /> Completed in {optimizedPlan.region.name}</>
            ) : inQueue || executed ? (
              <><CheckCircle2 className="w-4 h-4" /> In Pipeline for {optimizedPlan.region.name}</>
            ) : (
              <><ListPlus className="w-4 h-4" /> Add to Execution Pipeline</>
            )}
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
