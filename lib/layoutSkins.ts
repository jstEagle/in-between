import type { LayoutArchetype } from "./types";
import { pick } from "./seed";

const skinsByLayout: Partial<Record<LayoutArchetype, readonly string[]>> = {
  mixed: ["classic-blocks", "hero-heavy", "sidebar-intrusion", "stacked-zigzag", "footer-first", "asymmetric", "intrusion-stack"],
  streaming: ["shelves", "theater-grid", "channel-list", "playlist-rows", "broadcast-ticker", "cinema-row"],
  "minimal-blog": ["editorial", "magazine", "index", "newsletter", "timeline", "marginalia", "folio"],
  store: ["sidebar-filters", "wide-grid", "compact-list", "mosaic", "carousel-hero", "list-detail", "split-catalog"],
  "portal-2000": ["three-column", "link-farm", "frameset", "webring", "guestbook-portal", "banner-maze"],
  search: ["results-list", "results-cards", "image-grid", "minimal-query", "split-results", "answer-box"],
  news: ["broadsheet", "wire-feed", "tabloid", "magazine-spread", "local-briefing", "front-page", "classifieds"],
  dashboard: ["sidebar", "topnav", "widgets", "kanban", "compact-metrics", "command-center", "split-metrics"],
  landing: ["centered-hero", "split-hero", "stacked-form", "video-bg", "pricing-table", "social-proof", "long-scroll"],
  booking: ["hero-search", "room-grid", "calendar-strip", "compact-form", "map-availability", "amenities-first"],
  forum: ["table", "cards", "compact", "split-board", "pinned-hero", "thread-expanded", "mod-queue"],
  directory: ["category-grid", "a-z-list", "featured-tree", "search-first", "regional", "tag-cloud", "nested-tree"],
  game: ["arcade-grid", "featured-play", "leaderboard", "category-shelves", "flash-window", "prize-wheel"],
  "app-store": ["product-page", "featured-row", "category-tabs", "minimal-download", "editorial-story", "ranked-list"],
  events: ["timeline", "calendar-grid", "featured-event", "compact-list", "venue-map", "week-strip"],
  product: ["gallery-left", "gallery-stack", "sticky-buy", "minimal", "spec-sheet", "comparison"],
  docs: ["sidebar-nav", "centered-toc", "api-reference", "changelog", "tutorial-path", "quickstart"],
  manual: ["help-center", "article-steps", "faq-accordion", "search-first", "contact-support", "troubleshoot-tree"],
  "link-in-bio": ["stacked", "grid-links", "hero-card", "minimal", "shop-row", "story-ring"],
  guestbook: ["classic", "threaded", "mosaic", "wall", "signing-table", "scrapbook"],
  "social-feed": ["three-column", "single-column", "masonry", "media-first", "quote-repost", "profile-hub"],
  "short-video": ["grid", "theater", "reel-scroll", "discover-tabs", "duet-stack", "sound-strip"],
  finance: ["portfolio", "terminal", "watchlist", "news-heavy", "heatmap", "ledger"],
  education: ["catalog", "dashboard", "lesson-player", "syllabus", "path-map", "flashcards"],
  health: ["dashboard", "magazine", "tracker", "clinic-list", "vitals-strip", "program-grid"],
  jobs: ["list", "cards", "map-jobs", "featured-company", "salary-focus", "remote-board"],
  maps: ["split-map", "list-first", "full-bleed", "directions", "transit-layer", "street-view"],
  food: ["grid", "order-tracker", "menu-focus", "deals-bar", "cuisine-tabs", "group-order"],
  "real-estate": ["grid", "map-list", "floor-plan", "luxury-hero", "open-house", "agent-card"],
  creator: ["studio", "gallery", "timeline", "monetize", "link-hub", "analytics-wall"],
  weather: ["forecast", "minimal", "radar", "hourly-strip", "alert-banner", "compare-cities"],
  auctions: ["grid", "live-list", "featured-lot", "countdown-banner", "bid-history", "seller-spotlight"],
  music: ["library", "now-playing", "album-wall", "playlist-detail", "radio-dial", "concert-promo"],
  chat: ["assistant", "thread-history", "model-picker", "playground", "support-bot", "prompt-gallery"]
};

export function chooseLayoutSkin(seed: string, layout: LayoutArchetype): string {
  const pool = skinsByLayout[layout] ?? ["default"];
  return pick(`${seed}:layout-skin:${layout}`, [...pool]);
}
