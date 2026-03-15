import { NextRequest, NextResponse } from "next/server";
import { generateExplanation } from "@/lib/gemini/client";
import { JobSpec, BaselinePlan, OptimizedPlan } from "@/lib/types";
import { RankedRegion } from "@/lib/optimizer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      jobSpec: JobSpec;
      baselinePlan: BaselinePlan;
      optimizedPlan: OptimizedPlan;
      rankedRegions: RankedRegion[];
    };

    const explanation = await generateExplanation(
      body.jobSpec,
      body.baselinePlan,
      body.optimizedPlan,
      body.rankedRegions ?? []
    );

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("[/api/explain] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
