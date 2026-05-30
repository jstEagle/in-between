import type { Metadata } from "next";
import { RadioStationGrid } from "@/components/radio/RadioStationGrid";
import { fetchRandomMusicRadioBrowserStations, searchRadioBrowserStations } from "@/lib/real-data";
import { seededRadioStations, toRadioStation } from "@/lib/radio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Radio | in between space",
  description: "Browse and listen to live internet radio stations from around the world."
};

export default async function RadioPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; country?: string; tag?: string; language?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim();
  const result = query
    ? await searchRadioBrowserStations({
        query,
        country: params.country,
        tag: params.tag,
        language: params.language,
        limit: 72,
        randomize: true
      })
    : await fetchRandomMusicRadioBrowserStations(72);
  const stations = seededRadioStations(`radio-directory:${Date.now()}:${Math.random()}`, result.data.map(toRadioStation), 72);

  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)]">
      <header className="site-header sticky top-0 z-30 border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] backdrop-blur">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
          <a href="/" className="site-brand headline lowercase no-underline">
            in between radio
          </a>
          <form action="/radio" className="flex w-full max-w-xl">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search stations, places, tags"
              className="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-white px-3 py-2 text-sm text-black"
            />
            <button className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-l-0 border-[var(--page-border)] bg-[var(--page-fg)] px-4 text-sm font-medium text-[var(--page-bg)]">
              Search
            </button>
          </form>
        </div>
      </header>
      <section className="shell py-8">
        <div className="mb-6 grid gap-2">
          <p className="font-accent text-[11px] uppercase opacity-60">{result.fallback ? "cached music stations" : "randomized music stations from Radio Browser"}</p>
          <h1 className="headline max-w-4xl text-[length:var(--text-hero)] leading-[0.9]">radio stations, not videos</h1>
          <p className="max-w-2xl text-sm leading-6 opacity-75">
            Search and tune into internet radio streams from around the world. Playback uses each station's public stream URL.
          </p>
        </div>
        <RadioStationGrid stations={stations} title={query ? `Results for ${query}` : "Global stations"} />
      </section>
    </main>
  );
}
