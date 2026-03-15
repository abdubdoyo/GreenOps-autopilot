import { RegionCarbonProfile } from "@/lib/types";
import { REGIONS } from "@/lib/mock-data/regions";

// Electricity Maps zone codes mapped to our region IDs
const ZONE_MAP: Record<string, string> = {
  "us-east-1": "US-MIDA-PJM",
  "us-west-2": "US-NW-PACW",
  "eu-west-1": "IE",
  "eu-north-1": "SE",
  "ap-southeast-1": "SG",
  "us-central1": "US-MIDW-MISO",
  "northamerica-northeast1": "CA-QC",
  "europe-west4": "NL",
  "eastus": "US-MIDA-PJM",
  "swedencentral": "SE",
};

export interface EnrichedRegionProfile extends RegionCarbonProfile {
  liveCarbon?: number;
  carbonSource: "live" | "static";
}

// In-memory cache: zone -> { value (gCO2/kWh), timestamp }
const cache = new Map<string, { value: number; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

async function fetchZoneCarbonIntensity(
  zone: string,
  apiKey: string
): Promise<number | null> {
  // Check cache first
  const cached = cache.get(zone);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.value;
  }

  try {
    const res = await fetch(
      `https://api.electricitymap.org/v3/carbon-intensity/latest?zone=${zone}`,
      {
        headers: { "auth-token": apiKey },
        next: { revalidate: 900 }, // 15 min for Next.js cache layer
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const value: number = data?.carbonIntensity ?? null;
    if (typeof value !== "number") return null;

    cache.set(zone, { value, timestamp: Date.now() });
    return value;
  } catch {
    return null;
  }
}

/**
 * Fetch enriched region profiles with live carbon intensity data.
 * Falls back to static data if API key is missing or any fetch fails.
 */
export async function fetchEnrichedRegions(): Promise<EnrichedRegionProfile[]> {
  const apiKey = process.env.ELECTRICITY_MAPS_API_KEY;

  if (!apiKey) {
    // No key configured — return static data
    return REGIONS.map((r) => ({ ...r, carbonSource: "static" as const }));
  }

  // Fetch all zones in parallel
  const entries = Object.entries(ZONE_MAP);
  const results = await Promise.allSettled(
    entries.map(([, zone]) => fetchZoneCarbonIntensity(zone, apiKey))
  );

  // Build a regionId -> live carbon value map
  const liveCarbonByRegion: Record<string, number | null> = {};
  entries.forEach(([regionId], i) => {
    const result = results[i];
    liveCarbonByRegion[regionId] =
      result.status === "fulfilled" ? result.value : null;
  });

  return REGIONS.map((r) => {
    const liveCarbon = liveCarbonByRegion[r.id];
    if (liveCarbon !== null && liveCarbon !== undefined) {
      return {
        ...r,
        carbonIntensity: Math.round(liveCarbon),
        liveCarbon: Math.round(liveCarbon),
        carbonSource: "live" as const,
      };
    }
    return { ...r, carbonSource: "static" as const };
  });
}

/**
 * Returns the data source summary for a set of enriched profiles.
 * Used to populate the `source` field in PlanResponse.
 */
export function deriveDataSource(
  regions: EnrichedRegionProfile[]
): "live" | "cached" | "fallback" {
  const liveCnt = regions.filter((r) => r.carbonSource === "live").length;
  if (liveCnt === regions.length) return "live";
  if (liveCnt > 0) return "cached";
  return "fallback";
}
