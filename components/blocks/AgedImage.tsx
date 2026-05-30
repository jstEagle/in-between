"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ImgHTMLAttributes } from "react";
import type { ImageAging } from "@/lib/imageEngine";

type AgedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "style"> & {
  aging?: ImageAging;
  cssFilter?: string;
  pixelated?: boolean;
  style?: CSSProperties;
};

const cleanAging: ImageAging = {
  resolutionScale: 1,
  grain: 0,
  contrast: 1,
  label: "clean"
};

export function AgedImage({ aging = cleanAging, cssFilter = "none", pixelated = false, className = "", style, src, alt = "", ...props }: AgedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const shouldDownsample = aging.resolutionScale < 0.92;
  const shouldGrain = aging.grain > 0.015;
  const filter = mergeFilters(cssFilter, aging.contrast);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  useEffect(() => {
    setCanvasReady(false);
    const canvas = canvasRef.current;
    if (!canvas || !src || !shouldDownsample) return;

    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";

    image.onload = () => {
      if (cancelled) return;
      const sourceWidth = image.naturalWidth || image.width;
      const sourceHeight = image.naturalHeight || image.height;
      if (!sourceWidth || !sourceHeight) return;

      const scale = Math.max(0.05, Math.min(1, aging.resolutionScale));
      const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
      const targetHeight = Math.max(1, Math.round(sourceHeight * scale));
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      try {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
        setCanvasReady(true);
      } catch {
        setCanvasReady(false);
      }
    };

    image.onerror = () => {
      if (!cancelled) setCanvasReady(false);
    };
    image.src = String(src);

    return () => {
      cancelled = true;
    };
  }, [aging.resolutionScale, shouldDownsample, src]);

  const sharedStyle = useMemo(
    () =>
      ({
        ...style,
        "--media-filter": filter,
        "--image-grain-opacity": aging.grain.toString()
      }) as CSSProperties,
    [aging.grain, filter, style]
  );

  const mediaClass = `${className} broken-media ${pixelated || shouldDownsample ? "media-pixelated" : ""}`.trim();

  // A remote asset that fails (slow CDN, rate limit, dead hotlink) must never
  // leave a blank white void — it should degrade to a deterministic, on-theme
  // placeholder so the page reads as "broken but intentional" rather than empty.
  if (failed) {
    return (
      <span className={`aged-image-shell media-fallback ${className}`} style={sharedStyle} role="img" aria-label={String(alt)}>
        <span aria-hidden="true" className="media-fallback-label">{String(alt).slice(0, 28) || "image unavailable"}</span>
      </span>
    );
  }

  return (
    <span className="aged-image-shell">
      {shouldDownsample ? <canvas ref={canvasRef} aria-hidden="true" className={`${mediaClass} ${canvasReady ? "" : "hidden"}`} style={sharedStyle} /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        src={src}
        alt={alt}
        className={`${mediaClass} ${canvasReady ? "hidden" : ""}`}
        style={sharedStyle}
        onError={() => setFailed(true)}
      />
      {shouldGrain ? <span aria-hidden="true" className="aged-image-grain" style={sharedStyle} /> : null}
    </span>
  );
}

function mergeFilters(cssFilter: string, contrast: number) {
  const filters = [cssFilter && cssFilter !== "none" ? cssFilter : "", contrast !== 1 ? `contrast(${contrast})` : ""].filter(Boolean);
  return filters.join(" ") || "none";
}
