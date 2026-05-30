import type { GeneratedComponentContext, MediaAsset } from "./types";
import { mediaManifest } from "./media/mediaManifest";
import { generateMediaQueries } from "./media/queryEngine";
import { chooseTransforms, cssFilterForTransforms } from "./media/transforms";
import { createRng, hashString, pick } from "./seed";

export type ImagePacket = {
  asset: MediaAsset;
  alt: string;
  src: string;
  videoSrc?: string;
  kind: "real" | "generated" | "broken";
  cssFilter: string;
  transforms: string[];
  pixelated: boolean;
  broken: boolean;
  aging: ImageAging;
  role: string;
  videoPlayerVariant: "native" | "streaming" | "webcam" | "mini-disc" | "archive";
  alternates: MediaAlternate[];
};

export type ImageAging = {
  resolutionScale: number;
  grain: number;
  contrast: number;
  label: "clean" | "soft" | "compressed" | "pixelated" | "archival";
};

export type MediaAlternate = {
  key: string;
  asset: MediaAsset;
  alt: string;
  src: string;
  videoSrc?: string;
  kind: ImagePacket["kind"];
};

const providerBalanceJitter = 0.24;
const alternateLimit = 18;

export function selectImage(ctx: GeneratedComponentContext, role: string): ImagePacket {
  const seed = `${ctx.componentSeed}:image:${role}`;
  const queries = generateMediaQueries(seed, ctx.genreFormula, role, ctx.motifs);
  const haystack = queries.join(" ").toLowerCase();
  const taggedCandidates = mediaManifest.filter(
    (asset) => mediaMatches(asset, haystack, role)
  );
  const wantsVideo = /\b(video|stream|trailer|player|episode|watch)\b/i.test(`${role} ${haystack}`);
  const candidates = diversifyCandidates(seed, taggedCandidates, wantsVideo, haystack, role);
  const candidatePool = candidates.length ? candidates : mediaManifest;
  let asset = balancedMediaPick(`${seed}:asset:${queries.join("|")}`, candidatePool, haystack, role, wantsVideo);
  if (wantsVideo && (asset.type !== "video" || !asset.originalUrl)) {
    const playableVideos = candidatePool.filter((candidate) => candidate.type === "video" && Boolean(candidate.originalUrl));
    const fallbackVideos = mediaManifest.filter((candidate) => candidate.type === "video" && Boolean(candidate.originalUrl));
    const videoPool = playableVideos.length ? playableVideos : fallbackVideos;
    if (videoPool.length) {
      asset = pick(`${seed}:forced-video`, videoPool);
    }
  }
  const transforms = chooseTransforms(seed, ctx.mediaProfile);
  const pixelated = transforms.includes("pixelated") || transforms.includes("low-res");
  const selectedVideo = asset.type === "video" && Boolean(asset.originalUrl);
  const broken = selectedVideo ? false : createRng(`${seed}:broken`).bool(Math.min(0.45, ctx.mediaProfile.brokenRate + ctx.depth / 240));
  const source = sourceForAsset(asset, seed, role, transforms, ctx.motifs, broken);
  const alternateAssets = alternateMediaAssets(`${seed}:alternates`, candidates, asset, haystack, role, wantsVideo);
  const alternates = alternateAssets.map((alternate, index) => {
    const alternateSeed = `${seed}:alternate:${index}:${alternate.id}`;
    const alternateSource = sourceForAsset(alternate, alternateSeed, role, transforms, ctx.motifs, false);

    return {
      key: `${assetKey(alternate)}:${alternate.id}`,
      asset: { ...alternate, queries },
      alt: altText(alternate, role, ctx),
      ...alternateSource
    };
  });

  return {
    asset: { ...asset, queries },
    alt: altText(asset, role, ctx),
    ...source,
    transforms,
    pixelated,
    cssFilter: cssFilterForTransforms(transforms),
    broken,
    aging: imageAgingFor(seed, ctx, transforms, role),
    role,
    videoPlayerVariant: pick(`${seed}:video-player`, ["native", "streaming", "webcam", "mini-disc", "archive"]),
    alternates
  };
}

