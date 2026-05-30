import { generationConfig } from "@/config/generation";
import type { LayoutArchetype, LayoutComposition, SiteKind } from "./types";
import { entropyLevel } from "./entropy";
import { createRng, pick } from "./seed";

/**
 * Each site kind resolves to a *family* of plausible archetypes rather than a
 * single one. The choice is keyed on the stable site seed, so every page within
 * one mini-site keeps the same recognizable shell, but two "streaming" sites
 * might be a video portal and a music player respectively. This is what makes
 * the labyrinth feel like the whole variety of the web instead of seven sites.
 */
const primarySetBySiteKind: Record<SiteKind, LayoutArchetype[]> = {
  blog: ["minimal-blog", "minimal-blog", "news", "creator", "social-feed", "health", "chat"],
  store: ["store", "store", "product", "auctions", "food", "app-store"],
  forum: ["forum", "guestbook", "social-feed", "link-in-bio", "chat"],
  docs: ["docs", "manual", "education", "dashboard"],
  streaming: ["streaming", "streaming", "music", "short-video", "creator"],
  booking: ["booking", "landing", "real-estate", "weather", "events"],
  directory: ["directory", "search", "maps", "jobs", "finance", "portal-2000"]
};

export function primaryLayoutForSite(siteKind: SiteKind, siteSeed: string): LayoutArchetype {
  return pick(`${siteSeed}:site-primary-layout`, primarySetBySiteKind[siteKind]);
}

export function primaryLayoutForPage(siteKind: SiteKind, siteSeed: string, routeSeed: string, drift: number): LayoutArchetype {
  const stableShell = primaryLayoutForSite(siteKind, siteSeed);
  const rng = createRng(`${routeSeed}:site-shell-variation:${siteKind}`);

  if (rng.bool(Math.max(0.24, 0.76 - drift * 0.48))) {
    return stableShell;
  }

  const pagePool = primarySetBySiteKind[siteKind].filter((candidate) => candidate !== stableShell);
  return pagePool.length ? pick(`${routeSeed}:page-primary-layout:${siteKind}`, pagePool) : stableShell;
}

export function chooseLayoutComposition(
  seed: string,
  primary: LayoutArchetype,
  siteKind: SiteKind,
  depth: number,
  drift: number
): LayoutComposition {
  const rng = createRng(`${seed}:layout-composition:${primary}:${siteKind}`);
  const entropy = entropyLevel(depth);
  const entropySource = Math.max(entropy, drift);
  const secondaryChance = entropySource <= 0
    ? 0
    : generationConfig.composition.shallowSecondaryChance +
      (generationConfig.composition.deepSecondaryChance - generationConfig.composition.shallowSecondaryChance) * entropySource;
  const secondaryPool = generationConfig.compatibleSecondaryLayouts[siteKind].filter((candidate) => candidate !== primary);
  const secondary = secondaryPool.length && rng.bool(secondaryChance) ? pick(`${seed}:layout-composition:secondary`, secondaryPool) : undefined;
  const intensity = entropySource <= 0
    ? generationConfig.composition.minIntensity
    : generationConfig.composition.minIntensity +
      (generationConfig.composition.maxIntensity - generationConfig.composition.minIntensity) * entropySource;

  return {
    primary,
    secondary,
    mode: secondary ? "layered-intrusion" : "pure",
    intensity: Number(intensity.toFixed(2))
  };
}
