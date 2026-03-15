import {
  JobSpec,
  RegionCarbonProfile,
  BaselinePlan,
  OptimizedPlan,
  AuditLogEntry,
  Assumption,
  AlternativeRegion,
} from "@/lib/types";
import { HARDWARE_WATT, PUE, MAX_CARBON_INTENSITY, MAX_GPU_PRICE_PER_HOUR } from "./constants";

export interface RankedRegion {
  region: RegionCarbonProfile;
  energyKwh: number;
  co2Kg: number;
  costUSD: number;
  score: number;
  rank: number;
}

export interface OptimizerResult {
  baselinePlan: BaselinePlan;
  optimizedPlan: OptimizedPlan;
  rankedRegions: RankedRegion[];
}

function isGpuHardware(hw: JobSpec["hardwareType"]): boolean {
  return hw !== "cpu";
}

function estimateEnergy(jobSpec: JobSpec): number {
  const watt = HARDWARE_WATT[jobSpec.hardwareType] ?? 240;
  return (watt * jobSpec.runtimeHours * PUE) / 1000; // kWh
}

function estimateCO2(energyKwh: number, carbonIntensity: number): number {
  return (energyKwh * carbonIntensity) / 1000; // kg CO₂
}

function estimateCost(region: RegionCarbonProfile, jobSpec: JobSpec): number {
  const rate = isGpuHardware(jobSpec.hardwareType)
    ? region.pricePerHourGPU
    : region.pricePerHourCPU;
  return rate * jobSpec.runtimeHours;
}

