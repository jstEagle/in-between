import { realDataConfig } from "@/config/real-data";
import { fixtureMetObject } from "../fixtures";
import { boundedList, compactParams, fetchJson } from "../http";
import type { MetObject, RealDataResult } from "../types";

type MetSearchResponse = {
  objectIDs?: number[] | null;
  total?: number;
};

type MetObjectResponse = {
  artistDisplayName?: string;
  department?: string;
  medium?: string;
  objectDate?: string;
  objectID?: number;
  objectURL?: string;
  primaryImageSmall?: string;
  title?: string;
};

function normalizeObject(object: MetObjectResponse): MetObject {
  return {
    artistDisplayName: object.artistDisplayName,
    department: object.department,
    imageUrl: object.primaryImageSmall,
    medium: object.medium,
    objectDate: object.objectDate,
    objectId: object.objectID ?? fixtureMetObject.objectId,
    objectUrl: object.objectURL,
    title: object.title ?? "Untitled object"
  };
}

export async function fetchMetObject(objectId: number): Promise<RealDataResult<MetObject>> {
  const raw = await fetchJson<MetObjectResponse>(
    `${realDataConfig.providers.metMuseum.baseUrl}/objects/${objectId}`,
    {
      fallback: fixtureMetObject as unknown as MetObjectResponse,
      source: "met-museum"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureMetObject,
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: normalizeObject(raw.data),
    fallback: false,
    source: "met-museum"
  };
}

export async function searchMetObjects(
  query: string,
  limit: number = 6
): Promise<RealDataResult<MetObject[]>> {
  const params = compactParams({
    hasImages: true,
    q: query
  });
  const raw = await fetchJson<MetSearchResponse>(
    `${realDataConfig.providers.metMuseum.baseUrl}/search?${params}`,
    {
      fallback: { objectIDs: [fixtureMetObject.objectId], total: 1 },
      source: "met-museum"
    }
  );

  if (raw.fallback) {
    return {
      data: [fixtureMetObject],
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  const ids = (raw.data.objectIDs ?? []).slice(0, Math.max(0, limit));
  const objects = await Promise.all(ids.map((id) => fetchMetObject(id)));

  return {
    data: objects.map((object) => object.data),
    fallback: objects.some((object) => object.fallback),
    source: objects.some((object) => object.fallback) ? "fixture" : "met-museum"
  };
}