function sourceForAsset(asset: MediaAsset, seed: string, role: string, transforms: string[], motifs: string[], broken: boolean) {
  const hasRemotePreview = /^https?:\/\//.test(asset.previewUrl);
  const hasRemoteVideo = asset.type === "video" && /^https?:\/\//.test(asset.originalUrl ?? "");
  const remixRemoteStill = !hasRemoteVideo && hasRemotePreview && createRng(`${seed}:remote-remix`).bool(0.52);

  if (broken) {
    return {
      kind: "broken" as const,
      src: brokenSvg(asset, seed, role)
    };
  }

  if (isBuiltInVideoFallback(asset)) {
    return {
      kind: "generated" as const,
      src: generatedSvg(asset, seed, role, transforms, motifs)
    };
  }

  if ((hasRemotePreview || hasRemoteVideo) && !remixRemoteStill) {
    return {
      kind: "real" as const,
      src: hasRemotePreview ? asset.previewUrl : generatedSvg(asset, seed, role, transforms, motifs),
      videoSrc: asset.type === "video" ? asset.originalUrl : undefined
    };
  }

  return {
    kind: "generated" as const,
    src: generatedSvg(asset, seed, role, transforms, motifs)
  };
}

function altText(asset: MediaAsset, role: string, ctx: GeneratedComponentContext) {
  return `${role} image for ${ctx.genreFormula.surface} remembering ${ctx.genreFormula.residue} (${asset.id})`;
}

function imageAgingFor(seed: string, ctx: GeneratedComponentContext, transforms: string[], role: string): ImageAging {
  const rng = createRng(`${seed}:aging`);
  const between = (min: number, max: number) => rng.next() * (max - min) + min;
  const profile = ctx.mediaProfile.id;
  const depthAge = Math.min(1, Math.max(0, ctx.depth / 36));
  const lowResTransform = transforms.includes("pixelated") || transforms.includes("low-res") || transforms.includes("secondary-lowres");
  const isPrimaryHero = /\bhero\b/i.test(role);

  let resolutionScale = 1;
  let grain = 0;
  let contrast = 1;
  let label: ImageAging["label"] = "clean";
  const profileChance: Record<string, number> = {
    "thumb-2000": 0.58,
    "archive-scrape": 0.5,
    "broadband-720": 0.22,
    "mobile-mirror": 0.16,
    "hd-marketing": 0.08,
    "ultra-clean": 0.02
  };
  const agingChance = Math.min(0.78, (profileChance[profile] ?? 0.12) + depthAge * 0.28 + (lowResTransform ? 0.18 : 0));
  const shouldAge = rng.bool(agingChance);

  if (!shouldAge) {
    return { resolutionScale, grain, contrast, label };
  }

  if (profile === "thumb-2000") {
    resolutionScale = between(0.2, 0.42);
    grain = between(0.1, 0.24);
    contrast = between(1.02, 1.16);
    label = lowResTransform ? "pixelated" : "compressed";
  } else if (profile === "archive-scrape") {
    resolutionScale = between(0.24, 0.52);
    grain = between(0.12, 0.3);
    contrast = between(0.9, 1.05);
    label = "archival";
  } else if (profile === "broadband-720") {
    resolutionScale = between(0.55, 0.82);
    grain = between(0.03, 0.1);
    contrast = between(0.96, 1.12);
    label = "compressed";
  } else if (profile === "mobile-mirror") {
    resolutionScale = between(0.62, 0.88);
    grain = between(0.02, 0.08);
    contrast = between(1, 1.16);
    label = "soft";
  } else if (profile === "hd-marketing" && (lowResTransform || !isPrimaryHero)) {
    resolutionScale = between(0.72, 0.92);
    grain = between(0.01, 0.06);
    contrast = between(0.98, 1.08);
    label = "soft";
  }

  if (lowResTransform && resolutionScale > 0.38) {
    resolutionScale = between(0.28, 0.48);
    grain = Math.max(grain, between(0.06, 0.16));
    label = "pixelated";
  }

  if (depthAge > 0) {
    const ageHit = rng.bool(0.08 + depthAge * 0.32);
    if (ageHit) {
      resolutionScale = Math.min(resolutionScale, between(0.24, 0.76 - depthAge * 0.18));
      grain = Math.max(grain, between(0.05, 0.16 + depthAge * 0.18));
      contrast = contrast * between(0.94, 1.12);
      label = depthAge > 0.65 ? "archival" : "compressed";
    }
  }

  return {
    resolutionScale: Number(Math.max(0.06, Math.min(1, resolutionScale)).toFixed(3)),
    grain: Number(Math.max(0, Math.min(0.55, grain)).toFixed(3)),
    contrast: Number(Math.max(0.75, Math.min(1.35, contrast)).toFixed(3)),
    label
  };
}

