/**
 * Helpers for turning what a visitor types into a deterministic `/search/...`
 * path, and for recovering a human-readable query back out of such a path.
 *
 * The labyrinth never truly indexes anything: instead the typed query becomes
 * part of the URL slug, which `decodeRoute` folds into the page seed and
 * motifs. The generated results are therefore thematically adjacent to the
 * query — recognisably "about" it, yet never quite the thing that was sought.
 */

const QUERY_SLUG_MAX = 64;

/** Structural words we strip when reconstructing the query a visitor typed. */
const SEARCH_STRUCTURE_WORDS = new Set([
  "search",
  "searches",
  "results",
  "result",
  "for",
  "page",
  "pages",
  "query",
  "no",
  "not",
  "found",
  "with",
  "after",
  "and",
  "the",
  "of",
  "to",
  "in",
  "on",
  "a",
  "an",
  "related",
  "images",
  "image",
  "find",
  "best",
  "top"
]);

export function slugifyQuery(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, QUERY_SLUG_MAX)
    .replace(/-+$/g, "");
}

/**
 * Build the destination for a submitted search. Deterministic by design: the
 * same query always resolves to the same page, so results stay shareable.
 */
export function buildSearchPath(value: string): string {
  const slug = slugifyQuery(value);
  if (!slug) return "/search/everything-and-nothing-results";
  return `/search/${slug}-results`;
}

/** Tokens like a 4-6 char hex continuity token baked into generated slugs. */
function isStructuralToken(word: string): boolean {
  if (SEARCH_STRUCTURE_WORDS.has(word)) return true;
  if (/^\d+$/.test(word)) return true;
  if (/\d/.test(word) && /^[a-f0-9]{4,6}$/.test(word)) return true;
  return false;
}

/**
 * Recover the query a visitor most likely typed from a decoded set of slug
 * words. Returns undefined when nothing meaningful survives the filtering.
 */
export function readableSearchQuery(words: string[]): string | undefined {
  const kept = words.filter((word) => !isStructuralToken(word));
  const query = kept.join(" ").trim();
  return query || undefined;
}
