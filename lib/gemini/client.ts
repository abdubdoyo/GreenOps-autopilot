import { GoogleGenerativeAI } from "@google/generative-ai";
import { JobSpec, BaselinePlan, OptimizedPlan } from "@/lib/types";
import { GeminiExplanation } from "@/lib/types";
import { RankedRegion } from "@/lib/optimizer";
import { buildSystemInstruction, buildUserPrompt } from "./prompts";

const FALLBACK_EXPLANATION: GeminiExplanation = {
  summary:
    "GreenOps selected the cleanest available region for your workload, significantly reducing carbon emissions compared to the default region.",
  whyThisRegion:
    "This region has a substantially lower carbon intensity grid mix, meaning each unit of electricity generates far less CO₂.",
  tradeoffs:
    "The optimized region may carry a modest cost premium vs. the cheapest option, and slight scheduling delays may be needed to hit optimal grid windows.",
  recommendations: [
    "Schedule workloads during off-peak grid hours (typically 02:00–06:00 local time) to maximize renewable energy usage.",
    "Consider splitting large jobs into smaller chunks to increase scheduling flexibility across clean-grid windows.",
    "Set up recurring GreenOps analysis to capture monthly patterns in regional grid carbon intensity.",
  ],
  funFact:
    "The CO₂ saved by this optimization is roughly equivalent to driving a typical petrol car for several hundred kilometers.",
  confidenceNote:
    "Estimates are based on regional carbon intensity snapshots. Actual values may vary by ±5–15% depending on real-time grid conditions.",
  recommendation: "PROCEED",
};

export async function generateExplanation(
  jobSpec: JobSpec,
  baselinePlan: BaselinePlan,
  optimizedPlan: OptimizedPlan,
  rankedRegions: RankedRegion[]
): Promise<GeminiExplanation> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[Gemini] GEMINI_API_KEY not set — using fallback explanation");
    return FALLBACK_EXPLANATION;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: buildSystemInstruction(),
    });

    const userPrompt = buildUserPrompt(
      jobSpec,
      baselinePlan,
      optimizedPlan,
      rankedRegions
    );

    const result = await model.generateContent(userPrompt);
    const text = result.response.text().trim();

    // Strip markdown fences if Gemini wraps the JSON
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsed = JSON.parse(cleaned) as Record<string, unknown>;

    // Validate required fields
    const required = [
      "summary",
      "whyThisRegion",
      "tradeoffs",
      "recommendations",
      "funFact",
      "confidenceNote",
      "recommendation",
    ];
    for (const field of required) {
      if (!(field in parsed)) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    if (!Array.isArray(parsed.recommendations)) {
      throw new Error("recommendations must be an array");
    }

    const validRecs = ["PROCEED", "REVIEW", "RECONSIDER"];
    if (!validRecs.includes(parsed.recommendation as string)) {
      parsed.recommendation = "REVIEW";
    }

    return parsed as unknown as GeminiExplanation;
  } catch (err) {
    console.error("[Gemini] Failed to generate explanation:", err);
    return FALLBACK_EXPLANATION;
  }
}
