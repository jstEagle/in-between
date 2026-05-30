import type { GenreFormula, LanguageBlend, RouteState } from "./types";
import { supportedLanguages } from "@/content/i18n";
import { entropyChance } from "./entropy";
import { createRng, pick } from "./seed";

export const webMoods = [
  "abandoned ecommerce category",
  "underfilled hotel booking flow",
  "overfilled 2000s portal",
  "dead streaming platform",
  "stale news homepage",
  "forgotten corporate microsite",
  "broken search results page",
  "children's games portal with adult content categories",
  "SaaS dashboard with impossible metrics",
  "multilingual travel directory",
  "fake app store listing",
  "local services directory",
  "content farm blog with checkout controls",
  "webmail-style inbox for public pages"
];

export const languages = supportedLanguages;
const randomLocalizedPageRate = 0.05;

export function generateGenreFormula(routeState: RouteState): GenreFormula {
  return {
    surface: routeState.surfaceGenre,
    content: routeState.contentGenre,
    action: routeState.actionGenre,
    residue: routeState.residueGenre
  };
}

export function chooseWebMood(seed: string, depth: number) {
  const base = pick(`${seed}:mood`, webMoods);
  if (depth > 50) return pick(`${seed}:late-mood`, ["empty directory with authority", "admin panel with no outside", "beautiful almost-normal landing page"]);
  if (depth > 20) return pick(`${seed}:deep-mood`, ["self-referential public portal", "contradictory checkout archive", base]);
  return base;
}

export function chooseLanguageBlend(seed: string, hint?: string, depth = 0): LanguageBlend {
  const nonEnglishLanguages = languages.filter((language) => language !== "English");
  const rng = createRng(`${seed}:language:chance`);
  const primary = hint ?? (rng.bool(entropyChance(depth, randomLocalizedPageRate, 0.42)) ? pick(`${seed}:language:primary`, nonEnglishLanguages) : "English");
  const contamination =
    primary === "English"
      ? "English"
      : pick(`${seed}:language:contamination`, languages.filter((language) => language !== primary));
  return {
    primary,
    contamination,
    fallback: "English"
  };
}
