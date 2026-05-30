"use client";

import { useMemo, useState } from "react";
import { getStationStreamUrl, getStationTags, RadioPlayer, type RadioStation } from "./RadioPlayer";

export type RadioStationGridProps = {
  stations: RadioStation[];
  title?: string;
  initialStationUuid?: string;
  className?: string;
};

type SortKey = "votes" | "name" | "bitrate";
type ViewMode = "grid" | "list";

function stationSearchText(station: RadioStation) {
  return [
    station.name,
    station.country,
    station.countrycode,
    station.language,
    station.codec,
    station.bitrate,
    station.votes,
    getStationTags(station.tags).join(" ")
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function numberValue(value: RadioStation["votes"] | RadioStation["bitrate"]) {
  if (typeof value === "number") return value;
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function uniqueOptions(stations: RadioStation[], field: "country" | "language") {
  return Array.from(new Set(stations.map((station) => station[field]?.trim()).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

function sortStations(stations: RadioStation[], sort: SortKey) {
  return [...stations].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "bitrate") return numberValue(b.bitrate) - numberValue(a.bitrate) || a.name.localeCompare(b.name);
    return numberValue(b.votes) - numberValue(a.votes) || a.name.localeCompare(b.name);
  });
}

function stationMeta(station: RadioStation) {
  return [
    station.countrycode ? station.countrycode.toUpperCase() : station.country,
    station.language,
    station.codec?.toUpperCase(),
    station.bitrate ? `${station.bitrate} kbps` : ""
  ]
    .filter(Boolean)
    .join(" · ");
}

export function RadioStationGrid({ stations, title = "Radio stations", initialStationUuid, className = "" }: RadioStationGridProps) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState<SortKey>("votes");
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedUuid, setSelectedUuid] = useState(initialStationUuid ?? stations[0]?.stationuuid ?? "");

  const countries = useMemo(() => uniqueOptions(stations, "country"), [stations]);
  const languages = useMemo(() => uniqueOptions(stations, "language"), [stations]);
  const visibleStations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = stations.filter((station) => {
      const matchesQuery = !normalizedQuery || stationSearchText(station).includes(normalizedQuery);
      const matchesCountry = country === "all" || station.country === country;
      const matchesLanguage = language === "all" || station.language === language;
      return matchesQuery && matchesCountry && matchesLanguage;
    });

    return sortStations(filtered, sort);
  }, [country, language, query, sort, stations]);

  const selectedStation = useMemo(() => {
    return stations.find((station) => station.stationuuid === selectedUuid) ?? visibleStations[0] ?? stations[0];
  }, [selectedUuid, stations, visibleStations]);

  const selectedIndex = selectedStation ? stations.findIndex((station) => station.stationuuid === selectedStation.stationuuid) : -1;

  function moveSelection(delta: number) {
    if (stations.length === 0 || selectedIndex < 0) return;
    const next = stations[(selectedIndex + delta + stations.length) % stations.length];
    setSelectedUuid(next.stationuuid);
  }

  return (
    <section className={["grid gap-[var(--gap-grid)]", className].join(" ")}>
      <div className="grid gap-[var(--gap-grid)] lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="grid gap-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-accent text-[11px] uppercase opacity-60">{visibleStations.length} available</p>
              <h2 className="headline text-[length:var(--text-h2)]">{title}</h2>
            </div>
            <div className="flex rounded-[var(--radius-button)] border border-[var(--page-border)] p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded-[calc(var(--radius-button)-2px)] px-3 py-1.5 text-sm ${view === "grid" ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : ""}`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded-[calc(var(--radius-button)-2px)] px-3 py-1.5 text-sm ${view === "list" ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : ""}`}
              >
                List
              </button>
            </div>
          </div>

          <div className="panel grid gap-3 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
            <label className="grid gap-1">
              <span className="font-accent text-[11px] uppercase opacity-70">Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Station, country, tag"
                className="min-w-0 border border-[var(--page-border)] bg-white/90 px-3 py-2 text-sm text-black outline-none focus:border-[var(--page-accent)]"
              />
            </label>
            <label className="grid gap-1">
              <span className="font-accent text-[11px] uppercase opacity-70">Country</span>
              <select value={country} onChange={(event) => setCountry(event.target.value)} className="min-w-0 border border-[var(--page-border)] bg-white/90 px-3 py-2 text-sm text-black">
                <option value="all">All countries</option>
                {countries.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="font-accent text-[11px] uppercase opacity-70">Language</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="min-w-0 border border-[var(--page-border)] bg-white/90 px-3 py-2 text-sm text-black">
                <option value="all">All languages</option>
                {languages.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="font-accent text-[11px] uppercase opacity-70">Sort</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className="min-w-0 border border-[var(--page-border)] bg-white/90 px-3 py-2 text-sm text-black">
                <option value="votes">Most votes</option>
                <option value="name">Name</option>
                <option value="bitrate">Bitrate</option>
              </select>
            </label>
          </div>

          <div className={view === "grid" ? "grid gap-[var(--gap-grid)] sm:grid-cols-2 xl:grid-cols-3" : "grid gap-2"}>
            {visibleStations.map((station) => (
              <StationCard
                key={station.stationuuid}
                station={station}
                selected={selectedStation?.stationuuid === station.stationuuid}
                compact={view === "grid"}
                onSelect={() => setSelectedUuid(station.stationuuid)}
              />
            ))}
          </div>

          {visibleStations.length === 0 && <div className="panel text-sm">No stations match the current filters.</div>}
        </div>

        <div className="lg:sticky lg:top-4">
          {selectedStation ? (
            <RadioPlayer
              station={selectedStation}
              variant="expanded"
              onPrevious={stations.length > 1 ? () => moveSelection(-1) : undefined}
              onNext={stations.length > 1 ? () => moveSelection(1) : undefined}
            />
          ) : (
            <div className="panel text-sm">Add stations to start listening.</div>
          )}
        </div>
      </div>
    </section>
  );
}

function StationCard({ station, selected, compact, onSelect }: { station: RadioStation; selected: boolean; compact: boolean; onSelect: () => void }) {
  const tags = getStationTags(station.tags).slice(0, compact ? 2 : 4);
  const streamUrl = getStationStreamUrl(station);

  return (
    <article
      className={[
        "border border-[var(--page-border)] bg-[color-mix(in_srgb,var(--page-bg)_94%,white_6%)] p-3",
        "grid gap-3 rounded-[var(--radius-card)]",
        selected ? "outline outline-2 outline-[var(--page-accent)]" : "",
        compact ? "" : "md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold leading-tight">{station.name}</h3>
            <p className="mt-1 truncate text-xs opacity-70">{stationMeta(station) || "Internet radio"}</p>
          </div>
          {station.votes !== undefined && station.votes !== null && <span className="shrink-0 font-accent text-[11px] opacity-65">{station.votes}</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="rounded-[var(--radius-tag)] border border-[var(--page-border)] px-2 py-0.5 text-[11px] opacity-75">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onSelect}
        disabled={!streamUrl}
        className="w-fit rounded-[var(--radius-button)] bg-[var(--page-fg)] px-3 py-2 text-sm font-medium text-[var(--page-bg)] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {selected ? "Selected" : "Play"}
      </button>
    </article>
  );
}
