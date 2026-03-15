import { NextResponse } from "next/server";
import { fetchEnrichedRegions } from "@/lib/carbon/electricity-maps";
import { REGIONS } from "@/lib/mock-data/regions";

export async function GET() {
  try {
    const regions = await fetchEnrichedRegions();
    return NextResponse.json(regions);
  } catch (error) {
    console.error("[/api/regions] Error:", error);
    // Graceful fallback: return static regions
    const fallback = REGIONS.map((r) => ({
      ...r,
      carbonSource: "static",
    }));
    return NextResponse.json(fallback);
  }
}
