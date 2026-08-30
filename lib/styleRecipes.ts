import type { StyleRecipe } from "./types";
import { pick } from "./seed";

/**
 * Recipes now carry the colour / era *personality* only. The structural
 * traits (radius, padding, border weight, shadow, container width) come from
 * the per-page design tokens (see designTokens.ts) via CSS variables, so two
 * pages sharing a recipe still look like different websites.
 *
 * `.panel` (globals.css) already applies border + radius + padding + shadow
 * from tokens, so each recipe's `panel` only layers its background/era flavour.
 */

const buttonBase = "inline-block rounded-[var(--radius-button)] px-[1.1em] py-[.55em] text-sm shadow-[var(--shadow-button)]";
const tagBase = "inline-block rounded-[var(--radius-tag)] px-2 py-1 text-[11px]";

export const styleRecipes: StyleRecipe[] = [
  {
    id: "old-portal",
    name: "Old Portal",
    density: "dense",
    chrome: "old-web",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel bg-white/75",
      intrusionPanel: "border-2 border-[#7b7b7b] bg-[#efefef] p-2 font-intrusion text-[13px] text-[#171717]",
      button: `${buttonBase} border border-[#222] bg-[#e6e6e6] text-black hover:bg-white`,
      tag: `${tagBase} border border-[var(--page-border)] bg-[var(--page-muted)] uppercase`
    }
  },
  {
    id: "corporate-hotel",
    name: "Corporate Hotel",
    density: "balanced",
    chrome: "modern",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel bg-white/80 backdrop-blur",
      intrusionPanel: "rounded-[var(--radius-card)] border border-[#d5b84c] bg-[#fff7bf] p-3 font-intrusion text-[13px] text-[#3a2f12]",
      button: `${buttonBase} border border-[var(--page-accent)] bg-[var(--page-accent)] font-medium text-white hover:brightness-110`,
      tag: `${tagBase} bg-[var(--page-muted)] text-[var(--page-fg)]`
    }
  },
  {
    id: "kids-2006",
    name: "Kids 2006",
    density: "dense",
    chrome: "playful",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel bg-white/90 hard-shadow",
      intrusionPanel: "rounded-[var(--radius-card)] border-2 border-[#00a0ff] bg-[#f6ff00] p-3 font-accent text-[13px] text-black",
      button: `${buttonBase} border-2 border-[#111] bg-[var(--page-accent)] font-bold text-white hard-shadow hover:translate-x-[1px]`,
      tag: `${tagBase} border border-[#111] bg-white font-bold text-black`
    }
  },
  {
    id: "web-1-travel",
    name: "Web 1.0 Travel",
    density: "dense",
    chrome: "portal",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel bg-[#fff8d7] text-[#241f08]",
      intrusionPanel: "border border-[#0c5992] bg-[#e6f0ff] p-2 font-intrusion text-[13px] text-[#0c2f4a]",
      button: `${buttonBase} border border-[#6d6331] bg-[#ffe36d] font-semibold text-black hover:bg-[#fff4b8]`,
      tag: `${tagBase} border border-[#6d6331] bg-[#fffef2] text-[#241f08]`
    }
  },
  {
    id: "dark-club",
    name: "Dark Club Landing Page",
    density: "balanced",
    chrome: "modern",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-white/15 bg-black/45 text-white",
      intrusionPanel: "rounded-[var(--radius-card)] border border-[var(--page-border)] bg-[#f7f2dd] p-3 font-intrusion text-[13px] text-[#171717]",
      button: `${buttonBase} border border-white/20 bg-[var(--page-accent)] font-semibold text-black hover:brightness-125`,
      tag: `${tagBase} border border-white/20 bg-white/10 text-white`
    }
  },
  {
    id: "public-directory",
    name: "Public Directory",
    density: "dense",
    chrome: "portal",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel bg-white/85",
      intrusionPanel: "border-l-4 border-[var(--page-accent)] bg-[var(--page-muted)] p-3 font-accent text-[13px]",
      button: `${buttonBase} border border-[var(--page-accent)] bg-white font-semibold text-[var(--page-accent)] hover:bg-[var(--page-muted)]`,
      tag: `${tagBase} border-l-4 border-[var(--page-accent)] bg-white text-[var(--page-fg)]`
    }
  },
  {
    id: "abandoned-saas",
    name: "Abandoned SaaS",
    density: "sparse",
    chrome: "dashboard",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel bg-white/72",
      intrusionPanel: "rounded-[var(--radius-card)] border border-dashed [border-color:var(--page-border)] bg-[var(--page-muted)]/70 p-3 font-accent text-[13px]",
      button: `${buttonBase} border border-[var(--page-border)] bg-white font-medium hover:border-[var(--page-accent)]`,
      tag: `${tagBase} rounded-[var(--radius-pill)] border border-[var(--page-border)] bg-white/80`
    }
  },
  {
    id: "soft-utility",
    name: "Soft Utility",
    density: "balanced",
    chrome: "modern",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-white/70 bg-white/60 backdrop-blur",
      intrusionPanel: "rounded-[var(--radius-card)] border border-[var(--page-border)] bg-white p-3 font-intrusion text-[13px]",
      button: `${buttonBase} bg-[var(--page-accent)] font-medium text-white hover:brightness-105`,
      tag: `${tagBase} bg-white/70 text-[var(--page-fg)]`
    }
  },
  {
    id: "dark-streaming",
    name: "Dead Streaming Platform",
    density: "balanced",
    chrome: "modern",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-white/10 bg-[#0e0e12]/70 text-[#f3f3f6]",
      intrusionPanel: "rounded-[var(--radius-card)] border border-[var(--page-accent2)] bg-[var(--page-accent2)]/12 p-3 font-accent text-[13px]",
      button: `${buttonBase} bg-white font-semibold text-black hover:bg-[var(--page-accent)] hover:text-white`,
      tag: `${tagBase} border border-white/15 bg-white/5 uppercase`
    }
  },
  {
    id: "brutalist-news",
    name: "Brutalist News",
    density: "dense",
    chrome: "old-web",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel bg-[var(--page-bg)]",
      intrusionPanel: "border-[3px] border-black bg-[var(--page-bg)] p-3 font-intrusion text-[13px]",
      button: `${buttonBase} border-2 border-current bg-transparent font-bold uppercase hover:bg-[var(--page-fg)] hover:text-[var(--page-bg)]`,
      tag: `${tagBase} border-2 border-current bg-transparent uppercase`
    }
  },
  {
    id: "pastel-portal",
    name: "Pastel Portal",
    density: "balanced",
    chrome: "playful",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-[var(--page-accent)]/30 bg-[color-mix(in_srgb,var(--page-bg)_85%,white)]",
      intrusionPanel: "rounded-[var(--radius-pill)] border border-[var(--page-accent2)] bg-[var(--page-accent2)]/10 p-3 font-accent text-[13px]",
      button: `${buttonBase} rounded-[var(--radius-pill)] bg-[var(--page-accent)] font-semibold text-white hover:brightness-105`,
      tag: `${tagBase} rounded-[var(--radius-pill)] bg-[var(--page-accent)]/15 text-[var(--page-accent)]`
    }
  },
  {
    id: "government-print",
    name: "Government Print",
    density: "dense",
    chrome: "portal",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel bg-white",
      intrusionPanel: "border-y-2 border-[var(--page-fg)] bg-transparent py-3 font-accent text-[13px] uppercase",
      button: `${buttonBase} border border-[var(--page-fg)] bg-[var(--page-fg)] font-semibold text-[var(--page-bg)] hover:opacity-90`,
      tag: `${tagBase} border border-[var(--page-fg)] bg-transparent uppercase`
    }
  },
  {
    id: "editorial-broadsheet",
    name: "Editorial Broadsheet",
    density: "balanced",
    chrome: "old-web",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-x-0 border-t-0 border-b border-[var(--page-border)] bg-transparent shadow-none",
      intrusionPanel: "border-l border-[var(--page-fg)] pl-3 bg-transparent font-intrusion text-[13px] italic",
      button: `${buttonBase} border-b border-[var(--page-fg)] rounded-none bg-transparent font-medium uppercase tracking-wide hover:bg-[var(--page-fg)] hover:text-[var(--page-bg)]`,
      tag: `${tagBase} border-0 bg-transparent px-0 uppercase tracking-[0.18em] font-accent`
    }
  },
  {
    id: "terminal-green",
    name: "Terminal Console",
    density: "dense",
    chrome: "dashboard",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel rounded-none border border-[var(--page-accent)]/40 bg-black/55 text-[var(--page-accent)] shadow-none font-accent",
      intrusionPanel: "border border-dashed border-[var(--page-accent)]/60 bg-black/40 p-2 font-accent text-[12px] text-[var(--page-accent)]",
      button: `${buttonBase} rounded-none border border-[var(--page-accent)] bg-transparent font-accent text-[var(--page-accent)] hover:bg-[var(--page-accent)] hover:text-black`,
      tag: `${tagBase} rounded-none border border-[var(--page-accent)]/50 bg-transparent font-accent uppercase`
    }
  },
  {
    id: "swiss-international",
    name: "Swiss International",
    density: "sparse",
    chrome: "modern",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel rounded-none border-0 border-t-2 border-[var(--page-fg)] bg-transparent shadow-none",
      intrusionPanel: "border-t-2 border-[var(--page-accent)] bg-transparent pt-3 font-accent text-[13px]",
      button: `${buttonBase} rounded-none bg-[var(--page-fg)] font-medium text-[var(--page-bg)] hover:bg-[var(--page-accent)]`,
      tag: `${tagBase} rounded-none border-0 bg-transparent px-0 font-accent uppercase tracking-[0.2em]`
    }
  },
  {
    id: "vaporwave-arcade",
    name: "Vaporwave Arcade",
    density: "balanced",
    chrome: "playful",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-[var(--page-accent2)]/40 bg-[var(--page-accent2)]/10 text-[var(--page-fg)] backdrop-blur",
      intrusionPanel: "rounded-[var(--radius-card)] border border-[var(--page-accent)] bg-[var(--page-accent)]/12 p-3 font-accent text-[13px]",
      button: `${buttonBase} border border-[var(--page-accent)] bg-[var(--page-accent)] font-semibold text-black shadow-[0_0_18px_var(--page-accent)] hover:brightness-110`,
      tag: `${tagBase} border border-[var(--page-accent2)] bg-transparent uppercase tracking-[0.14em]`
    }
  },
  {
    id: "eink-reader",
    name: "E-Ink Reader",
    density: "sparse",
    chrome: "modern",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-[var(--page-border)] bg-[color-mix(in_srgb,var(--page-bg)_94%,var(--page-fg))] shadow-none",
      intrusionPanel: "border border-[var(--page-border)] bg-transparent p-3 font-intrusion text-[13px]",
      button: `${buttonBase} border border-[var(--page-fg)] bg-transparent font-medium hover:bg-[var(--page-fg)] hover:text-[var(--page-bg)]`,
      tag: `${tagBase} border border-[var(--page-border)] bg-transparent`
    }
  },
  {
    id: "blueprint-tech",
    name: "Blueprint Technical",
    density: "balanced",
    chrome: "dashboard",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border border-[var(--page-link)]/40 bg-[var(--page-link)]/8 font-accent text-[var(--page-fg)] shadow-none",
      intrusionPanel: "border border-dashed border-[var(--page-link)]/60 bg-transparent p-3 font-accent text-[12px]",
      button: `${buttonBase} rounded-none border border-[var(--page-link)] bg-transparent font-accent text-[var(--page-link)] uppercase hover:bg-[var(--page-link)] hover:text-[var(--page-bg)]`,
      tag: `${tagBase} rounded-none border border-[var(--page-link)]/50 bg-transparent font-accent uppercase`
    }
  },
  {
    id: "fashion-magazine",
    name: "Fashion Magazine",
    density: "sparse",
    chrome: "modern",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-0 bg-transparent shadow-none",
      intrusionPanel: "border-y border-[var(--page-fg)] bg-transparent py-4 font-intrusion text-[13px] italic",
      button: `${buttonBase} rounded-none border border-[var(--page-fg)] bg-transparent font-light uppercase tracking-[0.28em] text-[11px] hover:bg-[var(--page-fg)] hover:text-[var(--page-bg)]`,
      tag: `${tagBase} border-0 bg-transparent px-0 uppercase tracking-[0.28em] font-light`
    }
  },
  {
    id: "neo-memphis",
    name: "Neo Memphis",
    density: "balanced",
    chrome: "playful",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-2 border-[var(--page-fg)] bg-[var(--page-bg)] hard-shadow",
      intrusionPanel: "rounded-[var(--radius-card)] border-2 border-[var(--page-fg)] bg-[var(--page-accent2)]/20 p-3 font-accent text-[13px]",
      button: `${buttonBase} border-2 border-[var(--page-fg)] bg-[var(--page-accent)] font-bold text-black hard-shadow hover:translate-x-[1px] hover:translate-y-[1px]`,
      tag: `${tagBase} rounded-[var(--radius-pill)] border-2 border-[var(--page-fg)] bg-[var(--page-accent2)]/30 font-bold`
    }
  },
  {
    id: "concrete-brutalist",
    name: "Concrete Brutalist",
    density: "dense",
    chrome: "old-web",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel rounded-none border border-[var(--page-fg)] bg-[color-mix(in_srgb,var(--page-bg)_92%,var(--page-fg))] shadow-none",
      intrusionPanel: "border border-[var(--page-fg)] bg-transparent p-3 font-accent text-[12px] uppercase",
      button: `${buttonBase} rounded-none border border-[var(--page-fg)] bg-transparent font-mono uppercase hover:bg-[var(--page-fg)] hover:text-[var(--page-bg)]`,
      tag: `${tagBase} rounded-none border border-[var(--page-fg)] bg-transparent font-mono uppercase`
    }
  },
  {
    id: "sunset-gradient",
    name: "Sunset Gradient",
    density: "balanced",
    chrome: "modern",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel border-white/20 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--page-accent)_16%,transparent),color-mix(in_srgb,var(--page-accent2)_16%,transparent))] backdrop-blur",
      intrusionPanel: "rounded-[var(--radius-card)] border border-[var(--page-accent)] bg-[var(--page-accent)]/10 p-3 font-accent text-[13px]",
      button: `${buttonBase} rounded-[var(--radius-pill)] bg-[linear-gradient(135deg,var(--page-accent),var(--page-accent2))] font-semibold text-white hover:brightness-110`,
      tag: `${tagBase} rounded-[var(--radius-pill)] bg-white/15 text-[var(--page-fg)]`
    }
  },
  {
    id: "zine-photocopy",
    name: "Zine Photocopy",
    density: "dense",
    chrome: "old-web",
    classes: {
      page: "",
      shell: "shell",
      panel: "panel rounded-none border-2 border-black bg-white text-black shadow-none",
      intrusionPanel: "border-2 border-dashed border-black bg-white p-2 font-accent text-[12px] text-black uppercase",
      button: `${buttonBase} rounded-none border-2 border-black bg-black font-bold uppercase text-white hover:bg-white hover:text-black`,
      tag: `${tagBase} rounded-none border-2 border-black bg-white font-bold text-black uppercase`
    }
  }
];

export function chooseStyleRecipe(seed: string, depth: number) {
  if (depth > 35) return pick(`${seed}:style:deep`, styleRecipes);
  return pick(`${seed}:style`, styleRecipes);
}
