import type { RadioStation } from "@/components/radio/RadioPlayer";
import type { RadioBrowserStation } from "@/lib/real-data";
import { createRng } from "@/lib/seed";

export function toRadioStation(station: RadioBrowserStation): RadioStation {
  return {
    stationuuid: station.id,
    name: station.name,
    url: station.streamUrl,
    urlResolved: station.resolvedStreamUrl ?? station.streamUrl,
    country: station.country,
    countrycode: station.countryCode,
    language: station.language,
    tags: station.tags,
    favicon: station.faviconUrl,
    codec: station.codec,
    bitrate: station.bitrateKbps,
    votes: station.votes
  };
}

export function seededRadioStations(seed: string, stations: RadioStation[], count: number): RadioStation[] {
  const rng = createRng(`${seed}:radio-stations`);
  const pool = [...stations];
  const picked: RadioStation[] = [];
  const limit = Math.min(Math.max(count, 0), pool.length);

  for (let index = 0; index < limit; index += 1) {
    picked.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
  }

  return picked;
}

export function shouldShowRadioStumble(seed: string, depth: number) {
  const chance = Math.min(0.54, 0.18 + depth / 90);
  return createRng(`${seed}:radio-stumble`).bool(chance);
}
