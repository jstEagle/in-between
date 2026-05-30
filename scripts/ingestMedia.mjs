#!/usr/bin/env node
/**
 * Media ingestion for "in between space".
 *
 * Pulls real, openly-licensed photos AND videos from free providers:
 *   - Pexels   (https://api.pexels.com)      — photos + videos  [needs PEXELS_API_KEY]
 *   - Pixabay  (https://pixabay.com/api)      — photos + videos  [needs PIXABAY_API_KEY]
 *   - Openverse (https://api.openverse.org)   — CC photos        [no key]
 *   - Wikimedia Commons (commons.wikimedia.org) — archival / PD  [no key]
 *
 * Keys are read from .env / .env.local in the project root. Providers without a
 * key are simply skipped, so this runs today on the keyless providers and
 * automatically widens to Pexels/Pixabay the moment keys are added.
 *
 * Results are normalized into the MediaAsset shape and written to
 * content/image-manifest.json. Runtime pages render from that manifest
 * (manifest-first, deterministic, instant) and deliberately misuse the assets
 * across unrelated web genres. License + attribution are always preserved.
 *
 * Usage:  node scripts/ingestMedia.mjs [perQuery] [pagesPerQuery]
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "content", "image-manifest.json");
const UA = "in-between-space/0.1 (deterministic web-labyrinth art project; contact: local-dev)";
const PER_QUERY = Number.parseInt(process.argv[2] ?? "12", 10);
const PAGES_PER_QUERY = Number.parseInt(process.argv[3] ?? "3", 10);

// ---- minimal .env loader (root .env then .env.local, which wins) ----
async function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    try {
      const raw = await readFile(join(ROOT, file), "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (!m) continue;
        const value = m[2].replace(/^["']|["']$/g, "");
        if (!(m[1] in process.env)) process.env[m[1]] = value;
      }
    } catch {
      /* file absent — fine */
    }
  }
}

// Mundane, provider-safe queries drawn from the vision word banks. Each carries
// a `tags` set that the runtime image engine matches against generated queries.
const openverseQueries = [
  { q: "hotel lobby", tags: ["hotel", "lobby", "reception", "booking", "travel"] },
  { q: "hotel reception desk", tags: ["hotel", "reception", "desk", "guest", "booking"] },
  { q: "apartment interior", tags: ["apartment", "interior", "suite", "room", "travel"] },
  { q: "breakfast table", tags: ["breakfast", "food", "hotel", "morning"] },
  { q: "office desk laptop", tags: ["office", "desk", "laptop", "corporate", "dashboard"] },
  { q: "business meeting room", tags: ["office", "meeting", "corporate", "conference"] },
  { q: "shopping mall interior", tags: ["shopping", "mall", "retail", "product"] },
  { q: "product still life", tags: ["product", "catalog", "shopping", "thumbnail"] },
  { q: "supermarket aisle", tags: ["supermarket", "shopping", "delivery", "warehouse"] },
  { q: "warehouse shelves", tags: ["warehouse", "delivery", "package", "logistics"] },
  { q: "customer service call center", tags: ["customer", "service", "office", "support"] },
  { q: "television screen", tags: ["television", "screen", "video", "streaming", "entertainment"] },
  { q: "arcade game machine", tags: ["arcade", "game", "controller", "entertainment", "kids"] },
  { q: "city street newspaper", tags: ["city", "newspaper", "news", "press", "street"] },
  { q: "empty waiting room", tags: ["waiting", "lobby", "office", "reception"] },
  { q: "computer dashboard screen", tags: ["dashboard", "software", "screen", "metrics", "app"] },
  { q: "server room", tags: ["server", "software", "dashboard", "technology"] },
  { q: "parking garage", tags: ["parking", "garage", "directory", "public"] },
  { q: "library catalog", tags: ["library", "catalog", "archive", "directory", "document"] },
  { q: "conference badge lanyard", tags: ["conference", "badge", "profile", "membership"] },
  { q: "vending machine", tags: ["vending", "product", "machine", "retail"] },
  { q: "luggage suitcase", tags: ["luggage", "travel", "booking", "guest"] }
];

