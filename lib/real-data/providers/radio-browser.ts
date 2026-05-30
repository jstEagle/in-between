import { realDataConfig } from "@/config/real-data";
import { boundedList, compactParams, fetchJson } from "../http";
import type { RadioBrowserSearchOptions, RadioBrowserStation, RealDataResult } from "../types";

type RadioBrowserStationResponse = {
  stationuuid?: string;
  name?: string;
  url?: string;
  url_resolved?: string;
  homepage?: string;
  favicon?: string;
  tags?: string;
  country?: string;
  countrycode?: string;
  state?: string;
  language?: string;
  codec?: string;
  bitrate?: number;
  votes?: number;
  clickcount?: number;
  lastcheckok?: number;
};

type RadioBrowserSearchParams = RadioBrowserSearchOptions & {
  order?: "name" | "url" | "homepage" | "favicon" | "tags" | "country" | "state" | "language" | "votes" | "codec" | "bitrate" | "clickcount" | "random";
  reverse?: boolean;
};

export const fixtureRadioBrowserStations: RadioBrowserStation[] = [
  {
    bitrateKbps: 128,
    clickCount: 0,
    codec: "MP3",
    country: "United States",
    countryCode: "US",
    homepageUrl: "https://radioparadise.com",
    id: "fixture-radio-paradise",
    isOnline: true,
    language: "english",
    name: "Radio Paradise",
    streamUrl: "https://stream.radioparadise.com/mp3-128",
    tags: ["eclectic", "rock", "world"],
    votes: 0
  },
  {
    bitrateKbps: 128,
    clickCount: 0,
    codec: "MP3",
    country: "New Zealand",
    countryCode: "NZ",
    homepageUrl: "https://95bfm.com",
    id: "fixture-95bfm",
    isOnline: true,
    language: "english",
    name: "95bFM",
    streamUrl: "https://streams.95bfm.com/stream128",
    tags: ["alternative", "college", "independent"],
    votes: 0
  }
];

