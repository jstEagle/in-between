import { generateTheme } from "./theme";
import { createRng, pick } from "./seed";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] ?? char);
}

export function generateFaviconSvg(seed: string, label = "in between space") {
  const theme = generateTheme(seed);
  const rng = createRng(`${seed}:favicon`);
  const variant = pick(`${seed}:favicon:variant`, ["tab", "folder", "play", "notice", "checkout"]);
  const letter = escapeXml(label.replace(/[^a-z0-9]/gi, "").charAt(0).toUpperCase() || "I");
  const tilt = rng.int(-8, 8);

  const glyphs: Record<string, string> = {
    tab: `<rect x="18" y="22" width="92" height="68" rx="8" fill="${theme.muted}" stroke="${theme.border}" stroke-width="6"/><rect x="28" y="34" width="44" height="8" fill="${theme.accent}"/><rect x="28" y="52" width="62" height="6" fill="${theme.fg}" opacity=".55"/>`,
    folder: `<path d="M16 34 H50 L60 46 H112 V96 H16 Z" fill="${theme.muted}" stroke="${theme.border}" stroke-width="6"/><rect x="30" y="60" width="58" height="10" fill="${theme.accent2}"/>`,
    play: `<rect x="16" y="20" width="96" height="72" rx="12" fill="${theme.muted}" stroke="${theme.border}" stroke-width="6"/><path d="M52 42 L82 64 L52 86 Z" fill="${theme.accent}"/>`,
    notice: `<rect x="24" y="14" width="80" height="98" rx="4" fill="${theme.muted}" stroke="${theme.border}" stroke-width="6"/><rect x="38" y="32" width="52" height="8" fill="${theme.accent}"/><rect x="38" y="52" width="40" height="7" fill="${theme.fg}" opacity=".52"/><rect x="38" y="70" width="48" height="7" fill="${theme.fg}" opacity=".36"/>`,
    checkout: `<circle cx="50" cy="94" r="7" fill="${theme.fg}"/><circle cx="88" cy="94" r="7" fill="${theme.fg}"/><path d="M22 30 H38 L48 76 H94 L106 44 H46" fill="none" stroke="${theme.border}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><rect x="54" y="48" width="30" height="12" fill="${theme.accent2}"/>`
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="${rng.int(12, 30)}" fill="${theme.bg}"/>
  <g transform="rotate(${tilt} 64 64)">${glyphs[variant]}</g>
  <circle cx="96" cy="30" r="18" fill="${theme.accent}"/>
  <text x="96" y="39" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="800" fill="${theme.bg}">${letter}</text>
</svg>`;
}
