import type { MotionEntranceStyle, MotionTextStyle, MotionClockStyle } from "@/lib/types";

export const motionEffectConfig = {
  // Only animate repeating *content* items and headlines — never structural
  // containers (header/main/section/aside/footer). Hiding a wrapper with
  // autoAlpha:0 would blank a whole region until its staggered tween arrives,
  // which reads as a broken empty page rather than a snappy entrance.
  entranceSelector:
    ":is(article, .panel, [class*='card'], [class*='hero'], [class*='tile'], .headline)",
  headingTextSelector: "h1, h2, h3, .headline, .landing__title, .landing__section-title",
  copyTextSelector: "h1, h2, h3, p, a, button, figcaption, label, .headline",
  clockAttachSelector: "header, nav, main > div, section, article, aside, footer, .panel, [class*='card'], [class*='grid']",
  cypherCharset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&?+=*/",
  entranceStyles: ["none", "fly", "cascade", "float"] satisfies MotionEntranceStyle[],
  textStyles: ["none", "cypher-headings", "cypher-copy"] satisfies MotionTextStyle[],
  clockStyles: ["none", "corner-badge", "inline-chip"] satisfies MotionClockStyle[],
  maxEntranceTargets: {
    quiet: 6,
    medium: 12,
    loud: 18
  },
  maxTextTargets: {
    quiet: 3,
    medium: 8,
    loud: 16
  },
  maxClockTargets: {
    quiet: 1,
    medium: 2,
    loud: 4
  }
} as const;