function normalizeTags(tags: string | undefined): string[] {
  return (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeStation(station: RadioBrowserStationResponse): RadioBrowserStation {
  const streamUrl = station.url_resolved || station.url || "";

  return {
    bitrateKbps: station.bitrate,
    clickCount: station.clickcount ?? 0,
    codec: station.codec || undefined,
    country: station.country || undefined,
    countryCode: station.countrycode || undefined,
    faviconUrl: station.favicon || undefined,
    homepageUrl: station.homepage || undefined,
    id: station.stationuuid ?? streamUrl,
    isOnline: station.lastcheckok === undefined ? true : station.lastcheckok === 1,
    language: station.language || undefined,
    name: station.name || "Untitled station",
    resolvedStreamUrl: station.url_resolved || undefined,
    state: station.state || undefined,
    streamUrl,
    tags: normalizeTags(station.tags),
    votes: station.votes ?? 0
  };
}

function fallbackStations(limit: number | undefined): RadioBrowserStation[] {
  return boundedList(fixtureRadioBrowserStations, limit ?? realDataConfig.providers.radioBrowser.maxStationResults);
}

function radioBrowserParams(options: RadioBrowserSearchParams): URLSearchParams {
  const limit = Math.min(
    Math.max(options.limit ?? realDataConfig.maxSearchResults, 1),
    realDataConfig.providers.radioBrowser.maxStationResults
  );

  return compactParams({
    bitrate: undefined,
    codec: options.codec,
    country: options.country,
    countrycode: options.countryCode,
    hidebroken: realDataConfig.providers.radioBrowser.hideBrokenStations,
    language: options.language,
    limit,
    name: options.name ?? options.query,
    offset: options.offset,
    order: options.order ?? (options.randomize ? "random" : realDataConfig.providers.radioBrowser.defaultOrder),
    reverse: options.reverse ?? (options.randomize ? false : realDataConfig.providers.radioBrowser.defaultReverse),
    state: options.state,
    tag: options.tag,
    _: options.randomize ? Date.now() : undefined
  });
}

function isLikelyMusicStation(station: RadioBrowserStation): boolean {
  const haystack = `${station.name} ${station.tags.join(" ")}`.toLowerCase();
  const excluded = realDataConfig.providers.radioBrowser.excludedTags.some((tag) => haystack.includes(tag));
  if (excluded) return false;

  return realDataConfig.providers.radioBrowser.musicTags.some((tag) => haystack.includes(tag));
}

export async function searchRadioBrowserStations(
  options: RadioBrowserSearchOptions = {}
): Promise<RealDataResult<RadioBrowserStation[]>> {
  const params = radioBrowserParams(options);
  const raw = await fetchJson<RadioBrowserStationResponse[]>(
    `${realDataConfig.providers.radioBrowser.baseUrl}/stations/search?${params}`,
    {
      cache: options.randomize ? "no-store" : undefined,
      fallback: [],
      source: "radio-browser"
    }
  );

  if (raw.fallback) {
    return {
      data: fallbackStations(options.limit),
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: boundedList(raw.data, options.limit).map(normalizeStation).filter((station) => station.streamUrl),
    fallback: false,
    source: "radio-browser"
  };
}

export async function fetchTopRadioBrowserStations(
  limit: number = realDataConfig.maxSearchResults
): Promise<RealDataResult<RadioBrowserStation[]>> {
  return searchRadioBrowserStations({
    limit
  });
}

export async function fetchRandomMusicRadioBrowserStations(
  limit: number = realDataConfig.providers.radioBrowser.maxStationResults
): Promise<RealDataResult<RadioBrowserStation[]>> {
  const tags = realDataConfig.providers.radioBrowser.musicTags;
  const offset = Math.floor(Math.random() * 500);
  const shuffledTags = tags
    .map((tag) => ({ tag, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 4)
    .map((entry) => entry.tag);
  const perTagLimit = Math.max(12, Math.ceil(limit / shuffledTags.length));
  const results = await Promise.all(
    shuffledTags.map((tag) =>
      searchRadioBrowserStations({
        limit: perTagLimit,
        offset,
        randomize: true,
        tag
      })
    )
  );
  const unique = new Map<string, RadioBrowserStation>();
  let fallback = true;
  let error: string | undefined;

  for (const result of results) {
    fallback = fallback && result.fallback;
    error ??= result.error;
    for (const station of result.data) {
      if (station.streamUrl && station.isOnline && isLikelyMusicStation(station)) {
        unique.set(station.id, station);
      }
    }
  }

  const stations = Array.from(unique.values())
    .map((station) => ({ station, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.station);

  return {
    data: boundedList(stations.length ? stations : fallbackStations(limit), limit),
    error,
    fallback,
    source: fallback ? "fixture" : "radio-browser"
  };
}

export async function fetchRadioBrowserStationById(
  stationId: string
): Promise<RealDataResult<RadioBrowserStation | undefined>> {
  const raw = await fetchJson<RadioBrowserStationResponse[]>(
    `${realDataConfig.providers.radioBrowser.baseUrl}/stations/byuuid/${encodeURIComponent(stationId)}`,
    {
      fallback: [],
      source: "radio-browser"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureRadioBrowserStations.find((station) => station.id === stationId),
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: raw.data[0] ? normalizeStation(raw.data[0]) : undefined,
    fallback: false,
    source: "radio-browser"
  };
}

export async function clickRadioBrowserStation(stationId: string): Promise<RealDataResult<RadioBrowserStation | undefined>> {
  type ClickResponse = RadioBrowserStationResponse & {
    ok?: boolean;
    message?: string;
  };

  const raw = await fetchJson<ClickResponse>(
    `${realDataConfig.providers.radioBrowser.baseUrl}/url/${encodeURIComponent(stationId)}`,
    {
      fallback: {},
      source: "radio-browser"
    }
  );

  if (raw.fallback) {
    return {
      data: fixtureRadioBrowserStations.find((station) => station.id === stationId),
      error: raw.error,
      fallback: true,
      source: "fixture"
    };
  }

  return {
    data: raw.data.stationuuid ? normalizeStation(raw.data) : undefined,
    fallback: false,
    source: "radio-browser"
  };
}
