import { corpora, type CorpusKey } from "@/content/corpora/fragments";
import { getLanguagePack, languageLabel } from "@/content/i18n";
import type { GeneratedComponentContext, GenreFormula, LanguageBlend } from "./types";
import { markov } from "./markov";
import { createRng, pick } from "./seed";

function corpusKeysFor(formula: GenreFormula): CorpusKey[] {
  const joined = `${formula.surface} ${formula.content} ${formula.action} ${formula.residue}`.toLowerCase();
  const keys: CorpusKey[] = [];
  if (joined.includes("commerce") || joined.includes("checkout") || joined.includes("catalog")) keys.push("ecommerce");
  if (joined.includes("hotel") || joined.includes("booking") || joined.includes("guest") || joined.includes("travel")) keys.push("hotel");
  if (joined.includes("news") || joined.includes("council") || joined.includes("municipal")) keys.push("news", "municipal");
  if (joined.includes("stream") || joined.includes("video") || joined.includes("watch") || joined.includes("episode")) keys.push("software", "shortVideo", "music");
  if (joined.includes("game")) keys.push("games", "gaming");
  if (joined.includes("corporate") || joined.includes("saas")) keys.push("corporate", "software");
  if (joined.includes("blog") || joined.includes("guide")) keys.push("blog");
  if (joined.includes("recipe")) keys.push("recipe");
  if (joined.includes("social") || joined.includes("profile") || joined.includes("feed") || joined.includes("friend")) keys.push("social");
  if (joined.includes("finance") || joined.includes("market") || joined.includes("wallet") || joined.includes("invoice")) keys.push("finance");
  if (joined.includes("course") || joined.includes("school") || joined.includes("class") || joined.includes("library")) keys.push("education");
  if (joined.includes("health") || joined.includes("wellness") || joined.includes("fitness") || joined.includes("clinic")) keys.push("health");
  if (joined.includes("job") || joined.includes("career") || joined.includes("recruit") || joined.includes("shift")) keys.push("jobs");
  if (joined.includes("map") || joined.includes("local") || joined.includes("nearby") || joined.includes("directory")) keys.push("local");
  if (joined.includes("forum") || joined.includes("wiki") || joined.includes("answer") || joined.includes("manual")) keys.push("forums");
  if (joined.includes("food") || joined.includes("delivery") || joined.includes("restaurant") || joined.includes("breakfast")) keys.push("food");
  if (joined.includes("estate") || joined.includes("apartment") || joined.includes("listing") || joined.includes("room")) keys.push("realEstate");
  if (joined.includes("creator") || joined.includes("design") || joined.includes("template") || joined.includes("asset")) keys.push("creator");
  if (joined.includes("calendar") || joined.includes("email") || joined.includes("todo") || joined.includes("account")) keys.push("productivity");
  if (joined.includes("government") || joined.includes("legal") || joined.includes("permit") || joined.includes("public")) keys.push("government");
  if (joined.includes("auction") || joined.includes("classified") || joined.includes("seller") || joined.includes("offer")) keys.push("auctions");
  if (joined.includes("weather") || joined.includes("storm") || joined.includes("climate")) keys.push("weather");
  keys.push("policy");
  return [...new Set(keys)];
}

export function buildTextContext(ctx: GeneratedComponentContext) {
  const keys = corpusKeysFor(ctx.genreFormula);
  return keys.flatMap((key) => corpora[key]);
}

