import type { LayoutVariation as PageLayoutVariation } from "./layoutVariation";
import type { LayoutGrammar } from "./layoutGrammar";

export type RouteState = {
  seed: string;
  depth: number;
  routeSection: string;
  surfaceGenre: string;
  contentGenre: string;
  actionGenre: string;
  residueGenre: string;
  motifs: string[];
  languageHint?: string;
  /** Human-readable query a visitor typed, when this route is a search page. */
  searchQuery?: string;
  site: SiteFlowState;
};

export type GenreFormula = {
  surface: string;
  content: string;
  action: string;
  residue: string;
};

export type LanguageBlend = {
  primary: string;
  contamination: string;
  fallback: string;
};

export type StyleRecipe = {
  id: string;
  name: string;
  density: "sparse" | "balanced" | "dense";
  chrome: "modern" | "old-web" | "portal" | "dashboard" | "playful";
  classes: {
    page: string;
    shell: string;
    panel: string;
    intrusionPanel: string;
    button: string;
    tag: string;
  };
};

export type ThemeTokens = {
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
  muted: string;
  border: string;
  link: string;
  danger: string;
  fontPrimary: string;
  fontIntrusion: string;
  fontAccent: string;
  fontHeadline: string;
  mediaFilter: string;
  scheme: "light" | "dark";
};

export type DesignTokens = {
  id: string;
  radius: "sharp" | "soft" | "round" | "pill" | "mixed";
  density: "tight" | "normal" | "roomy" | "cavernous";
  borderStyle: "hairline" | "normal" | "chunky" | "double" | "dashed";
  shadow: "none" | "soft" | "hard" | "glow" | "inset";
  container: "narrow" | "normal" | "wide" | "bleed";
  headingCase: "upper" | "none" | "lower" | "title";
  tracking: "tight" | "normal" | "wide";
  texture: "scan" | "dots" | "grid" | "soft-radial" | "none" | "noise";
  heroVariant: HeroVariant;
  chromeVariant: ChromeVariant;
  /** Flat map of CSS custom properties to spread onto the page root. */
  cssVars: Record<string, string>;
};

export type MotionEntranceStyle = "none" | "fly" | "cascade" | "float";
export type MotionTextStyle = "none" | "cypher-headings" | "cypher-copy";
export type MotionClockStyle = "none" | "corner-badge" | "inline-chip";

export type MotionProfile = {
  id: string;
  seed: string;
  intensity: "quiet" | "medium" | "loud";
  entrance: {
    style: MotionEntranceStyle;
    selector: string;
    amount: number;
    duration: number;
    distance: number;
    stagger: number;
  };
  text: {
    style: MotionTextStyle;
    selector: string;
    amount: number;
    durationMs: number;
    charset: string;
  };
  clock: {
    style: MotionClockStyle;
    selector: string;
    amount: number;
  };
};

export type HeroVariant =
  | "split-booking"
  | "full-bleed"
  | "masthead"
  | "centered"
  | "card-stack"
  | "dashboard"
  | "catalog";

export type ChromeVariant = "classic" | "centered" | "portal" | "mega" | "minimal" | "stacked";

export type LayoutArchetype =
  | "mixed"
  | "streaming"
  | "minimal-blog"
  | "store"
  | "portal-2000"
  | "search"
  | "news"
  | "dashboard"
  | "landing"
  | "booking"
  | "forum"
  | "directory"
  | "game"
  | "app-store"
  | "events"
  | "product"
  | "docs"
  | "manual"
  | "link-in-bio"
  | "guestbook"
  | "social-feed"
  | "short-video"
  | "finance"
  | "education"
  | "health"
  | "jobs"
  | "maps"
  | "food"
  | "real-estate"
  | "creator"
  | "weather"
  | "auctions"
  | "music"
  | "chat";

export type SiteKind = "blog" | "store" | "forum" | "docs" | "streaming" | "booking" | "directory";

