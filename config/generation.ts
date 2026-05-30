import type { LayoutArchetype, SiteKind } from "@/lib/types";

export const generationConfig = {
  siteFlow: {
    budgetMin: 10,
    budgetMax: 16,
    inSiteChance: 0.78,
    driftChance: 0.08,
    exitChance: 0.025
  },
  composition: {
    shallowSecondaryChance: 0.08,
    deepSecondaryChance: 0.82,
    minIntensity: 0.03,
    maxIntensity: 0.82
  },
  compatibleSecondaryLayouts: {
    blog: ["store", "news", "portal-2000", "directory", "health", "creator", "guestbook"],
    store: ["news", "portal-2000", "dashboard", "booking", "auctions", "food", "app-store"],
    forum: ["booking", "guestbook", "portal-2000", "directory", "social-feed", "chat"],
    docs: ["social-feed", "dashboard", "portal-2000", "manual", "education", "search"],
    streaming: ["booking", "store", "portal-2000", "short-video", "music", "chat"],
    booking: ["news", "store", "dashboard", "directory", "weather", "real-estate", "events"],
    directory: ["portal-2000", "news", "store", "search", "maps", "jobs", "finance"]
  } satisfies Record<SiteKind, LayoutArchetype[]>
} as const;
