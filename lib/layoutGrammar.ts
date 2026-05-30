import type { LayoutArchetype, SiteKind } from "./types";
import { entropyLevel } from "./entropy";
import { createRng, pick } from "./seed";

export type LayoutFrame = "linear" | "sidebar" | "split" | "portal" | "magazine" | "app-shell" | "masonry";
export type LayoutAlignment = "left" | "center" | "right" | "justified";
export type LayoutHeader = "masthead" | "topnav" | "compact" | "side-rail" | "utility";
export type LayoutRhythm = "quiet" | "stacked" | "dense" | "wandering";

export type LayoutGrammar = {
  frame: LayoutFrame;
  alignment: LayoutAlignment;
  header: LayoutHeader;
  sidebar: "left" | "right" | "none";
  columns: 1 | 2 | 3 | 4;
  heroPlacement: "first" | "inline" | "aside" | "omitted";
  rhythm: LayoutRhythm;
  blockOrder: "normal" | "reversed" | "shuffle";
  showUtilityStrip: boolean;
  showLocalNav: boolean;
  maxBlocksBeforeFooter: number;
};

const frameBySiteKind: Record<SiteKind, LayoutFrame[]> = {
  blog: ["linear", "magazine", "sidebar", "masonry"],
  store: ["sidebar", "portal", "masonry", "split"],
  forum: ["linear", "sidebar", "portal", "app-shell"],
  docs: ["app-shell", "sidebar", "linear"],
  streaming: ["portal", "masonry", "split", "app-shell"],
  booking: ["split", "sidebar", "linear", "portal"],
  directory: ["portal", "sidebar", "masonry", "linear"]
};

const headerByFrame: Record<LayoutFrame, LayoutHeader[]> = {
  linear: ["masthead", "topnav", "compact"],
  sidebar: ["topnav", "compact", "utility"],
  split: ["topnav", "utility", "masthead"],
  portal: ["utility", "topnav", "masthead"],
  magazine: ["masthead", "topnav", "utility"],
  "app-shell": ["side-rail", "compact", "topnav"],
  masonry: ["topnav", "compact", "utility"]
};

/**
 * Grammar is the generic "this page can't decide what it is" renderer. It used
 * to render *every* page, which flattened all 30+ bespoke archetypes into the
 * same card-stack. Now it is a minority path: rare on shallow/coherent pages,
 * more common as the visitor drifts deeper into the labyrinth, where identity
 * instability is exactly the point.
 */
export function shouldUseLayoutGrammar(seed: string, depth: number, drift: number): boolean {
  const entropy = Math.max(entropyLevel(depth), drift);
  if (entropy <= 0) return false;
  const chance = 0.04 + entropy * 0.58;
  return createRng(`${seed}:use-layout-grammar`).bool(Math.min(0.62, chance));
}

export function chooseLayoutGrammar(
  seed: string,
  layout: LayoutArchetype,
  siteKind: SiteKind,
  depth: number,
  drift: number
): LayoutGrammar {
  const rng = createRng(`${seed}:layout-grammar:${layout}:${siteKind}`);
  const depthFactor = entropyLevel(depth);
  const framePool = frameBySiteKind[siteKind];
  const frame = pick(`${seed}:layout-grammar:frame`, framePool);
  const sidebar = frame === "sidebar" || frame === "app-shell"
    ? rng.bool(0.52) ? "left" : "right"
    : frame === "split" && rng.bool(0.34)
      ? rng.bool() ? "left" : "right"
      : "none";
  const columns = chooseColumns(seed, frame, drift);

  return {
    frame,
    alignment: pick(`${seed}:layout-grammar:align`, alignmentPoolForFrame(frame)),
    header: pick(`${seed}:layout-grammar:header`, headerByFrame[frame]),
    sidebar,
    columns,
    heroPlacement: pick(`${seed}:layout-grammar:hero`, heroPoolForFrame(frame, depthFactor)),
    rhythm: pick(`${seed}:layout-grammar:rhythm`, rhythmPoolForFrame(frame, drift)),
    blockOrder: pick(`${seed}:layout-grammar:order`, depthFactor > 0.6 ? ["normal", "shuffle", "reversed"] : ["normal", "normal", "shuffle"]),
    showUtilityStrip: rng.bool(0.18 + depthFactor * 0.3 + drift * 0.2),
    showLocalNav: rng.bool(0.5 + Math.min(0.24, drift * 0.3)),
    maxBlocksBeforeFooter: rng.int(frame === "linear" ? 3 : 4, frame === "portal" || frame === "masonry" ? 9 : 7)
  };
}

function chooseColumns(seed: string, frame: LayoutFrame, drift: number): LayoutGrammar["columns"] {
  if (frame === "linear" || frame === "split") return pick(`${seed}:layout-grammar:columns`, [1, 2]);
  if (frame === "sidebar" || frame === "app-shell") return pick(`${seed}:layout-grammar:columns`, [1, 2, 2, 3]);
  if (frame === "magazine") return pick(`${seed}:layout-grammar:columns`, [2, 3, 3, 4]);
  if (frame === "portal") return pick(`${seed}:layout-grammar:columns`, drift > 0.5 ? [3, 4] : [2, 3]);
  return pick(`${seed}:layout-grammar:columns`, [2, 3, 4]);
}

function alignmentPoolForFrame(frame: LayoutFrame): LayoutAlignment[] {
  if (frame === "linear") return ["left", "left", "center", "right"];
  if (frame === "magazine") return ["left", "justified", "center"];
  if (frame === "portal") return ["left", "justified"];
  if (frame === "split") return ["left", "right", "center"];
  return ["left", "left", "justified"];
}

function heroPoolForFrame(frame: LayoutFrame, depthFactor: number): LayoutGrammar["heroPlacement"][] {
  if (frame === "app-shell") return depthFactor > 0.4 ? ["inline", "omitted", "aside"] : ["inline", "aside"];
  if (frame === "portal" || frame === "masonry") return ["inline", "first", "omitted"];
  if (frame === "split") return ["first", "aside", "inline"];
  return ["first", "inline", "first"];
}

function rhythmPoolForFrame(frame: LayoutFrame, drift: number): LayoutRhythm[] {
  const base: LayoutRhythm[] = frame === "portal" ? ["dense", "stacked", "wandering"] : ["quiet", "stacked", "wandering"];
  if (drift > 0.55) return [...base, "dense", "wandering"];
  return base;
}
