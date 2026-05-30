import { generationConfig } from "@/config/generation";
import type { GeneratedComponentContext, LinkRole, RouteState, SiteFlowState, SiteKind } from "./types";
import { entropyChance, entropyLevel } from "./entropy";
import { createRng, hashString, pick } from "./seed";

const continuityWords = new Set([
  "home",
  "index",
  "story",
  "post",
  "details",
  "thread",
  "lesson",
  "category",
  "author",
  "channel",
  "episode",
  "suite",
  "rooms",
  "directory",
  "results",
  "search"
]);

const siteKindBySection: Record<string, SiteKind> = {
  article: "blog",
  news: "blog",
  products: "store",
  offers: "store",
  auctions: "store",
  forums: "forum",
  guides: "docs",
  help: "docs",
  learn: "docs",
  watch: "streaming",
  video: "streaming",
  shorts: "streaming",
  booking: "booking",
  homes: "booking",
  search: "directory",
  maps: "directory",
  food: "directory"
};

const sectionBySiteKind: Record<SiteKind, string> = {
  blog: "article",
  store: "products",
  forum: "forums",
  docs: "guides",
  streaming: "watch",
  booking: "booking",
  directory: "search"
};

const surfaceBySiteKind: Record<SiteKind, string> = {
  blog: "personal blog",
  store: "ecommerce catalog",
  forum: "forum wiki archive",
  docs: "documentation site",
  streaming: "dead streaming platform",
  booking: "hotel booking site",
  directory: "search engine"
};

const contentBySiteKind: Record<SiteKind, string> = {
  blog: "local news",
  store: "digital commerce",
  forum: "forum wiki archive",
  docs: "software update notes",
  streaming: "video streaming",
  booking: "hotel availability",
  directory: "local map search"
};

const actionByRole: Record<LinkRole, string> = {
  home: "open directory",
  index: "open directory",
  item: "compare listings",
  related: "continue watching",
  next: "continue watching",
  category: "open directory",
  search: "open directory",
  action: "checkout",
  exit: "newsletter signup"
};

const nodeWordByKind: Record<SiteKind, Record<LinkRole, string>> = {
  blog: { home: "home", index: "author", item: "story", related: "story", next: "post", category: "category", search: "search", action: "subscribe", exit: "exit" },
  store: { home: "home", index: "catalog", item: "details", related: "details", next: "details", category: "category", search: "search", action: "checkout", exit: "exit" },
  forum: { home: "home", index: "board", item: "thread", related: "thread", next: "thread", category: "category", search: "search", action: "reply", exit: "exit" },
  docs: { home: "home", index: "index", item: "lesson", related: "lesson", next: "next", category: "category", search: "search", action: "download", exit: "exit" },
  streaming: { home: "home", index: "channel", item: "episode", related: "episode", next: "next", category: "category", search: "search", action: "watch", exit: "exit" },
  booking: { home: "home", index: "rooms", item: "suite", related: "suite", next: "availability", category: "category", search: "search", action: "reserve", exit: "exit" },
  directory: { home: "home", index: "directory", item: "result", related: "nearby", next: "next", category: "category", search: "search", action: "open", exit: "exit" }
};

const identityWords = ["quiet", "soft", "nearby", "archived", "seasonal", "familiar", "previous", "interior"];
const entityWords = ["author", "directory", "membership", "channel", "guestbook", "window", "breakfast", "thumbnail", "floor", "account"];

export function inferSiteFlow(section: string, words: string[], routeSeed: string, depth: number): SiteFlowState {
  const siteKind = inferSiteKind(section, words, routeSeed);
  const token = findSiteToken(words) ?? hashString(`${routeSeed}:site-token`).slice(0, 5);
  const siteSeed = hashString(`mini-site:${siteKind}:${token}`);
  const rng = createRng(`${siteSeed}:budget`);
  const siteBudget = rng.int(generationConfig.siteFlow.budgetMin, generationConfig.siteFlow.budgetMax);
  const hasContinuity = words.some((word) => continuityWords.has(word)) || Boolean(findSiteToken(words));
  const siteDepth = depth > 0 ? depth : hasContinuity ? createRng(`${routeSeed}:site-depth`).int(1, 3) : 0;
  const currentNode = inferCurrentNode(words, siteKind);
  const parentNode = words.includes("home") || words.includes("index") ? undefined : `${siteKind}-home`;
  const drift = entropyLevel(siteDepth);

  return {
    siteSeed,
    siteToken: token,
    siteKind,
    siteDepth,
    siteBudget,
    currentNode,
    parentNode,
    drift
  };
}

