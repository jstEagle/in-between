import { entropyConfig } from "@/config/entropy";

export type EntropyPhase = "landing" | "coherent" | "uneasy" | "deranged" | "broken";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function entropyLevel(depth: number): number {
  if (depth <= entropyConfig.normalDepth) return 0;
  return clamp((depth - entropyConfig.normalDepth) / (entropyConfig.brokenDepth - entropyConfig.normalDepth));
}

export function entropyPhase(depth: number): EntropyPhase {
  if (depth <= 0) return "landing";
  if (depth <= entropyConfig.normalDepth) return "coherent";
  if (depth <= entropyConfig.uneasyDepth) return "uneasy";
  if (depth <= entropyConfig.derangedDepth) return "deranged";
  return "broken";
}

export function entropyChance(depth: number, low: number, high: number): number {
  return low + (high - low) * entropyLevel(depth);
}

export function entropyScale(depth: number, low: number, high: number): number {
  return low + (high - low) * entropyLevel(depth);
}
