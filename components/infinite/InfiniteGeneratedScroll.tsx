"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { DeepLink } from "@/components/glitches/DeepLink";
import { MediaFrame } from "@/components/blocks/MediaFrame";
import { contextForBlock } from "@/lib/generatePage";
import { selectImage } from "@/lib/imageEngine";
import { infiniteScrollConfig } from "@/lib/infiniteScrollConfig";
import { makeLink } from "@/lib/linkEngine";
import { createRng } from "@/lib/seed";
import { generateFormLabel, generateLoadingMessage, generateParagraph, generateProductName } from "@/lib/textEngine";
import type { GeneratedPage, LinkPacket } from "@/lib/types";

type VirtualWindow = {
  loadedCount: number;
  totalHeight: number;
  visible: number[];
  onScroll: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

type VirtualOptions = {
  initialItems: number;
  batchSize: number;
  itemHeight: number;
  preloadItems: number;
  overscanItems: number;
};

function useVirtualWindow({ initialItems, batchSize, itemHeight, preloadItems, overscanItems }: VirtualOptions): VirtualWindow {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loadedCount, setLoadedCount] = useState(initialItems);
  const [scrollState, setScrollState] = useState({ top: 0, height: 720 });

  const measure = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    setScrollState({ top: node.scrollTop, height: node.clientHeight || 720 });
  }, []);

  const onScroll = useCallback(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    measure();
    const node = scrollRef.current;
    if (!node) return;

    const resize = new ResizeObserver(measure);
    resize.observe(node);
    return () => resize.disconnect();
  }, [measure]);

  const firstVisible = Math.max(0, Math.floor(scrollState.top / itemHeight) - overscanItems);
  const lastVisible = Math.min(
    loadedCount - 1,
    Math.ceil((scrollState.top + scrollState.height) / itemHeight) + overscanItems
  );

  useEffect(() => {
    if (lastVisible >= loadedCount - preloadItems) {
      setLoadedCount((count) => count + batchSize);
    }
  }, [batchSize, lastVisible, loadedCount, preloadItems]);

  const visible = useMemo(() => {
    const next: number[] = [];
    for (let i = firstVisible; i <= lastVisible; i += 1) next.push(i);
    return next;
  }, [firstVisible, lastVisible]);

  return {
    loadedCount,
    totalHeight: loadedCount * itemHeight,
    visible,
    onScroll,
    scrollRef
  };
}

function useResponsiveColumns(breakpoints: { base: number; sm?: number; lg?: number }) {
  const [columns, setColumns] = useState(breakpoints.base);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setColumns(width >= 1024 ? breakpoints.lg ?? breakpoints.sm ?? breakpoints.base : width >= 640 ? breakpoints.sm ?? breakpoints.base : breakpoints.base);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoints.base, breakpoints.lg, breakpoints.sm]);

  return columns;
}

