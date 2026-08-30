import type { RouteState } from "./types";
import { createRng, hashString, pick, pickMany } from "./seed";
import { readableSearchQuery } from "./searchQuery";
import { inferSiteFlow } from "./siteEngine";

export const routeSections = [
  "products",
  "news",
  "video",
  "watch",
  "account",
  "guides",
  "games",
  "search",
  "booking",
  "help",
  "download",
  "article",
  "offers",
  "social",
  "shorts",
  "finance",
  "learn",
  "health",
  "jobs",
  "maps",
  "forums",
  "food",
  "homes",
  "creators",
  "weather",
  "auctions"
] as const;
const commerceNouns = ["checkout", "cart", "subscription", "bundle", "listing", "offer", "sample", "membership"] as const;
const mediaNouns = ["video", "episode", "preview", "playlist", "channel", "trailer", "feature", "stream", "streaming", "short"] as const;
const hotelNouns = ["suite", "guest", "booking", "breakfast", "availability", "stay"] as const;
const newsNouns = ["update", "index", "report", "bulletin", "headline", "digest"] as const;
const interfaceNouns = ["tab", "widget", "sidebar", "modal", "thumbnail", "profile", "feed"] as const;
const adjectives = ["quiet", "standard", "familiar", "nearby", "official", "seasonal", "previous", "available", "interior", "soft"] as const;
const timeFragments = ["today", "yesterday", "later", "archived", "current", "nightly", "morning"] as const;
const verbs = ["continue", "compare", "reserve", "download", "return", "open", "watch", "confirm", "locate"] as const;
const motifs = ["breakfast", "thumbnail", "checkout", "autoplay", "guestbook", "sidebar", "window", "directory", "floor", "membership"] as const;
const languageAliases: Record<string, string> = {
  english: "English",
  japanese: "Japanese",
  ja: "Japanese",
  korean: "Korean",
  ko: "Korean",
  chinese: "Simplified Chinese",
  simplified: "Simplified Chinese",
  mandarin: "Simplified Chinese",
  zh: "Simplified Chinese",
  arabic: "Arabic",
  ar: "Arabic",
  hindi: "Hindi",
  hi: "Hindi",
  german: "German",
  de: "German",
  french: "French",
  fr: "French",
  spanish: "Spanish",
  es: "Spanish",
  italian: "Italian",
  it: "Italian",
  portuguese: "Portuguese",
  pt: "Portuguese",
  dutch: "Dutch",
  nl: "Dutch",
  swedish: "Swedish",
  sv: "Swedish",
  polish: "Polish",
  pl: "Polish",
  turkish: "Turkish",
  tr: "Turkish",
  greek: "Greek",
  el: "Greek",
  russian: "Russian",
  ru: "Russian",
  ukrainian: "Ukrainian",
  uk: "Ukrainian",
  indonesian: "Indonesian",
  id: "Indonesian",
  vietnamese: "Vietnamese",
  vi: "Vietnamese",
  thai: "Thai",
  th: "Thai"
};

export const genreBySection: Record<string, string> = {
  products: "ecommerce catalog",
  news: "news portal",
  video: "dead streaming platform",
  watch: "dead streaming platform",
  account: "SaaS dashboard",
  guides: "documentation site",
  games: "kids' game portal",
  search: "search engine",
  booking: "hotel booking site",
  help: "product manual",
  download: "fake app store listing",
  article: "personal blog",
  offers: "events directory",
  social: "social network feed",
  shorts: "short video platform",
  finance: "finance dashboard",
  learn: "online course portal",
  health: "wellness appointment portal",
  jobs: "job board",
  maps: "local map directory",
  forums: "forum wiki archive",
  food: "restaurant delivery portal",
  homes: "real estate listing",
  creators: "creator tools dashboard",
  weather: "weather environment dashboard",
  auctions: "classified auction site"
};

