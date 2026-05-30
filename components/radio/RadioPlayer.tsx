"use client";

import { useMemo, useRef, useState } from "react";

export type RadioStation = {
  stationuuid: string;
  name: string;
  urlResolved?: string | null;
  url?: string | null;
  country?: string | null;
  countrycode?: string | null;
  language?: string | null;
  tags?: string | string[] | null;
  favicon?: string | null;
  codec?: string | null;
  bitrate?: number | string | null;
  votes?: number | string | null;
};

export type RadioPlayerProps = {
  station: RadioStation;
  variant?: "compact" | "expanded";
  autoplay?: boolean;
  className?: string;
  onNext?: () => void;
  onPrevious?: () => void;
};

export function getStationStreamUrl(station: Pick<RadioStation, "url" | "urlResolved">) {
  return station.urlResolved?.trim() || station.url?.trim() || "";
}

export function getStationTags(tags: RadioStation["tags"]) {
  if (Array.isArray(tags)) return tags.map((tag) => tag.trim()).filter(Boolean);
  return (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function stationInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function stationLocation(station: RadioStation) {
  return [station.country, station.countrycode ? station.countrycode.toUpperCase() : ""].filter(Boolean).join(" · ");
}

function stationTech(station: RadioStation) {
  return [station.codec?.toUpperCase(), station.bitrate ? `${station.bitrate} kbps` : ""].filter(Boolean).join(" · ");
}

export function RadioPlayer({ station, variant = "compact", autoplay = false, className = "", onNext, onPrevious }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [clickedStationUuid, setClickedStationUuid] = useState("");
  const streamUrl = getStationStreamUrl(station);
  const tags = useMemo(() => getStationTags(station.tags).slice(0, variant === "compact" ? 3 : 6), [station.tags, variant]);
  const location = stationLocation(station);
  const tech = stationTech(station);
  const isExpanded = variant === "expanded";

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    if (audio.paused) {
      registerStationClick();
      await audio.play();
      setIsPlaying(true);
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }

  function registerStationClick() {
    if (clickedStationUuid === station.stationuuid) return;
    setClickedStationUuid(station.stationuuid);
    void fetch(`/api/radio/click/${encodeURIComponent(station.stationuuid)}`).catch(() => undefined);
  }

  return (
    <article
      className={[
        "panel overflow-hidden bg-[color-mix(in_srgb,var(--page-bg)_92%,white_8%)]",
        isExpanded ? "grid gap-4" : "grid gap-3",
        className
      ].join(" ")}
    >
      <div className={isExpanded ? "h-44 min-h-0 overflow-hidden rounded-[var(--radius-media)] border border-[var(--page-border)] bg-[var(--page-muted)]" : "flex items-center gap-3"}>
        <div
          className={[
            "grid shrink-0 place-items-center overflow-hidden border border-[var(--page-border)] bg-[var(--page-muted)] font-accent text-lg",
            isExpanded ? "h-full w-full" : "h-12 w-12 rounded-[var(--radius-media)]"
          ].join(" ")}
          aria-hidden="true"
        >
          {station.favicon && !imageFailed ? (
            <img
              src={station.favicon}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span>{stationInitial(station.name)}</span>
          )}
        </div>

        {!isExpanded && (
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold leading-tight">{station.name}</h3>
            <p className="truncate text-xs opacity-70">{location || station.language || "Internet radio"}</p>
          </div>
        )}
      </div>

      <div className="grid min-w-0 content-between gap-3">
        {isExpanded && (
          <div className="min-w-0">
            <p className="font-accent text-[11px] uppercase opacity-60">Now tuning</p>
            <h2 className="headline mt-1 break-words text-2xl leading-tight">{station.name}</h2>
            <p className="mt-1 text-sm opacity-75">{[location, station.language].filter(Boolean).join(" · ") || "Internet radio"}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {onPrevious && (
            <button
              type="button"
              onClick={onPrevious}
              className="rounded-[var(--radius-button)] border border-[var(--page-border)] px-3 py-2 text-sm"
              aria-label="Previous station"
            >
              Prev
            </button>
          )}
          <button
            type="button"
            onClick={togglePlayback}
            disabled={!streamUrl}
            className="rounded-[var(--radius-button)] bg-[var(--page-fg)] px-4 py-2 text-sm font-medium text-[var(--page-bg)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="rounded-[var(--radius-button)] border border-[var(--page-border)] px-3 py-2 text-sm"
              aria-label="Next station"
            >
              Next
            </button>
          )}
          {tech && <span className="font-accent text-[11px] uppercase opacity-65">{tech}</span>}
        </div>

        <audio
          ref={audioRef}
          src={streamUrl}
          controls
          autoPlay={autoplay}
          preload="none"
          className="w-full"
          onPlay={() => {
            registerStationClick();
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-[var(--radius-tag)] border border-[var(--page-border)] px-2 py-1 text-xs opacity-80">
              {tag}
            </span>
          ))}
          {station.votes !== undefined && station.votes !== null && (
            <span className="rounded-[var(--radius-tag)] border border-[var(--page-border)] px-2 py-1 text-xs opacity-80">
              {station.votes} votes
            </span>
          )}
        </div>

        {!streamUrl && <p className="text-sm text-[var(--page-danger)]">This station does not include a playable stream URL.</p>}
      </div>
    </article>
  );
}