function diversifyCandidates(seed: string, taggedCandidates: MediaAsset[], wantsVideo: boolean, haystack: string, role: string) {
  const realVideoCandidates = taggedCandidates.filter(isPlayableNonFallbackVideo);
  const globalRealVideos = mediaManifest.filter(isPlayableNonFallbackVideo);
  const enoughRealVideoVariety = wantsVideo && (realVideoCandidates.length >= 6 || globalRealVideos.length >= 6);
  const longTailLimit = wantsVideo && !enoughRealVideoVariety ? 140 : 88;
  const longTail = mediaManifest
    .map((asset) => ({
      asset,
      score: hashString(`${seed}:long-tail:${asset.id}:${assetKey(asset)}`)
    }))
    .sort((a, b) => a.score.localeCompare(b.score))
    .slice(0, Math.min(longTailLimit, mediaManifest.length))
    .map(({ asset }) => asset);

  const builtInVideos = wantsVideo && !enoughRealVideoVariety
    ? mediaManifest.filter(isBuiltInVideoFallback)
    : [];
  const videoLikePosters = wantsVideo && !enoughRealVideoVariety
    ? mediaManifest.filter((asset) => asset.type !== "video" && mediaMatches(asset, `${haystack} video stream thumbnail`, role))
    : [];
  const videoPool = enoughRealVideoVariety ? [...realVideoCandidates, ...globalRealVideos] : [...builtInVideos, ...videoLikePosters];
  const relevantPool = taggedCandidates.length ? taggedCandidates : mediaManifest;
  const expanded = wantsVideo
    ? [...videoPool, ...relevantPool, ...longTail, ...mediaManifest.filter((asset) => asset.type === "video")]
    : [...relevantPool, ...longTail];

  return dedupeAssets(expanded);
}

function balancedMediaPick(seed: string, candidates: MediaAsset[], haystack: string, role: string, wantsVideo: boolean) {
  const playableVideos = wantsVideo ? candidates.filter((asset) => asset.type === "video" && Boolean(asset.originalUrl)) : [];
  const pickPool = playableVideos.length > 0 ? playableVideos : candidates;
  const weighted = pickPool.map((asset) => ({ asset, weight: mediaWeight(asset, haystack, role, wantsVideo) }));
  const byProvider = new Map<MediaAsset["provider"], typeof weighted>();
  for (const item of weighted) {
    const items = byProvider.get(item.asset.provider) ?? [];
    items.push(item);
    byProvider.set(item.asset.provider, items);
  }

  const providerItems = [...byProvider.entries()].map(([provider, items]) => {
    const ranked = [...items].sort((a, b) => b.weight - a.weight);
    const representativeWeight = ranked.slice(0, Math.min(6, ranked.length)).reduce((sum, item) => sum + item.weight, 0) / Math.min(6, ranked.length);
    return { provider, items, weight: Math.max(0.05, representativeWeight) };
  });
  const provider = weightedPick(
    `${seed}:provider`,
    providerItems.map((item) => ({
      value: item,
      weight: item.weight * (1 - providerBalanceJitter + createRng(`${seed}:provider-jitter:${item.provider}`).next() * providerBalanceJitter * 2)
    }))
  );

  return weightedPick(
    `${seed}:asset-within:${provider.provider}`,
    provider.items.map((item) => ({ value: item.asset, weight: item.weight }))
  );
}

