import type { RealDataIntrusion } from "@/lib/types";
import { createRng } from "@/lib/seed";

type RealDataPanelProps = {
  intrusion: RealDataIntrusion;
  className?: string;
  compact?: boolean;
};

const kindLabel: Record<RealDataIntrusion["kind"], string> = {
  article: "article",
  art: "collection",
  biodiversity: "occurrence",
  book: "book",
  recipe: "recipe",
  space: "sky",
  weather: "forecast",
  wildlife: "sighting"
};

function sourceSuffix(intrusion: RealDataIntrusion) {
  return intrusion.fallback ? "cached" : "live";
}

export function RealDataPanel({ intrusion, className = "", compact = false }: RealDataPanelProps) {
  return (
    <article className={`${className} overflow-hidden`}>
      {intrusion.imageUrl ? (
        <div className={`${compact ? "h-28" : "h-40"} overflow-hidden bg-[var(--page-muted)]`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={intrusion.imageUrl} alt="" className="h-full w-full object-cover opacity-85 mix-blend-multiply" loading="lazy" />
        </div>
      ) : null}
      <div className={compact ? "p-3" : "p-4"}>
        <div className="mb-2 flex flex-wrap items-center gap-2 font-accent text-[10px] uppercase opacity-65">
          <span>{kindLabel[intrusion.kind]}</span>
          <span>·</span>
          <span>{intrusion.provider}</span>
          <span>·</span>
          <span>{sourceSuffix(intrusion)}</span>
        </div>
        <p className="font-accent text-[11px] uppercase opacity-60">{intrusion.kicker}</p>
        <h3 className={`${compact ? "text-base" : "text-xl"} mt-1 font-semibold leading-tight`}>{intrusion.title}</h3>
        <p className={`${compact ? "line-clamp-3 text-xs" : "text-sm"} mt-2 leading-6 opacity-78`}>{intrusion.body}</p>
        {intrusion.meta.length ? (
          <p className="mt-3 truncate font-accent text-[10px] uppercase opacity-50">{intrusion.meta.filter(Boolean).slice(0, 2).join(" / ")}</p>
        ) : null}
        {intrusion.readerUrl ? <InlineBookReader intrusion={intrusion} compact={compact} /> : null}
      </div>
    </article>
  );
}

export function InlineBookReader({ intrusion, compact = false }: { intrusion: RealDataIntrusion; compact?: boolean }) {
  if (!intrusion.readerUrl) return null;

  return (
    <details className="mt-4 border-t border-[var(--page-border)] pt-3">
      <summary className="cursor-pointer font-accent text-[11px] uppercase text-[var(--page-link)]">
        {compact ? "Open reader" : "Read inside this page"}
      </summary>
      <div className="mt-3 overflow-hidden rounded-[var(--radius-media)] border border-[var(--page-border)] bg-black/5">
        <iframe
          title={`Reader for ${intrusion.title}`}
          src={intrusion.readerUrl}
          className={compact ? "h-[360px] w-full" : "h-[560px] w-full"}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </details>
  );
}

export function pickRealDataIntrusions(seed: string, intrusions: RealDataIntrusion[], count: number) {
  const rng = createRng(seed);
  const pool = [...intrusions];
  const picked: RealDataIntrusion[] = [];
  const limit = Math.min(count, pool.length);

  for (let index = 0; index < limit; index += 1) {
    picked.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
  }

  return picked;
}
