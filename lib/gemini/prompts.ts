import { JobSpec, BaselinePlan, OptimizedPlan } from "@/lib/types";
import { RankedRegion } from "@/lib/optimizer";

export function buildSystemInstruction(): string {
  return `You are a sustainability analyst for cloud computing workloads. 
Your job is to explain optimization decisions clearly and concisely.

CRITICAL RULES:
1. ONLY use the numbers provided in the user message. Do not invent or estimate figures.
2. Always respond with a single, valid JSON object — no markdown fences, no preamble, no trailing text.
3. The JSON must contain exactly these fields:
   - "summary": string (2-3 sentences, plain English, non-technical audience)
   - "whyThisRegion": string (1-2 sentences referencing the actual carbon numbers from the data)
   - "tradeoffs": string (honest 1-2 sentences about cost, latency, or availability tradeoffs)
   - "recommendations": array of exactly 3 strings (actionable next steps)
   - "funFact": string (memorable real-world CO₂ equivalency using the co2SavedKg value)
   - "confidenceNote": string (1 sentence about data freshness or confidence caveats)
   - "recommendation": one of the strings "PROCEED", "REVIEW", or "RECONSIDER"
4. Choose "PROCEED" if co2SavedPercent > 50, "REVIEW" if 20-50%, "RECONSIDER" if < 20%.
5. Never add fields beyond those listed above.`;
}

export function buildUserPrompt(
  jobSpec: JobSpec,
  baselinePlan: BaselinePlan,
  optimizedPlan: OptimizedPlan,
  rankedRegions: RankedRegion[]
): string {
  const top3 = rankedRegions.slice(0, 3);

  return `WORKLOAD JOB SPEC:
- Name: ${jobSpec.name}
- Type: ${jobSpec.workloadType}
- Hardware: ${jobSpec.hardwareType}
- Runtime: ${jobSpec.runtimeHours} hours
- Sustainability Weight: ${jobSpec.sustainabilityWeight}/100
- Cost Cap: $${jobSpec.costCapUSD}
- Performance Priority: ${jobSpec.perfPriority}

BASELINE PLAN (naïve default):
- Region: ${baselinePlan.region.name} (${baselinePlan.region.id})
- Carbon Intensity: ${baselinePlan.carbonIntensityGCO2} gCO₂/kWh
- Estimated CO₂: ${baselinePlan.estimatedCO2kg.toFixed(2)} kg
- Energy Used: ${baselinePlan.energyKwh.toFixed(1)} kWh
- Estimated Cost: $${baselinePlan.estimatedCostUSD.toFixed(2)}
- Renewable Energy: ${baselinePlan.region.renewablePercent}%

OPTIMIZED PLAN:
- Region: ${optimizedPlan.region.name} (${optimizedPlan.region.id})
- Carbon Intensity: ${optimizedPlan.carbonIntensityGCO2} gCO₂/kWh
- Estimated CO₂: ${optimizedPlan.estimatedCO2kg.toFixed(2)} kg
- Energy Used: ${optimizedPlan.energyKwh.toFixed(1)} kWh
- Estimated Cost: $${optimizedPlan.estimatedCostUSD.toFixed(2)}
- Renewable Energy: ${optimizedPlan.region.renewablePercent}%
- CO₂ Saved: ${optimizedPlan.co2SavedKg.toFixed(2)} kg (${optimizedPlan.co2SavedPercent.toFixed(1)}% reduction)
- Cost Delta: ${optimizedPlan.costDeltaUSD >= 0 ? "+" : ""}$${optimizedPlan.costDeltaUSD.toFixed(2)}
- Confidence Score: ${optimizedPlan.confidenceScore}%

TOP 3 EVALUATED REGIONS:
${top3.map((r, i) => `${i + 1}. ${r.region.name}: ${r.region.carbonIntensity} gCO₂/kWh, ${r.co2Kg.toFixed(2)} kg CO₂, $${r.costUSD.toFixed(2)} cost`).join("\n")}

Return only the JSON object. No other text.`;
}
