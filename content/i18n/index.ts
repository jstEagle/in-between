import { englishLanguagePack } from "./english";
import { asiaLanguagePacks } from "./packs/asia";
import { europeMixedLanguagePacks } from "./packs/europeMixed";
import { westernEuropeLanguagePacks } from "./packs/westernEurope";
import { worldMixedLanguagePacks } from "./packs/worldMixed";
import type { GenericLabelKey, LanguagePack } from "./types";

type RawLanguagePack = Omit<LanguagePack, "name" | "htmlLang" | "dir" | "formLabels" | "genericLabels"> & {
  webNouns: readonly string[];
  interfaceNouns: readonly string[];
  genreNouns: readonly string[];
  adjectives: readonly string[];
  verbs: readonly string[];
  timeFragments: readonly string[];
  contaminationFragments: readonly string[];
  formLabels: readonly string[] | Record<string, string>;
  genericLabels: Partial<Record<GenericLabelKey, string>>;
};

const htmlLangByName: Record<string, string> = {
  English: "en",
  Japanese: "ja",
  Korean: "ko",
  "Simplified Chinese": "zh-CN",
  Arabic: "ar",
  Hindi: "hi",
  German: "de",
  French: "fr",
  Spanish: "es",
  Italian: "it",
  Portuguese: "pt",
  Dutch: "nl",
  Swedish: "sv",
  Polish: "pl",
  Turkish: "tr",
  Greek: "el",
  Russian: "ru",
  Ukrainian: "uk",
  Indonesian: "id",
  Vietnamese: "vi",
  Thai: "th"
};

function normalizeLanguagePack(name: string, pack: RawLanguagePack): LanguagePack {
  return {
    name,
    htmlLang: htmlLangByName[name] ?? "en",
    dir: name === "Arabic" ? "rtl" : "ltr",
    webNouns: [...pack.webNouns],
    interfaceNouns: [...pack.interfaceNouns],
    genreNouns: [...pack.genreNouns],
    adjectives: [...pack.adjectives],
    verbs: [...pack.verbs],
    timeFragments: [...pack.timeFragments],
    contaminationFragments: [...pack.contaminationFragments],
    formLabels: normalizeFormLabels(pack.formLabels),
    genericLabels: {
      ...englishLanguagePack.genericLabels,
      ...pack.genericLabels
    }
  };
}

function normalizeFormLabels(labels: readonly string[] | Record<string, string>) {
  if (Array.isArray(labels)) return [...labels];
  const labelMap = labels as Record<string, string>;

  const ordered = [
    labelMap.checkIn,
    labelMap.checkOut,
    labelMap.guests,
    labelMap.preferredHallway,
    labelMap.rememberFloor,
    labelMap.searchSuite ?? labelMap.search,
    labelMap.emailUpdates ?? labelMap.emailForUpdates ?? labelMap.email,
    labelMap.deliveryWindow
  ].filter((label): label is string => Boolean(label));

  return ordered.length ? ordered : Object.values(labelMap).slice(0, 8);
}

const generatedLanguagePacks = {
  ...asiaLanguagePacks,
  ...westernEuropeLanguagePacks,
  ...europeMixedLanguagePacks,
  ...worldMixedLanguagePacks
} as unknown as Record<string, RawLanguagePack>;

export const languagePacks: Record<string, LanguagePack> = {
  English: englishLanguagePack,
  ...Object.fromEntries(Object.entries(generatedLanguagePacks).map(([name, pack]) => [name, normalizeLanguagePack(name, pack)]))
};

export const supportedLanguages = Object.keys(languagePacks);

export function getLanguagePack(language?: string) {
  return language ? (languagePacks[language] ?? englishLanguagePack) : englishLanguagePack;
}

export function languageLabel(language: string | undefined, key: GenericLabelKey) {
  return getLanguagePack(language).genericLabels[key] ?? englishLanguagePack.genericLabels[key];
}

export type { GenericLabelKey, LanguagePack };
