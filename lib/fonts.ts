import { createRng, pick } from "./seed";

export type FontCategory = "grotesk" | "humanist" | "serif" | "display" | "slab" | "mono" | "hand" | "pixel";

export type FontDef = { id: string; label: string; css: string; category: FontCategory };

// Curated Google Fonts manifest. Every entry maps to a next/font variable
// declared in app/fonts.ts. Selection is deterministic per page seed.
export const fontManifest: FontDef[] = [
  { id: "inter", label: "Inter", css: "var(--font-inter), system-ui, sans-serif", category: "grotesk" },
  { id: "space", label: "Space Grotesk", css: "var(--font-space), system-ui, sans-serif", category: "grotesk" },
  { id: "archivo", label: "Archivo", css: "var(--font-archivo), system-ui, sans-serif", category: "grotesk" },
  { id: "manrope", label: "Manrope", css: "var(--font-manrope), system-ui, sans-serif", category: "grotesk" },
  { id: "sora", label: "Sora", css: "var(--font-sora), system-ui, sans-serif", category: "grotesk" },
  { id: "nunito", label: "Nunito", css: "var(--font-nunito), system-ui, sans-serif", category: "humanist" },
  { id: "worksans", label: "Work Sans", css: "var(--font-worksans), system-ui, sans-serif", category: "humanist" },
  { id: "lora", label: "Lora", css: "var(--font-lora), Georgia, serif", category: "serif" },
  { id: "fraunces", label: "Fraunces", css: "var(--font-fraunces), Georgia, serif", category: "serif" },
  { id: "playfair", label: "Playfair Display", css: "var(--font-playfair), Georgia, serif", category: "serif" },
  { id: "dmserif", label: "DM Serif Display", css: "var(--font-dmserif), Georgia, serif", category: "display" },
  { id: "robotoslab", label: "Roboto Slab", css: "var(--font-robotoslab), Georgia, serif", category: "slab" },
  { id: "bebas", label: "Bebas Neue", css: "var(--font-bebas), Impact, sans-serif", category: "display" },
  { id: "oswald", label: "Oswald", css: "var(--font-oswald), Impact, sans-serif", category: "display" },
  { id: "archivoblack", label: "Archivo Black", css: "var(--font-archivoblack), Impact, sans-serif", category: "display" },
  { id: "mono", label: "IBM Plex Mono", css: "var(--font-ibm-plex-mono), ui-monospace, monospace", category: "mono" },
  { id: "spacemono", label: "Space Mono", css: "var(--font-spacemono), ui-monospace, monospace", category: "mono" },
  { id: "caveat", label: "Caveat", css: "var(--font-caveat), cursive", category: "hand" },
  { id: "vt323", label: "VT323", css: "var(--font-vt323), ui-monospace, monospace", category: "pixel" },
  { id: "pressstart", label: "Press Start 2P", css: "var(--font-pressstart), ui-monospace, monospace", category: "pixel" },
  { id: "times", label: "Times New Roman", css: "'Times New Roman', Times, serif", category: "serif" }
];

const byCategory = (cats: FontCategory[]) => fontManifest.filter((f) => cats.includes(f.category));

// Contrast tables: which intrusion categories read as "from another website"
// against a given primary category. Keeps pairings deliberate, not arbitrary.
const intrusionFor: Record<FontCategory, FontCategory[]> = {
  grotesk: ["serif", "display", "pixel", "hand", "slab"],
  humanist: ["serif", "mono", "pixel", "display"],
  serif: ["grotesk", "display", "pixel", "mono"],
  display: ["serif", "mono", "humanist", "pixel"],
  slab: ["grotesk", "hand", "pixel", "display"],
  mono: ["serif", "display", "humanist"],
  hand: ["grotesk", "serif", "mono"],
  pixel: ["serif", "humanist", "slab"]
};

export function chooseFonts(seed: string) {
  // Primary leans readable; display/pixel/hand stay as intrusions/accents.
  const primaryPool = byCategory(["grotesk", "humanist", "serif", "slab", "display"]);
  const primary = pick(`${seed}:font:primary`, primaryPool);

  const intrusionCats = intrusionFor[primary.category];
  const intrusionPool = fontManifest.filter((f) => intrusionCats.includes(f.category) && f.id !== primary.id);
  const intrusion = pick(`${seed}:font:intrusion`, intrusionPool.length ? intrusionPool : fontManifest.filter((f) => f.id !== primary.id));

  // accent prefers mono / pixel / hand / display — the "era-specific UI" font.
  const accentPool = byCategory(["mono", "pixel", "hand", "display"]).filter(
    (f) => f.id !== primary.id && f.id !== intrusion.id
  );
  const accent = pick(`${seed}:font:accent`, accentPool.length ? accentPool : fontManifest.filter((f) => f.id !== primary.id && f.id !== intrusion.id));

  // occasionally the giant hero headline uses the intrusion or accent font
  // instead of the primary, which changes a page's whole character.
  const headlineRoll = createRng(`${seed}:font:headline`).int(0, 2);
  const headline = headlineRoll === 0 ? primary : headlineRoll === 1 ? intrusion : accent;

  return { primary, intrusion, accent, headline };
}
