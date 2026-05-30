"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createRng } from "@/lib/seed";
import type { LoaderVariant } from "@/lib/loadingProfiles";

type LoaderProps = {
  variant: LoaderVariant;
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function LoaderGlyph({ variant, message, className = "", size = "md" }: LoaderProps) {
  const dim = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-12 w-12" : "h-8 w-8";

  const glyph = (() => {
    switch (variant) {
      case "streaming-spinner":
        return <span className={`loader-streaming ${dim}`} aria-hidden />;
      case "hard-blocks":
        return <span className={`loader-blocks ${dim}`} aria-hidden />;
      case "blur-up":
        return <span className={`loader-blur-up ${dim}`} aria-hidden />;
      case "luxury-shimmer":
        return <span className={`loader-luxury skeleton-shimmer ${dim}`} aria-hidden />;
      case "metadata-lines":
        return <span className="loader-metadata grid w-full max-w-[140px] gap-1" aria-hidden>
          <span className="h-1.5 w-full rounded-sm bg-[var(--page-border)]" />
          <span className="h-1.5 w-4/5 rounded-sm bg-[var(--page-muted)]" />
          <span className="h-1.5 w-2/3 rounded-sm bg-[var(--page-muted)]" />
        </span>;
      case "app-skeleton":
        return <span className="loader-app-skeleton grid w-full max-w-[120px] gap-1.5" aria-hidden>
          <span className="h-8 w-8 rounded-[var(--radius-media)] skeleton-shimmer" />
          <span className="h-2 w-full rounded skeleton-shimmer" />
          <span className="h-2 w-3/4 rounded skeleton-shimmer" />
        </span>;
      case "retro-dots":
        return <span className="loader-dots font-accent text-lg tracking-[0.35em]" aria-hidden>●●●</span>;
      case "progress-bar":
        return <span className="loader-progress grid w-full max-w-[180px] gap-1" aria-hidden>
          <span className="h-2 overflow-hidden rounded-sm border border-[var(--page-border)] bg-[var(--page-muted)]">
            <span className="loader-progress-fill block h-full w-[var(--loader-progress,42%)] bg-[var(--page-accent)]" />
          </span>
        </span>;
      case "vhs-buffer":
        return <span className="loader-vhs font-accent text-[10px] uppercase tracking-widest" aria-hidden>▮▯▯ buffering</span>;
      case "table-cell":
        return <span className="loader-table-cell inline-block border border-[var(--page-border)] bg-white px-2 py-1 font-accent text-[10px]" aria-hidden>wait…</span>;
      default:
        return <span className={`loader-streaming ${dim}`} aria-hidden />;
    }
  })();

  return (
    <div className={`grid place-items-center gap-2 ${className}`} role="status" aria-live="polite">
      {glyph}
      {message ? <p className="font-accent text-[11px] uppercase tracking-wide opacity-75">{message}</p> : null}
    </div>
  );
}

export function FakePageOverlay({
  show,
  durationMs,
  variant,
  message,
  wrongGenre
}: {
  show: boolean;
  durationMs: number;
  variant: LoaderVariant;
  message: string;
  wrongGenre?: string;
}) {
  const [visible, setVisible] = useState(show);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    setFading(false);
    const fadeTimer = window.setTimeout(() => setFading(true), Math.max(200, durationMs - 350));
    const hideTimer = window.setTimeout(() => setVisible(false), durationMs);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [show, durationMs]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-[color-mix(in_srgb,var(--page-bg)_92%,black_8%)] backdrop-blur-sm transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
      aria-hidden={fading}
    >
      <div className="grid max-w-sm gap-4 px-6 text-center">
        <LoaderGlyph variant={variant} message={message} size="lg" />
        {wrongGenre ? (
          <p className="font-accent text-[10px] uppercase opacity-50">resolving as {wrongGenre}</p>
        ) : null}
        {variant === "progress-bar" ? (
          <div className="mx-auto w-48">
            <LoaderGlyph variant="progress-bar" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function CornerLoader({
  show,
  message,
  variant
}: {
  show: boolean;
  message: string;
  variant: LoaderVariant;
}) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (!show) return;
    const id = window.setInterval(() => setPulse((v) => !v), 1400);
    return () => window.clearInterval(id);
  }, [show]);

  if (!show) return null;

  return (
    <aside
      className={`pointer-events-none fixed left-3 top-3 z-40 max-w-[200px] rounded-[var(--radius-card)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[color-mix(in_srgb,var(--page-bg)_90%,white)] px-3 py-2 shadow-[var(--shadow-panel)] transition-opacity ${pulse ? "opacity-100" : "opacity-55"}`}
      aria-live="polite"
    >
      <LoaderGlyph variant={variant} message={message} size="sm" />
    </aside>
  );
}

export function InlineBlockLoader({
  variant,
  message,
  durationMs,
  stuck = false
}: {
  variant: LoaderVariant;
  message: string;
  durationMs: number;
  stuck?: boolean;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (stuck) return;
    const id = window.setTimeout(() => setVisible(false), durationMs);
    return () => window.clearTimeout(id);
  }, [durationMs, stuck]);

  if (!visible) return null;

  return (
    <div className="my-2 flex items-center gap-3 rounded-[var(--radius-input)] border border-dashed border-[var(--page-border)] bg-[var(--page-muted)]/40 px-3 py-2">
      <LoaderGlyph variant={variant} size="sm" />
      <p className="font-accent text-[11px] uppercase opacity-70">{message}{stuck ? " (still)" : "…"}</p>
    </div>
  );
}