const sectionBySurfaceKeyword: { match: string; section: (typeof routeSections)[number] }[] = [
  { match: "ecommerce", section: "products" },
  { match: "catalog", section: "products" },
  { match: "news", section: "news" },
  { match: "stream", section: "watch" },
  { match: "video", section: "video" },
  { match: "saas", section: "account" },
  { match: "dashboard", section: "account" },
  { match: "documentation", section: "guides" },
  { match: "manual", section: "help" },
  { match: "game", section: "games" },
  { match: "search", section: "search" },
  { match: "booking", section: "booking" },
  { match: "hotel", section: "booking" },
  { match: "app store", section: "download" },
  { match: "blog", section: "article" },
  { match: "event", section: "offers" },
  { match: "social", section: "social" },
  { match: "short video", section: "shorts" },
  { match: "finance", section: "finance" },
  { match: "course", section: "learn" },
  { match: "wellness", section: "health" },
  { match: "job", section: "jobs" },
  { match: "map", section: "maps" },
  { match: "forum", section: "forums" },
  { match: "restaurant", section: "food" },
  { match: "real estate", section: "homes" },
  { match: "creator", section: "creators" },
  { match: "weather", section: "weather" },
  { match: "auction", section: "auctions" },
  { match: "classified", section: "auctions" }
];

const contentHints = [...commerceNouns, ...mediaNouns, ...hotelNouns, ...newsNouns, ...interfaceNouns];

export function encodeRoute(state: RouteState): string {
  const rng = createRng(state.seed);
  const section = routeSections.includes(state.routeSection as (typeof routeSections)[number])
    ? state.routeSection
    : sectionForSurface(state.surfaceGenre);
  const adjective = slugPart(pick(`${state.seed}:adj`, adjectives));
  const content = slugPart(pick(`${state.seed}:content:${state.contentGenre}`, contentHints));
  const action = slugPart(pick(`${state.seed}:action:${state.actionGenre}`, [...commerceNouns, ...verbs]));
  const residue = slugPart(pick(`${state.seed}:residue:${state.residueGenre}`, [...newsNouns, ...interfaceNouns, ...timeFragments]));
  const motif = slugPart(state.motifs[0] ?? pick(`${state.seed}:motif`, motifs));
  const number = Math.max(1, state.depth);
  const language = state.languageHint ? `${languageSlug(state.languageHint)}-` : "";

  const grammar = rng.int(0, 5);
  const slug =
    grammar === 0
      ? `${language}${content}`
      : grammar === 1
        ? `${language}${adjective}-${content}`
        : grammar === 2
          ? `${language}${content}-${number}`
          : grammar === 3
            ? `${language}${pick(`${state.seed}:verb`, verbs)}-${content}`
            : grammar === 4
              ? `${language}${content}-with-${motif}`
              : `${language}${content}-after-${residue}`;

  return `/${section}/${slug}`;
}

export function decodeRoute(path: string): RouteState {
  const normalized = path.replace(/^\/+|\/+$/g, "").toLowerCase();
  const [section = "products", ...rest] = normalized.split("/");
  const slug = rest.join("-") || "quiet-membership-checkout";
  const words = slug.split(/[-_]+/).filter(Boolean);
  const seed = hashString(normalized || "in-between-space/home");
  const depthNumber = words.map((word) => Number.parseInt(word, 10)).find((value) => Number.isFinite(value));
  const depth = depthNumber ?? (normalized ? createRng(seed).int(0, 8) : 0);
  const surfaceGenre = genreBySection[section] ?? pick(`${seed}:surface`, Object.values(genreBySection));
  const contentGenre = inferGenre(words, seed, "content");
  const actionGenre = inferAction(words, seed);
  const residueGenre = inferResidue(words, seed);
  const routeMotifs = pickMany(`${seed}:motifs`, [...new Set([...words, ...motifs])], 4);
  const site = inferSiteFlow(section, words, seed, depth);

  return {
    seed,
    depth,
    routeSection: section,
    surfaceGenre,
    contentGenre,
    actionGenre,
    residueGenre,
    motifs: routeMotifs,
    languageHint: inferLanguage(words),
    searchQuery: section === "search" ? readableSearchQuery(words) : undefined,
    site
  };
}

export function sectionForSurface(surface: string) {
  const normalized = surface.toLowerCase();
  return sectionBySurfaceKeyword.find((entry) => normalized.includes(entry.match))?.section ?? "products";
}

