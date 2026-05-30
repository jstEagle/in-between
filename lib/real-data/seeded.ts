import { createRng, hashString } from "@/lib/seed";

export function seededIndex(seed: string, length: number): number {
  if (length <= 0) {
    throw new Error("Cannot select from an empty collection.");
  }

  return createRng(seed).int(0, length - 1);
}

export function seededPick<T>(seed: string, items: readonly T[]): T {
  return items[seededIndex(seed, items.length)];
}

export function seededSample<T>(seed: string, items: readonly T[], count: number): T[] {
  const rng = createRng(seed);
  const pool = [...items];
  const picked: T[] = [];
  const limit = Math.max(0, Math.min(count, pool.length));

  for (let i = 0; i < limit; i += 1) {
    picked.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
  }

  return picked;
}

export function seededShuffle<T>(seed: string, items: readonly T[]): T[] {
  return seededSample(hashString(`shuffle:${seed}`), items, items.length);
}

export function seededSearchTerm(seed: string, terms: readonly string[]): string {
  return seededPick(hashString(`term:${seed}`), terms);
}
