import type { MediaProfile } from "../types";
import { pickMany } from "../seed";

const filters = ["crop-left", "mirror", "tiny-rotate", "posterize", "dither", "scanlines", "glass-reflection", "overexposed", "low-res"];

export function chooseTransforms(seed: string, profile: MediaProfile) {
  const count = profile.id === "ultra-clean" ? 1 : profile.id === "thumb-2000" ? 4 : 2;
  return [...profile.filterStack, ...pickMany(`${seed}:transform`, filters, count)];
}

export function cssFilterForTransforms(transforms: string[]) {
  const parts: string[] = [];
  if (transforms.includes("posterize")) parts.push("contrast(1.25)");
  if (transforms.includes("dither")) parts.push("saturate(0.72)");
  if (transforms.includes("overexposed")) parts.push("brightness(1.12)");
  if (transforms.includes("scanlines")) parts.push("contrast(0.92)");
  if (transforms.includes("low-res")) parts.push("blur(0.25px)");
  if (transforms.includes("sepia")) parts.push("sepia(0.22)");
  return parts.join(" ") || "none";
}
