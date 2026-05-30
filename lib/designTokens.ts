import type {
  ChromeVariant,
  DesignTokens,
  HeroVariant,
  ThemeTokens
} from "./types";
import { createRng, pick } from "./seed";

/**
 * Structural personalities. Two pages can share a colour palette and a style
 * recipe and still feel like different websites because radius, spacing,
 * borders, shadows, container width and type scale are all chosen here,
 * independently, from the page seed. These are emitted as CSS variables so the
 * blocks read them through Tailwind arbitrary values (rounded-[var(--radius-card)]).
 */

const radiusBundles: Record<DesignTokens["radius"], Record<string, string>> = {
  sharp: { card: "0px", button: "0px", input: "0px", media: "0px", tag: "0px", pill: "9999px" },
  soft: { card: ".375rem", button: ".375rem", input: ".25rem", media: ".25rem", tag: ".25rem", pill: "9999px" },
  round: { card: ".9rem", button: ".7rem", input: ".55rem", media: ".7rem", tag: ".45rem", pill: "9999px" },
  pill: { card: "1.5rem", button: "9999px", input: "9999px", media: "1.1rem", tag: "9999px", pill: "9999px" },
  // intentionally inconsistent — uncanny
  mixed: { card: ".85rem", button: "0px", input: ".5rem", media: "0px", tag: "9999px", pill: "9999px" }
};

const densityBundles: Record<
  DesignTokens["density"],
  { section: string; panel: string; gap: string; gapTight: string; chrome: string }
> = {
  tight: { section: "1.1rem", panel: ".7rem", gap: ".5rem", gapTight: ".35rem", chrome: ".5rem" },
  normal: { section: "1.9rem", panel: "1.05rem", gap: ".9rem", gapTight: ".6rem", chrome: ".8rem" },
  roomy: { section: "3.25rem", panel: "1.6rem", gap: "1.3rem", gapTight: ".85rem", chrome: "1.1rem" },
  cavernous: { section: "5.5rem", panel: "2.3rem", gap: "2.1rem", gapTight: "1.2rem", chrome: "1.5rem" }
};

const borderBundles: Record<DesignTokens["borderStyle"], { width: string; style: string }> = {
  hairline: { width: "1px", style: "solid" },
  normal: { width: "1.5px", style: "solid" },
  chunky: { width: "3px", style: "solid" },
  double: { width: "4px", style: "double" },
  dashed: { width: "2px", style: "dashed" }
};

function shadowBundle(kind: DesignTokens["shadow"]) {
  switch (kind) {
    case "none":
      return { panel: "none", button: "none", media: "none" };
    case "soft":
      return {
        panel: "0 1px 3px rgba(0,0,0,.10), 0 10px 28px rgba(0,0,0,.07)",
        button: "0 1px 2px rgba(0,0,0,.18)",
        media: "0 8px 24px rgba(0,0,0,.10)"
      };
    case "hard":
      return {
        panel: "5px 5px 0 var(--page-border)",
        button: "3px 3px 0 var(--page-border)",
        media: "6px 6px 0 var(--page-border)"
      };
    case "glow":
      return {
        panel: "0 0 34px color-mix(in srgb, var(--page-accent) 42%, transparent)",
        button: "0 0 18px color-mix(in srgb, var(--page-accent) 55%, transparent)",
        media: "0 0 40px color-mix(in srgb, var(--page-accent) 38%, transparent)"
      };
    case "inset":
      return {
        panel: "inset 0 0 0 1px color-mix(in srgb, var(--page-border) 65%, transparent), inset 0 18px 40px rgba(0,0,0,.05)",
        button: "inset 0 -2px 0 color-mix(in srgb, var(--page-border) 70%, transparent)",
        media: "inset 0 0 0 2px color-mix(in srgb, var(--page-border) 50%, transparent)"
      };
  }
}

const containerWidths: Record<DesignTokens["container"], string> = {
  narrow: "960px",
  normal: "1180px",
  wide: "1360px",
  bleed: "min(1600px, 96vw)"
};

const trackingValues: Record<DesignTokens["tracking"], string> = {
  tight: "0em",
  normal: "0em",
  wide: "0em"
};