function A({ link, className = "", children, ariaLabel }: { link: LinkPacket; className?: string; children: ReactNode; ariaLabel?: string }) {
  return (
    <a href={link.href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

function CleanMedia({
  image,
  className = "",
  rounded = "rounded-[var(--radius-media)]",
  motion = false
}: {
  image: ReturnType<typeof selectImage>;
  className?: string;
  rounded?: string;
  motion?: boolean;
}) {
  return (
    <div className={`overflow-hidden ${rounded} bg-[var(--page-muted)] ${className}`}>
      <MediaFrame image={image} plain motion={motion} />
    </div>
  );
}

function views(seed: string) {
  const rng = createRng(`${seed}:views`);
  const n = rng.int(1, 990);
  const unit = ["views", "K views", "M views"][rng.int(0, 2)];
  const ago = rng.int(1, 11);
  const span = ["minutes", "hours", "days", "years"][rng.int(0, 3)];
  return `${n}${unit === "views" ? "" : ""} ${unit} · ${ago} ${span} ago`;
}

function FeedPost({ page, id, compact = false }: { page: GeneratedPage; id: string; compact?: boolean }) {
  const ctx = contextForBlock(page, id);
  const r = createRng(ctx.componentSeed);
  const avatar = selectImage(ctx, "profile/avatar");
  const showMedia = r.bool(0.55);
  const media = selectImage({ ...ctx, componentSeed: `${ctx.componentSeed}:media` }, showMedia ? "news thumbnail" : "product image");
  const author = `guest_${r.int(100, 9999)}`;
  const reactions = ["Like", "Repost", "Send", "Save"];

  return (
    <article className={`${page.styleRecipe.classes.panel} grid h-full content-start gap-3 overflow-hidden`}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--page-muted)]">
          <MediaFrame image={avatar} plain />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">@{author}</p>
          <p className="truncate font-accent text-[11px] opacity-60">
            {views(ctx.componentSeed)} · {page.genreFormula.content}
          </p>
        </div>
        <span className="max-w-24 truncate font-accent text-[11px] opacity-50">{page.motifs[r.int(0, page.motifs.length - 1)] ?? "feed"}</span>
      </div>
      <p className={`${compact ? "line-clamp-3" : "line-clamp-4"} text-[15px] leading-6`}>{generateParagraph(ctx, 0)}</p>
      {showMedia && <CleanMedia image={media} className={compact ? "h-36" : "h-44"} />}
      <div className="mt-auto flex items-center justify-between border-t-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pt-2 font-accent text-xs opacity-70">
        <div className="flex gap-3">
          {reactions.map((label, i) => (
            <DeepLink key={label} link={makeLink(ctx, `react-${i}`, label)} className="hover:text-[var(--page-accent)]" />
          ))}
        </div>
        <span className="truncate">{r.int(0, 404)} comments · {r.int(1, 99)} shares</span>
      </div>
    </article>
  );
}

function SocialMediaTile({ page, index }: { page: GeneratedPage; index: number }) {
  const ctx = contextForBlock(page, `media-${index}`);
  const link = makeLink(ctx, `media-${index}`, generateProductName(ctx, index));
  return (
    <A link={link} className="relative block h-full overflow-hidden bg-black no-underline">
      <CleanMedia image={selectImage(ctx, index % 2 ? "video thumbnail" : "news thumbnail")} className="h-full" rounded="" motion />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-2">
        <p className="line-clamp-2 text-xs font-semibold text-white">{link.label}</p>
      </div>
    </A>
  );
}

export function InfiniteSocialFeed({
  page,
  variant = "feed",
  className = "",
  includeComposer = false
}: {
  page: GeneratedPage;
  variant?: "feed" | "compact" | "media-grid";
  className?: string;
  includeComposer?: boolean;
}) {
  const cfg = infiniteScrollConfig.social;
  const itemHeight = variant === "media-grid" ? cfg.mediaGridItemHeight : variant === "compact" ? cfg.compactItemHeight : cfg.itemHeight;
  const columns = useResponsiveColumns(variant === "media-grid" ? { base: 2, sm: 3, lg: 4 } : { base: 1 });
  const rowHeight = variant === "media-grid" ? itemHeight : itemHeight;
  const virtual = useVirtualWindow({
    initialItems: cfg.initialItems,
    batchSize: cfg.batchSize,
    itemHeight: rowHeight,
    preloadItems: cfg.preloadItems,
    overscanItems: cfg.overscanItems
  });
  const rowsLoaded = Math.ceil(virtual.loadedCount / columns);
  const totalHeight = rowsLoaded * rowHeight;
  const ctx = contextForBlock(page, "social-scroll");

  if (variant === "media-grid") {
    return (
      <div
        ref={virtual.scrollRef}
        onScroll={virtual.onScroll}
        className={`h-[calc(100vh-72px)] overflow-y-auto contain-content ${className}`}
        data-infinite-scroll="social-media-grid"
        data-loaded-count={virtual.loadedCount}
      >
        <div className="relative" style={{ height: totalHeight }}>
          {virtual.visible.flatMap((row) =>
            Array.from({ length: columns }).map((_, column) => {
              const index = row * columns + column;
              if (index >= virtual.loadedCount) return null;
              return (
                <div
                  key={index}
                  className="absolute p-0.5"
                  data-virtual-item="social"
                  style={{
                    top: row * rowHeight,
                    left: `${(column / columns) * 100}%`,
                    width: `${100 / columns}%`,
                    height: rowHeight
                  }}
                >
                  <SocialMediaTile page={page} index={index} />
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={virtual.scrollRef}
      onScroll={virtual.onScroll}
      className={`h-[calc(100vh-190px)] min-h-[520px] overflow-y-auto pr-1 contain-content ${className}`}
      data-infinite-scroll={variant === "compact" ? "social-compact" : "social-feed"}
      data-loaded-count={virtual.loadedCount}
    >
      {includeComposer ? (
        <div className={`${page.styleRecipe.classes.panel} sticky top-0 z-10 mb-4 grid gap-2 bg-[var(--page-bg)]/95 backdrop-blur`}>
          <p className="font-accent text-[11px] uppercase opacity-60">What's happening</p>
          <input className="border-0 bg-transparent text-lg outline-none" placeholder={generateFormLabel(ctx, 0)} />
          <div className="flex justify-end">
            <DeepLink link={makeLink(ctx, "compose", "Post")} className={page.styleRecipe.classes.button} />
          </div>
        </div>
      ) : null}
      <div className="relative" style={{ height: virtual.totalHeight }}>
        {virtual.visible.map((index) => (
          <div
            key={index}
            className="absolute inset-x-0 pb-4"
            data-virtual-item="social"
            style={{ top: index * itemHeight, height: itemHeight }}
          >
            <FeedPost page={page} id={`post-${index}`} compact={variant === "compact"} />
          </div>
        ))}
      </div>
      <p className="py-4 text-center font-accent text-xs opacity-50">{generateLoadingMessage(ctx)}</p>
    </div>
  );
}

function ShortTile({ page, id }: { page: GeneratedPage; id: string }) {
  const ctx = contextForBlock(page, id);
  const image = selectImage(ctx, "video thumbnail");
  const link = makeLink(ctx, id, generateProductName(ctx, 0));
  const r = createRng(ctx.componentSeed);
  const actions = ["Like", "Talk", "Share", "Save"];

  return (
    <div className="relative grid h-full overflow-hidden rounded-[var(--radius-card)] bg-black">
      <CleanMedia image={image} className="absolute inset-0 h-full" rounded="" motion={Boolean(image.videoSrc)} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      <div className="absolute bottom-0 left-0 right-12 p-4 text-white">
        <p className="font-semibold">@{`creator_${r.int(100, 999)}`}</p>
        <p className="mt-1 line-clamp-2 text-sm opacity-90">{generateParagraph(ctx, 0)}</p>
        <p className="mt-2 font-accent text-[11px] opacity-70">{page.motifs[0] ?? "ambient checkout"} · {views(ctx.componentSeed)}</p>
      </div>
      <div className="absolute bottom-4 right-2 grid gap-3 text-center text-white">
        {actions.map((action, i) => {
          const actionLink = makeLink(ctx, `act-${i}`, action);
          return (
            <A key={action} link={actionLink} className="grid gap-0.5 text-xs no-underline">
              <span>{action}</span>
              <span className="font-accent text-[10px]">{r.int(0, 9999)}</span>
            </A>
          );
        })}
      </div>
      <A link={link} className="absolute inset-0" ariaLabel={link.label}>
        <span className="sr-only">{link.label}</span>
      </A>
    </div>
  );
}

function DiscoverShort({ page, index }: { page: GeneratedPage; index: number }) {
  const ctx = contextForBlock(page, `disc-${index}`);
  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-2 overflow-hidden">
      <CleanMedia image={selectImage(ctx, "video thumbnail")} className="min-h-0" motion />
      <p className="line-clamp-2 text-sm font-semibold">{generateProductName(ctx, index)}</p>
    </div>
  );
}

export function InfiniteShortVideoFeed({
  page,
  variant = "grid",
  className = ""
}: {
  page: GeneratedPage;
  variant?: "reel" | "grid" | "discover";
  className?: string;
}) {
  const cfg = infiniteScrollConfig.shorts;
  const columns = useResponsiveColumns(variant === "grid" ? { base: 2, sm: 3, lg: 4 } : variant === "discover" ? { base: 1, sm: 2 } : { base: 1 });
  const itemHeight = variant === "reel" ? cfg.reelItemHeight : variant === "discover" ? cfg.discoverItemHeight : cfg.gridItemHeight;
  const virtual = useVirtualWindow({
    initialItems: cfg.initialItems,
    batchSize: cfg.batchSize,
    itemHeight,
    preloadItems: cfg.preloadItems,
    overscanItems: cfg.overscanItems
  });
  const rowsLoaded = Math.ceil(virtual.loadedCount / columns);
  const totalHeight = rowsLoaded * itemHeight;

  return (
    <div
      ref={virtual.scrollRef}
      onScroll={virtual.onScroll}
      className={`h-[calc(100vh-145px)] min-h-[560px] overflow-y-auto contain-content ${variant === "reel" ? "snap-y snap-mandatory" : ""} ${className}`}
      data-infinite-scroll={`short-${variant}`}
      data-loaded-count={virtual.loadedCount}
    >
      <div className="relative mx-auto" style={{ height: totalHeight, maxWidth: variant === "reel" ? 448 : undefined }}>
        {virtual.visible.flatMap((row) =>
          Array.from({ length: columns }).map((_, column) => {
            const index = row * columns + column;
            if (index >= virtual.loadedCount) return null;
            return (
              <div
                key={index}
                className={`absolute ${variant === "reel" ? "snap-start px-0 pb-4" : "p-1.5"}`}
                data-virtual-item="short"
                style={{
                  top: row * itemHeight,
                  left: `${(column / columns) * 100}%`,
                  width: `${100 / columns}%`,
                  height: itemHeight
                }}
              >
                {variant === "discover" ? <DiscoverShort page={page} index={index} /> : <ShortTile page={page} id={`${variant}-${index}`} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
