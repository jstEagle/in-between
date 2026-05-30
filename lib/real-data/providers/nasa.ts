import { realDataConfig } from "@/config/real-data";
import { fixtureNasaApod } from "../fixtures";
import { compactParams, fetchJson } from "../http";
import type { NasaApod, RealDataResult } from "../types";

type NasaApodResponse = {
  copyright?: string;
  date?: string;
  explanation?: string;
  hdurl?: string;
  media_type?: string;
  title?: string;
  url?: string;
};

export async function fetchNasaApod(date?: string): Promise<RealDataResult<NasaApod>> {
  const params = compactParams({
    api_key: realDataConfig.providers.nasa.apodApiKey,
    date
  });
  const raw = await fetchJson<NasaApodResponse>(
    `${realDataConfig.providers.nasa.apodUrl}?${params}`,
    {
      fallback: fixtureNasaApod,
      source: "nasa-apod"
    }
  );

  if (raw.fallback) {
    return raw as RealDataResult<NasaApod>;
  }

  return {
    data: {
      copyright: raw.data.copyright,
      date: raw.data.date ?? "",
      explanation: raw.data.explanation ?? "",
      hdUrl: raw.data.hdurl,
      mediaType: raw.data.media_type ?? "image",
      title: raw.data.title ?? "Astronomy Picture of the Day",
      url: raw.data.url ?? fixtureNasaApod.url
    },
    fallback: false,
    source: "nasa-apod"
  };
}
