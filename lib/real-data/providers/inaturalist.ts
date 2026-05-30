import { realDataConfig } from "@/config/real-data";
import { fixtureNaturalistObservations } from "../fixtures";
import { boundedList, compactParams, fetchJson } from "../http";
import type { NaturalistObservation, RealDataResult } from "../types";

type INaturalistResponse = {
  results?: Array<{
    id?: number;
    observed_on?: string;
    photos?: Array<{
      url?: string;
    }>;
    place_guess?: string;
    species_guess?: string;
    taxon?: {
      name?: string;
    };
    uri?: string;
  }>;
};

function normalizePhoto(url: string | undefined): string | undefined {
  return url?.replace("square.", "medium.");
}

export async function fetchINaturalistObservations(
  taxonName: string,
  limit: number = 10
): Promise<RealDataResult<NaturalistObservation[]>> {
  const params = compactParams({
    order: "desc",
    order_by: "observed_on",
    per_page: Math.min(Math.max(limit, 1), realDataConfig.maxSearchResults),
    photos: true,
    q: taxonName
  });
  const raw = await fetchJson<INaturalistResponse>(
    `${realDataConfig.providers.inaturalist.baseUrl}/observations?${params}`,
    {
      fallback: { results: [] },
      source: "inaturalist"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureNaturalistObservations,
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: boundedList(raw.data.results ?? [], limit).map((observation) => ({
      id: observation.id ?? 0,
      imageUrl: normalizePhoto(observation.photos?.[0]?.url),
      observedOn: observation.observed_on,
      placeGuess: observation.place_guess,
      speciesGuess: observation.species_guess,
      taxonName: observation.taxon?.name,
      uri: observation.uri
    })),
    fallback: false,
    source: "inaturalist"
  };
}
