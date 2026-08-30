import { linkGenerationConfig } from "@/config/generation";
import { supportedLanguages } from "@/content/i18n";
import type { GeneratedComponentContext, LinkPacket, LinkRole, RouteState } from "./types";
import { decodeRoute, encodeRoute, genreBySection, sectionForSurface } from "./routeCodec";
import { entropyChance } from "./entropy";
import { createRng, hashString, pick } from "./seed";
import { localizedPhrase } from "./textEngine";
import { classifyLinkRole, makeSiteHref, siteIdentity } from "./siteEngine";

const linkSurfaceGenres = Object.values(genreBySection);
const randomLocalizedLinkRate = 0.18;
const linkContentGenres = [
  "automotive listings",
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

const destinationTopics = linkGenerationConfig.destinationTopics;
const genericActionLabels = new Set<string>(linkGenerationConfig.genericActionLabels);

export function makeLink(ctx: GeneratedComponentContext, elementId: string, label?: string): LinkPacket {
  const nextSeed = hashString(`${ctx.pageSeed}:${elementId}:${label ?? ""}`);
  const role = label ? classifyLinkRole(ctx, elementId, label) : defaultGeneratedRole(elementId);
  const routeLabel = label ?? elementId;
  const siteHref = makeSiteHref(ctx, role, elementId, routeLabel);
  const plannedState = siteHref ? decodeRoute(siteHref) : exploratoryRouteState(ctx, role, elementId, label, nextSeed);
  const href = siteHref ?? encodeRoute(plannedState);
  const state = decodeRoute(href);
  const destination = destinationPreview(state);
  const finalLabel = shouldUseDestinationLabel(label) ? destinationLabel(ctx, state, role, elementId) : label ?? destinationLabel(ctx, state, role, elementId);

  return {
    id: elementId,
    label: finalLabel,
    hoverLabel: `Opens ${destination.contentGenre} on ${destination.siteIdentity}`,
    href,
    destination
  };
}

function exploratoryRouteState(ctx: GeneratedComponentContext, role: LinkRole, elementId: string, label: string | undefined, nextSeed: string): RouteState {
  const topic = pick(`${nextSeed}:topic`, destinationTopics);
  const surfaceGenre = topic.surface ?? pick(`${nextSeed}:surface`, [
    ctx.genreFormula.content,
    ctx.genreFormula.residue,
    ...linkSurfaceGenres
  ]);

  return {
    ...ctx.routeState,
    seed: nextSeed,
    depth: ctx.depth + 1,
    routeSection: topic.section ?? sectionForSurface(surfaceGenre),
    surfaceGenre,
    contentGenre: topic.content ?? pick(`${nextSeed}:content`, [
      ctx.genreFormula.surface,
      ctx.genreFormula.content,
      ...linkContentGenres
    ]),
    actionGenre: actionForRole(role, topic.action),
    residueGenre: topic.residue,
    motifs: [slugWords(label)[0] ?? pick(`${nextSeed}:label`, topic.labels), ...ctx.motifs].filter(Boolean).slice(0, 4),
    languageHint: randomLinkLanguage(nextSeed, ctx.depth)
  };
}

function destinationPreview(state: RouteState): LinkPacket["destination"] {
  return {
    routeSection: state.routeSection,
    surfaceGenre: state.surfaceGenre,
    contentGenre: state.contentGenre,
    actionGenre: state.actionGenre,
    siteKind: state.site.siteKind,
    siteIdentity: siteIdentity(state.site)
  };
}

function destinationLabel(ctx: GeneratedComponentContext, state: RouteState, role: LinkRole, elementId: string) {
  const seed = `${state.seed}:destination-label:${elementId}:${role}`;
  const topic = topicLabel(state, seed);
  const indexNoun = nounForSection(state.routeSection);

  switch (role) {
    case "home":
      return state.site.siteDepth > 0 ? siteIdentity(state.site) : "Home";
    case "index":
    case "category":
      return titleCase(topic.includes(indexNoun) ? topic : `${topic} ${indexNoun}`);
    case "search":
      return titleCase(`search ${topic}`);
    case "action":
      return titleCase(`${actionVerb(state.actionGenre, seed)} ${topic}`);
    case "next":
    case "related":
      return titleCase(`${relatedVerb(seed)} ${topic}`);
    case "exit":
      return titleCase(`elsewhere: ${topic}`);
    default:
      return titleCase(topic || localizedPhrase(ctx, `${ctx.componentSeed}:link:${elementId}`));
  }
}

function topicLabel(state: RouteState, seed: string) {
  const matchingTopic = destinationTopics.find((topic) => topic.content === state.contentGenre);
  if (matchingTopic) return pick(`${seed}:matching-topic`, [...matchingTopic.labels]);

  const motif = state.motifs.find(Boolean);
  const content = state.contentGenre.replace(/\b(feed|portal|site|dashboard|catalog)\b/g, "").trim();
  return content || motif || state.surfaceGenre;
}

function defaultGeneratedRole(elementId: string): LinkRole {
  const index = trailingIndex(elementId);
  if (/\b(nav|local-nav|navitem)\b/.test(elementId)) {
    return pickByIndex(index, ["home", "index", "category", "item", "search", "related", "action"]);
  }
  if (/\b(footer|further|related|also|near|brief)\b/.test(elementId)) {
    return pickByIndex(index, ["related", "item", "category", "search"]);
  }
  if (/\b(department|dept|cat|category|chip|board|toc|sf|side)\b/.test(elementId)) return "category";
  if (/\b(search|results|query|images)\b/.test(elementId)) return "search";
  if (/\b(submit|buy|book|reserve|checkout|download|get|apply|bid|upload|post|reply|sign|cta)\b/.test(elementId)) return "action";
  return pickByIndex(index, ["related", "item", "category", "next"]);
}

function shouldUseDestinationLabel(label: string | undefined) {
  if (!label) return true;
  return genericActionLabels.has(label.trim().toLowerCase());
}

function actionForRole(role: LinkRole, fallback: string) {
  if (role === "search" || role === "index" || role === "category") return "open directory";
  if (role === "related" || role === "next") return "continue watching";
  if (role === "action") return fallback;
  return fallback;
}

function nounForSection(section: string) {
  if (section === "booking") return "availability";
  if (section === "products") return "catalog";
  if (section === "forums") return "board";
  if (section === "guides" || section === "help") return "guide";
  if (section === "watch" || section === "video") return "channel";
  if (section === "maps" || section === "search") return "directory";
  return "index";
}

function actionVerb(action: string, seed: string) {
  if (action.includes("booking")) return "reserve";
  if (action.includes("download")) return "download";
  if (action.includes("checkout")) return "choose";
  if (action.includes("save")) return "save";
  return pick(`${seed}:verb`, ["open", "compare", "choose", "view"]);
}

function relatedVerb(seed: string) {
  return pick(`${seed}:related`, ["more", "related", "next", "nearby"]);
}

function trailingIndex(value: string) {
  const match = value.match(/(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function pickByIndex<T>(index: number, values: T[]) {
  return values[index % values.length];
}

function slugWords(value: string | undefined) {
  return value?.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean) ?? [];
}

function titleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function randomLinkLanguage(seed: string, depth: number) {
  const rng = createRng(`${seed}:link-language`);
  if (!rng.bool(entropyChance(depth, 0.04, randomLocalizedLinkRate + 0.28))) return undefined;
  return pick(`${seed}:link-language:choice`, supportedLanguages.filter((language) => language !== "English"));
}

export function makeLinks(ctx: GeneratedComponentContext, count: number, prefix: string) {
  return Array.from({ length: count }, (_, index) => makeLink(ctx, `${prefix}-${index}`));
}