export function generateHeading(ctx: GeneratedComponentContext) {
  const rng = createRng(`${ctx.componentSeed}:heading`);
  const pack = getLanguagePack(ctx.languageBlend.primary);
  const noun = pick(`${ctx.componentSeed}:heading:noun`, [...pack.webNouns, ...pack.genreNouns]);
  const adjective = pick(`${ctx.componentSeed}:heading:adj`, pack.adjectives);
  const object = pick(`${ctx.componentSeed}:heading:object`, [...pack.interfaceNouns, ...localizedMotifs(ctx)]);
  const verb = pick(`${ctx.componentSeed}:verb`, pack.verbs);
  const templates =
    pack.name === "English"
      ? [
          `Welcome Home to ${capitalize(adjective)} ${capitalize(noun)}`,
          `${capitalize(ctx.genreFormula.surface)} for ${capitalize(object)} ${rng.int(2, 42)}`,
          `${capitalize(verb)} Your ${capitalize(adjective)} ${capitalize(object)}`,
          `${capitalize(ctx.motifs[0] ?? "local")} ${capitalize(noun)} Remains Open`
        ]
      : [
          `${verb} ${adjective} ${noun}`,
          `${adjective} ${object} ${rng.int(2, 42)}`,
          `${noun} ${languageLabel(ctx.languageBlend.primary, "open")} ${object}`,
          `${verb} ${object} ${pick(`${ctx.componentSeed}:heading:time`, pack.timeFragments)}`
        ];
  return templates[rng.int(0, templates.length - 1)];
}

export function generateSubheading(ctx: GeneratedComponentContext) {
  if (ctx.languageBlend.primary !== "English") return localizedSentence(ctx, `${ctx.componentSeed}:sub`, 18);
  const source = buildTextContext(ctx);
  return `${markov(`${ctx.componentSeed}:sub`, source, 18)} ${contamination(ctx.languageBlend, ctx.componentSeed)}`;
}

export function generateProductName(ctx: GeneratedComponentContext, index: number) {
  const seed = `${ctx.componentSeed}:product:${index}`;
  const pack = getLanguagePack(ctx.languageBlend.primary);
  const adjective = pick(`${seed}:adj`, pack.adjectives);
  const noun = pick(`${seed}:noun`, [...pack.genreNouns, ...pack.interfaceNouns, ...localizedMotifs(ctx)]);
  const suffix = pick(`${seed}:suffix`, pack.name === "English" ? ["Membership", "Sample", "Preview", "Bundle", "Account", "Standard Edition", "4-Pack"] : pack.genreNouns);
  return `${capitalize(adjective)} ${capitalize(noun)} ${suffix}`;
}

export function generateProductDescription(ctx: GeneratedComponentContext, index: number) {
  if (ctx.languageBlend.primary !== "English") return localizedSentence(ctx, `${ctx.componentSeed}:product-description:${index}`, 22);
  return markov(`${ctx.componentSeed}:product-description:${index}`, buildTextContext(ctx), 22);
}

export function generateHeadline(ctx: GeneratedComponentContext, index: number) {
  const seed = `${ctx.componentSeed}:headline:${index}`;
  const pack = getLanguagePack(ctx.languageBlend.primary);
  if (pack.name === "English") {
    const subject = pick(`${seed}:subject`, ["Council", "Guests", "Markets", "Directory", "Furniture Index", "Local Sidebar", "Account Weather"]);
    const verb = pick(`${seed}:verb`, ["announces", "confirms", "approves", "remains", "opens", "returns"]);
    const object = pick(`${seed}:object`, [...ctx.motifs, ...pack.interfaceNouns, ...pack.genreNouns]);
    return `${subject} ${verb} ${capitalize(object)} Near ${capitalize(pick(`${seed}:place`, pack.webNouns))}`;
  }
  return `${pick(`${seed}:subject`, pack.webNouns)} ${pick(`${seed}:verb`, pack.verbs)} ${pick(`${seed}:object`, [...pack.interfaceNouns, ...pack.genreNouns])}`;
}

export function generateParagraph(ctx: GeneratedComponentContext, index: number) {
  if (ctx.languageBlend.primary !== "English") return `${localizedSentence(ctx, `${ctx.componentSeed}:paragraph:${index}`, 28)} ${contamination(ctx.languageBlend, `${ctx.componentSeed}:paragraph:${index}`)}`;
  const language = contamination(ctx.languageBlend, `${ctx.componentSeed}:paragraph:${index}`);
  return `${markov(`${ctx.componentSeed}:paragraph:${index}`, buildTextContext(ctx), 28)} ${language} ${markov(`${ctx.componentSeed}:paragraph:b:${index}`, buildTextContext(ctx), 22)}`;
}

