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

export const linkGenerationConfig = {
  destinationTopics: [
    {
      section: "products",
      surface: "ecommerce catalog",
      content: "automotive listings",
      action: "compare listings",
      residue: "classified auction site",
      labels: ["car listings", "garage parts", "dealer offers", "used vans"]
    },
    {
      section: "booking",
      surface: "hotel booking site",
      content: "hotel availability",
      action: "booking",
      residue: "Web 1.0 travel directory",
      labels: ["hotel rooms", "suite availability", "breakfast stays", "late checkout"]
    },
    {
      section: "food",
      surface: "restaurant delivery portal",
      content: "restaurant menu",
      action: "checkout",
      residue: "old portal",
      labels: ["dinner menus", "nearby cafes", "delivery deals", "breakfast specials"]
    },
    {
      section: "homes",
      surface: "real estate listing",
      content: "real estate listings",
      action: "compare listings",
      residue: "public directory",
      labels: ["open homes", "rental listings", "floor plans", "available apartments"]
    },
    {
      section: "guides",
      surface: "documentation site",
      content: "software update notes",
      action: "download software",
      residue: "abandoned SaaS",
      labels: ["release notes", "API guide", "install manual", "migration steps"]
    },
    {
      section: "watch",
      surface: "dead streaming platform",
      content: "video streaming",
      action: "continue watching",
      residue: "vertical video mirror",
      labels: ["next episode", "channel archive", "watch queue", "behind the scenes"]
    },
    {
      section: "forums",
      surface: "forum wiki archive",
      content: "forum wiki archive",
      action: "reply",
      residue: "forgotten social graph",
      labels: ["active threads", "repair wiki", "member board", "answered questions"]
    },
    {
      section: "maps",
      surface: "local map directory",
      content: "local map search",
      action: "open directory",
      residue: "public directory",
      labels: ["nearby places", "route planner", "local directory", "saved stops"]
    },
    {
      section: "finance",
      surface: "finance dashboard",
      content: "finance watchlist",
      action: "save listing",
      residue: "stale news homepage",
      labels: ["market watchlist", "portfolio notes", "fund prices", "earnings calendar"]
    },
    {
      section: "weather",
      surface: "weather environment dashboard",
      content: "weather alert feed",
      action: "open directory",
      residue: "stale news homepage",
      labels: ["rain radar", "coastal alerts", "weekend forecast", "wind map"]
    }
  ],
  genericActionLabels: ["view", "see all", "show all", "open", "more", "continue", "details"]
} as const;
