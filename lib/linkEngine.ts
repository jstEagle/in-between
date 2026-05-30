import { supportedLanguages } from "@/content/i18n";
import type { GeneratedComponentContext, LinkPacket, RouteState } from "./types";
import { encodeRoute, genreBySection, sectionForSurface } from "./routeCodec";
import { entropyChance } from "./entropy";
import { createRng, hashString, pick } from "./seed";
import { localizedPhrase } from "./textEngine";
import { classifyLinkRole, makeSiteHref } from "./siteEngine";

const linkSurfaceGenres = Object.values(genreBySection);
const randomLocalizedLinkRate = 0.18;
const linkContentGenres = [
  "hotel availability",
  "municipal announcements",
  "software update notes",
  "social profile feed",
  "short video recommendations",
  "finance watchlist",
  "restaurant menu",
  "course catalog",
  "wellness appointment portal",
  "job board",
  "local map search",
  "forum wiki archive",
  "real estate listings",
  "creator asset gallery",
  "weather alert feed",
  "auction lots"
];

export function makeLink(ctx: GeneratedComponentContext, elementId: string, label?: string): LinkPacket {
  const nextSeed = hashString(`${ctx.pageSeed}:${elementId}:${label ?? ""}`);
  const finalLabel = label ?? localizedPhrase(ctx, `${ctx.componentSeed}:link:${elementId}`);
  const role = classifyLinkRole(ctx, elementId, finalLabel);
  const siteHref = makeSiteHref(ctx, role, elementId, finalLabel);
  const surfaceGenre = pick(`${nextSeed}:surface`, [
    ctx.genreFormula.content,
    ctx.genreFormula.residue,
    ...linkSurfaceGenres
  ]);
  const state: RouteState = {
    ...ctx.routeState,
    seed: nextSeed,
    depth: ctx.depth + 1,
    routeSection: sectionForSurface(surfaceGenre),
    surfaceGenre,
    contentGenre: pick(`${nextSeed}:content`, [
      ctx.genreFormula.surface,
      ctx.genreFormula.content,
      ...linkContentGenres
    ]),
    actionGenre: pick(`${nextSeed}:action`, ["checkout", "booking", "newsletter signup", "download software", "continue watching", "open directory", "follow profile", "save listing"]),
    residueGenre: pick(`${nextSeed}:residue`, ["old portal", "kids 2006", "public directory", "stale news homepage", "abandoned SaaS", "forgotten social graph", "vertical video mirror"]),
    motifs: [pick(`${nextSeed}:motif`, ctx.motifs), ...ctx.motifs].slice(0, 4),
    languageHint: randomLinkLanguage(nextSeed, ctx.depth)
  };

  return {
    id: elementId,
    label: finalLabel,
    hoverLabel: localizedPhrase(ctx, `${ctx.componentSeed}:hover:${elementId}`),
    href: siteHref ?? encodeRoute(state)
  };
}

function randomLinkLanguage(seed: string, depth: number) {
  const rng = createRng(`${seed}:link-language`);
  if (!rng.bool(entropyChance(depth, 0.04, randomLocalizedLinkRate + 0.28))) return undefined;
  return pick(`${seed}:link-language:choice`, supportedLanguages.filter((language) => language !== "English"));
}

export function makeLinks(ctx: GeneratedComponentContext, count: number, prefix: string) {
  return Array.from({ length: count }, (_, index) => makeLink(ctx, `${prefix}-${index}`));
}