export type SiteFlowState = {
  siteSeed: string;
  siteToken: string;
  siteKind: SiteKind;
  siteDepth: number;
  siteBudget: number;
  currentNode: string;
  parentNode?: string;
  drift: number;
};

export type LinkRole = "home" | "index" | "item" | "related" | "next" | "category" | "search" | "action" | "exit";

export type LayoutComposition = {
  primary: LayoutArchetype;
  secondary?: LayoutArchetype;
  mode: "pure" | "layered-intrusion";
  intensity: number;
};

export type MediaProfile = {
  id: string;
  name: string;
  apparentResolution: string;
  loadingFamily: string;
  filterStack: string[];
  brokenRate: number;
};

export type MediaSafety = {
  safeSearchApplied: boolean;
  safeSearchMode?: string;
  reviewed: boolean;
};

export type MediaAsset = {
  id: string;
  provider: "pexels" | "unsplash" | "pixabay" | "wikimedia" | "openverse" | "project";
  type: "photo" | "video" | "illustration" | "vector" | "document";
  sourceUrl: string;
  previewUrl: string;
  originalUrl?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  author?: string;
  authorUrl?: string;
  license?: string;
  licenseUrl?: string;
  attributionRequired: boolean;
  attributionText?: string;
  queries: string[];
  tags: string[];
  dominantColor?: string;
  safety: MediaSafety;
};

export type GeneratedComponentContext = {
  routeState: RouteState;
  pageSeed: string;
  componentId: string;
  componentSeed: string;
  depth: number;
  genreFormula: GenreFormula;
  webMood: string;
  mediaProfile: MediaProfile;
  styleRecipe: StyleRecipe;
  languageBlend: LanguageBlend;
  motifs: string[];
};

export type LinkPacket = {
  label: string;
  href: string;
  hoverLabel: string;
  id: string;
};

export type BlockPacket =
  | { type: "hero"; id: string }
  | { type: "productGrid"; id: string }
  | { type: "newsPortal"; id: string }
  | { type: "blogArticle"; id: string }
  | { type: "directory"; id: string }
  | { type: "form"; id: string }
  | { type: "ad"; id: string }
  | { type: "realData"; id: string }
  | { type: "dashboard"; id: string }
  | { type: "footer"; id: string };

export type RealDataIntrusionKind =
  | "weather"
  | "book"
  | "article"
  | "recipe"
  | "space"
  | "art"
  | "wildlife"
  | "biodiversity";

export type RealDataIntrusion = {
  id: string;
  kind: RealDataIntrusionKind;
  provider: string;
  source: string;
  title: string;
  kicker: string;
  body: string;
  href?: string;
  imageUrl?: string;
  readerUrl?: string;
  actionLabel?: string;
  meta: string[];
  fallback: boolean;
};

export type { PageLayoutVariation as LayoutVariation };

export type GeneratedPage = {
  routeState: RouteState;
  genreFormula: GenreFormula;
  webMood: string;
  layoutComposition: LayoutComposition;
  styleRecipe: StyleRecipe;
  theme: ThemeTokens;
  design: DesignTokens;
  layout: LayoutArchetype;
  layoutSkin: string;
  layoutVariation: PageLayoutVariation;
  /**
   * When set, the page renders through the generic "confused mash" grammar
   * renderer instead of its bespoke archetype. This is now a *minority* path
   * (more likely the deeper you drift) so most pages keep a recognizable
   * website identity. See lib/generatePage.ts.
   */
  layoutGrammar: LayoutGrammar | null;
  motion: MotionProfile;
  mediaProfile: MediaProfile;
  languageBlend: LanguageBlend;
  motifs: string[];
  title: string;
  subtitle: string;
  navigation: LinkPacket[];
  realDataIntrusions: RealDataIntrusion[];
  blocks: BlockPacket[];
  credits: MediaAsset[];
};
