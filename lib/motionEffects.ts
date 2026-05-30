import { motionEffectConfig } from "@/config/motion-effects";
import type { LayoutArchetype, MotionProfile, MotionTextStyle } from "./types";
import { entropyLevel } from "./entropy";
import { createRng, pick } from "./seed";

const motionFriendlyLayouts: LayoutArchetype[] = [
  "landing",
  "streaming",
  "store",
  "portal-2000",
  "dashboard",
  "game",
  "app-store",
  "events",
  "creator",
  "weather",
  "auctions"
];

export function generateMotionProfile(seed: string, layout: LayoutArchetype, depth: number): MotionProfile {
  const rng = createRng(`${seed}:motion`);
  const entropy = entropyLevel(depth);
  const intensity = entropy <= 0
    ? pick(`${seed}:motion:intensity`, ["quiet", "quiet", "medium"] as const)
    : entropy > 0.62
      ? pick(`${seed}:motion:intensity`, ["medium", "loud", "loud"] as const)
      : pick(`${seed}:motion:intensity`, ["quiet", "medium", "medium"] as const);
  const layoutLikesMotion = motionFriendlyLayouts.includes(layout);
  const entranceStyle = entropy <= 0 && rng.bool(0.62)
    ? "none"
    : layoutLikesMotion
    ? pick(`${seed}:motion:entrance`, motionEffectConfig.entranceStyles)
    : pick(`${seed}:motion:entrance`, ["none", "fly", "cascade"] as const);
  const textCandidates: readonly MotionTextStyle[] =
    entropy <= 0 ? (["none", "none", "cypher-headings"] as const) : motionEffectConfig.textStyles;
  const textStyle = pick(`${seed}:motion:text`, textCandidates);
  const clockStyle = pick(
    `${seed}:motion:clock`,
    layout === "dashboard" || layout === "portal-2000" || layout === "jobs"
      ? ["corner-badge", "inline-chip", "none"] as const
      : motionEffectConfig.clockStyles
  );

  return {
    id: `${intensity}-${entranceStyle}-${textStyle}-${clockStyle}`,
    seed,
    intensity,
    entrance: {
      style: entranceStyle,
      selector: motionEffectConfig.entranceSelector,
      amount: motionEffectConfig.maxEntranceTargets[intensity],
      duration: Number(rng.float(0.45, intensity === "loud" ? 0.9 : 0.7).toFixed(2)),
      distance: rng.int(intensity === "quiet" ? 16 : 28, intensity === "loud" ? 120 : 72),
      stagger: Number(rng.float(0.02, intensity === "loud" ? 0.055 : 0.038).toFixed(3))
    },
    text: {
      style: textStyle,
      selector: textStyle === "cypher-copy" ? motionEffectConfig.copyTextSelector : motionEffectConfig.headingTextSelector,
      amount: motionEffectConfig.maxTextTargets[intensity],
      durationMs: rng.int(intensity === "quiet" ? 420 : 620, intensity === "loud" ? 1500 : 1050),
      charset: motionEffectConfig.cypherCharset
    },
    clock: {
      style: clockStyle,
      selector: motionEffectConfig.clockAttachSelector,
      amount: motionEffectConfig.maxClockTargets[intensity]
    }
  };
}
