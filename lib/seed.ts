export function hashString(input: string): string {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return ((h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0"));
}

export type SeedRng = {
  next: () => number;
  int: (min: number, max: number) => number;
  float: (min: number, max: number) => number;
  bool: (chance?: number) => boolean;
};

export function createRng(seed: string): SeedRng {
  let state = parseInt(hashString(seed).slice(0, 8), 16) || 1;

  function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    next,
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    float: (min, max) => min + next() * (max - min),
    bool: (chance = 0.5) => next() < chance
  };
}

export function pick<T>(seed: string, items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from an empty list.");
  }

  const rng = createRng(seed);
  return items[rng.int(0, items.length - 1)];
}

export function pickMany<T>(seed: string, items: readonly T[], count: number): T[] {
  const rng = createRng(seed);
  const pool = [...items];
  const picked: T[] = [];
  const limit = Math.min(count, pool.length);

  for (let i = 0; i < limit; i += 1) {
    picked.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]);
  }

  return picked;
}

export function componentSeed(pageSeed: string, componentId: string) {
  return hashString(`${pageSeed}:${componentId}`);
}
