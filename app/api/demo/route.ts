import { NextResponse } from "next/server";
import { PlanResponse } from "@/lib/types";
import { DEMO_SCENARIOS } from "@/lib/mock-data/scenarios";
import { generateExplanation } from "@/lib/gemini/client";
import { runOptimizer } from "@/lib/optimizer";

export async function GET() {
  try {
    const demo = DEMO_SCENARIOS[0];

    // Run optimizer on the demo job spec so we have rankedRegions for the prompt
    const { rankedRegions } = runOptimizer(demo.jobSpec, [
      demo.baselinePlan.region,
      demo.optimizedPlan.region,
      ...(demo.optimizedPlan.alternativeRegions?.map((a) => a.region) ?? []),
    ]);

    const explanation = await generateExplanation(
      demo.jobSpec,
      demo.baselinePlan,
      demo.optimizedPlan,
      rankedRegions
    );

    const response: PlanResponse = {
      jobSpec: demo.jobSpec,
      baselinePlan: demo.baselinePlan,
      optimizedPlan: demo.optimizedPlan,
      explanation,
      source: "static",
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[/api/demo] Error:", error);

    // Bare-bones fallback
    const demo = DEMO_SCENARIOS[0];
    const fallback: PlanResponse = {
      jobSpec: demo.jobSpec,
      baselinePlan: demo.baselinePlan,
      optimizedPlan: demo.optimizedPlan,
      explanation: {
        summary:
          "Running this LLM fine-tune in EU North (Stockholm) avoids 118.9 kg CO₂, a 97.9% reduction vs US East.",
        whyThisRegion:
          "Stockholm runs on a near-zero-carbon Scandinavian hydro and wind grid at only 8 gCO₂/kWh vs 386 gCO₂/kWh in US East.",
        tradeoffs:
          "Cost increases by $143.64 (7.2%) — a fair premium for near-zero-carbon compute.",
        recommendations: [
          "Pin CI/CD and batch jobs to EU North whenever the deadline allows.",
          "Track real-time carbon intensity via Electricity Maps to catch grid dips.",
          "Evaluate spot instances in Stockholm to close the cost gap.",
        ],
        funFact:
          "118.9 kg CO₂ saved = not driving a petrol car for 487 km — or keeing 594 trees alive for a year.",
        confidenceNote:
          "Static carbon intensity used. Add ELECTRICITY_MAPS_API_KEY for live data.",
        recommendation: "PROCEED",
      },
      source: "fallback",
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(fallback);
  }
}