export function MediaLoadingShim({
  variant,
  message,
  delayMs,
  children
}: {
  variant: LoaderVariant;
  message?: string;
  delayMs: number;
  children: ReactNode;
}) {
  const [loaded, setLoaded] = useState(delayMs === 0);
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    if (delayMs === 0) {
      setLoaded(true);
      return;
    }
    const id = window.setTimeout(() => setLoaded(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);

  useEffect(() => {
    if (loaded && mediaReady) return;
  }, [loaded, mediaReady]);

  const showOverlay = !loaded || !mediaReady;

  return (
    <div className="relative h-full w-full">
      {showOverlay ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-[var(--page-muted)]">
          <LoaderGlyph variant={variant} message={message} size="sm" />
        </div>
      ) : null}
      <div
        className={`h-full w-full transition-opacity duration-500 ${showOverlay ? "opacity-0" : "opacity-100"}`}
        onLoadCapture={() => setMediaReady(true)}
      >
        {children}
      </div>
    </div>
  );
}

export function FloatingBriefLoader({
  variant,
  message,
  durationMs = 2200,
  className = ""
}: {
  variant: LoaderVariant;
  message: string;
  durationMs?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), durationMs);
    return () => window.clearTimeout(id);
  }, [durationMs]);

  if (!visible) return null;

  return (
    <div className={`transition-opacity duration-500 ${className}`}>
      <LoaderGlyph variant={variant} message={message} size="sm" />
    </div>
  );
}

export function VisitorCounter({ seed }: { seed: string }) {
  const target = createRng(`${seed}:visitors`).int(10000, 99999);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 24));
    const id = window.setInterval(() => {
      current = Math.min(target, current + step);
      setValue(current);
      if (current >= target) {
        window.clearInterval(id);
        window.setTimeout(() => setLoading(false), 400);
      }
    }, 70);
    return () => window.clearInterval(id);
  }, [target]);

  if (loading) {
    return (
      <div className="grid place-items-center py-1">
        <LoaderGlyph variant="retro-dots" message="counting guests" size="sm" />
      </div>
    );
  }

  return <p className="font-accent text-2xl tracking-[0.2em]">{String(value)}</p>;
}

export function RouteLoadingShell({
  variant,
  message,
  progress
}: {
  variant: LoaderVariant;
  message: string;
  progress: number;
}) {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] p-6 text-[var(--page-fg)]">
      <div className="mx-auto grid max-w-5xl gap-6">
        <div className="flex items-center gap-4">
          <LoaderGlyph variant={variant} size="md" />
          <p className="font-mono text-sm">{message}</p>
        </div>
        {variant === "app-skeleton" || variant === "metadata-lines" ? (
          <div className="grid gap-3">
            <div className="h-10 w-64 skeleton-shimmer rounded-[var(--radius-input)]" />
            <div className="h-[52vh] skeleton-shimmer rounded-[var(--radius-card)] border border-[var(--page-border)]" />
            <div className="grid gap-2 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 skeleton-shimmer rounded-[var(--radius-card)]" />
              ))}
            </div>
          </div>
        ) : variant === "hard-blocks" ? (
          <div className="grid gap-2 font-mono text-xs uppercase">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 animate-pulse bg-[var(--page-muted)]" style={{ width: `${100 - i * 12}%` }} />
            ))}
          </div>
        ) : (
          <div
            className="h-[52vh] animate-pulse border border-[var(--page-border)] bg-[var(--page-muted)]"
            style={{ "--loader-progress": `${progress}%` } as React.CSSProperties}
          />
        )}
        {variant === "progress-bar" || variant === "streaming-spinner" ? (
          <div className="max-w-xs" style={{ "--loader-progress": `${progress}%` } as React.CSSProperties}>
            <LoaderGlyph variant="progress-bar" message={`${progress}% complete`} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