export function classifyLinkRole(ctx: GeneratedComponentContext, elementId: string, label: string): LinkRole {
  const haystack = `${elementId} ${label}`.toLowerCase();

  if (/\b(home|brand|logo|crumb-0)\b/.test(haystack)) return "home";
  if (/\b(index|all|archive|catalog|board|channel|rooms|directory|toc|nav|dept|category|cat)\b/.test(haystack)) return "index";
  if (/\b(search|query|results|images)\b/.test(haystack)) return "search";
  if (/\b(next|continue|more|further|also|related)\b/.test(haystack)) return "related";
  if (/\b(add|buy|checkout|reserve|book|download|get|signup|sign|choose|submit|reply|post)\b/.test(haystack)) return "action";
  if (/\b(exit|elsewhere|external|random|lucky)\b/.test(haystack)) return "exit";

  const genre = `${ctx.genreFormula.surface} ${ctx.genreFormula.content} ${ctx.routeState.site.siteKind}`.toLowerCase();
  if (/\b(blog|article|news|forum|thread|product|store|catalog|watch|video|lesson|docs|booking|suite)\b/.test(`${haystack} ${genre}`)) {
    return "item";
  }

  return "related";
}

export function siteIdentity(site: SiteFlowState) {
  const first = pick(`${site.siteSeed}:identity:first`, identityWords);
  const second = pick(`${site.siteSeed}:identity:second`, entityWords);
  const labelByKind: Record<SiteKind, string> = {
    blog: `${first} ${second} review`,
    store: `${first} ${second} market`,
    forum: `${first} ${second} board`,
    docs: `${first} ${second} manual`,
    streaming: `${first} ${second} channel`,
    booking: `${first} ${second} rooms`,
    directory: `${first} ${second} index`
  };
  return labelByKind[site.siteKind];
}

export function makeSiteHref(ctx: GeneratedComponentContext, role: LinkRole, elementId: string, label: string): string | undefined {
  const site = ctx.routeState.site;
  const rng = createRng(`${ctx.componentSeed}:site-link:${elementId}:${label}`);
  const expired = site.siteDepth >= site.siteBudget;
  const entropy = entropyLevel(ctx.depth);
  const looseClick = role !== "home" && role !== "index" && role !== "search";
  const shouldUseFreeRoute = looseClick && rng.bool(entropyChance(ctx.depth, 0.02, 0.42));

  if (shouldUseFreeRoute) {
    return undefined;
  }

  const shouldExit = role === "exit" || (expired && rng.bool(0.24 + entropy * 0.5)) || rng.bool(generationConfig.siteFlow.exitChance + entropy * 0.12);

  if (shouldExit) {
    return makeExitHref(ctx, elementId, label);
  }

  const stayChance = Math.max(0.28, generationConfig.siteFlow.inSiteChance - entropy * 0.38);
  const shouldStay = !expired && (role === "home" || role === "index" || rng.bool(stayChance));
  if (!shouldStay && rng.bool(generationConfig.siteFlow.driftChance + entropy * 0.34)) {
    return makeDriftHref(ctx, role, elementId, label);
  }

  return makeInSiteHref(ctx, role, elementId, label);
}

export function nextRouteStateForSiteLink(ctx: GeneratedComponentContext, role: LinkRole, elementId: string, label: string): RouteState {
  const site = ctx.routeState.site;
  const seed = hashString(`${site.siteSeed}:${role}:${elementId}:${label}:${site.siteDepth + 1}`);
  const section = sectionBySiteKind[site.siteKind];
  const nodeWord = nodeWordByKind[site.siteKind][role];

  return {
    ...ctx.routeState,
    seed,
    depth: role === "home" ? Math.max(1, site.siteDepth) : site.siteDepth + 1,
    routeSection: section,
    surfaceGenre: surfaceBySiteKind[site.siteKind],
    contentGenre: contentBySiteKind[site.siteKind],
    actionGenre: actionByRole[role],
    residueGenre: ctx.genreFormula.residue,
    motifs: [slugPart(label), nodeWord, ...ctx.motifs].filter(Boolean).slice(0, 5),
    searchQuery: role === "search" ? label : undefined,
    site: {
      ...site,
      siteDepth: role === "home" ? 1 : site.siteDepth + 1,
      currentNode: `${role}:${slugPart(label || elementId)}`,
      parentNode: role === "home" ? undefined : site.currentNode,
      drift: entropyLevel(role === "home" ? 1 : site.siteDepth + 1)
    }
  };
}

