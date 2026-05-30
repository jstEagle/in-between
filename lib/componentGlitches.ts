import { createRng } from "./seed";
import { entropyLevel } from "./entropy";

export type ComponentGlitch =
  | { kind: "none" }
  | { kind: "clipped"; maxHeight: string }
  | { kind: "offset"; x: number; y: number }
  | { kind: "sliced"; inset: string }
  | { kind: "duplicate"; x: number; y: number }
  | { kind: "collapsed"; maxHeight: string };

export function chooseComponentGlitch(seed: string, depth: number, role = "component"): ComponentGlitch {
  const entropy = entropyLevel(depth);
  if (entropy <= 0) return { kind: "none" };

  const pageGate = createRng(`${seed}:glitch-page:${role}`).bool(Math.min(0.74, 0.08 + entropy * 0.66));
  if (!pageGate) return { kind: "none" };

  const rng = createRng(`${seed}:glitch-kind:${role}`);
  if (!rng.bool(0.16 + entropy * 0.42)) return { kind: "none" };

  const variants: ComponentGlitch[] = [
    { kind: "clipped", maxHeight: `${rng.int(120, 340)}px` },
    { kind: "offset", x: rng.int(-46, 42), y: rng.int(-18, 24) },
    { kind: "sliced", inset: `${rng.int(0, 18)}% ${rng.int(0, 22)}% ${rng.int(8, 42)}% ${rng.int(0, 16)}%` },
    { kind: "duplicate", x: rng.int(-18, 24), y: rng.int(10, 34) },
    { kind: "collapsed", maxHeight: `${rng.int(54, 150)}px` }
  ];

  return variants[rng.int(0, variants.length - 1)];
}

export function glitchClassName(glitch: ComponentGlitch) {
  if (glitch.kind === "none") return "";
  return "component-glitch";
}
