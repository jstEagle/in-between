"use client";

import { useEffect, useMemo, useState, type CSSProperties, type DragEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AgedImage } from "@/components/blocks/AgedImage";
import { buildSearchPath } from "@/lib/searchQuery";
import { chooseComponentGlitch, glitchClassName, type ComponentGlitch } from "@/lib/componentGlitches";
import type { ImageAging } from "@/lib/imageEngine";
import type { LinkPacket } from "@/lib/types";
import type { LoaderVariant } from "@/lib/loadingProfiles";
import { LoaderGlyph } from "@/components/loaders/LoadingEffects";
import { languageLabel } from "@/content/i18n";

export type InteractionImage = {
  src: string;
  alt: string;
  label?: string;
  cssFilter?: string;
  pixelated?: boolean;
  aging?: ImageAging;
};

export type InteractionItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  price?: string;
  meta?: string;
  tags: string[];
  images: InteractionImage[];
};

type Classes = {
  panel: string;
  button: string;
  tag: string;
};

type DropRecord = {
  itemId: string;
  title: string;
  zone: string;
};

function searchableText(item: InteractionItem) {
  return `${item.title} ${item.description} ${item.price ?? ""} ${item.meta ?? ""} ${item.tags.join(" ")}`.toLowerCase();
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags.filter(Boolean)));
}

function scoreItem(item: InteractionItem, query: string) {
  if (!query.trim()) return 1;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = searchableText(item);
  return terms.reduce((score, term) => {
    if (item.title.toLowerCase().includes(term)) return score + 8;
    if (item.tags.some((tag) => tag.toLowerCase().includes(term))) return score + 5;
    if (text.includes(term)) return score + 2;
    return score - 5;
  }, 0);
}

function useFilteredItems(items: InteractionItem[], query: string, activeTag: string, sort: string) {
  return useMemo(() => {
    const ranked = items
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter(({ item, score }) => score > 0 && (activeTag === "all" || item.tags.includes(activeTag)));

    ranked.sort((a, b) => {
      if (sort === "name") return a.item.title.localeCompare(b.item.title);
      if (sort === "price") return (a.item.price ?? "").localeCompare(b.item.price ?? "");
      return b.score - a.score || a.item.title.localeCompare(b.item.title);
    });

    return ranked.map(({ item }) => item);
  }, [activeTag, items, query, sort]);
}

