import { DemoScenario, DashboardMetrics, WeeklySavings, SustainabilityMetric } from "../types";
import { REGIONS } from "./regions";

const usEast = REGIONS.find((r) => r.id === "us-east-1")!;
const euNorth = REGIONS.find((r) => r.id === "eu-north-1")!;
const montreal = REGIONS.find((r) => r.id === "northamerica-northeast1")!;
const usWest = REGIONS.find((r) => r.id === "us-west-2")!;
const swedenCentral = REGIONS.find((r) => r.id === "swedencentral")!;

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "demo-llm-training",
    name: "LLM Fine-Tuning — GPT-Style Model",
    description: "8xA100 fine-tune run for a 7B parameter language model with 48h deadline",
    jobSpec: {
      id: "job-demo-001",
      name: "LLM Fine-Tune v3.2",
      workloadType: "ml-training",
      hardwareType: "gpu-a100",
      runtimeHours: 18,
      deadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      allowedRegions: ["us-east-1", "us-west-2", "eu-west-1", "eu-north-1"],
      costCapUSD: 2500,
      perfPriority: "high",
      sustainabilityWeight: 75,
      createdAt: new Date().toISOString(),
    },
    baselinePlan: {
      jobId: "job-demo-001",
      region: usEast,
      startTime: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
      endTime: new Date(Date.now() + 19 * 3600 * 1000).toISOString(),
      estimatedCO2kg: 121.4,
      estimatedCostUSD: 1987.56,
      energyKwh: 314.2,
      carbonIntensityGCO2: 386,
    },
    optimizedPlan: {
      jobId: "job-demo-001",
      region: euNorth,
      startTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      endTime: new Date(Date.now() + 22 * 3600 * 1000).toISOString(),
      estimatedCO2kg: 2.5,
      estimatedCostUSD: 2131.20,
      energyKwh: 314.2,
      carbonIntensityGCO2: 8,
      co2SavedKg: 118.9,
      co2SavedPercent: 97.9,
      costDeltaUSD: 143.64,
      confidenceScore: 94,
      optimizationScore: 98,
      auditLog: [
        {
          id: "log-001",
          timestamp: new Date().toISOString(),
          step: "Region Enumeration",
          decision: "Evaluated 4 allowed regions",
          reasoning: "Filtered allowed regions: us-east-1, us-west-2, eu-west-1, eu-north-1",
          impact: "low",
        },
        {
          id: "log-002",
          timestamp: new Date(Date.now() + 100).toISOString(),
          step: "Carbon Scoring",
          decision: "Ranked regions by carbon intensity",
          reasoning: "eu-north-1 (8 gCO2/kWh) scores 98% cleaner than us-east-1 (386 gCO2/kWh). Hydroelectric + wind grid in Scandinavia.",
          impact: "high",
        },
        {
          id: "log-003",
          timestamp: new Date(Date.now() + 200).toISOString(),
          step: "Deadline Check",
          decision: "4h delay approved — deadline met with 26h margin",
          reasoning: "Job runtime 18h + 4h start delay = 22h total. Deadline is 48h away. 26h safety margin exceeds minimum threshold.",
          impact: "medium",
        },
        {
          id: "log-004",
          timestamp: new Date(Date.now() + 300).toISOString(),
          step: "Cost Constraint",
          decision: "Cost within cap: $2,131 < $2,500 cap",
          reasoning: "eu-north-1 GPU pricing ($3.44/hr) × 18h × 8 GPUs = $2,131. Within the $2,500 cap.",
          impact: "medium",
        },
        {
          id: "log-005",
          timestamp: new Date(Date.now() + 400).toISOString(),
          step: "Time Slot Optimization",
          decision: "Scheduled for 04:00 UTC to avoid Stockholm peak hours",
          reasoning: "eu-north-1 grid has lowest carbon intensity during 02:00–08:00 UTC. Renewable percentage peaks at 99.4% overnight.",
          impact: "high",
        },
        {
          id: "log-006",
          timestamp: new Date(Date.now() + 500).toISOString(),
          step: "Plan Finalized",
          decision: "Optimized plan selected: 97.9% CO2 reduction",
          reasoning: "118.9 kg CO2 avoided. Equivalent to driving 487 km in an average petrol car.",
          impact: "high",
        },
      ],
      assumptions: [
        { id: "a1", category: "Hardware", description: "GPU power draw", value: "400W per A100 at full utilization", confidence: "high" },
        { id: "a2", category: "Grid", description: "Carbon intensity source", value: "Electricity Maps API snapshot (15-min granularity)", confidence: "high" },
        { id: "a3", category: "Overhead", description: "PUE (Power Usage Effectiveness)", value: "1.12 — AWS/GCP reported average", confidence: "medium" },
        { id: "a4", category: "Cooling", description: "Cooling overhead included in PUE", value: "Yes — embedded in 1.12 multiplier", confidence: "high" },
        { id: "a5", category: "Network", description: "Data transfer emissions", value: "Excluded — <1% of compute emissions", confidence: "medium" },
        { id: "a6", category: "Grid", description: "Forecast horizon", value: "6h ahead forecast used; may drift ±5%", confidence: "medium" },
      ],
      alternativeRegions: [
        { region: euNorth, co2Kg: 2.5, costUSD: 2131.20, rank: 1 },
        { region: swedenCentral, co2Kg: 4.7, costUSD: 2194.56, rank: 2 },
        { region: montreal, co2Kg: 0.6, costUSD: 2257.92, rank: 3 },
        { region: usWest, co2Kg: 42.7, costUSD: 1989.00, rank: 4 },
        { region: usEast, co2Kg: 121.4, costUSD: 1987.56, rank: 5 },
      ],
    },
  },
  {
    id: "demo-etl-pipeline",
    name: "Nightly ETL — Data Warehouse Refresh",
    description: "CPU-intensive ETL job processing 500GB of raw event data",
    jobSpec: {
      id: "job-demo-002",
      name: "Nightly ETL Refresh",
      workloadType: "etl",
      hardwareType: "cpu",
      runtimeHours: 4,
      deadline: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
      allowedRegions: ["us-east-1", "us-central1", "northamerica-northeast1"],
      costCapUSD: 500,
      perfPriority: "medium",
      sustainabilityWeight: 60,
      createdAt: new Date().toISOString(),
    },
    baselinePlan: {
      jobId: "job-demo-002",
      region: usEast,
      startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 4.5 * 3600 * 1000).toISOString(),
      estimatedCO2kg: 8.9,
      estimatedCostUSD: 342.10,
      energyKwh: 23.1,
      carbonIntensityGCO2: 386,
    },
    optimizedPlan: {
      jobId: "job-demo-002",
      region: montreal,
      startTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      endTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      estimatedCO2kg: 0.046,
      estimatedCostUSD: 364.80,
      energyKwh: 23.1,
      carbonIntensityGCO2: 2,
      co2SavedKg: 8.854,
      co2SavedPercent: 99.5,
      costDeltaUSD: 22.70,
      confidenceScore: 91,
      optimizationScore: 96,
      auditLog: [
        {
          id: "log-e001",
          timestamp: new Date().toISOString(),
          step: "Region Analysis",
          decision: "Montréal selected — 99% hydro-electric grid",
          reasoning: "northamerica-northeast1 carbon intensity of 2 gCO2/kWh is lowest among allowed regions by 99.5%.",
          impact: "high",
        },
        {
          id: "log-e002",
          timestamp: new Date(Date.now() + 100).toISOString(),
          step: "Start Time Optimization",
          decision: "2h delay selected — off-peak pricing",
          reasoning: "Running at 02:00 local time avoids peak CPU demand window and aligns with lowest grid carbon period.",
          impact: "medium",
        },
        {
          id: "log-e003",
          timestamp: new Date(Date.now() + 200).toISOString(),
          step: "Plan Finalized",
          decision: "99.5% CO2 reduction achieved",
          reasoning: "From 8.9kg to 0.046kg CO2. $22.70 additional cost represents $193/tonne CO2 — below typical carbon credit prices.",
          impact: "high",
        },
      ],
      assumptions: [
        { id: "b1", category: "Hardware", description: "CPU TDP assumed", value: "96-core, 240W TDP at 85% utilization", confidence: "medium" },
        { id: "b2", category: "Grid", description: "Montréal grid source", value: "Hydro-Québec — 99.4% hydro + renewables (2024 annual)", confidence: "high" },
        { id: "b3", category: "Overhead", description: "PUE applied", value: "1.10 — GCP Montreal datacenter rated", confidence: "high" },
      ],
      alternativeRegions: [
        { region: montreal, co2Kg: 0.046, costUSD: 364.80, rank: 1 },
        { region: usEast, co2Kg: 8.9, costUSD: 342.10, rank: 2 },
        { region: REGIONS.find(r => r.id === "us-central1")!, co2Kg: 9.8, costUSD: 329.20, rank: 3 },
      ],
    },
  },
];