const wikimediaQueries = [
  { q: "technical diagram", tags: ["diagram", "manual", "archive", "document"] },
  { q: "old road map", tags: ["map", "directory", "archive", "travel"] },
  { q: "public information sign", tags: ["sign", "public", "directory", "signage"] },
  { q: "vintage brochure", tags: ["brochure", "archive", "catalog", "document"] },
  { q: "instruction manual page", tags: ["manual", "document", "archive", "help"] }
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function licenseRequiresAttribution(license) {
  const l = (license ?? "").toLowerCase();
  return !(l === "cc0" || l === "pdm" || l === "public domain" || l.includes("publicdomain"));
}

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json", ...headers } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function ingestOpenverse(entry) {
  const assets = [];
  for (let page = 1; page <= PAGES_PER_QUERY; page += 1) {
    const url = new URL("https://api.openverse.org/v1/images/");
    url.searchParams.set("q", entry.q);
    url.searchParams.set("page_size", String(PER_QUERY));
    url.searchParams.set("page", String(page));
    url.searchParams.set("license_type", "all-cc,commercial");
    url.searchParams.set("mature", "false");
    url.searchParams.set("aspect_ratio", "wide,square");

    try {
      const data = await fetchJson(url);
      assets.push(...(data.results ?? [])
      .filter((r) => r.thumbnail || r.url)
      .map((r) => ({
        id: `openverse-${r.id}`,
        provider: "openverse",
        type: "photo",
        sourceUrl: r.foreign_landing_url ?? r.url,
        previewUrl: r.thumbnail ?? r.url,
        originalUrl: r.url,
        width: r.width,
        height: r.height,
        author: r.creator,
        authorUrl: r.creator_url,
        license: r.license ? `${r.license}${r.license_version ? " " + r.license_version : ""}`.toUpperCase() : undefined,
        licenseUrl: r.license_url,
        attributionRequired: licenseRequiresAttribution(r.license),
        attributionText: r.attribution,
        queries: [entry.q],
        tags: dedupe([...entry.tags, ...entry.q.split(/\s+/)]),
        dominantColor: undefined,
        safety: { safeSearchApplied: true, safeSearchMode: "openverse:mature=false", reviewed: false }
      })));
    } catch (err) {
      console.warn(`  ! openverse "${entry.q}" page ${page}: ${err.message}`);
    }
    await sleep(120);
  }
  return assets;
}

async function ingestWikimedia(entry) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", `filetype:bitmap ${entry.q}`);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", String(PER_QUERY));
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|size|extmetadata");
  url.searchParams.set("iiurlwidth", "1000");

  try {
    const data = await fetchJson(url);
    const pages = Object.values(data?.query?.pages ?? {});
    return pages
      .map((p) => {
        const info = p.imageinfo?.[0];
        if (!info?.thumburl) return null;
        const meta = info.extmetadata ?? {};
        const license = meta.LicenseShortName?.value;
        const artist = stripHtml(meta.Artist?.value);
        return {
          id: `wikimedia-${p.pageid}`,
          provider: "wikimedia",
          type: "photo",
          sourceUrl: info.descriptionurl ?? info.url,
          previewUrl: info.thumburl,
          originalUrl: info.url,
          width: info.thumbwidth ?? info.width,
          height: info.thumbheight ?? info.height,
          author: artist,
          authorUrl: undefined,
          license: license,
          licenseUrl: meta.LicenseUrl?.value,
          attributionRequired: licenseRequiresAttribution(license),
          attributionText: artist ? `${artist} via Wikimedia Commons${license ? ", " + license : ""}` : undefined,
          queries: [entry.q],
          tags: dedupe([...entry.tags, ...entry.q.split(/\s+/)]),
          safety: { safeSearchApplied: true, safeSearchMode: "wikimedia:conservative-query", reviewed: false }
        };
      })
      .filter(Boolean);
  } catch (err) {
    console.warn(`  ! wikimedia "${entry.q}": ${err.message}`);
    return [];
  }
}

async function ingestPexelsPhotos(entry) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const assets = [];
  for (let page = 1; page <= PAGES_PER_QUERY; page += 1) {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", entry.q);
    url.searchParams.set("per_page", String(PER_QUERY));
    url.searchParams.set("page", String(page));
    try {
      const data = await fetchJson(url, { Authorization: key });
      assets.push(...(data.photos ?? [])
      .filter((p) => p?.src?.large)
      .map((p) => ({
        id: `pexels-${p.id}`,
        provider: "pexels",
        type: "photo",
        sourceUrl: p.url,
        previewUrl: p.src.large,
        originalUrl: p.src.original ?? p.src.large2x,
        width: p.width,
        height: p.height,
        author: p.photographer,
        authorUrl: p.photographer_url,
        license: "Pexels License",
        licenseUrl: "https://www.pexels.com/license/",
        attributionRequired: false,
        attributionText: p.photographer ? `Photo by ${p.photographer} on Pexels` : "Pexels",
        queries: [entry.q],
        tags: dedupe([...entry.tags, ...entry.q.split(/\s+/)]),
        dominantColor: p.avg_color,
        safety: { safeSearchApplied: true, safeSearchMode: "pexels:conservative-query", reviewed: false }
      })));
    } catch (err) {
      console.warn(`  ! pexels photo "${entry.q}" page ${page}: ${err.message}`);
    }
    await sleep(120);
  }
  return assets;
}

