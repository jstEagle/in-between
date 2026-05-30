import type { MediaProfile } from "../types";
import { pick } from "../seed";

export const mediaProfiles: MediaProfile[] = [
  {
    id: "thumb-2000",
    name: "2000s thumbnail page",
    apparentResolution: "160p-360p",
    loadingFamily: "hard-edged placeholder",
    filterStack: ["pixelated", "jpeg"],
    brokenRate: 0.22
  },
  {
    id: "broadband-720",
    name: "720p broadband page",
    apparentResolution: "720p-ish",
    loadingFamily: "old streaming spinner",
    filterStack: ["mild-compression"],
    brokenRate: 0.1
  },
  {
    id: "hd-marketing",
    name: "HD marketing page",
    apparentResolution: "1080p hero with low-res secondary media",
    loadingFamily: "blur-up",
    filterStack: ["clean", "secondary-lowres"],
    brokenRate: 0.06
  },
  {
    id: "ultra-clean",
    name: "Ultra high definition page",
    apparentResolution: "overclean 4K-like",
    loadingFamily: "luxury shimmer",
    filterStack: ["high-contrast", "polished"],
    brokenRate: 0.03
  },
  {
    id: "archive-scrape",
    name: "Archive scrape page",
    apparentResolution: "mixed archival",
    loadingFamily: "metadata first",
    filterStack: ["sepia", "uneven-aspect"],
    brokenRate: 0.18
  },
  {
    id: "mobile-mirror",
    name: "Mobile app mirror page",
    apparentResolution: "vertical crops",
    loadingFamily: "app-store skeleton",
    filterStack: ["blurred-fill", "sharpened-crop"],
    brokenRate: 0.08
  }
];

export function chooseMediaProfile(seed: string, depth: number) {
  if (depth > 30) return pick(`${seed}:media:deep`, mediaProfiles);
  return pick(`${seed}:media`, mediaProfiles);
}
