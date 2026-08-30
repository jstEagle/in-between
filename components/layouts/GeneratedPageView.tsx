import type { CSSProperties } from "react";
import { MotionEffectsLayer } from "@/components/effects/MotionEffectsLayer";
import { PageArchetype } from "@/components/layouts/PageArchetypes";
import { PageLoadingLayer } from "@/components/loaders/PageLoadingLayer";
import { getLanguagePack } from "@/content/i18n";
import type { GeneratedPage } from "@/lib/types";

const textureClass: Record<GeneratedPage["design"]["texture"], string> = {
  scan: "texture-scan",
  dots: "texture-dots",
  grid: "texture-grid",
  "soft-radial": "texture-soft-radial",
  noise: "texture-noise",
  halftone: "texture-halftone",
  blueprint: "texture-blueprint",
  stripes: "texture-stripes",
  vignette: "texture-vignette",
  none: ""
};

export function GeneratedPageView({ page }: { page: GeneratedPage }) {
  const languagePack = getLanguagePack(page.languageBlend.primary);
  const style = {
    "--page-bg": page.theme.bg,
    "--page-fg": page.theme.fg,
    "--page-accent": page.theme.accent,
    "--page-accent2": page.theme.accent2,
    "--page-muted": page.theme.muted,
    "--page-border": page.theme.border,
    "--page-link": page.theme.link,
    "--page-danger": page.theme.danger,
    "--page-font-primary": page.theme.fontPrimary,
    "--page-font-intrusion": page.theme.fontIntrusion,
    "--page-font-accent": page.theme.fontAccent,
    "--page-font-headline": page.theme.fontHeadline,
    "--media-filter": page.theme.mediaFilter,
    "--composition-intensity": String(page.layoutComposition.intensity),
    "--composition-border": `${Math.max(1, Math.round(page.layoutComposition.intensity * 3))}px`,
    "--composition-accent-alpha": `${Math.round(page.layoutComposition.intensity * 18)}%`,
    "--composition-soft-alpha": `${Math.round(page.layoutComposition.intensity * 12)}%`,
    ...page.design.cssVars
  } as CSSProperties;

  return (
    <main
      lang={languagePack.htmlLang}
      dir={languagePack.dir}
      data-motion-root
      data-scheme={page.theme.scheme}
      data-layout-primary={page.layoutComposition.primary}
      data-layout-secondary={page.layoutComposition.secondary ?? "none"}
      data-composition-mode={page.layoutComposition.mode}
      className={`min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)] [font-size:var(--text-base)] tracking-[var(--tracking)] ${textureClass[page.design.texture]}`}
      style={style}
    >
      <PageLoadingLayer page={page} />
      <MotionEffectsLayer profile={page.motion} />
      <PageArchetype page={page} />
    </main>
  );
}