async function ingestPexelsVideos(entry) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const assets = [];
  for (let page = 1; page <= PAGES_PER_QUERY; page += 1) {
    const url = new URL("https://api.pexels.com/videos/search");
    url.searchParams.set("query", entry.q);
    url.searchParams.set("per_page", String(Math.max(3, Math.ceil(PER_QUERY / 2))));
    url.searchParams.set("page", String(page));
    try {
      const data = await fetchJson(url, { Authorization: key });
      assets.push(...(data.videos ?? [])
      .map((v) => {
        // prefer a mid-size mp4 file
        const files = (v.video_files ?? []).filter((f) => f.file_type === "video/mp4");
        const file =
          files.sort((a, b) => (a.width ?? 0) - (b.width ?? 0)).find((f) => (f.width ?? 0) >= 640) ?? files[0];
        if (!file || !v.image) return null;
        return {
          id: `pexels-video-${v.id}`,
          provider: "pexels",
          type: "video",
          sourceUrl: v.url,
          previewUrl: v.image, // poster frame
          originalUrl: file.link,
          width: v.width,
          height: v.height,
          durationSeconds: v.duration,
          author: v.user?.name,
          authorUrl: v.user?.url,
          license: "Pexels License",
          licenseUrl: "https://www.pexels.com/license/",
          attributionRequired: false,
          attributionText: v.user?.name ? `Video by ${v.user.name} on Pexels` : "Pexels",
          queries: [entry.q],
          tags: dedupe([...entry.tags, ...entry.q.split(/\s+/), "video", "stream"]),
          safety: { safeSearchApplied: true, safeSearchMode: "pexels:conservative-query", reviewed: false }
        };
      })
      .filter(Boolean));
    } catch (err) {
      console.warn(`  ! pexels video "${entry.q}" page ${page}: ${err.message}`);
    }
    await sleep(120);
  }
  return assets;
}

async function ingestPixabay(entry) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return [];
  const assets = [];
  for (let page = 1; page <= PAGES_PER_QUERY; page += 1) {
    const url = new URL("https://pixabay.com/api/");
    url.searchParams.set("key", key);
    url.searchParams.set("q", entry.q);
    url.searchParams.set("image_type", "photo");
    url.searchParams.set("safesearch", "true");
    url.searchParams.set("per_page", String(Math.max(3, PER_QUERY)));
    url.searchParams.set("page", String(page));
    try {
      const data = await fetchJson(url);
      assets.push(...(data.hits ?? [])
      .filter((h) => h.webformatURL)
      .map((h) => ({
        id: `pixabay-${h.id}`,
        provider: "pixabay",
        type: "photo",
        sourceUrl: h.pageURL,
        previewUrl: h.largeImageURL ?? h.webformatURL,
        originalUrl: h.largeImageURL ?? h.fullHDURL,
        width: h.imageWidth,
        height: h.imageHeight,
        author: h.user,
        authorUrl: h.user ? `https://pixabay.com/users/${h.user}-${h.user_id}/` : undefined,
        license: "Pixabay Content License",
        licenseUrl: "https://pixabay.com/service/license-summary/",
        attributionRequired: false,
        attributionText: h.user ? `Image by ${h.user} on Pixabay` : "Pixabay",
        queries: [entry.q],
        tags: dedupe([...entry.tags, ...entry.q.split(/\s+/), ...String(h.tags ?? "").split(/,\s*/)]),
        safety: { safeSearchApplied: true, safeSearchMode: "pixabay:safesearch=true", reviewed: false }
      })));
    } catch (err) {
      console.warn(`  ! pixabay photo "${entry.q}" page ${page}: ${err.message}`);
    }
    await sleep(120);
  }
  return assets;
}

