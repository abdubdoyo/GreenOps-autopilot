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