const heroVariants: HeroVariant[] = [
  "split-booking",
  "full-bleed",
  "masthead",
  "centered",
  "card-stack",
  "dashboard",
  "catalog"
];

const chromeVariants: ChromeVariant[] = ["classic", "centered", "portal", "mega", "minimal", "stacked"];

const heroHeights: Record<HeroVariant, string> = {
  "split-booking": "78vh",
  "full-bleed": "92vh",
  masthead: "62vh",
  centered: "70vh",
  "card-stack": "auto",
  dashboard: "auto",
  catalog: "auto"
};

export function generateDesign(seed: string, theme: ThemeTokens, depth: number): DesignTokens {
  const radius = pick(`${seed}:dt:radius`, Object.keys(radiusBundles) as DesignTokens["radius"][]);
  const density = pick(`${seed}:dt:density`, Object.keys(densityBundles) as DesignTokens["density"][]);
  const borderStyle = pick(`${seed}:dt:border`, Object.keys(borderBundles) as DesignTokens["borderStyle"][]);

  // glow reads as nightclub neon; keep it for dark pages, soften it on light ones.
  let shadow = pick(`${seed}:dt:shadow`, ["none", "soft", "hard", "glow", "inset"] as DesignTokens["shadow"][]);
  if (shadow === "glow" && theme.scheme === "light") shadow = "soft";

  const container = pick(`${seed}:dt:container`, Object.keys(containerWidths) as DesignTokens["container"][]);
  const headingCase = pick(`${seed}:dt:case`, ["upper", "none", "none", "lower", "title"] as DesignTokens["headingCase"][]);
  const tracking = pick(`${seed}:dt:tracking`, Object.keys(trackingValues) as DesignTokens["tracking"][]);
  const texture = pick(`${seed}:dt:texture`, ["scan", "dots", "grid", "soft-radial", "none", "noise"] as DesignTokens["texture"][]);

  const heroVariant = pick(`${seed}:dt:hero`, heroVariants);
  const chromeVariant = pick(`${seed}:dt:chrome`, chromeVariants);

  const rng = createRng(`${seed}:dt:type`);
  const baseSize = rng.int(14, 17);
  // Keep display type seeded but stable; viewport-scaled type made compact
  // generated layouts feel more artificial than the real web fragments around them.
  const heroSize = [2.6, 3.1, 3.7, 4.4][rng.int(0, 3)];
  const h2Size = [1.55, 1.8, 2.1, 2.45][rng.int(0, 3)];
  const leading = [1.04, 1.12, 1.22, 1.35][rng.int(0, 3)];

  const radiusVals = radiusBundles[radius];
  const dens = densityBundles[density];
  const bord = borderBundles[borderStyle];
  const shadows = shadowBundle(shadow);

  const cssVars: Record<string, string> = {
    "--radius-card": radiusVals.card,
    "--radius-button": radiusVals.button,
    "--radius-input": radiusVals.input,
    "--radius-media": radiusVals.media,
    "--radius-tag": radiusVals.tag,
    "--radius-pill": radiusVals.pill,
    "--pad-section": dens.section,
    "--pad-panel": dens.panel,
    "--pad-chrome": dens.chrome,
    "--gap-grid": dens.gap,
    "--gap-tight": dens.gapTight,
    "--border-w": bord.width,
    "--border-style": bord.style,
    "--shadow-panel": shadows.panel,
    "--shadow-button": shadows.button,
    "--shadow-media": shadows.media,
    "--container-max": containerWidths[container],
    "--tracking": trackingValues[tracking],
    "--leading": String(leading),
    "--text-base": `${baseSize}px`,
    "--text-hero": `${heroSize}rem`,
    "--text-h2": `${h2Size}rem`,
    "--hero-min-h": heroHeights[heroVariant],
    "--heading-transform":
      headingCase === "upper"
        ? "uppercase"
        : headingCase === "lower"
          ? "lowercase"
          : headingCase === "title"
            ? "capitalize"
            : "none"
  };

  return {
    id: `${radius}-${density}-${borderStyle}-${shadow}-${container}`,
    radius,
    density,
    borderStyle,
    shadow,
    container,
    headingCase,
    tracking,
    texture,
    heroVariant,
    chromeVariant,
    cssVars
  };
}