export function generateButtonLabel(ctx: GeneratedComponentContext, index = 0) {
  const seed = `${ctx.componentSeed}:button:${index}`;
  const pack = getLanguagePack(ctx.languageBlend.primary);
  return `${capitalize(pick(`${seed}:verb`, pack.verbs))} ${pick(`${seed}:adj`, pack.adjectives)} ${pick(`${seed}:noun`, [...pack.interfaceNouns, ...pack.genreNouns])}`;
}

export function generateFormLabel(ctx: GeneratedComponentContext, index: number) {
  const labels = getLanguagePack(ctx.languageBlend.primary).formLabels;
  return labels[index % labels.length];
}

export function generateLoadingMessage(ctx: GeneratedComponentContext) {
  const pack = getLanguagePack(ctx.languageBlend.primary);
  const verbs = pack.name === "English" ? ["loading", "buffering", "checking", "preparing", "restoring", "downloading"] : pack.verbs;
  return `${capitalize(pick(`${ctx.componentSeed}:loading:v`, verbs))} ${pick(`${ctx.componentSeed}:loading:n`, [...localizedMotifs(ctx), ...pack.interfaceNouns, ...pack.genreNouns])}`;
}

export function generateFooterLine(ctx: GeneratedComponentContext) {
  const year = createRng(`${ctx.componentSeed}:footer-year`).int(1998, 2028);
  if (ctx.languageBlend.primary !== "English") return localizedSentence(ctx, `${ctx.componentSeed}:footer:${year}`, 18);
  return `Copyright ${year} ${ctx.motifs[0] ?? "Available"} Directory International. Support lines may route to ${ctx.genreFormula.residue}.`;
}

export function phrase(seed: string) {
  const pack = getLanguagePack("English");
  return `${capitalize(pick(`${seed}:verb`, pack.verbs))} your ${pick(`${seed}:adj`, pack.adjectives)} ${pick(`${seed}:object`, [...pack.webNouns, ...pack.interfaceNouns])} for ${pick(`${seed}:time`, pack.timeFragments)}`;
}

export function localizedPhrase(ctx: GeneratedComponentContext, seed: string) {
  const pack = getLanguagePack(ctx.languageBlend.primary);
  if (pack.name === "English") return phrase(seed);
  return `${pick(`${seed}:verb`, pack.verbs)} ${pick(`${seed}:adj`, pack.adjectives)} ${pick(`${seed}:object`, [...pack.webNouns, ...pack.interfaceNouns])} ${pick(`${seed}:time`, pack.timeFragments)}`;
}

function contamination(languageBlend: LanguageBlend, seed: string) {
  if (languageBlend.contamination === "English") return "";
  const fragments = getLanguagePack(languageBlend.contamination).contaminationFragments;
  return pick(`${seed}:contamination`, fragments);
}

function localizedSentence(ctx: GeneratedComponentContext, seed: string, length: number) {
  const pack = getLanguagePack(ctx.languageBlend.primary);
  const words = [...pack.adjectives, ...pack.webNouns, ...pack.interfaceNouns, ...pack.genreNouns, ...pack.verbs, ...pack.timeFragments];
  const rng = createRng(seed);
  const clauses = Array.from({ length: Math.max(2, Math.min(5, Math.round(length / 7))) }, (_, index) => {
    const clauseSeed = `${seed}:clause:${index}`;
    return [
      pick(`${clauseSeed}:verb`, pack.verbs),
      pick(`${clauseSeed}:adj`, pack.adjectives),
      pick(`${clauseSeed}:noun`, [...pack.webNouns, ...pack.interfaceNouns, ...pack.genreNouns]),
      rng.bool(0.45) ? pick(`${clauseSeed}:time`, pack.timeFragments) : pick(`${clauseSeed}:extra`, words)
    ].join(" ");
  });
  return clauses.join(pack.name === "Thai" || pack.name === "Simplified Chinese" || pack.name === "Japanese" ? "、" : ", ");
}

function localizedMotifs(ctx: GeneratedComponentContext) {
  const pack = getLanguagePack(ctx.languageBlend.primary);
  if (pack.name === "English") return ctx.motifs;
  return ctx.motifs.map((motif, index) => pack.webNouns[index % pack.webNouns.length] ?? motif);
}

function capitalize(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
