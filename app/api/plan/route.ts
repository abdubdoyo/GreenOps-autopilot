import { NextRequest, NextResponse } from "next/server";
import { JobSpec, PlanResponse } from "@/lib/types";
import { fetchEnrichedRegions, deriveDataSource } from "@/lib/carbon/electricity-maps";
import { runOptimizer } from "@/lib/optimizer";
import { generateExplanation } from "@/lib/gemini/client";
import { DEMO_SCENARIOS } from "@/lib/mock-data/scenarios";

export async function POST(req: NextRequest) {
  try {
    const jobSpec = (await req.json()) as JobSpec;

    // Fetch enriched region profiles (live carbon or static fallback)
    const enrichedRegions = await fetchEnrichedRegions();
    const source = deriveDataSource(enrichedRegions);

    // Run the optimizer
    const { baselinePlan, optimizedPlan, rankedRegions } = runOptimizer(
      jobSpec,
      enrichedRegions
    );

    // Generate Gemini explanation
    const explanation = await generateExplanation(
      jobSpec,
      baselinePlan,
      optimizedPlan,
      rankedRegions
    );

    const response: PlanResponse = {
      jobSpec,
      baselinePlan,
      optimizedPlan,
      explanation,
      source,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[/api/plan] Error:", error);

    // Graceful fallback: return first demo scenario
    const demo = DEMO_SCENARIOS[0];
    const fallback: PlanResponse = {
      jobSpec: demo.jobSpec,
      baselinePlan: demo.baselinePlan,
      optimizedPlan: demo.optimizedPlan,
      explanation: {
        summary:
          "GreenOps selected the cleanest available region, dramatically cutting carbon compared to the default.",
        whyThisRegion:
          "The selected region runs almost entirely on renewable energy, resulting in near-zero carbon emissions per kWh.",
        tradeoffs:
          "A modest cost premium applies versus the cheapest region, offset by significant sustainability gains.",
        recommendations: [
          "Schedule during off-peak hours to maximize renewable grid utilization.",
          "Monitor live carbon intensity data as grid mix varies by hour.",
          "Consider spot/preemptible instances in the optimized region to reduce cost delta.",
        ],
        funFact:
          "The CO₂ saved is roughly equivalent to planting 500 trees and letting them grow for a year.",
        confidenceNote:
          "This is a fallback estimate. Configure ELECTRICITY_MAPS_API_KEY for live carbon data.",
        recommendation: "PROCEED",
      },
      source: "fallback",
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(fallback);
  }
}
