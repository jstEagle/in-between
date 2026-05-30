import type { GeneratedComponentContext, GeneratedPage } from "./types";
import { buildComponentList } from "./componentRegistry";
import { componentSeed, pickMany } from "./seed";
import { decodeRoute } from "./routeCodec";
import { chooseLanguageBlend, chooseWebMood, generateGenreFormula } from "./genreEngine";
import { chooseMediaProfile } from "./media/mediaProfiles";
import { chooseStyleRecipe } from "./styleRecipes";
import { generateTheme } from "./theme";
import { generateDesign } from "./designTokens";
import { chooseLayout } from "./layoutArchetypes";
import { chooseLayoutGrammar, shouldUseLayoutGrammar } from "./layoutGrammar";
import { chooseLayoutSkin } from "./layoutSkins";
import { chooseLayoutVariation } from "./layoutVariation";
import { chooseLayoutComposition, primaryLayoutForPage } from "./layoutComposition";
import { generateMotionProfile } from "./motionEffects";
import { generateHeading, generateSubheading } from "./textEngine";
import { makeLinks } from "./linkEngine";
import { mediaManifest } from "./media/mediaManifest";
import { generateRealDataIntrusions } from "./intrusionEngine";

const motifFallback = [
  "checkout",
  "autoplay",
  "stale account",
  "featured tab",
  "quiet listing",
  "guestbook",
  "breakfast",
  "thumbnail",
  "previous floor",
  "directory"
];

export async function generatePage(path: string): Promise<GeneratedPage> {
  const pageModel = generatePageModel(path);
  const realDataIntrusions = await generateRealDataIntrusions(pageModel.routeState);

  return {
    ...pageModel,
    realDataIntrusions
  };
}

export function generatePageModel(path: string): GeneratedPage {
  const routeState = decodeRoute(path);
  const pageSeed = routeState.seed;
  const motifs = pickMany(`${pageSeed}:page-motifs`, [...new Set([...routeState.motifs, ...motifFallback])], 5);
  const genreFormula = generateGenreFormula(routeState);
  const webMood = chooseWebMood(pageSeed, routeState.depth);
  const styleRecipe = chooseStyleRecipe(pageSeed, routeState.depth);
  const theme = generateTheme(pageSeed);
  const design = generateDesign(pageSeed, theme, routeState.depth);
  const sitePrimary = primaryLayoutForPage(routeState.site.siteKind, routeState.site.siteSeed, pageSeed, routeState.site.drift);
  const exploratoryLayout = chooseLayout(pageSeed, genreFormula, routeState.depth, routeState.routeSection);
  const layout = routeState.site.siteDepth <= routeState.site.siteBudget ? sitePrimary : exploratoryLayout;
  const layoutComposition = chooseLayoutComposition(pageSeed, layout, routeState.site.siteKind, routeState.depth, routeState.site.drift);
  const layoutSkin = chooseLayoutSkin(pageSeed, layout);
  const layoutVariation = chooseLayoutVariation(pageSeed, layout, layoutSkin, routeState.depth);
  const layoutGrammar = shouldUseLayoutGrammar(pageSeed, routeState.depth, routeState.site.drift)
    ? chooseLayoutGrammar(pageSeed, layout, routeState.site.siteKind, routeState.depth, routeState.site.drift)
    : null;
  const motion = generateMotionProfile(pageSeed, layout, routeState.depth);
  const mediaProfile = chooseMediaProfile(pageSeed, routeState.depth);
  const languageBlend = chooseLanguageBlend(pageSeed, routeState.languageHint, routeState.depth);
  const localizedRouteState = {
    ...routeState,
    motifs,
    languageHint: languageBlend.primary === "English" ? undefined : languageBlend.primary
  };
  const baseCtx: GeneratedComponentContext = {
    routeState: localizedRouteState,
    pageSeed,
    componentId: "page",
    componentSeed: componentSeed(pageSeed, "page"),
    depth: routeState.depth,
    genreFormula,
    webMood,
    mediaProfile,
    styleRecipe,
    languageBlend,
    motifs
  };

  return {
    routeState: localizedRouteState,
    genreFormula,
    webMood,
    layoutComposition,
    styleRecipe,
    theme,
    design,
    layout,
    layoutSkin,
    layoutVariation,
    layoutGrammar,
    motion,
    mediaProfile,
    languageBlend,
    motifs,
    title: generateHeading(baseCtx),
    subtitle: generateSubheading(baseCtx),
    navigation: makeLinks(baseCtx, 7, "nav"),
    blocks: buildComponentList(localizedRouteState, layoutComposition),
    credits: mediaManifest,
    realDataIntrusions: []
  };
}

export function contextForBlock(page: GeneratedPage, componentId: string): GeneratedComponentContext {
  return {
    routeState: page.routeState,
    pageSeed: page.routeState.seed,
    componentId,
    componentSeed: componentSeed(page.routeState.seed, componentId),
    depth: page.routeState.depth,
    genreFormula: page.genreFormula,
    webMood: page.webMood,
    mediaProfile: page.mediaProfile,
    styleRecipe: page.styleRecipe,
    languageBlend: page.languageBlend,
    motifs: page.motifs
  };
}