function scoreRegion(
  region: RegionCarbonProfile,
  _costUSD: number,
  sustainabilityWeight: number
): number {
  const sw = sustainabilityWeight / 100;

  const carbonScore = Math.max(
    0,
    1 - region.carbonIntensity / MAX_CARBON_INTENSITY
  );
  // Use GPU price for cost score normalization (dominant compute cost)
  const costScore = Math.max(
    0,
    1 - region.pricePerHourGPU / MAX_GPU_PRICE_PER_HOUR
  );
  const availScore = region.availabilityScore / 100;

  // Weighted combination: sustainability + cost + availability
  return sw * carbonScore + (1 - sw) * 0.6 * costScore + 0.2 * availScore;
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function now(offsetMs = 0): string {
  return new Date(Date.now() + offsetMs).toISOString();
}

export function runOptimizer(
  jobSpec: JobSpec,
  regions: RegionCarbonProfile[]
): OptimizerResult {
  // Filter to allowed regions; fall back to all if empty
  let candidates =
    jobSpec.allowedRegions.length > 0
      ? regions.filter((r) => jobSpec.allowedRegions.includes(r.id))
      : [...regions];

  if (candidates.length === 0) candidates = [...regions];

  const energyKwh = estimateEnergy(jobSpec);

  // Compute scores for all candidates
  const scored = candidates.map((region) => {
    const co2Kg = estimateCO2(energyKwh, region.carbonIntensity);
    const costUSD = estimateCost(region, jobSpec);
    const score = scoreRegion(region, costUSD, jobSpec.sustainabilityWeight);
    return { region, energyKwh, co2Kg, costUSD, score };
  });

  // Filter out regions exceeding cost cap (keep at least one)
  const withinBudget = scored.filter((s) => s.costUSD <= jobSpec.costCapUSD);
  const finalCandidates = withinBudget.length > 0 ? withinBudget : scored;

  // Sort by score descending (best = rank 1)
  finalCandidates.sort((a, b) => b.score - a.score);

  // Rank
  const rankedRegions: RankedRegion[] = finalCandidates.map((s, i) => ({
    ...s,
    rank: i + 1,
  }));

  // Baseline = worst carbon region in the allowed set (simulates naïve default)
  const baselineCandidate = [...scored].sort(
    (a, b) => b.region.carbonIntensity - a.region.carbonIntensity
  )[0];

  const optimizedCandidate = rankedRegions[0];

  // Time planning
  const startDelay = 1 * 3600 * 1000; // 1h for baseline
  const optimizedDelay =
    ranked_delay_ms(optimizedCandidate.region, jobSpec);

  const baselineStart = now(startDelay);
  const baselineEnd = now(startDelay + jobSpec.runtimeHours * 3600 * 1000);
  const optimizedStart = now(optimizedDelay);
  const optimizedEnd = now(optimizedDelay + jobSpec.runtimeHours * 3600 * 1000);

  // Savings calculation
  const co2SavedKg = Math.max(
    0,
    baselineCandidate.co2Kg - optimizedCandidate.co2Kg
  );
  const co2SavedPercent =
    baselineCandidate.co2Kg > 0
      ? (co2SavedKg / baselineCandidate.co2Kg) * 100
      : 0;
  const costDeltaUSD =
    optimizedCandidate.costUSD - baselineCandidate.costUSD;

  // Confidence: based on availability score and carbon score spread
  const carbonSpread =
    baselineCandidate.region.carbonIntensity -
    optimizedCandidate.region.carbonIntensity;
  const confidenceScore = Math.min(
    99,
    Math.round(
      60 +
        (optimizedCandidate.region.availabilityScore / 100) * 20 +
        Math.min(carbonSpread / 10, 20)
    )
  );

  const optimizationScore = Math.min(
    99,
    Math.round(50 + co2SavedPercent / 2)
  );

  // Audit log
  const auditLog: AuditLogEntry[] = [
    {
      id: makeId(),
      timestamp: now(),
      step: "Region Enumeration",
      decision: `Evaluated ${candidates.length} allowed region${candidates.length !== 1 ? "s" : ""}`,
      reasoning: `Filtered from job spec: ${candidates.map((r) => r.id).join(", ")}`,
      impact: "low",
    },
    {
      id: makeId(),
      timestamp: now(100),
      step: "Carbon Scoring",
      decision: `Ranked regions by sustainability score (weight: ${jobSpec.sustainabilityWeight}%)`,
      reasoning: `${optimizedCandidate.region.name} (${optimizedCandidate.region.carbonIntensity} gCO₂/kWh) scored highest. Baseline region ${baselineCandidate.region.name} has ${baselineCandidate.region.carbonIntensity} gCO₂/kWh.`,
      impact: "high",
    },
    {
      id: makeId(),
      timestamp: now(200),
      step: "Cost Constraint Check",
      decision: `Estimated cost ${formatUSD(optimizedCandidate.costUSD)} ${optimizedCandidate.costUSD <= jobSpec.costCapUSD ? "within" : "exceeds"} $${jobSpec.costCapUSD} cap`,
      reasoning: `${isGpuHardware(jobSpec.hardwareType) ? "GPU" : "CPU"} rate ${formatUSD(isGpuHardware(jobSpec.hardwareType) ? optimizedCandidate.region.pricePerHourGPU : optimizedCandidate.region.pricePerHourCPU)}/hr × ${jobSpec.runtimeHours}h = ${formatUSD(optimizedCandidate.costUSD)}`,
      impact: "medium",
    },
    {
      id: makeId(),
      timestamp: now(300),
      step: "Energy Estimate",
      decision: `${energyKwh.toFixed(1)} kWh total consumption`,
      reasoning: `${HARDWARE_WATT[jobSpec.hardwareType]}W × ${jobSpec.runtimeHours}h × PUE ${PUE} = ${energyKwh.toFixed(1)} kWh`,
      impact: "medium",
    },
    {
      id: makeId(),
      timestamp: now(400),
      step: "Plan Finalized",
      decision: `Optimized plan: ${co2SavedPercent.toFixed(1)}% CO₂ reduction`,
      reasoning: `${co2SavedKg.toFixed(2)} kg CO₂ avoided. Cost delta: ${costDeltaUSD >= 0 ? "+" : ""}${formatUSD(costDeltaUSD)}.`,
      impact: "high",
    },
  ];

  // Assumptions
  const assumptions: Assumption[] = [
    {
      id: "a1",
      category: "Hardware",
      description: "Power draw",
      value: `${HARDWARE_WATT[jobSpec.hardwareType]}W per ${jobSpec.hardwareType.toUpperCase()} at full utilization`,
      confidence: "high",
    },
    {
      id: "a2",
      category: "Overhead",
      description: "PUE (Power Usage Effectiveness)",
      value: `${PUE} — industry average for major cloud providers`,
      confidence: "medium",
    },
    {
      id: "a3",
      category: "Grid",
      description: "Carbon intensity source",
      value: "Electricity Maps API snapshot or static regional average",
      confidence: "medium",
    },
    {
      id: "a4",
      category: "Network",
      description: "Data transfer emissions",
      value: "Excluded — typically <1% of compute emissions",
      confidence: "medium",
    },
  ];

  // Alternative regions
  const alternativeRegions: AlternativeRegion[] = rankedRegions.map((r) => ({
    region: r.region,
    co2Kg: r.co2Kg,
    costUSD: r.costUSD,
    rank: r.rank,
  }));

  const baselinePlan: BaselinePlan = {
    jobId: jobSpec.id,
    region: baselineCandidate.region,
    startTime: baselineStart,
    endTime: baselineEnd,
    estimatedCO2kg: baselineCandidate.co2Kg,
    estimatedCostUSD: baselineCandidate.costUSD,
    energyKwh,
    carbonIntensityGCO2: baselineCandidate.region.carbonIntensity,
  };

  const optimizedPlan: OptimizedPlan = {
    jobId: jobSpec.id,
    region: optimizedCandidate.region,
    startTime: optimizedStart,
    endTime: optimizedEnd,
    estimatedCO2kg: optimizedCandidate.co2Kg,
    estimatedCostUSD: optimizedCandidate.costUSD,
    energyKwh,
    carbonIntensityGCO2: optimizedCandidate.region.carbonIntensity,
    co2SavedKg,
    co2SavedPercent,
    costDeltaUSD,
    confidenceScore,
    optimizationScore,
    auditLog,
    assumptions,
    alternativeRegions,
  };

  return { baselinePlan, optimizedPlan, rankedRegions };
}

// Helper: delay before optimized job starts (avoids peak hours)
function ranked_delay_ms(
  region: RegionCarbonProfile,
  jobSpec: JobSpec
): number {
  const hoursUntilDeadline =
    (new Date(jobSpec.deadline).getTime() - Date.now()) / 3600000;
  // Allow up to 4h delay if deadline is >8h away
  if (hoursUntilDeadline > 8) return 4 * 3600 * 1000;
  if (hoursUntilDeadline > 4) return 2 * 3600 * 1000;
  return 1 * 3600 * 1000;
}

function formatUSD(n: number): string {
  return `$${Math.abs(n).toFixed(2)}`;
}
