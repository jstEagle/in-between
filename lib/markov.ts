import { createRng } from "./seed";

export function markov(seed: string, sources: string[], maxWords = 24) {
  const rng = createRng(seed);
  const words = sources.join(" ").toLowerCase().replace(/[^\w\s-]/g, "").split(/\s+/).filter(Boolean);
  const chain = new Map<string, string[]>();

  for (let i = 0; i < words.length - 1; i += 1) {
    const key = words[i];
    const next = words[i + 1];
    const values = chain.get(key) ?? [];
    values.push(next);
    chain.set(key, values);
  }

  if (words.length === 0) return "";

  let current = words[rng.int(0, words.length - 1)];
  const result = [current];

  for (let i = 1; i < maxWords; i += 1) {
    const nextWords = chain.get(current);
    current = nextWords?.[rng.int(0, nextWords.length - 1)] ?? words[rng.int(0, words.length - 1)];
    result.push(current);
  }

  const sentence = result.join(" ").replace(/\bi\b/g, "I");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}
