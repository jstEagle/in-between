import { realDataConfig } from "@/config/real-data";
import { fixtureGbifOccurrences } from "../fixtures";
import { boundedList, compactParams, fetchJson } from "../http";
import type { GbifOccurrence, RealDataResult } from "../types";

type GbifOccurrenceResponse = {
  results?: Array<{
    basisOfRecord?: string;
    country?: string;
    decimalLatitude?: number;
    decimalLongitude?: number;
    eventDate?: string;
    key?: number;
    scientificName?: string;
  }>;
};

export async function fetchGbifOccurrences(
  scientificName: string,
  limit: number = 10
): Promise<RealDataResult<GbifOccurrence[]>> {
  const params = compactParams({
    limit: Math.min(Math.max(limit, 1), realDataConfig.maxSearchResults),
    q: scientificName
  });
  const raw = await fetchJson<GbifOccurrenceResponse>(
    `${realDataConfig.providers.gbif.baseUrl}/occurrence/search?${params}`,
    {
      fallback: { results: [] },
      source: "gbif"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureGbifOccurrences,
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: boundedList(raw.data.results ?? [], limit).map((occurrence) => {
      const key = occurrence.key ?? 0;
      return {
        basisOfRecord: occurrence.basisOfRecord,
        country: occurrence.country,
        decimalLatitude: occurrence.decimalLatitude,
        decimalLongitude: occurrence.decimalLongitude,
        eventDate: occurrence.eventDate,
        gbifUrl: `https://www.gbif.org/occurrence/${key}`,
        key,
        scientificName: occurrence.scientificName
      };
    }),
    fallback: false,
    source: "gbif"
  };
}
