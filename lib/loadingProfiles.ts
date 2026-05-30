import type { GeneratedComponentContext, GeneratedPage } from "./types";
import { createRng, pick } from "./seed";
import { generateLoadingMessage } from "./textEngine";

export type LoaderVariant =
  | "streaming-spinner"
  | "hard-blocks"
  | "blur-up"
  | "luxury-shimmer"
  | "metadata-lines"
  | "app-skeleton"
  | "retro-dots"
  | "progress-bar"
  | "vhs-buffer"
  | "table-cell";

const familyMap: Record<string, LoaderVariant> = {
  "hard-edged placeholder": "hard-blocks",
  "old streaming spinner": "streaming-spinner",
  "blur-up": "blur-up",
  "luxury shimmer": "luxury-shimmer",
  "metadata first": "metadata-lines",
  "app-store skeleton": "app-skeleton"
};

export function loaderVariantForPage(page: GeneratedPage): LoaderVariant {
  return familyMap[page.mediaProfile.loadingFamily] ?? "streaming-spinner";
}

export function loaderVariantForContext(ctx: GeneratedComponentContext): LoaderVariant {
  const base = familyMap[ctx.mediaProfile.loadingFamily] ?? "streaming-spinner";
  const extras: LoaderVariant[] = ["retro-dots", "progress-bar", "vhs-buffer", "table-cell"];
  return pick(`${ctx.componentSeed}:loader`, [base, ...extras]);
}

export type PageOverlayConfig = {
  show: boolean;
  durationMs: number;
  variant: LoaderVariant;
  message: string;
  wrongGenre?: string;
};

export function pageLoadingOverlay(page: GeneratedPage): PageOverlayConfig {
  const rng = createRng(`${page.routeState.seed}:page-overlay`);
  const ctx = {
    routeState: page.routeState,
    pageSeed: page.routeState.seed,
    componentId: "overlay",
    componentSeed: `${page.routeState.seed}:overlay`,
    depth: page.routeState.depth,
    genreFormula: page.genreFormula,
    webMood: page.webMood,
    mediaProfile: page.mediaProfile,
    styleRecipe: page.styleRecipe,
    languageBlend: page.languageBlend,
    motifs: page.motifs
  } satisfies GeneratedComponentContext;

  const wrongGenres = [page.genreFormula.content, page.genreFormula.action, page.genreFormula.residue, "checkout", "breaking news"];
  return {
    show: rng.bool(0.015),
    durationMs: rng.int(180, 420),
    variant: loaderVariantForPage(page),
    message: generateLoadingMessage(ctx),
    wrongGenre: rng.bool(0.42) ? pick(`${page.routeState.seed}:wrong-genre`, wrongGenres) : undefined
  };
}

export type CornerLoaderConfig = {
  show: boolean;
  message: string;
  variant: LoaderVariant;
};

export function cornerLoader(page: GeneratedPage): CornerLoaderConfig {
  const rng = createRng(`${page.routeState.seed}:corner-loader`);
  const ctx = {
    routeState: page.routeState,
    pageSeed: page.routeState.seed,
    componentId: "corner",
    componentSeed: `${page.routeState.seed}:corner`,
    depth: page.routeState.depth,
    genreFormula: page.genreFormula,
    webMood: page.webMood,
    mediaProfile: page.mediaProfile,
    styleRecipe: page.styleRecipe,
    languageBlend: page.languageBlend,
    motifs: page.motifs
  } satisfies GeneratedComponentContext;

  return {
    show: rng.bool(0.22),
    message: generateLoadingMessage(ctx),
    variant: pick(`${page.routeState.seed}:corner-variant`, ["retro-dots", "table-cell", "progress-bar", loaderVariantForPage(page)])
  };
}

export function mediaLoaderDelayMs(ctx: GeneratedComponentContext): number {
  const rng = createRng(`${ctx.componentSeed}:media-delay`);
  const family = ctx.mediaProfile.loadingFamily;
  if (family === "luxury shimmer") return rng.int(280, 760);
  if (family === "metadata first") return rng.int(180, 560);
  if (family === "hard-edged placeholder") return rng.int(90, 320);
  if (family === "old streaming spinner") return rng.int(140, 480);
  if (rng.bool(0.25)) return rng.int(120, 420);
  return 0;
}

export function shouldFakeMediaLoader(ctx: GeneratedComponentContext): boolean {
  return createRng(`${ctx.componentSeed}:media-loader`).bool(0.04);
}

export type MediaLoaderConfig = {
  variant: LoaderVariant;
  message: string;
  delayMs: number;
};

export function mediaLoaderConfig(ctx: GeneratedComponentContext): MediaLoaderConfig | null {
  if (!shouldFakeMediaLoader(ctx)) return null;
  return {
    variant: loaderVariantForContext(ctx),
    message: generateLoadingMessage(ctx),
    delayMs: mediaLoaderDelayMs(ctx)
  };
}

export function inlineLoaderForBlock(page: GeneratedPage, blockId: string) {
  const rng = createRng(`${page.routeState.seed}:${blockId}:inline`);
  if (!rng.bool(0.035)) return null;

  const ctx = {
    routeState: page.routeState,
    pageSeed: page.routeState.seed,
    componentId: blockId,
    componentSeed: `${page.routeState.seed}:${blockId}`,
    depth: page.routeState.depth,
    genreFormula: page.genreFormula,
    webMood: page.webMood,
    mediaProfile: page.mediaProfile,
    styleRecipe: page.styleRecipe,
    languageBlend: page.languageBlend,
    motifs: page.motifs
  } satisfies GeneratedComponentContext;

  return {
    variant: loaderVariantForContext(ctx),
    message: generateLoadingMessage(ctx),
    durationMs: rng.int(260, 820),
    stuck: false
  };
}

export function routeLoaderFromPath(path: string) {
  const seed = path || "/";
  const rng = createRng(`${seed}:route-loader`);
  const variants: LoaderVariant[] = [
    "streaming-spinner",
    "hard-blocks",
    "blur-up",
    "luxury-shimmer",
    "metadata-lines",
    "app-skeleton",
    "retro-dots",
    "progress-bar",
    "vhs-buffer"
  ];
  const verbs = ["Restoring", "Buffering", "Checking", "Preparing", "Downloading", "Locating"];
  const nouns = ["previous tab", "nearby suite", "thumbnail inventory", "local headline", "breakfast options", "guest directory"];

  return {
    variant: pick(`${seed}:route-variant`, variants),
    message: `${pick(`${seed}:route-verb`, verbs)} ${pick(`${seed}:route-noun`, nouns)}…`,
    progress: rng.int(12, 88)
  };
}
