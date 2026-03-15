// Core data types for GreenOps Autopilot

export type WorkloadType = "ml-training" | "ml-inference" | "etl" | "batch" | "streaming" | "ci-cd";
export type HardwareType = "cpu" | "gpu-a100" | "gpu-v100" | "gpu-t4" | "tpu-v4";
export type PerfPriority = "low" | "medium" | "high" | "critical";
export type Region = string;

export interface JobSpec {
  id: string;
  name: string;
  workloadType: WorkloadType;
  hardwareType: HardwareType;
  runtimeHours: number;
  deadline: string; // ISO date string
  allowedRegions: Region[];
  costCapUSD: number;
  perfPriority: PerfPriority;
  sustainabilityWeight: number; // 0-100
  createdAt: string;
}

export interface RegionCarbonProfile {
  id: string;
  name: string;
  provider: "aws" | "gcp" | "azure";
  carbonIntensity: number; // gCO2eq/kWh
  renewablePercent: number; // 0-100
  zone: "us" | "eu" | "asia" | "other";
  pricePerHourCPU: number; // USD
  pricePerHourGPU: number; // USD
  availabilityScore: number; // 0-100
  peakHours: number[]; // hours of day (0-23) with high demand
}

export interface BaselinePlan {
  jobId: string;
  region: RegionCarbonProfile;
  startTime: string; // ISO datetime
  endTime: string;
  estimatedCO2kg: number;
  estimatedCostUSD: number;
  energyKwh: number;
  carbonIntensityGCO2: number;
}

export interface OptimizedPlan {
  jobId: string;
  region: RegionCarbonProfile;
  startTime: string;
  endTime: string;
  estimatedCO2kg: number;
  estimatedCostUSD: number;
  energyKwh: number;
  carbonIntensityGCO2: number;
  co2SavedKg: number;
  co2SavedPercent: number;
  costDeltaUSD: number;
  confidenceScore: number; // 0-100
  optimizationScore: number; // 0-100
  alternativeRegions: AlternativeRegion[];
}


export interface AlternativeRegion {
  region: RegionCarbonProfile;
  co2Kg: number;
  costUSD: number;
  rank: number;
}

export interface SustainabilityMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number; // % change from last period
  trend: "up" | "down" | "flat";
  isPositive: boolean; // whether up is good
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  jobSpec: JobSpec;
  baselinePlan: BaselinePlan;
  optimizedPlan: OptimizedPlan;
}

export interface WeeklySavings {
  week: string;
  co2Saved: number;
  costSaved: number;
  jobsOptimized: number;
}

// ── New types added for backend integration ───────────────────────────────────

export interface GeminiExplanation {
  summary: string;
  whyThisRegion: string;
  tradeoffs: string;
  recommendations: string[];
  funFact: string;
  confidenceNote: string;
  recommendation: "PROCEED" | "REVIEW" | "RECONSIDER";
}

export interface PlanResponse {
  jobSpec: JobSpec;
  baselinePlan: BaselinePlan;
  optimizedPlan: OptimizedPlan;
  explanation: GeminiExplanation;
  source: "live" | "cached" | "fallback" | "static";
  generatedAt: string;
}

export interface EnrichedRegionProfile extends RegionCarbonProfile {
  liveCarbon?: number;
  carbonSource: "live" | "static";
}

// ── Original types below ──────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalJobsAnalyzed: number;
  totalCO2SavedKg: number;
  avgOptimizationRate: number;
  totalCostDeltaUSD: number;
  activeJobs: number;
}