async function ingestPixabayVideos(entry) {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return [];
  const assets = [];
  for (let page = 1; page <= PAGES_PER_QUERY; page += 1) {
    const url = new URL("https://pixabay.com/api/videos/");
    url.searchParams.set("key", key);
    url.searchParams.set("q", entry.q);
    url.searchParams.set("video_type", "all");
    url.searchParams.set("safesearch", "true");
    url.searchParams.set("per_page", String(Math.max(3, Math.ceil(PER_QUERY / 2))));
    url.searchParams.set("page", String(page));
    try {
      const data = await fetchJson(url);
      assets.push(...(data.hits ?? [])
        .map((h) => {
          const video = h.videos?.medium ?? h.videos?.small ?? h.videos?.large ?? h.videos?.tiny;
          if (!video?.url || !h.picture_id) return null;
          return {
            id: `pixabay-video-${h.id}`,
            provider: "pixabay",
            type: "video",
            sourceUrl: h.pageURL,
            previewUrl: `https://i.vimeocdn.com/video/${h.picture_id}_960x540.jpg`,
            originalUrl: video.url,
            width: video.width,
            height: video.height,
            durationSeconds: h.duration,
            author: h.user,
            authorUrl: h.user ? `https://pixabay.com/users/${h.user}-${h.user_id}/` : undefined,
            license: "Pixabay Content License",
            licenseUrl: "https://pixabay.com/service/license-summary/",
            attributionRequired: false,
            attributionText: h.user ? `Video by ${h.user} on Pixabay` : "Pixabay",
            queries: [entry.q],
            tags: dedupe([...entry.tags, ...entry.q.split(/\s+/), ...String(h.tags ?? "").split(/,\s*/), "video", "stream"]),
            safety: { safeSearchApplied: true, safeSearchMode: "pixabay-videos:safesearch=true", reviewed: false }
          };
        })
        .filter(Boolean));
    } catch (err) {
      console.warn(`  ! pixabay video "${entry.q}" page ${page}: ${err.message}`);
    }
    await sleep(120);
  }
  return assets;
}

function stripHtml(value) {
  if (!value) return undefined;
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || undefined;
}

function dedupe(arr) {
  return [...new Set(arr.map((s) => s.toLowerCase()))];
}

async function main() {
  await loadEnv();
  const hasPexels = Boolean(process.env.PEXELS_API_KEY);
  const hasPixabay = Boolean(process.env.PIXABAY_API_KEY);
  console.log(`Ingesting media (perQuery=${PER_QUERY}, pagesPerQuery=${PAGES_PER_QUERY})`);
  console.log(`  providers: openverse=yes wikimedia=yes pexels=${hasPexels ? "yes" : "no key"} pixabay=${hasPixabay ? "yes" : "no key"}`);
  if (!hasPexels || !hasPixabay) {
    console.log("  (add PEXELS_API_KEY / PIXABAY_API_KEY to .env.local to include those providers)");
  }
  const assets = [];

  for (const entry of openverseQueries) {
    if (hasPexels) {
      const photos = await ingestPexelsPhotos(entry);
      const videos = await ingestPexelsVideos(entry);
      console.log(`  pexels "${entry.q}" -> ${photos.length} photos, ${videos.length} videos`);
      assets.push(...photos, ...videos);
      await sleep(250);
    }
    if (hasPixabay) {
      const pix = await ingestPixabay(entry);
      const pixVideos = await ingestPixabayVideos(entry);
      console.log(`  pixabay "${entry.q}" -> ${pix.length} photos, ${pixVideos.length} videos`);
      assets.push(...pix, ...pixVideos);
      await sleep(250);
    }
    const found = await ingestOpenverse(entry);
    console.log(`  openverse "${entry.q}" -> ${found.length}`);
    assets.push(...found);
    await sleep(300);
  }

  for (const entry of wikimediaQueries) {
    const found = await ingestWikimedia(entry);
    console.log(`  wikimedia "${entry.q}" -> ${found.length}`);
    assets.push(...found);
    await sleep(300);
  }

  // de-duplicate by id and drop anything missing a usable preview
  const seen = new Set();
  const clean = assets.filter((a) => a.previewUrl && !seen.has(a.id) && seen.add(a.id));

  await writeFile(OUT, JSON.stringify(clean, null, 2));
  console.log(`\nWrote ${clean.length} assets to ${OUT}`);
  const byProvider = clean.reduce((acc, a) => ((acc[a.provider] = (acc[a.provider] ?? 0) + 1), acc), {});
  console.log("By provider:", byProvider);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
