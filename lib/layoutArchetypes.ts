import type { GenreFormula, LayoutArchetype } from "./types";
import { pick } from "./seed";

export const layoutArchetypes: LayoutArchetype[] = [
  "mixed",
  "streaming",
  "minimal-blog",
  "store",
  "portal-2000",
  "search",
  "news",
  "dashboard",
  "landing",
  "booking",
  "forum",
  "directory",
  "game",
  "app-store",
  "events",
  "product",
  "docs",
  "manual",
  "link-in-bio",
  "guestbook",
  "social-feed",
  "short-video",
  "finance",
  "education",
  "health",
  "jobs",
  "maps",
  "food",
  "real-estate",
  "creator",
  "weather",
  "auctions",
  "music",
  "chat"
];

// Surface genre nudges which layout is most likely, but a page often resolves
// into a *different* archetype than its genre suggests — that mismatch is the
// uncanny engine. A "video streaming" surface can render as a calm blog whose
// every post is a hotel booking.
const preferenceBySurfaceKeyword: { match: string; layouts: LayoutArchetype[] }[] = [
  { match: "stream", layouts: ["streaming", "product"] },
  { match: "video", layouts: ["streaming"] },
  { match: "music", layouts: ["music", "streaming"] },
  { match: "audio", layouts: ["music", "streaming"] },
  { match: "playlist", layouts: ["music", "streaming"] },
  { match: "radio", layouts: ["music", "streaming"] },
  { match: "podcast", layouts: ["music", "creator"] },
  { match: "chat", layouts: ["chat", "social-feed"] },
  { match: "assistant", layouts: ["chat", "dashboard"] },
  { match: "intelligence", layouts: ["chat", "dashboard"] },
  { match: "ecommerce", layouts: ["store", "product"] },
  { match: "catalog", layouts: ["store", "directory"] },
  { match: "hotel", layouts: ["landing", "store", "product"] },
  { match: "booking", layouts: ["landing", "product"] },
  { match: "news", layouts: ["news", "portal-2000"] },
  { match: "blog", layouts: ["minimal-blog", "docs"] },
  { match: "forum", layouts: ["forum", "guestbook"] },
  { match: "corporate", layouts: ["landing", "dashboard"] },
  { match: "saas", layouts: ["dashboard", "landing"] },
  { match: "dashboard", layouts: ["dashboard"] },
  { match: "game", layouts: ["streaming", "link-in-bio", "portal-2000"] },
  { match: "kids", layouts: ["link-in-bio", "guestbook", "portal-2000"] },
  { match: "search", layouts: ["search", "search", "directory"] },
  { match: "documentation", layouts: ["docs", "docs"] },
  { match: "manual", layouts: ["docs", "directory"] },
  { match: "directory", layouts: ["directory", "portal-2000"] },
  { match: "council", layouts: ["portal-2000", "news"] },
  { match: "municipal", layouts: ["portal-2000", "docs"] },
  { match: "app store", layouts: ["store", "landing"] },
  { match: "social", layouts: ["social-feed", "link-in-bio"] },
  { match: "short video", layouts: ["short-video", "streaming"] },
  { match: "finance", layouts: ["finance", "dashboard"] },
  { match: "course", layouts: ["education", "docs"] },
  { match: "wellness", layouts: ["health", "landing"] },
  { match: "job", layouts: ["jobs", "directory"] },
  { match: "map", layouts: ["maps", "directory"] },
  { match: "restaurant", layouts: ["food", "store"] },
  { match: "real estate", layouts: ["real-estate", "product"] },
  { match: "creator", layouts: ["creator", "dashboard"] },
  { match: "weather", layouts: ["weather", "news"] },
  { match: "auction", layouts: ["auctions", "store"] },
  { match: "classified", layouts: ["auctions", "directory"] }
];

const layoutBySection: Record<string, LayoutArchetype> = {
  products: "store",
  news: "news",
  video: "streaming",
  watch: "streaming",
  account: "dashboard",
  guides: "docs",
  games: "game",
  search: "search",
  booking: "booking",
  help: "manual",
  download: "app-store",
  article: "minimal-blog",
  offers: "events",
  social: "social-feed",
  shorts: "short-video",
  finance: "finance",
  learn: "education",
  health: "health",
  jobs: "jobs",
  maps: "maps",
  forums: "forum",
  food: "food",
  homes: "real-estate",
  creators: "creator",
  weather: "weather",
  auctions: "auctions",
  music: "music",
  listen: "music",
  station: "music",
  chat: "chat",
  ask: "chat",
  assistant: "chat"
};

export function chooseLayout(seed: string, formula: GenreFormula, depth: number, routeSection?: string): LayoutArchetype {
  const haystack = `${formula.surface} ${formula.content} ${formula.residue}`.toLowerCase();
  const sectionLayout = routeSection ? layoutBySection[routeSection] : undefined;

  if (sectionLayout && depth === 0) {
    return sectionLayout;
  }

  const preferred = preferenceBySurfaceKeyword.find((entry) => haystack.includes(entry.match));

  if (preferred && depth === 0) {
    return pick(`${seed}:layout:pref`, [...new Set(preferred.layouts)]);
  }

  return pick(`${seed}:layout:any`, layoutArchetypes);
}