function alternateMediaAssets(seed: string, candidates: MediaAsset[], selected: MediaAsset, haystack: string, role: string, wantsVideo: boolean) {
  const ranked = candidates
    .filter((asset) => assetKey(asset) !== assetKey(selected))
    .map((asset) => ({
      asset,
      weight: mediaWeight(asset, haystack, role, wantsVideo),
      score: hashString(`${seed}:${asset.id}:${assetKey(asset)}`)
    }))
    .sort((a, b) => {
      const weightDelta = b.weight - a.weight;
      if (Math.abs(weightDelta) > 2.5) return weightDelta;
      return a.score.localeCompare(b.score);
    });
  const byProvider = new Map<MediaAsset["provider"], typeof ranked>();
  for (const item of ranked) {
    const items = byProvider.get(item.asset.provider) ?? [];
    items.push(item);
    byProvider.set(item.asset.provider, items);
  }
  const providers = [...byProvider.keys()].sort((a, b) => hashString(`${seed}:provider:${a}`).localeCompare(hashString(`${seed}:provider:${b}`)));
  const alternates: MediaAsset[] = [];

  while (alternates.length < alternateLimit && providers.length > 0) {
    let added = false;
    for (const provider of providers) {
      const next = byProvider.get(provider)?.shift();
      if (!next) continue;
      alternates.push(next.asset);
      added = true;
      if (alternates.length >= alternateLimit) break;
    }
    if (!added) break;
  }

  return alternates;
}

function mediaWeight(asset: MediaAsset, haystack: string, role: string, wantsVideo: boolean) {
  const tagHits = asset.tags.filter((tag) => haystack.includes(tag) || role.toLowerCase().includes(tag)).length;
  const queryHits = asset.queries.filter((query) => haystack.includes(query.toLowerCase())).length;
  let weight = 1 + tagHits * 2.4 + queryHits * 1.6;

  if (asset.tags.includes(role)) weight += 3;
  if (wantsVideo && isPlayableNonFallbackVideo(asset)) weight += 7;
  if (wantsVideo && isBuiltInVideoFallback(asset)) weight += 9;
  if (wantsVideo && asset.type !== "video" && hasVideoSemantics(asset)) weight += 4;
  if (asset.provider === "project" && !isBuiltInVideoFallback(asset) && mediaManifest.some((candidate) => candidate.provider !== "project")) weight *= 0.35;

  return Math.max(0.05, weight);
}

function mediaMatches(asset: MediaAsset, haystack: string, role: string) {
  const normalizedRole = role.toLowerCase();
  return asset.tags.some((tag) => haystack.includes(tag) || normalizedRole.includes(tag)) || asset.queries.some((query) => haystack.includes(query.toLowerCase()));
}

function hasVideoSemantics(asset: MediaAsset) {
  return asset.tags.some((tag) => /\b(video|stream|watch|thumbnail|episode|trailer|screen|television|playlist)\b/i.test(tag));
}

function isPlayableNonFallbackVideo(asset: MediaAsset) {
  return asset.type === "video" && Boolean(asset.originalUrl) && !isBuiltInVideoFallback(asset);
}

function isBuiltInVideoFallback(asset: MediaAsset) {
  return asset.provider === "project" && asset.type === "video";
}

function dedupeAssets(assets: MediaAsset[]) {
  const seen = new Set<string>();
  const unique: MediaAsset[] = [];

  for (const asset of assets) {
    const key = assetKey(asset);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(asset);
  }

  return unique;
}

function weightedPick<T>(seed: string, items: { value: T; weight: number }[]): T {
  if (items.length === 0) throw new Error("Cannot pick from an empty list.");
  const rng = createRng(`${seed}:weighted-pick`);
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let target = rng.next() * total;

  for (const item of items) {
    target -= item.weight;
    if (target <= 0) return item.value;
  }

  return items[items.length - 1].value;
}

function assetKey(asset: MediaAsset) {
  return asset.originalUrl || asset.previewUrl || asset.sourceUrl || asset.id;
}

