import type { MediaAsset } from "../../types";

type PexelsOptions = {
  apiKey?: string;
  perPage?: number;
};

export async function searchPhotos(query: string, options: PexelsOptions = {}): Promise<MediaAsset[]> {
  const apiKey = options.apiKey ?? process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(options.perPage ?? 12));

  const response = await fetch(url, {
    headers: { Authorization: apiKey },
    next: { revalidate: 86400 }
  });

  if (!response.ok) return [];
  const raw = (await response.json()) as { photos?: unknown[] };
  return (raw.photos ?? []).map((item) => normalizeResult(item, query)).filter(Boolean) as MediaAsset[];
}

export async function searchVideos() {
  return [] as MediaAsset[];
}

export function normalizeResult(raw: unknown, query: string): MediaAsset | null {
  const result = raw as {
    id?: number;
    url?: string;
    width?: number;
    height?: number;
    photographer?: string;
    photographer_url?: string;
    src?: { large?: string; original?: string };
    alt?: string;
  };

  if (!result.id || !result.src?.large || !result.url) return null;

  return {
    id: `pexels-${result.id}`,
    provider: "pexels",
    type: "photo",
    sourceUrl: result.url,
    previewUrl: result.src.large,
    originalUrl: result.src.original,
    width: result.width,
    height: result.height,
    author: result.photographer,
    authorUrl: result.photographer_url,
    license: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
    attributionRequired: false,
    queries: [query],
    tags: query.split(/\s+/),
    safety: { safeSearchApplied: true, safeSearchMode: "conservative-query", reviewed: false }
  };
}
