import type { MediaAsset } from "../types";
import ingested from "@/content/image-manifest.json";

// Project-owned generated fallbacks. These guarantee the page always has media
// even if the ingested manifest is empty or a provider URL fails to load.
export const projectAssets: MediaAsset[] = [
  {
    id: "sterile-lobby",
    provider: "project",
    type: "illustration",
    sourceUrl: "project://generated/sterile-lobby",
    previewUrl: "",
    width: 1200,
    height: 760,
    author: "in between space generator",
    license: "Project-owned generated asset",
    attributionRequired: false,
    queries: ["hotel reception", "office lobby", "customer service"],
    tags: ["hotel", "office", "lobby", "hero", "booking"],
    dominantColor: "#dfe8e5",
    safety: { safeSearchApplied: true, safeSearchMode: "project-owned", reviewed: true }
  },
  {
    id: "quiet-product-table",
    provider: "project",
    type: "illustration",
    sourceUrl: "project://generated/quiet-product-table",
    previewUrl: "",
    width: 900,
    height: 720,
    author: "in between space generator",
    license: "Project-owned generated asset",
    attributionRequired: false,
    queries: ["product", "shopping", "catalog", "desk"],
    tags: ["product", "catalog", "checkout", "desk", "thumbnail"],
    dominantColor: "#f1dfbf",
    safety: { safeSearchApplied: true, safeSearchMode: "project-owned", reviewed: true }
  },
  {
    id: "manual-map",
    provider: "project",
    type: "document",
    sourceUrl: "project://generated/manual-map",
    previewUrl: "",
    width: 960,
    height: 680,
    author: "in between space generator",
    license: "Project-owned generated asset",
    attributionRequired: false,
    queries: ["manual", "map", "directory", "document"],
    tags: ["manual", "map", "directory", "archive", "document"],
    dominantColor: "#fff8d7",
    safety: { safeSearchApplied: true, safeSearchMode: "project-owned", reviewed: true }
  },
  {
    id: "dashboard-preview",
    provider: "project",
    type: "illustration",
    sourceUrl: "project://generated/dashboard-preview",
    previewUrl: "",
    width: 1000,
    height: 700,
    author: "in between space generator",
    license: "Project-owned generated asset",
    attributionRequired: false,
    queries: ["dashboard", "software", "metrics", "subscription"],
    tags: ["dashboard", "software", "metrics", "app", "profile"],
    dominantColor: "#dbeafe",
    safety: { safeSearchApplied: true, safeSearchMode: "project-owned", reviewed: true }
  },
  {
    id: "game-booking-tile",
    provider: "project",
    type: "illustration",
    sourceUrl: "project://generated/game-booking-tile",
    previewUrl: "",
    width: 800,
    height: 800,
    author: "in between space generator",
    license: "Project-owned generated asset",
    attributionRequired: false,
    queries: ["game", "arcade", "booking", "badge"],
    tags: ["game", "badge", "booking", "kids", "thumbnail"],
    dominantColor: "#f6ff00",
    safety: { safeSearchApplied: true, safeSearchMode: "project-owned", reviewed: true }
  },
  {
    id: "news-product-photo",
    provider: "project",
    type: "photo",
    sourceUrl: "project://generated/news-product-photo",
    previewUrl: "",
    width: 900,
    height: 600,
    author: "in between space generator",
    license: "Project-owned generated asset",
    attributionRequired: false,
    queries: ["news", "product", "announcement", "office"],
    tags: ["news", "product", "announcement", "office", "feed"],
    dominantColor: "#e0edf5",
    safety: { safeSearchApplied: true, safeSearchMode: "project-owned", reviewed: true }
  }
];

// Built-in CC0 sample clips keep video-first layouts alive even when the
// ingested manifest was built without Pexels/Pixabay video API keys.
export const fallbackVideoAssets: MediaAsset[] = [
  {
    id: "cc0-flower-buffer",
    provider: "project",
    type: "video",
    sourceUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    previewUrl: "",
    originalUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    width: 960,
    height: 540,
    durationSeconds: 5,
    author: "MDN Web Docs",
    license: "CC0 sample video",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    attributionRequired: false,
    queries: ["video", "stream", "thumbnail", "short video", "player", "watch"],
    tags: ["video", "stream", "streaming", "thumbnail", "short", "player", "watch", "episode", "trailer", "media", "hero"],
    dominantColor: "#7a8f55",
    safety: { safeSearchApplied: true, safeSearchMode: "curated built-in fallback", reviewed: true }
  },
  {
    id: "cc0-flower-vertical-mirror",
    provider: "project",
    type: "video",
    sourceUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    previewUrl: "",
    originalUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    width: 540,
    height: 960,
    durationSeconds: 5,
    author: "MDN Web Docs",
    license: "CC0 sample video",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    attributionRequired: false,
    queries: ["vertical video", "short video", "mobile stream", "watch", "feed"],
    tags: ["video", "vertical", "short", "mobile", "stream", "thumbnail", "watch", "feed", "live"],
    dominantColor: "#9f784a",
    safety: { safeSearchApplied: true, safeSearchMode: "curated built-in fallback", reviewed: true }
  }
];

// Real ingested assets first (deterministic selection prefers them), then the
// generated project fallbacks. The cast keeps the JSON typed as MediaAsset[].
export const realAssets = ingested as unknown as MediaAsset[];

export const mediaManifest: MediaAsset[] = [...realAssets, ...fallbackVideoAssets, ...projectAssets];