export const DASHBOARD_METRICS: DashboardMetrics = {
  totalJobsAnalyzed: 1847,
  totalCO2SavedKg: 24381,
  avgOptimizationRate: 73.4,
  totalCostDeltaUSD: -3218,
  activeJobs: 12,
};

export const WEEKLY_SAVINGS: WeeklySavings[] = [
  { week: "Mar 3", co2Saved: 2841, costSaved: 412, jobsOptimized: 198 },
  { week: "Mar 10", co2Saved: 3124, costSaved: 287, jobsOptimized: 221 },
  { week: "Mar 17", co2Saved: 2987, costSaved: 521, jobsOptimized: 210 },
  { week: "Mar 24", co2Saved: 3456, costSaved: 394, jobsOptimized: 247 },
  { week: "Mar 31", co2Saved: 3891, costSaved: 618, jobsOptimized: 268 },
  { week: "Apr 7",  co2Saved: 4102, costSaved: 445, jobsOptimized: 283 },
  { week: "Apr 14", co2Saved: 3980, costSaved: 541, jobsOptimized: 276 },
];

export const SUSTAINABILITY_METRICS: SustainabilityMetric[] = [
  { id: "sm1", label: "CO₂ Saved This Month", value: 8082, unit: "kg", change: 18.2, trend: "up", isPositive: true },
  { id: "sm2", label: "Avg Carbon Intensity", value: 127, unit: "gCO₂/kWh", change: -23.1, trend: "down", isPositive: true },
  { id: "sm3", label: "Clean Energy Jobs", value: 76.4, unit: "%", change: 12.3, trend: "up", isPositive: true },
  { id: "sm4", label: "Optimization Rate", value: 73.4, unit: "%", change: 5.7, trend: "up", isPositive: true },
];

