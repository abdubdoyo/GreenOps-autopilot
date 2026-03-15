"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/Nav";
import { Button, Card, Badge } from "@/components/ui";
import {
  Cpu, Clock, DollarSign, Globe, Leaf,
  ChevronDown, Zap, Info, Play,
} from "lucide-react";
import { REGIONS } from "@/lib/mock-data/regions";

const WORKLOAD_TYPES = [
  { id: "ml-training", label: "ML Training", icon: "🧠", desc: "Model fine-tuning or full training runs" },
  { id: "ml-inference", label: "ML Inference", icon: "⚡", desc: "Batch or real-time model serving" },
  { id: "etl", label: "ETL Pipeline", icon: "🔄", desc: "Data transformation and loading" },
  { id: "batch", label: "Batch Processing", icon: "📦", desc: "Scheduled batch compute jobs" },
  { id: "streaming", label: "Streaming", icon: "🌊", desc: "Continuous data processing" },
  { id: "ci-cd", label: "CI/CD Build", icon: "🏗️", desc: "Compilation and test pipelines" },
];

const HARDWARE_TYPES = [
  { id: "cpu", label: "CPU", sub: "General purpose compute", watt: 240 },
  { id: "gpu-t4", label: "GPU T4", sub: "Cost-efficient ML inference", watt: 70 },
  { id: "gpu-v100", label: "GPU V100", sub: "High-performance ML training", watt: 300 },
  { id: "gpu-a100", label: "GPU A100", sub: "Top-tier ML / LLM training", watt: 400 },
  { id: "tpu-v4", label: "TPU v4", sub: "Google tensor processing unit", watt: 170 },
];

const US_REGIONS = REGIONS.filter((r) => r.zone === "us");
const EU_REGIONS = REGIONS.filter((r) => r.zone === "eu");
const ASIA_REGIONS = REGIONS.filter((r) => r.zone === "asia");