export function ProductExperience({
  items,
  links,
  classes,
  title,
  placeholder = "Search products, rooms, tags",
  labels = "English"
}: {
  items: InteractionItem[];
  links: LinkPacket[];
  classes: Classes;
  title: string;
  placeholder?: string;
  labels?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [drops, setDrops] = useState<DropRecord[]>([]);
  const [draggingItem, setDraggingItem] = useState<Pick<InteractionItem, "id" | "title"> | null>(null);
  const tags = useMemo(() => ["all", ...uniqueTags(items.flatMap((item) => item.tags)).slice(0, 8)], [items]);
  const visible = useFilteredItems(items, query, activeTag, sort);

  function captureDrop(event: DragEvent<HTMLElement>, zone: string) {
    event.preventDefault();
    const payload = event.dataTransfer.getData("application/x-inbetween-item");
    const parsed = payload ? (JSON.parse(payload) as Pick<InteractionItem, "id" | "title">) : draggingItem;
    if (!parsed) return;
    recordDrop(parsed, zone);
  }

  function recordDrop(item: Pick<InteractionItem, "id" | "title">, zone: string) {
    setDrops((current) => [{ itemId: item.id, title: item.title, zone }, ...current].slice(0, 5));
    setDraggingItem(null);
  }

  return (
    <div className="grid gap-[var(--gap-grid)]">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className={`${classes.panel} grid gap-3`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-accent text-[11px] uppercase opacity-60">{languageLabel(labels, "interactiveShelf")}</p>
              <h2 className="headline text-2xl leading-tight">{title}</h2>
            </div>
            <label className="grid min-w-0 flex-1 gap-1 md:max-w-md">
              <span className="font-accent text-[11px] uppercase opacity-70">{languageLabel(labels, "search")}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                className="min-w-0 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-white/90 px-3 py-2 text-sm text-black outline-none focus:border-[var(--page-accent)]"
              />
            </label>
            <label className="grid gap-1">
              <span className="font-accent text-[11px] uppercase opacity-70">{languageLabel(labels, "sort")}</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-white/90 px-3 py-2 text-sm text-black"
              >
                <option value="relevance">{languageLabel(labels, "relevance")}</option>
                <option value="name">{languageLabel(labels, "name")}</option>
                <option value="price">{languageLabel(labels, "priceLabel")}</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`${classes.tag} ${activeTag === tag ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <DropTarget zone={languageLabel(labels, "strayComparison")} drops={drops} activeItem={draggingItem} onDrop={captureDrop} onLooseDrop={recordDrop} labels={labels} />
      </div>

      <div className="grid gap-[var(--gap-grid)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((item) => (
          <GlitchShell key={item.id} glitch={chooseComponentGlitch(item.id, items.length, "interactive-card")}>
            <CarouselCard item={item} classes={classes} labels={labels} onDragStart={setDraggingItem} onDragEnd={() => setDraggingItem(null)} />
          </GlitchShell>
        ))}
      </div>

      {visible.length === 0 && (
        <div className={`${classes.panel} text-sm`}>
          {languageLabel(labels, "noMatchingItems")}
        </div>
      )}

      <div className="grid gap-[var(--gap-grid)] lg:grid-cols-[1fr_1fr_1fr]">
        <DropTarget zone={languageLabel(labels, "cartWithoutContext")} drops={drops} activeItem={draggingItem} onDrop={captureDrop} onLooseDrop={recordDrop} labels={labels} />
        <DropTarget zone={languageLabel(labels, "wrongDepartment")} drops={drops} activeItem={draggingItem} onDrop={captureDrop} onLooseDrop={recordDrop} labels={labels} />
        <div className={`${classes.panel} grid gap-2`}>
          <p className="font-accent text-[11px] uppercase opacity-70">{languageLabel(labels, "relatedRoutes")}</p>
          <div className="flex flex-wrap gap-2">
            {links.slice(0, 6).map((link) => (
              <a key={link.id} href={link.href} className="old-link text-sm">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselCard({
  item,
  classes,
  labels,
  onDragStart,
  onDragEnd
}: {
  item: InteractionItem;
  classes: Classes;
  labels: string;
  onDragStart: (item: Pick<InteractionItem, "id" | "title">) => void;
  onDragEnd: () => void;
}) {
  const [index, setIndex] = useState(0);
  const image = item.images[index] ?? item.images[0];

  function move(delta: number) {
    setIndex((current) => (current + delta + item.images.length) % item.images.length);
  }

  function drag(event: DragEvent<HTMLElement>) {
    event.dataTransfer.effectAllowed = "copyMove";
    event.dataTransfer.setData("application/x-inbetween-item", JSON.stringify({ id: item.id, title: item.title }));
    event.dataTransfer.setData("text/plain", `${item.title} ${item.href}`);
    onDragStart({ id: item.id, title: item.title });
  }

  return (
    <article
      draggable
      onMouseDown={() => onDragStart({ id: item.id, title: item.title })}
      onDragStart={drag}
      onDragEnd={onDragEnd}
      className={`${classes.panel} grid min-h-full cursor-grab gap-3 active:cursor-grabbing`}
    >
      <div className="relative overflow-hidden rounded-[var(--radius-media)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]">
        <AgedImage
          src={image.src}
          alt={image.alt}
          className="aspect-square h-full w-full object-cover"
          cssFilter={image.cssFilter}
          pixelated={image.pixelated}
          aging={image.aging}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        {item.images.length > 1 && (
          <div className="absolute inset-x-2 top-2 flex justify-between">
            <button type="button" onClick={() => move(-1)} aria-label={`Previous image for ${item.title}`} className="grid h-8 w-8 place-items-center rounded-[var(--radius-pill)] bg-white/85 text-black shadow">
              ‹
            </button>
            <button type="button" onClick={() => move(1)} aria-label={`Next image for ${item.title}`} className="grid h-8 w-8 place-items-center rounded-[var(--radius-pill)] bg-white/85 text-black shadow">
              ›
            </button>
          </div>
        )}
        <p className="absolute bottom-2 left-2 max-w-[82%] truncate rounded-[var(--radius-tag)] bg-white/85 px-2 py-1 font-accent text-[10px] text-black">
          {index + 1}/{item.images.length} {image.label ?? "image"}
        </p>
      </div>
      <div className="grid gap-2">
        <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
        <p className="line-clamp-3 text-sm leading-6 opacity-85">{item.description}</p>
        <div className="flex flex-wrap gap-1">
          {uniqueTags(item.tags).slice(0, 3).map((tag) => (
            <span key={`${item.id}-${tag}`} className="rounded-[var(--radius-tag)] bg-[var(--page-muted)] px-2 py-1 font-accent text-[10px] uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <span className="font-accent text-sm">{item.price ?? item.meta}</span>
        <a href={item.href} className={classes.button}>
          {languageLabel(labels, "open")}
        </a>
      </div>
    </article>
  );
}

function DropTarget({
  zone,
  drops,
  activeItem,
  onDrop,
  onLooseDrop,
  labels
}: {
  zone: string;
  drops: DropRecord[];
  activeItem: Pick<InteractionItem, "id" | "title"> | null;
  onDrop: (event: DragEvent<HTMLElement>, zone: string) => void;
  onLooseDrop: (item: Pick<InteractionItem, "id" | "title">, zone: string) => void;
  labels: string;
}) {
  const ownDrops = drops.filter((drop) => drop.zone === zone);
  const content = (
    <aside
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDrop(event, zone)}
      onMouseUp={() => {
        if (activeItem) onLooseDrop(activeItem, zone);
      }}
      className="min-h-32 rounded-[var(--radius-card)] border-[length:var(--border-w)] border-dashed border-[var(--page-border)] bg-[color-mix(in_srgb,var(--page-muted)_58%,transparent)] p-3"
    >
      <p className="font-accent text-[11px] uppercase opacity-70">{zone}</p>
      <div className="mt-3 grid gap-2 text-sm">
        {ownDrops.length ? ownDrops.map((drop, index) => <span key={`${drop.itemId}-${index}`}>{drop.title}</span>) : <span className="opacity-60">{languageLabel(labels, "dropAnythingHere")}</span>}
      </div>
    </aside>
  );

  return (
    <GlitchShell glitch={chooseComponentGlitch(`drop:${zone}`, drops.length + zone.length, "drop-zone")}>
      {content}
    </GlitchShell>
  );
}

function GlitchShell({ glitch, children }: { glitch: ComponentGlitch; children: ReactNode }) {
  if (glitch.kind === "none") return <>{children}</>;

  const style =
    glitch.kind === "offset"
      ? ({ transform: `translate(${glitch.x}px, ${glitch.y}px)` } as CSSProperties)
      : glitch.kind === "clipped" || glitch.kind === "collapsed"
        ? ({ maxHeight: glitch.maxHeight, overflow: "hidden" } as CSSProperties)
        : glitch.kind === "sliced"
          ? ({ clipPath: `inset(${glitch.inset})` } as CSSProperties)
          : ({ "--glitch-duplicate-x": `${glitch.x}px`, "--glitch-duplicate-y": `${glitch.y}px` } as CSSProperties);

  return (
    <div className={glitchClassName(glitch)} data-glitch={glitch.kind} style={style}>
      {children}
    </div>
  );
}

export function SearchExperience({
  items,
  suggestions,
  classes,
  initialQuery,
  loaderVariant = "streaming-spinner",
  labels = "English"
}: {
  items: InteractionItem[];
  suggestions: LinkPacket[];
  classes: Classes;
  initialQuery: string;
  loaderVariant?: LoaderVariant;
  labels?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [activeTag, setActiveTag] = useState("all");
  const [searching, setSearching] = useState(false);
  const tags = useMemo(() => ["all", ...uniqueTags(items.flatMap((item) => item.tags)).slice(0, 7)], [items]);
  const visible = useFilteredItems(items, query, activeTag, "relevance");

  useEffect(() => {
    setSearching(true);
    const id = window.setTimeout(() => setSearching(false), 420);
    return () => window.clearTimeout(id);
  }, [query, activeTag]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) router.push(buildSearchPath(trimmed));
  }

  return (
    <div className="grid gap-6">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="rounded-[var(--radius-pill)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-white px-4 py-2 shadow-[var(--shadow-panel)]"
      >
        <label className="flex items-center gap-2">
          <span className="opacity-40">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={languageLabel(labels, "search")} className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none" />
          <span className="opacity-40">{searching ? "…" : visible.length}</span>
        </label>
      </form>

      {searching ? (
        <div className="flex items-center gap-3 px-1">
          <LoaderGlyph variant={loaderVariant} message={languageLabel(labels, "findingSimilarWidgets")} size="sm" />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button key={tag} type="button" onClick={() => setActiveTag(tag)} className={`${classes.tag} ${activeTag === tag ? "bg-[#1a0dab] text-white" : "bg-white"}`}>
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {visible.map((item) => (
          <GlitchShell key={item.id} glitch={chooseComponentGlitch(item.id, items.length, "search-result")}>
            <article className="grid gap-1">
              <p className="flex items-center gap-2 text-xs">
                <span className="grid h-6 w-6 place-items-center rounded-[var(--radius-pill)] bg-[var(--page-muted)]">◑</span>
                <span className="opacity-70">{item.meta ?? "in between space"}</span>
                <span className="truncate text-[#0F9D58]">{item.href}</span>
              </p>
              <a href={item.href} className="text-xl text-[#1a0dab] hover:underline">
                {item.title}
              </a>
              <p className="text-sm leading-6 opacity-85">{item.description}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {uniqueTags(item.tags).slice(0, 4).map((tag) => (
                  <button key={`${item.id}-${tag}`} type="button" onClick={() => setActiveTag(tag)} className="text-sm text-[#1a0dab] hover:underline">
                    {tag}
                  </button>
                ))}
              </div>
            </article>
          </GlitchShell>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold opacity-70">{languageLabel(labels, "relatedSearches")}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {suggestions.map((link) => (
            <a key={link.id} href={link.href} className="flex items-center gap-2 rounded-[var(--radius-input)] bg-white px-3 py-2 text-sm shadow-[var(--shadow-panel)] hover:bg-[var(--page-muted)]/40">
              <span className="opacity-40">⌕</span> {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AmbientDragLayer({ links, classes, labels = "English" }: { links: LinkPacket[]; classes: Classes; labels?: string }) {
  const [last, setLast] = useState(languageLabel(labels, "nothingYet"));

  function capture(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const payload = event.dataTransfer.getData("application/x-inbetween-item") || event.dataTransfer.getData("text/plain");
    setLast(payload ? payload.replace(/[{}"]/g, " ").slice(0, 56) : languageLabel(labels, "unknownItem"));
  }

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-50 hidden w-[min(360px,calc(100vw-1.5rem))] md:block">
      <aside
        onDragOver={(event) => event.preventDefault()}
        onDrop={capture}
        className={`${classes.panel} pointer-events-auto bg-[color-mix(in_srgb,var(--page-bg)_92%,white)]/95 text-sm backdrop-blur`}
      >
        <p className="font-accent text-[11px] uppercase opacity-65">{languageLabel(labels, "looseAttachmentTarget")}</p>
        <p className="mt-1 line-clamp-2">{last}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {links.slice(0, 3).map((link) => (
            <a key={link.id} href={link.href} className="old-link text-xs">
              {link.label}
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}