function generatedSvg(asset: MediaAsset, seed: string, role: string, transforms: string[], motifs: string[]) {
  const rng = createRng(seed);
  const bg = asset.dominantColor ?? "#e5e7eb";
  const accent = colorShift(bg, rng.int(20, 80));
  const label = `${role.toUpperCase()} / ${motifs[0] ?? "LOCAL"}`;
  const secondary = motifs.slice(1, 3).join(" - ") || asset.tags.slice(0, 2).join(" - ");
  const scanlines = transforms.includes("scanlines")
    ? `<path d="M0 40 H1200 M0 80 H1200 M0 120 H1200 M0 160 H1200 M0 200 H1200 M0 240 H1200 M0 280 H1200 M0 320 H1200 M0 360 H1200 M0 400 H1200 M0 440 H1200 M0 480 H1200 M0 520 H1200 M0 560 H1200 M0 600 H1200 M0 640 H1200 M0 680 H1200" stroke="rgba(0,0,0,.08)" stroke-width="2"/>`
    : "";
  const blocks = Array.from({ length: 8 })
    .map((_, index) => {
      const x = rng.int(20, 1020);
      const y = rng.int(80, 570);
      const w = rng.int(56, 190);
      const h = rng.int(24, 120);
      const opacity = (rng.int(10, 38) / 100).toFixed(2);
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rng.int(0, 10)}" fill="${index % 2 ? "#fff" : accent}" opacity="${opacity}"/>`;
    })
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${escapeXml(bg)}"/>
        <stop offset="1" stop-color="${escapeXml(accent)}"/>
      </linearGradient>
      <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="${rng.int(1, 90)}"/><feColorMatrix type="saturate" values=".12"/><feBlend mode="multiply" in2="SourceGraphic"/></filter>
    </defs>
    <rect width="1200" height="760" fill="url(#g)"/>
    <rect x="28" y="28" width="1144" height="704" fill="rgba(255,255,255,.2)" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
    ${blocks}
    <circle cx="${rng.int(140, 960)}" cy="${rng.int(120, 520)}" r="${rng.int(38, 120)}" fill="rgba(255,255,255,.28)"/>
    <path d="M60 ${rng.int(610, 700)} C 260 ${rng.int(480, 640)}, 430 ${rng.int(700, 730)}, 650 ${rng.int(560, 700)} S 1030 ${rng.int(640, 720)}, 1140 ${rng.int(520, 680)}" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="5"/>
    ${scanlines}
    <g filter="url(#rough)">
      <rect x="64" y="64" width="520" height="92" fill="rgba(255,255,255,.64)" stroke="rgba(0,0,0,.24)"/>
      <text x="88" y="112" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#111">${escapeXml(label)}</text>
      <text x="90" y="140" font-family="Courier New, monospace" font-size="18" fill="#333">${escapeXml(secondary)}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function brokenSvg(asset: MediaAsset, seed: string, role: string) {
  const rng = createRng(seed);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 900 620">
    <rect width="900" height="620" fill="#f3f3f3"/>
    <rect x="18" y="18" width="864" height="584" fill="none" stroke="#9a9a9a" stroke-dasharray="8 5"/>
    <path d="M110 460 L318 260 L430 362 L560 190 L790 460 Z" fill="#d4d4d4" stroke="#777"/>
    <rect x="72" y="62" width="${rng.int(180, 380)}" height="28" fill="#c9c9c9"/>
    <text x="74" y="125" font-family="Times New Roman, serif" font-size="24" fill="#222">Image may be available: ${escapeXml(role)}</text>
    <text x="74" y="158" font-family="Courier New, monospace" font-size="16" fill="#555">${escapeXml(asset.id)} / retry later / ${rng.int(1998, 2028)}</text>
    <rect x="74" y="190" width="160" height="36" fill="#e6e6e6" stroke="#777"/>
    <text x="92" y="214" font-family="Arial" font-size="16" fill="#111">open preview</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function colorShift(hex: string, amount: number) {
  const parsed = hex.replace("#", "");
  const num = parseInt(parsed.length === 3 ? parsed.split("").map((ch) => ch + ch).join("") : parsed, 16);
  const r = Math.min(255, ((num >> 16) & 255) + amount);
  const g = Math.min(255, ((num >> 8) & 255) + Math.floor(amount / 2));
  const b = Math.max(0, (num & 255) - amount);
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] ?? char);
}