function SliderField({
  label, value, onChange, min = 0, max = 100,
  leftLabel, rightLabel, color = "#22c55e",
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; leftLabel?: string; rightLabel?: string; color?: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm font-mono" style={{ color }}>{value}%</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#22c55e] cursor-pointer"
        style={{ accentColor: color }}
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#4a6b4a]">{leftLabel}</span>
          <span className="text-[10px] text-[#4a6b4a]">{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#6b8f6b] mb-3 flex items-center gap-2">
      <span className="w-4 h-px bg-[rgba(34,197,94,0.4)] inline-block" />
      {children}
      <span className="flex-1 h-px bg-[rgba(34,197,94,0.1)] inline-block" />
    </h3>
  );
}

export default function PlannerPage() {
  const router = useRouter();
  const [workloadType, setWorkloadType] = useState("ml-training");
  const [hardwareType, setHardwareType] = useState("gpu-a100");
  const [jobName, setJobName] = useState("");
  const [runtime, setRuntime] = useState(18);
  const [costCap, setCostCap] = useState(2500);
  const [sustainWeight, setSustainWeight] = useState(75);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    "us-east-1", "us-west-2", "eu-west-1", "eu-north-1"
  ]);
  const [loading, setLoading] = useState(false);

  function toggleRegion(id: string) {
    setSelectedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const deadlineInput = (e.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>(
        'input[type="datetime-local"]'
      );
      const deadline = deadlineInput?.value
        ? new Date(deadlineInput.value).toISOString()
        : new Date(Date.now() + 48 * 3600000).toISOString();

      const jobSpec = {
        id: `job-${Date.now()}`,
        name: jobName || "Unnamed Job",
        workloadType,
        hardwareType,
        runtimeHours: runtime,
        deadline,
        allowedRegions: selectedRegions,
        costCapUSD: costCap,
        perfPriority: "medium",
        sustainabilityWeight: sustainWeight,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobSpec),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      sessionStorage.setItem("greenops_plan", JSON.stringify(data));
      router.push(`/plan/${data.optimizedPlan.jobId}`);
    } catch (err) {
      console.error("Failed to generate plan:", err);
      // Fall back to demo on error
      router.push("/plan/demo-llm-training");
    } finally {
      setLoading(false);
    }
  }

  function handleDemo() {
    router.push("/plan/demo-llm-training");
  }

  const selectedHW = HARDWARE_TYPES.find((h) => h.id === hardwareType);
  const estimatedKwh = ((selectedHW?.watt ?? 240) * runtime) / 1000;

  return (
    <DashboardLayout title="New Job Planner">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Plan a New Workload</h2>
            <p className="text-sm text-[#6b8f6b] mt-1">
              Enter your job specifications — GreenOps will find the optimal region and time slot
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={handleDemo}>
            <Play className="w-4 h-4" />
            Load Demo
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <SectionLabel>Job Details</SectionLabel>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#6b8f6b] mb-1.5 uppercase tracking-wide">
                  Job Name
                </label>
                <input
                  type="text"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="e.g. LLM Fine-Tune v3.2"
                  className="w-full bg-[#111a11] border border-[rgba(34,197,94,0.15)] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#4a6b4a] focus:outline-none focus:border-[rgba(34,197,94,0.5)] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6b8f6b] mb-1.5 uppercase tracking-wide">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  defaultValue={new Date(Date.now() + 48 * 3600000).toISOString().slice(0, 16)}
                  className="w-full bg-[#111a11] border border-[rgba(34,197,94,0.15)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[rgba(34,197,94,0.5)] transition-colors"
                />
              </div>
            </div>
          </Card>

          {/* Workload Type */}
          <Card>
            <SectionLabel>Workload Type</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              {WORKLOAD_TYPES.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWorkloadType(w.id)}
                  className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all ${
                    workloadType === w.id
                      ? "border-[rgba(34,197,94,0.5)] bg-[rgba(34,197,94,0.08)] text-white"
                      : "border-[rgba(34,197,94,0.08)] bg-[#111a11] text-[#6b8f6b] hover:border-[rgba(34,197,94,0.25)]"
                  }`}
                >
                  <span className="text-lg">{w.icon}</span>
                  <span className="text-xs font-semibold">{w.label}</span>
                  <span className="text-[10px] text-[#4a6b4a] leading-tight">{w.desc}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Hardware + Runtime */}
          <Card>
            <SectionLabel>Hardware & Runtime</SectionLabel>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#6b8f6b] mb-2 uppercase tracking-wide">
                  Hardware Type
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {HARDWARE_TYPES.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHardwareType(h.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                        hardwareType === h.id
                          ? "border-[rgba(14,165,233,0.5)] bg-[rgba(14,165,233,0.08)] text-white"
                          : "border-[rgba(34,197,94,0.08)] bg-[#111a11] text-[#6b8f6b] hover:border-[rgba(34,197,94,0.25)]"
                      }`}
                    >
                      <Cpu className="w-4 h-4" />
                      <span className="text-xs font-semibold">{h.label}</span>
                      <span className="text-[9px] text-[#4a6b4a]">{h.watt}W</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-[#6b8f6b] uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Runtime Estimate
                    </label>
                    <span className="text-sm font-mono text-white">{runtime}h</span>
                  </div>
                  <input
                    type="range" min={1} max={168} value={runtime}
                    onChange={(e) => setRuntime(Number(e.target.value))}
                    className="w-full cursor-pointer" style={{ accentColor: "#0ea5e9" }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-[#4a6b4a]">1h</span>
                    <span className="text-[10px] text-[#4a6b4a]">1 week</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-[#6b8f6b] uppercase tracking-wide flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3" />
                      Cost Cap
                    </label>
                    <span className="text-sm font-mono text-white">${costCap.toLocaleString()}</span>
                  </div>
                  <input
                    type="range" min={100} max={10000} step={100} value={costCap}
                    onChange={(e) => setCostCap(Number(e.target.value))}
                    className="w-full cursor-pointer" style={{ accentColor: "#eab308" }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-[#4a6b4a]">$100</span>
                    <span className="text-[10px] text-[#4a6b4a]">$10k</span>
                  </div>
                </div>
              </div>

              {/* Energy preview */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.1)]">
                <Zap className="w-4 h-4 text-[#22c55e]" />
                <span className="text-xs text-[#6b8f6b]">Estimated energy consumption:</span>
                <span className="text-xs font-mono font-bold text-[#22c55e]">{estimatedKwh.toFixed(1)} kWh</span>
                <span className="text-xs text-[#4a6b4a]">at {selectedHW?.watt}W peak draw</span>
              </div>
            </div>
          </Card>

          {/* Regions */}
          <Card>
            <SectionLabel>
              <Globe className="w-3 h-3" />
              Allowed Regions ({selectedRegions.length} selected)
            </SectionLabel>

            {[
              { label: "🇺🇸 North America", regions: US_REGIONS },
              { label: "🇪🇺 Europe", regions: EU_REGIONS },
              { label: "🌏 Asia Pacific", regions: ASIA_REGIONS },
            ].map(({ label, regions }) => (
              <div key={label} className="mb-4">
                <div className="text-[10px] font-medium text-[#4a6b4a] uppercase tracking-widest mb-2">{label}</div>
                <div className="flex flex-wrap gap-2">
                  {regions.map((r) => {
                    const selected = selectedRegions.includes(r.id);
                    const isClean = r.carbonIntensity < 50;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleRegion(r.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          selected
                            ? "border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.08)] text-white"
                            : "border-[rgba(34,197,94,0.08)] bg-[#111a11] text-[#6b8f6b] hover:border-[rgba(34,197,94,0.2)]"
                        }`}
                      >
                        {isClean && <span className="text-[#22c55e]">🌿</span>}
                        <span>{r.name}</span>
                        <span className={`font-mono text-[10px] ${r.carbonIntensity < 50 ? "text-[#22c55e]" : r.carbonIntensity < 200 ? "text-[#eab308]" : "text-[#ef4444]"}`}>
                          {r.carbonIntensity}g
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <p className="text-[10px] text-[#4a6b4a] flex items-center gap-1">
              <Info className="w-3 h-3" />
              🌿 = clean grid (&lt;50 gCO₂/kWh) · Numbers show carbon intensity
            </p>
          </Card>

          {/* Priorities */}
          <Card>
            <SectionLabel>
              <Leaf className="w-3 h-3" />
              Optimization Priorities
            </SectionLabel>
            <div className="space-y-5">
              <SliderField
                label="Sustainability Weight"
                value={sustainWeight}
                onChange={setSustainWeight}
                leftLabel="Cost-first"
                rightLabel="Green-first"
                color="#22c55e"
              />
              <div className="p-3 rounded-lg bg-[rgba(34,197,94,0.04)] border border-[rgba(34,197,94,0.1)] text-xs text-[#6b8f6b]">
                {sustainWeight >= 80
                  ? "🌿 Maximum green mode: optimizer will aggressively prioritize low-carbon regions, accepting higher cost."
                  : sustainWeight >= 50
                  ? "⚖️ Balanced mode: optimizer will balance cost and carbon impact."
                  : "💰 Cost-first mode: optimizer minimizes spend, uses carbon data as a tiebreaker."}
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex items-center gap-4 pb-8">
            <Button type="submit" size="lg" loading={loading} className="flex-1">
              {loading ? "Analyzing regions & grid data..." : "Generate Optimized Plan →"}
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={handleDemo}>
              Use demo job
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
