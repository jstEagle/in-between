"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { ImagePacket, MediaAlternate } from "@/lib/imageEngine";
import type { MediaLoaderConfig } from "@/lib/loadingProfiles";
import { LoaderGlyph } from "@/components/loaders/LoadingEffects";
import { AgedImage } from "./AgedImage";

type MediaFrameClientProps = {
  image: ImagePacket;
  className?: string;
  label?: string;
  plain?: boolean;
  motion?: boolean;
  loader?: MediaLoaderConfig | null;
};

export function MediaFrameClient({ image, className = "", label, plain = false, motion = false, loader }: MediaFrameClientProps) {
  const [revealed, setRevealed] = useState(!loader);
  const [activeImage, setActiveImage] = useState<ImagePacket>(image);

  useEffect(() => {
    setActiveImage(chooseSessionMedia(image));
  }, [image]);

  useEffect(() => {
    if (!loader) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    const id = window.setTimeout(() => setRevealed(true), loader.delayMs);
    return () => window.clearTimeout(id);
  }, [loader]);

  const mediaClass = "h-full w-full object-cover broken-media";
  const style = { "--media-filter": activeImage.cssFilter } as CSSProperties;
  const attribution = activeImage.asset.attributionRequired ? activeImage.asset.attributionText ?? activeImage.asset.author : undefined;
  const playable = activeImage.kind === "real" && Boolean(activeImage.videoSrc);
  const activeVideo = playable;
  const showOverlay = loader && !revealed;

  const media =
    activeVideo ? (
      <video
        className={mediaClass}
        style={style}
        src={activeImage.videoSrc}
        poster={activeImage.src}
        autoPlay={motion && activeImage.videoPlayerVariant !== "native"}
        muted={motion && activeImage.videoPlayerVariant !== "native"}
        loop={motion && activeImage.videoPlayerVariant !== "native"}
        playsInline
        preload="metadata"
        controls={!motion || activeImage.videoPlayerVariant === "native"}
      />
    ) : (
      <AgedImage
        src={activeImage.src}
        alt={activeImage.alt}
        className={mediaClass}
        style={style}
        cssFilter={activeImage.cssFilter}
        pixelated={activeImage.pixelated}
        aging={activeImage.aging}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );

  const framed = (
    <>
      {showOverlay ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[var(--page-muted)]">
          <LoaderGlyph variant={loader!.variant} message={loader!.message} size="sm" />
        </div>
      ) : null}
      <div className={`h-full w-full transition-opacity duration-500 ${showOverlay ? "opacity-0" : "opacity-100"}`}>{media}</div>
    </>
  );

  if (plain) {
    return <div className={`relative h-full w-full ${className}`}>{framed}</div>;
  }

  const caption = label ?? activeImage.asset.id;
  const tag = activeImage.kind === "broken" ? "retry image" : playable ? `${activeImage.videoPlayerVariant} video` : activeImage.aging.label;

  return (
    <figure
      className={`relative overflow-hidden rounded-[var(--radius-media)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)] shadow-[var(--shadow-media)] ${className}`}
      data-player={playable ? activeImage.videoPlayerVariant : undefined}
    >
      {framed}
      {activeVideo && activeImage.videoPlayerVariant !== "native" && <VideoChrome variant={activeImage.videoPlayerVariant} />}
      <figcaption className="absolute bottom-2 left-2 max-w-[88%] truncate rounded-[var(--radius-tag)] border border-black/20 bg-white/80 px-2 py-1 font-accent text-[11px] text-black">
        {caption} / {tag}
        {attribution ? ` / ${attribution.slice(0, 42)}` : ""}
      </figcaption>
    </figure>
  );
}

const mediaHistoryKey = "in-between:recent-media:v1";
const providerHistoryKey = "in-between:recent-media-provider:v1";
const mediaHistoryLimit = 420;
const providerHistoryLimit = 120;

function chooseSessionMedia(image: ImagePacket): ImagePacket {
  if (typeof window === "undefined" || image.alternates.length === 0) return image;

  const options: MediaAlternate[] = [
    {
      key: `${image.asset.id}:${image.src}:${image.videoSrc ?? ""}`,
      asset: image.asset,
      alt: image.alt,
      src: image.src,
      videoSrc: image.videoSrc,
      kind: image.kind
    },
    ...image.alternates
  ];
  const playableOptions = options.filter((option) => Boolean(option.videoSrc));
  const mediaOptions = image.videoSrc && playableOptions.length ? playableOptions : options;
  const history = readMediaHistory();
  const providerHistory = readProviderHistory();
  const ranked = mediaOptions
    .map((option) => {
      const recency = history.indexOf(option.key);
      const providerRecency = providerHistory.indexOf(option.asset.provider);
      return {
        option,
        recency: recency === -1 ? Number.POSITIVE_INFINITY : recency,
        providerRecency: providerRecency === -1 ? Number.POSITIVE_INFINITY : providerRecency,
        roll: cryptoRandom()
      };
    })
    .sort((a, b) => {
      if (a.providerRecency !== b.providerRecency) return b.providerRecency - a.providerRecency;
      if (a.recency !== b.recency) return b.recency - a.recency;
      return a.roll - b.roll;
    });
  const chosen = ranked[0]?.option ?? options[0];
  writeMediaHistory([chosen.key, ...history.filter((key) => key !== chosen.key)].slice(0, mediaHistoryLimit));
  writeProviderHistory([chosen.asset.provider, ...providerHistory.filter((provider) => provider !== chosen.asset.provider)].slice(0, providerHistoryLimit));

  return {
    ...image,
    asset: chosen.asset,
    alt: chosen.alt,
    src: chosen.src,
    videoSrc: chosen.videoSrc,
    kind: chosen.kind
  };
}

function readMediaHistory() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(mediaHistoryKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function readProviderHistory() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(providerHistoryKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is ImagePacket["asset"]["provider"] => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function writeMediaHistory(history: string[]) {
  try {
    window.localStorage.setItem(mediaHistoryKey, JSON.stringify(history));
  } catch {
    // Private browsing or storage limits should not block media rendering.
  }
}

function writeProviderHistory(history: ImagePacket["asset"]["provider"][]) {
  try {
    window.localStorage.setItem(providerHistoryKey, JSON.stringify(history));
  } catch {
    // Private browsing or storage limits should not block media rendering.
  }
}

function cryptoRandom() {
  const bytes = new Uint32Array(1);
  window.crypto?.getRandomValues(bytes);
  return bytes[0] / 2 ** 32;
}

function VideoChrome({ variant }: { variant: ImagePacket["videoPlayerVariant"] }) {
  if (variant === "streaming") {
    return (
      <div className="pointer-events-none absolute inset-x-3 bottom-9 rounded-[var(--radius-pill)] bg-black/60 p-2 text-white">
        <div className="h-1 rounded-full bg-white/25">
          <div className="h-1 w-2/5 rounded-full bg-[var(--page-accent)]" />
        </div>
      </div>
    );
  }

  if (variant === "webcam") {
    return (
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-[var(--radius-tag)] bg-black/65 px-2 py-1 font-accent text-[10px] uppercase text-white">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        live hallway feed
      </div>
    );
  }

  if (variant === "mini-disc") {
    return (
      <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/50 bg-black/55 px-3 py-2 font-accent text-[10px] text-white">
        MPEG
      </div>
    );
  }

  if (variant === "archive") {
    return (
      <div className="pointer-events-none absolute inset-3 border border-white/35">
        <div className="absolute right-2 top-2 bg-white/80 px-2 py-1 font-accent text-[10px] text-black">00:00:12:04</div>
      </div>
    );
  }

  return null;
}