function makeInSiteHref(ctx: GeneratedComponentContext, role: LinkRole, elementId: string, label: string) {
  const state = nextRouteStateForSiteLink(ctx, role, elementId, label);
  const site = state.site;
  const identity = slugPart(siteIdentity(site));
  const item = slugPart(label || elementId);
  const nodeWord = nodeWordByKind[site.siteKind][role];
  const depth = Math.max(1, site.siteDepth);
  const section = sectionBySiteKind[site.siteKind];

  if (role === "home") return `/${section}/${identity}-home-${depth}-${site.siteToken}`;
  if (role === "index") return `/${section}/${identity}-${nodeWord}-${depth}-${site.siteToken}`;
  if (role === "search") return `/search/${identity}-results-for-${item}-${depth}-${site.siteToken}`;

  return `/${section}/${identity}-${item}-${nodeWord}-${depth}-${site.siteToken}`;
}

function makeDriftHref(ctx: GeneratedComponentContext, role: LinkRole, elementId: string, label: string) {
  const driftKind = pick(`${ctx.routeState.site.siteSeed}:drift:${role}:${elementId}`, siteKindsExcept(ctx.routeState.site.siteKind));
  const token = hashString(`${ctx.routeState.site.siteSeed}:drift:${elementId}:${label}`).slice(0, 5);
  const section = sectionBySiteKind[driftKind];
  const identity = `${pick(`${token}:drift-adj`, identityWords)}-${pick(`${token}:drift-noun`, entityWords)}`;
  const item = slugPart(label || elementId);
  return `/${section}/${identity}-${item}-${nodeWordByKind[driftKind].related}-1-${token}`;
}

function makeExitHref(ctx: GeneratedComponentContext, elementId: string, label: string) {
  const seed = hashString(`${ctx.pageSeed}:hard-exit:${elementId}:${label}`);
  const exitKind = pick(`${seed}:exit-kind`, siteKinds);
  const section = sectionBySiteKind[exitKind];
  const identity = `${pick(`${seed}:exit-adj`, identityWords)}-${pick(`${seed}:exit-noun`, entityWords)}`;
  return `/${section}/${identity}-${slugPart(label || elementId)}-exit-1-${seed.slice(0, 5)}`;
}

function inferSiteKind(section: string, words: string[], routeSeed: string): SiteKind {
  if (siteKindBySection[section]) return siteKindBySection[section];
  if (words.some((word) => ["post", "story", "author", "article", "headline"].includes(word))) return "blog";
  if (words.some((word) => ["cart", "checkout", "product", "details", "catalog"].includes(word))) return "store";
  if (words.some((word) => ["thread", "board", "reply"].includes(word))) return "forum";
  if (words.some((word) => ["lesson", "manual", "docs", "download"].includes(word))) return "docs";
  if (words.some((word) => ["watch", "episode", "channel", "video"].includes(word))) return "streaming";
  if (words.some((word) => ["booking", "suite", "rooms", "availability"].includes(word))) return "booking";
  return pick(`${routeSeed}:site-kind`, siteKinds);
}

function inferCurrentNode(words: string[], siteKind: SiteKind) {
  const marker = words.find((word) => continuityWords.has(word));
  const tokenIndex = words.findIndex((word) => word === marker);
  if (marker && tokenIndex > 0) return `${marker}:${words[tokenIndex - 1]}`;
  return `${siteKind}:${words.slice(0, 4).join("-") || "home"}`;
}

function findSiteToken(words: string[]) {
  for (let index = words.length - 1; index >= 0; index -= 1) {
    if (/^[a-f0-9]{5}$/.test(words[index])) return words[index];
  }

  return undefined;
}

const siteKinds: SiteKind[] = ["blog", "store", "forum", "docs", "streaming", "booking", "directory"];

function siteKindsExcept(kind: SiteKind) {
  return siteKinds.filter((candidate) => candidate !== kind);
}

function slugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "nearby";
}
