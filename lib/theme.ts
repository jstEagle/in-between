import type { ThemeTokens } from "./types";
import { chooseFonts } from "./fonts";
import { createRng, pick } from "./seed";

type Hsl = { h: number; s: number; l: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapHue(hue: number) {
  return ((hue % 360) + 360) % 360;
}

function hslToHex({ h, s, l }: Hsl) {
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function readableAccent(base: Hsl, dark: boolean, offset: number) {
  return {
    h: wrapHue(base.h + offset),
    s: clamp(base.s + (dark ? 20 : 34), 58, 94),
    l: dark ? clamp(base.l + 46, 58, 78) : clamp(base.l - 42, 26, 42)
  };
}

function generatedPalette(seed: string) {
  const rng = createRng(`${seed}:generated-palette`);
  const dark = rng.bool(0.4);
  // A minority of light pages lean into a tinted, almost-branded background
  // instead of near-white, so the labyrinth isn't a sea of pale cards.
  const tinted = !dark && rng.bool(0.32);
  const base: Hsl = {
    h: rng.int(0, 359),
    s: dark ? rng.int(16, 46) : tinted ? rng.int(28, 62) : rng.int(10, 34),
    l: dark ? rng.int(6, 17) : tinted ? rng.int(82, 92) : rng.int(92, 98)
  };
  const accent = readableAccent(base, dark, pick(`${seed}:accent-offset`, [72, 108, 137, 164, 196, 222]));
  const accent2 = readableAccent(base, dark, pick(`${seed}:accent2-offset`, [-146, -118, -84, 38, 262, 312]));
  const muted: Hsl = {
    h: wrapHue(base.h + rng.int(-16, 16)),
    s: clamp(base.s + rng.int(-8, 14), 10, 48),
    l: dark ? clamp(base.l + rng.int(8, 17), 16, 32) : clamp(base.l - rng.int(8, 18), 76, 90)
  };
  const border: Hsl = {
    h: wrapHue(base.h + rng.int(-24, 24)),
    s: clamp(base.s + rng.int(-10, 6), 8, 38),
    l: dark ? clamp(base.l + rng.int(18, 30), 28, 48) : clamp(base.l - rng.int(20, 34), 56, 76)
  };

  return {
    bg: hslToHex(base),
    fg: hslToHex({ h: base.h, s: dark ? rng.int(8, 18) : rng.int(8, 22), l: dark ? rng.int(91, 98) : rng.int(6, 18) }),
    accent: hslToHex(accent),
    accent2: hslToHex(accent2),
    muted: hslToHex(muted),
    border: hslToHex(border),
    link: hslToHex(readableAccent(base, dark, pick(`${seed}:link-offset`, [28, 204, 232, 258]))),
    danger: hslToHex({ h: rng.int(346, 378), s: dark ? rng.int(68, 92) : rng.int(66, 88), l: dark ? rng.int(62, 76) : rng.int(34, 46) }),
    scheme: dark ? "dark" : "light" as "light" | "dark"
  };
}

type Palette = {
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
  muted: string;
  border: string;
  link: string;
  danger: string;
  scheme: "light" | "dark";
};

/**
 * Hand-tuned palettes. The generative algorithm above keeps the labyrinth
 * infinite, but a sizeable share of pages pull from this curated library so the
 * colour work reads as *designed* — coherent eras and moods rather than random
 * hues. Each entry is internally harmonious; the seed still decides which one.
 */
const curatedPalettes: Palette[] = [
  { bg: "#f6f4ee", fg: "#1d1c19", accent: "#1f6f73", accent2: "#b4532a", muted: "#e7e2d6", border: "#c3bcaa", link: "#0c5b8a", danger: "#b42318", scheme: "light" },
  { bg: "#fbf8f3", fg: "#2a2622", accent: "#a3582a", accent2: "#3f6f4f", muted: "#efe8dc", border: "#d8cdb8", link: "#7a3f1d", danger: "#a8321f", scheme: "light" },
  { bg: "#0e1116", fg: "#e8ecf2", accent: "#5cc8d8", accent2: "#f08a5d", muted: "#1b2029", border: "#2c333f", link: "#7fb2ff", danger: "#ff6b6b", scheme: "dark" },
  { bg: "#111014", fg: "#ece8f0", accent: "#c4a6ff", accent2: "#67e8a8", muted: "#1d1b22", border: "#332f3d", link: "#b39bff", danger: "#ff7a90", scheme: "dark" },
  { bg: "#eef1f4", fg: "#16202b", accent: "#2f5fd0", accent2: "#d0552f", muted: "#dde3ea", border: "#bcc6d2", link: "#1f4fb8", danger: "#c0392b", scheme: "light" },
  { bg: "#fff7ec", fg: "#3a2c14", accent: "#c9892a", accent2: "#6b8f3a", muted: "#f6e9cf", border: "#e3cfa0", link: "#9a5a12", danger: "#b03a1d", scheme: "light" },
  { bg: "#07090c", fg: "#d6f5e6", accent: "#39d98a", accent2: "#2f9bd0", muted: "#10161b", border: "#1e2a2f", link: "#54e0a0", danger: "#ff7b6b", scheme: "dark" },
  { bg: "#f3eef7", fg: "#241a2e", accent: "#7b3fe4", accent2: "#e0699b", muted: "#e7ddf0", border: "#cdbfdd", link: "#5e2bc4", danger: "#c0306a", scheme: "light" },
  { bg: "#1a1410", fg: "#f3e7d8", accent: "#e0a35a", accent2: "#7fae8a", muted: "#241c16", border: "#3a2e24", link: "#f0b86c", danger: "#e8705a", scheme: "dark" },
  { bg: "#eaf4f1", fg: "#10261f", accent: "#0f8a6a", accent2: "#c46a2b", muted: "#d6e8e1", border: "#bcd4cb", link: "#0a6b53", danger: "#b8401f", scheme: "light" },
  { bg: "#fdeef0", fg: "#2c1418", accent: "#d23b5e", accent2: "#3f8fb0", muted: "#f7dce1", border: "#e8bcc4", link: "#b02545", danger: "#c0162f", scheme: "light" },
  { bg: "#0c0f1a", fg: "#dfe4f5", accent: "#6c7bff", accent2: "#f25ca0", muted: "#161a2a", border: "#262c44", link: "#8b97ff", danger: "#ff6f8a", scheme: "dark" },
  { bg: "#f5f5f3", fg: "#191919", accent: "#e2362f", accent2: "#1a1a1a", muted: "#e6e6e3", border: "#c9c9c4", link: "#c42a24", danger: "#e2362f", scheme: "light" },
  { bg: "#13130f", fg: "#e9e4d6", accent: "#c9b07a", accent2: "#8a9b6e", muted: "#1d1c16", border: "#33312a", link: "#d8c089", danger: "#d97a5a", scheme: "dark" },
  { bg: "#ecf0f3", fg: "#1c2329", accent: "#3a7d8c", accent2: "#bf6b4a", muted: "#dce3e7", border: "#c1ccd3", link: "#2c6573", danger: "#b34028", scheme: "light" },
  { bg: "#1b1020", fg: "#f0e2f5", accent: "#ff7ad9", accent2: "#56e0e0", muted: "#271630", border: "#3d2649", link: "#ff96e2", danger: "#ff6f7d", scheme: "dark" },
  { bg: "#faf6f0", fg: "#33291f", accent: "#b5763e", accent2: "#4d7c9c", muted: "#f0e6d8", border: "#ddccb6", link: "#8c531f", danger: "#aa3a26", scheme: "light" },
  { bg: "#0a0d0b", fg: "#dce8df", accent: "#86d96a", accent2: "#e0b94f", muted: "#131814", border: "#1f2a22", link: "#9ee07f", danger: "#e8775e", scheme: "dark" },
  { bg: "#eef0ee", fg: "#1f241f", accent: "#516b3f", accent2: "#a8632e", muted: "#e0e4df", border: "#c5ccc1", link: "#3f5530", danger: "#a8381f", scheme: "light" },
  { bg: "#101216", fg: "#e6e9ee", accent: "#e8e8e8", accent2: "#ff8c42", muted: "#191c22", border: "#2a2e36", link: "#cfd6e0", danger: "#ff6b5e", scheme: "dark" },
  { bg: "#f7f3ff", fg: "#1e1a2e", accent: "#4b3fd0", accent2: "#d96aa8", muted: "#ebe5fa", border: "#d2c9ee", link: "#3a2eb8", danger: "#c0306a", scheme: "light" },
  { bg: "#161210", fg: "#f5ece2", accent: "#ff6b3d", accent2: "#5ec4c4", muted: "#211a16", border: "#372b24", link: "#ff8a63", danger: "#ff5e5e", scheme: "dark" },
  { bg: "#f0ece4", fg: "#23201a", accent: "#7a5c2e", accent2: "#3d6b6f", muted: "#e4ddd0", border: "#cdc2ac", link: "#5f4720", danger: "#9e3a22", scheme: "light" },
  { bg: "#0d1014", fg: "#e2e8ee", accent: "#4dd0c8", accent2: "#c49bff", muted: "#171b21", border: "#272d36", link: "#6fe0d8", danger: "#ff7585", scheme: "dark" }
];

function choosePalette(seed: string): Palette {
  return createRng(`${seed}:palette-mode`).bool(0.55)
    ? pick(`${seed}:curated-palette`, curatedPalettes)
    : generatedPalette(seed);
}

function luminance(hex: string) {
  const v = hex.replace("#", "");
  const full = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function generateTheme(seed: string): ThemeTokens {
  const palette = choosePalette(seed);
  const fonts = chooseFonts(seed);
  const filter = pick(`${seed}:filter`, [
    "contrast(0.9) saturate(0.78)",
    "contrast(1.14) saturate(0.92) brightness(1.04)",
    "sepia(0.18) saturate(0.85)",
    "grayscale(0.22) contrast(1.08)",
    "hue-rotate(8deg) saturate(1.14)",
    "blur(0.15px) contrast(0.94)",
    "contrast(1.05) saturate(1.2) brightness(0.98)",
    "sepia(0.32) hue-rotate(-10deg) saturate(0.9)",
    "saturate(1.35) contrast(1.02)",
    "grayscale(0.5) contrast(1.16) brightness(1.05)"
  ]);

  return {
    bg: palette.bg,
    fg: palette.fg,
    accent: palette.accent,
    accent2: palette.accent2,
    muted: palette.muted,
    border: palette.border,
    link: palette.link,
    danger: palette.danger,
    fontPrimary: fonts.primary.css,
    fontIntrusion: fonts.intrusion.css,
    fontAccent: fonts.accent.css,
    fontHeadline: fonts.headline.css,
    mediaFilter: filter,
    scheme: luminance(palette.bg) < 0.4 ? "dark" : "light"
  };
}
