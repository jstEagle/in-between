import type { BlockPacket, LayoutComposition, RouteState, SiteKind } from "./types";
import { entropyLevel } from "./entropy";
import { createRng, pick } from "./seed";
import { layoutPolicies } from "./generationRegistry";

const baseBlocks: BlockPacket["type"][] = ["productGrid", "newsPortal", "blogArticle", "directory", "form", "ad", "realData", "dashboard"];
const primaryBlocksBySiteKind: Record<SiteKind, BlockPacket["type"][]> = {
  blog: ["blogArticle", "blogArticle", "newsPortal", "directory", "realData", "form"],
  store: ["productGrid", "productGrid", "directory", "form", "ad", "dashboard", "realData"],
  forum: ["directory", "blogArticle", "form", "newsPortal", "ad", "realData"],
  docs: ["blogArticle", "directory", "dashboard", "form", "realData"],
  streaming: ["newsPortal", "directory", "productGrid", "ad", "realData", "realData"],
  booking: ["form", "productGrid", "newsPortal", "directory", "realData"],
  directory: ["directory", "directory", "newsPortal", "productGrid", "realData", "ad"]
};

const intrusionBlocksBySiteKind: Record<SiteKind, BlockPacket["type"][]> = {
  blog: ["productGrid", "dashboard", "ad"],
  store: ["newsPortal", "realData", "blogArticle"],
  forum: ["productGrid", "dashboard", "realData"],
  docs: ["productGrid", "newsPortal", "ad"],
  streaming: ["form", "dashboard", "productGrid"],
  booking: ["dashboard", "newsPortal", "ad"],
  directory: ["form", "dashboard", "blogArticle"]
};

const blockPatternsBySiteKind: Record<SiteKind, BlockPacket["type"][][]> = {
  blog: [
    ["blogArticle", "newsPortal", "realData", "directory", "ad"],
    ["newsPortal", "blogArticle", "productGrid", "form", "realData"],
    ["blogArticle", "directory", "dashboard", "realData", "ad"]
  ],
  store: [
    ["productGrid", "directory", "form", "newsPortal", "realData"],
    ["productGrid", "ad", "dashboard", "blogArticle", "directory"],
    ["form", "productGrid", "newsPortal", "realData", "ad"]
  ],
  forum: [
    ["directory", "blogArticle", "newsPortal", "form", "realData"],
    ["blogArticle", "directory", "dashboard", "ad", "productGrid"],
    ["directory", "form", "realData", "newsPortal", "blogArticle"]
  ],
  docs: [
    ["blogArticle", "directory", "dashboard", "realData", "form"],
    ["directory", "blogArticle", "newsPortal", "ad", "realData"],
    ["dashboard", "form", "blogArticle", "productGrid", "realData"]
  ],
  streaming: [
    ["newsPortal", "productGrid", "realData", "directory", "ad"],
    ["productGrid", "newsPortal", "form", "dashboard", "realData"],
    ["realData", "directory", "productGrid", "blogArticle", "ad"]
  ],
  booking: [
    ["form", "productGrid", "newsPortal", "realData", "directory"],
    ["productGrid", "form", "dashboard", "ad", "blogArticle"],
    ["newsPortal", "form", "realData", "directory", "productGrid"]
  ],
  directory: [
    ["directory", "newsPortal", "realData", "productGrid", "form"],
    ["directory", "dashboard", "blogArticle", "ad", "realData"],
    ["newsPortal", "directory", "productGrid", "realData", "form"]
  ]
};
const realDataSections = new Set(["article", "watch", "video", "shorts", "guides", "learn", "food", "maps", "weather"]);

export function buildComponentList(routeState: RouteState, composition?: LayoutComposition): BlockPacket[] {
  const rng = createRng(`${routeState.seed}:blocks`);
  const drift = Math.max(routeState.site.drift, entropyLevel(routeState.depth));
  const count = rng.int(3, routeState.depth > 34 ? 9 : routeState.depth > 18 ? 8 : routeState.depth > 10 ? 7 : 5);
  const middle = chooseFocusedBlocks(routeState, count);
  const blocks: BlockPacket[] = [
    { type: "hero", id: "hero-memory" },
    ...middle.map((type, index) => ({ type, id: `${type}-${index}` }) satisfies BlockPacket)
  ];

  if (composition?.secondary && composition.intensity > 0.38) {
    const policy = layoutPolicies[composition.secondary];
    const intrusionType = policy?.preferredIntrusions.length
      ? pick(`${routeState.seed}:secondary-intrusion:${composition.secondary}`, policy.preferredIntrusions)
      : undefined;

    if (intrusionType && rng.bool(0.12 + drift * 0.62)) {
      blocks.splice(rng.int(2, Math.max(2, blocks.length - 1)), 0, {
        type: intrusionType,
        id: `${intrusionType}-from-${composition.secondary}`
      } satisfies BlockPacket);
    }
  }

  if (routeState.depth > 18 && rng.bool(0.12 + drift * 0.32)) {
    blocks.splice(rng.int(2, Math.max(2, blocks.length - 1)), 0, { type: "directory", id: "duplicate-directory" });
  }

  const shouldEmbedRealData =
    realDataSections.has(routeState.routeSection) ||
    /\b(book|library|radio|station|recipe|weather|article|watch|video|wiki)\b/i.test(routeState.motifs.join(" ")) ||
    rng.bool(0.18 + drift * 0.34);

  if (shouldEmbedRealData && !blocks.some((block) => block.type === "realData")) {
    blocks.splice(rng.int(1, Math.max(2, blocks.length - 1)), 0, { type: "realData", id: "real-data-content" });
  }

  blocks.push({ type: "footer", id: "footer-from-elsewhere" });
  return blocks;
}

function chooseFocusedBlocks(routeState: RouteState, count: number): BlockPacket["type"][] {
  const rng = createRng(`${routeState.seed}:blocks:focused`);
  const primaryPool = primaryBlocksBySiteKind[routeState.site.siteKind] ?? baseBlocks;
  const intrusionPool = intrusionBlocksBySiteKind[routeState.site.siteKind] ?? baseBlocks;
  const patternPool = blockPatternsBySiteKind[routeState.site.siteKind] ?? [baseBlocks];
  const pattern = pick(`${routeState.seed}:blocks:pattern:${routeState.site.siteKind}`, patternPool);
  const entropy = Math.max(routeState.site.drift, entropyLevel(routeState.depth));
  const intrusionLimit = entropy > 0.75 ? 3 : entropy > 0.42 ? 2 : entropy > 0 ? 1 : 0;
  const blocks: BlockPacket["type"][] = pattern.slice(0, count);
  let intrusions = 0;

  for (let index = 0; index < count; index += 1) {
    const canIntrude = intrusions < intrusionLimit && index > 1;
    const useIntrusion = canIntrude && rng.bool(0.08 + entropy * 0.56);
    const pool = useIntrusion ? intrusionPool : primaryPool;
    if (!blocks[index] || useIntrusion || rng.bool(0.18)) {
      blocks[index] = pick(`${routeState.seed}:blocks:focused:${index}:${useIntrusion ? "intrusion" : "primary"}`, pool);
    }
    if (useIntrusion) intrusions += 1;
  }

  while (blocks.length < count) {
    const index = blocks.length;
    blocks.push(pick(`${routeState.seed}:blocks:tail:${index}`, primaryPool));
  }

  return blocks.slice(0, count);
}
