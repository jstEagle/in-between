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

function luminance(hex: string) {
  const v = hex.replace("#", "");
  const full = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function generateTheme(seed: string): ThemeTokens {
  const palette = generatedPalette(seed);
  const fonts = chooseFonts(seed);
  const filter = pick(`${seed}:filter`, [
    "contrast(0.9) saturate(0.78)",
    "contrast(1.14) saturate(0.92) brightness(1.04)",
    "sepia(0.18) saturate(0.85)",
    "grayscale(0.22) contrast(1.08)",
    "hue-rotate(8deg) saturate(1.14)",
    "blur(0.15px) contrast(0.94)"
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
