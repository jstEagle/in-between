import { realDataConfig } from "@/config/real-data";
import { fixtureWikimediaSearch, fixtureWikimediaSummary } from "../fixtures";
import { boundedList, compactParams, fetchJson } from "../http";
import type { RealDataResult, WikimediaSearchResult, WikimediaSummary } from "../types";

type WikimediaSummaryResponse = {
  content_urls?: {
    desktop?: {
      page?: string;
    };
  };
  description?: string;
  extract?: string;
  thumbnail?: {
    source?: string;
  };
  title?: string;
};

type WikimediaSearchResponse = {
  query?: {
    search?: Array<{
      snippet?: string;
      title?: string;
    }>;
  };
};

function pageUrl(title: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export async function fetchWikimediaSummary(title: string): Promise<RealDataResult<WikimediaSummary>> {
  const encodedTitle = encodeURIComponent(title.trim().replaceAll(" ", "_"));
  const raw = await fetchJson<WikimediaSummaryResponse>(
    `${realDataConfig.providers.wikimedia.restBaseUrl}/page/summary/${encodedTitle}`,
    {
      fallback: fixtureWikimediaSummary,
      source: "wikimedia"
    }
  );

  if (raw.fallback) {
    return raw as RealDataResult<WikimediaSummary>;
  }

  const normalizedTitle = raw.data.title ?? title;

  return {
    data: {
      description: raw.data.description,
      extract: raw.data.extract ?? "",
      thumbnailUrl: raw.data.thumbnail?.source,
      title: normalizedTitle,
      url: raw.data.content_urls?.desktop?.page ?? pageUrl(normalizedTitle)
    },
    fallback: false,
    source: "wikimedia"
  };
}

export async function searchWikimedia(
  query: string,
  limit: number = realDataConfig.maxSearchResults
): Promise<RealDataResult<WikimediaSearchResult[]>> {
  const params = compactParams({
    action: "query",
    format: "json",
    list: "search",
    origin: "*",
    srlimit: Math.min(Math.max(limit, 1), realDataConfig.maxSearchResults),
    srsearch: query
  });
  const raw = await fetchJson<WikimediaSearchResponse>(
    `${realDataConfig.providers.wikimedia.searchUrl}?${params}`,
    {
      fallback: { query: { search: [] } },
      source: "wikimedia"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureWikimediaSearch,
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: boundedList(raw.data.query?.search ?? [], limit).map((result) => {
      const title = result.title ?? query;
      return {
        snippet: stripHtml(result.snippet ?? ""),
        title,
        url: pageUrl(title)
      };
    }),
    fallback: false,
    source: "wikimedia"
  };
}