export const RECENT_PLANS = [
  { id: "plan-001", jobName: "ResNet Training v4", region: "EU North (Stockholm)", co2Saved: 48.2, savedPct: 96, cost: 412, status: "completed", ts: "2h ago" },
  { id: "plan-002", jobName: "Customer Segmentation ETL", region: "Montréal", co2Saved: 12.1, savedPct: 98, cost: 89, status: "running", ts: "4h ago" },
  { id: "plan-003", jobName: "Fraud Detection Inference", region: "Sweden Central", co2Saved: 3.4, savedPct: 88, cost: 203, status: "completed", ts: "7h ago" },
  { id: "plan-004", jobName: "GPT Fine-Tune Batch", region: "EU North (Stockholm)", co2Saved: 118.9, savedPct: 98, cost: 2131, status: "completed", ts: "12h ago" },
  { id: "plan-005", jobName: "Feature Engineering Pipeline", region: "US West (Oregon)", co2Saved: 18.7, savedPct: 65, cost: 621, status: "queued", ts: "15h ago" },
  { id: "plan-006", jobName: "Nightly Warehouse Refresh", region: "Montréal", co2Saved: 8.9, savedPct: 99, cost: 364, status: "completed", ts: "1d ago" },
];

export const REGION_EMISSIONS_CHART = REGIONS.map((r) => ({
  name: r.name.replace(/\(.*\)/, "").trim().split(" ").slice(-2).join(" "),
  carbonIntensity: r.carbonIntensity,
  renewablePercent: r.renewablePercent,
  fill: r.carbonIntensity < 50 ? "#22c55e" : r.carbonIntensity < 200 ? "#eab308" : "#ef4444",
})).sort((a, b) => a.carbonIntensity - b.carbonIntensity);