function inferGenre(words: string[], seed: string, salt: string) {
  if (words.some((word) => ["car", "cars", "auto", "autos", "vehicle", "vehicles", "garage", "dealer", "van", "vans"].includes(word))) return "automotive listings";
  if (words.some((word) => hotelNouns.includes(word as (typeof hotelNouns)[number]) || ["room", "rooms"].includes(word))) return "hotel availability";
  if (words.some((word) => mediaNouns.includes(word as (typeof mediaNouns)[number]))) return "video streaming";
  if (words.some((word) => newsNouns.includes(word as (typeof newsNouns)[number]))) return "local news";
  if (words.some((word) => ["project", "projects", "asset", "assets", "template", "templates", "upload", "export", "studio"].includes(word))) return "creator asset gallery";
  if (words.some((word) => ["analytics", "metric", "metrics", "chart", "dashboard", "reporting"].includes(word))) return "analytics dashboard";
  if (words.some((word) => ["lesson", "course", "courses", "learn", "module", "training"].includes(word))) return "course catalog";
  if (words.some((word) => ["restaurant", "restaurants", "menu", "menus", "dinner", "cafe", "cafes", "delivery"].includes(word))) return "restaurant menu";
  if (words.some((word) => ["home", "homes", "rental", "rentals", "apartment", "apartments", "floor", "floors"].includes(word))) return "real estate listings";
  if (words.some((word) => ["weather", "forecast", "radar", "rain", "wind", "coastal", "alert", "alerts"].includes(word))) return "weather alert feed";
  if (words.some((word) => ["map", "maps", "route", "routes", "place", "places", "nearby", "local"].includes(word))) return "local map search";
  if (words.some((word) => ["job", "jobs", "apply", "company", "salary", "hiring"].includes(word))) return "job board";
  if (words.some((word) => ["clinic", "clinics", "health", "wellness", "appointment", "appointments"].includes(word))) return "wellness appointment portal";
  if (words.some((word) => ["auction", "auctions", "bid", "lot", "lots"].includes(word))) return "auction lots";
  if (words.some((word) => ["thread", "threads", "forum", "forums", "board", "wiki", "reply"].includes(word))) return "forum wiki archive";
  if (words.some((word) => commerceNouns.includes(word as (typeof commerceNouns)[number]) || ["catalog", "pricing", "price", "plan", "plans", "tier", "tiers", "shop"].includes(word))) return "digital commerce";
  return pick(`${seed}:${salt}`, [
    "real estate blog",
    "municipal announcements",
    "furniture catalog",
    "software update notes",
    "travel guide",
    "recipe introduction",
    "social profile feed",
    "short video recommendations",
    "finance watchlist",
    "course catalog",
    "restaurant menu",
    "local map search"
  ]);
}

function inferAction(words: string[], seed: string) {
  if (words.includes("checkout") || words.includes("cart") || words.includes("offer")) return "checkout";
  if (words.includes("booking") || words.includes("guest") || words.includes("stay")) return "booking";
  if (words.includes("download")) return "download software";
  if (words.includes("watch") || words.includes("episode")) return "continue watching";
  return pick(`${seed}:actionGenre`, ["newsletter signup", "guest account", "compare listings", "reserve membership", "open directory"]);
}

function inferResidue(words: string[], seed: string) {
  if (words.includes("archived") || words.includes("guestbook")) return "Web 1.0 travel directory";
  if (words.includes("thumbnail") || words.includes("sidebar")) return "overfilled 2000s portal";
  if (words.includes("current") || words.includes("headline")) return "stale news homepage";
  return pick(`${seed}:residueGenre`, ["kids 2006", "public directory", "abandoned SaaS", "old portal", "mobile app mirror"]);
}

function inferLanguage(words: string[]) {
  const explicit = words.map((word) => languageAliases[word]).find(Boolean);
  if (explicit) return explicit;
  return undefined;
}

export const routeWordBanks = {
  routeSections,
  commerceNouns,
  mediaNouns,
  hotelNouns,
  newsNouns,
  interfaceNouns,
  adjectives,
  timeFragments,
  verbs,
  motifs
};

function slugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function languageSlug(language: string) {
  return (
    Object.entries(languageAliases).find(([, name]) => name === language)?.[0] ??
    language
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}
