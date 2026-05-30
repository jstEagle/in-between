import { realDataConfig } from "@/config/real-data";
import { fixtureOpenLibrarySearch, fixtureOpenLibraryWork } from "../fixtures";
import { boundedList, compactParams, fetchJson } from "../http";
import type { OpenLibrarySearchResult, OpenLibraryWork, RealDataResult } from "../types";

type OpenLibraryWorkResponse = {
  authors?: Array<{
    author?: {
      key?: string;
    };
  }>;
  covers?: number[];
  description?: string | {
    value?: string;
  };
  key?: string;
  subjects?: string[];
  title?: string;
};

type OpenLibrarySearchResponse = {
  docs?: Array<{
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    has_fulltext?: boolean;
    ia?: string[];
    key?: string;
    public_scan_b?: boolean;
    title?: string;
  }>;
};

function coverUrl(coverId?: number, size: "M" | "L" = "M"): string | undefined {
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : undefined;
}

function readableUrl(key: string | undefined, title: string | undefined, isReadable = true): string | undefined {
  if (!key || !isReadable) {
    return undefined;
  }

  const slug = title ? `/${encodeURIComponent(title.replaceAll(" ", "_"))}` : "";
  return `${realDataConfig.providers.openLibrary.baseUrl}${key}${slug}`;
}

function readerUrl(identifier: string | undefined): string | undefined {
  return identifier ? `https://archive.org/embed/${encodeURIComponent(identifier)}` : undefined;
}

function normalizeDescription(description: OpenLibraryWorkResponse["description"]): string | undefined {
  if (typeof description === "string") {
    return description;
  }

  return description?.value;
}

export async function fetchOpenLibraryWork(workKey: string): Promise<RealDataResult<OpenLibraryWork>> {
  const normalizedKey = workKey.startsWith("/works/") ? workKey : `/works/${workKey}`;
  const raw = await fetchJson<OpenLibraryWorkResponse>(
    `${realDataConfig.providers.openLibrary.baseUrl}${normalizedKey}.json`,
    {
      fallback: {} as OpenLibraryWorkResponse,
      source: "open-library"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureOpenLibraryWork,
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  const key = raw.data.key ?? normalizedKey;
  const title = raw.data.title ?? "Untitled work";

  return {
    data: {
      authors: raw.data.authors?.map((author) => author.author?.key ?? "").filter(Boolean) ?? [],
      coverUrl: coverUrl(raw.data.covers?.[0], "L"),
      description: normalizeDescription(raw.data.description),
      key,
      readerUrl: undefined,
      readableUrl: readableUrl(key, title),
      subjects: boundedList(raw.data.subjects ?? [], 12),
      title
    },
    fallback: false,
    source: "open-library"
  };
}

export async function searchOpenLibrary(
  query: string,
  limit: number = realDataConfig.maxSearchResults
): Promise<RealDataResult<OpenLibrarySearchResult[]>> {
  const params = compactParams({
    fields: "key,title,author_name,first_publish_year,cover_i,has_fulltext,public_scan_b,ia",
    limit: Math.min(Math.max(limit, 1), realDataConfig.maxSearchResults),
    q: query
  });
  const raw = await fetchJson<OpenLibrarySearchResponse>(
    `${realDataConfig.providers.openLibrary.baseUrl}/search.json?${params}`,
    {
      fallback: { docs: [] },
      source: "open-library"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureOpenLibrarySearch,
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: boundedList(raw.data.docs ?? [], limit).map((doc) => ({
      authors: doc.author_name ?? [],
      coverUrl: coverUrl(doc.cover_i),
      firstPublishYear: doc.first_publish_year,
      key: doc.key ?? "",
      readerUrl: readerUrl(doc.ia?.[0]),
      readableUrl: readableUrl(doc.key, doc.title, Boolean(doc.has_fulltext || doc.public_scan_b)),
      title: doc.title ?? "Untitled work"
    })),
    fallback: false,
    source: "open-library"
  };
}
