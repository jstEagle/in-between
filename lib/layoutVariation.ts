import type { LayoutArchetype } from "./types";
import { entropyLevel } from "./entropy";
import { createRng, pick } from "./seed";

export type LayoutVariation = {
  gridCols: 2 | 3 | 4 | 5 | 6;
  density: number;
  sidebarSide: "left" | "right";
  showSidebar: boolean;
  showPromo: boolean;
  showBreadcrumb: boolean;
  showIntrusion: boolean;
  showSecondaryMedia: boolean;
  headerMode: "mini" | "centered" | "compact" | "sticky" | "chrome" | "promo";
  footerMode: "columns" | "tiny" | "oldweb";
  mediaAspect: "square" | "video" | "wide" | "tall" | "portrait";
  blockOrder: "normal" | "reversed" | "shuffle";
  cardStyle: "panel" | "border" | "flat" | "elevated";
  shelfCount: number;
  navLinks: number;
  titleScale: "sm" | "md" | "lg" | "xl";
  gapScale: "tight" | "normal" | "loose";
  listStyle: "cards" | "rows" | "tiles";
  accentStrip: boolean;
  mirrorLayout: boolean;
};

const gridColsPool = [2, 3, 4, 5, 6] as const;
const headerPool = ["mini", "centered", "compact", "sticky", "chrome", "promo"] as const;
const footerPool = ["columns", "tiny", "oldweb"] as const;
const aspectPool = ["square", "video", "wide", "tall", "portrait"] as const;
const cardPool = ["panel", "border", "flat", "elevated"] as const;
const listPool = ["cards", "rows", "tiles"] as const;
const titlePool = ["sm", "md", "lg", "xl"] as const;
const gapPool = ["tight", "normal", "loose"] as const;
const orderPool = ["normal", "reversed", "shuffle"] as const;

type LayoutBias = {
  headerMode?: LayoutVariation["headerMode"];
  listStyle?: LayoutVariation["listStyle"];
  footerMode?: LayoutVariation["footerMode"];
  showSidebar?: boolean;
  mediaAspect?: LayoutVariation["mediaAspect"];
  cardStyle?: LayoutVariation["cardStyle"];
  titleScale?: LayoutVariation["titleScale"];
};

const layoutBias: Partial<Record<LayoutArchetype, LayoutBias>> = {
  streaming: { listStyle: "tiles", headerMode: "sticky" },
  store: { listStyle: "cards", showSidebar: true },
  news: { footerMode: "oldweb" },
  "portal-2000": { footerMode: "oldweb", headerMode: "promo" },
  dashboard: { showSidebar: true, headerMode: "compact" },
  forum: { listStyle: "rows", footerMode: "oldweb" },
  guestbook: { footerMode: "oldweb" },
  finance: { headerMode: "compact" },
  search: { headerMode: "centered" },
  docs: { headerMode: "sticky" },
  "link-in-bio": { headerMode: "centered", footerMode: "tiny" },
  "short-video": { listStyle: "tiles", mediaAspect: "portrait" },
  food: { headerMode: "promo" },
  music: { listStyle: "rows", headerMode: "compact", mediaAspect: "square" },
  chat: { headerMode: "compact", showSidebar: true, footerMode: "tiny" }
};

function pickBiased<T extends string>(seed: string, key: string, pool: readonly T[], bias?: T, chance = 0.55): T {
  if (bias && createRng(`${seed}:bias:${key}`).bool(chance)) return bias;
  return pick(`${seed}:lv:${key}`, pool);
}

export function chooseLayoutVariation(seed: string, layout: LayoutArchetype, skin: string, depth: number): LayoutVariation {
  const rng = createRng(`${seed}:layout-var:${layout}:${skin}`);
  const bias = layoutBias[layout] ?? {};
  const depthChaos = entropyLevel(depth);

  const density = rng.float(depthChaos > 0 ? 0.48 : 0.74, depthChaos > 0 ? 1.62 : 1.24);
  const gridCols = pick(`${seed}:lv:grid`, gridColsPool);
  const sidebarSide = rng.bool(0.5 + depthChaos * 0.15) ? "left" : "right";

  return {
    gridCols,
    density,
    sidebarSide,
    showSidebar: bias.showSidebar !== undefined ? rng.bool(bias.showSidebar ? 0.7 : 0.25) : rng.bool(layout === "store" || layout === "dashboard" ? 0.58 : 0.34),
    showPromo: rng.bool(0.22 + depthChaos * 0.54),
    showBreadcrumb: rng.bool(0.68 - depthChaos * 0.4),
    showIntrusion: rng.bool(0.16 + depthChaos * 0.68),
    showSecondaryMedia: rng.bool(0.36 + depthChaos * 0.42),
    headerMode: pickBiased(seed, "header", headerPool, bias.headerMode, 0.72 - depthChaos * 0.42),
    footerMode: pickBiased(seed, "footer", footerPool, bias.footerMode, 0.52),
    mediaAspect: bias.mediaAspect ?? (layout === "short-video" ? "portrait" : pick(`${seed}:lv:aspect`, aspectPool)),
    blockOrder: depthChaos <= 0 ? pick(`${seed}:lv:order`, ["normal", "normal", "reversed"] as const) : pick(`${seed}:lv:order`, orderPool),
    cardStyle: pick(`${seed}:lv:card`, cardPool),
    shelfCount: rng.int(2, 5),
    navLinks: rng.int(3, 7),
    titleScale: pick(`${seed}:lv:title`, titlePool),
    gapScale: pick(`${seed}:lv:gap`, gapPool),
    listStyle: pickBiased(seed, "list", listPool, bias.listStyle, 0.6),
    accentStrip: rng.bool(0.18 + depthChaos * 0.54),
    mirrorLayout: rng.bool(0.12 + depthChaos * 0.52)
  };
}

export function variedCount(seed: string, min: number, max: number, density: number): number {
  const rng = createRng(`${seed}:varied-count`);
  const base = rng.int(min, max);
  return Math.max(min, Math.min(max + 4, Math.round(base * density)));
}

export function reorderByVariation<T>(seed: string, items: readonly T[], order: LayoutVariation["blockOrder"]): T[] {
  if (order === "normal" || items.length < 2) return [...items];
  if (order === "reversed") return [...items].reverse();
  const rng = createRng(`${seed}:shuffle`);
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}
