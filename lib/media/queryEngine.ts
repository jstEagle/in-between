import type { GenreFormula } from "../types";
import { pickMany } from "../seed";

const queryBanks = {
  commercial: ["product", "shopping", "checkout", "customer service", "subscription", "delivery", "warehouse", "desk", "laptop", "package", "sale"],
  travel: ["hotel", "apartment", "suite", "reception", "booking", "breakfast", "luggage", "travel", "guest"],
  media: ["video", "streaming", "television", "game", "arcade", "controller", "screen", "playlist", "entertainment"],
  corporate: ["newspaper", "office", "meeting", "announcement", "report", "press", "city", "finance", "dashboard"],
  archive: ["diagram", "catalog", "manual", "sign", "document", "map", "public domain", "archive", "brochure"]
};

export function generateMediaQueries(seed: string, formula: GenreFormula, imageRole: string, motifs: string[]) {
  const joined = `${formula.surface} ${formula.content} ${formula.action} ${formula.residue}`.toLowerCase();
  const pageTerms = themeTerms(formula, motifs);
  const banks = [
    ...(joined.includes("hotel") || joined.includes("booking") ? queryBanks.travel : []),
    ...(joined.includes("commerce") || joined.includes("checkout") ? queryBanks.commercial : []),
    ...(joined.includes("stream") || joined.includes("video") || joined.includes("watch") || joined.includes("game") ? queryBanks.media : []),
    ...(joined.includes("news") || joined.includes("corporate") || joined.includes("saas") ? queryBanks.corporate : []),
    ...queryBanks.archive
  ];
  const base = banks.length ? banks : [...queryBanks.commercial, ...queryBanks.travel];
  const topics = pickMany(`${seed}:media-query:${imageRole}`, [...new Set([...pageTerms, ...base, ...motifs])], 5);

  return [
    `${formula.surface} ${topics[0]}`,
    topics[0],
    `${topics[0]} ${topics[1] ?? imageRole}`,
    `${imageRole} ${topics[2] ?? formula.content}`,
    `${topics[3] ?? formula.action} ${topics[4] ?? imageRole}`
  ];
}

function themeTerms(formula: GenreFormula, motifs: string[]) {
  return [
    ...splitUsefulTerms(formula.surface),
    ...splitUsefulTerms(formula.content),
    ...splitUsefulTerms(formula.action),
    ...splitUsefulTerms(formula.residue),
    ...motifs.flatMap(splitUsefulTerms)
  ];
}

function splitUsefulTerms(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2 && !stopTerms.has(term));
}

const stopTerms = new Set(["and", "for", "the", "with", "near", "from", "into", "your", "our", "page", "site", "web"]);
