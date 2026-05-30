"use client";

import { useEffect, useRef } from "react";
import type { MotionProfile } from "@/lib/types";
import { createRng } from "@/lib/seed";

type Cleanup = () => void;

export function MotionEffectsLayer({ profile }: { profile: MotionProfile }) {
  const markerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const marker = markerRef.current;
    const root = marker?.closest<HTMLElement>("[data-motion-root]");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Cleanup[] = [];
    let cancelled = false;

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const ctx = gsap.context(() => {
        runEntranceEffect(root, profile, gsap);
      }, root);
      cleanups.push(() => ctx.revert());
    });

    cleanups.push(runCypherEffect(root, profile));
    cleanups.push(runClockEffect(root, profile));

    return () => {
      cancelled = true;
      for (const cleanup of cleanups) cleanup();
    };
  }, [profile]);

  return <span ref={markerRef} hidden data-motion-controller={profile.id} />;
}

function visibleElements(root: HTMLElement, selector: string, amount: number, seed: string) {
  const rng = createRng(seed);
  return Array.from(root.querySelectorAll<HTMLElement>(selector))
    .filter((element) => element !== root && element.getClientRects().length > 0 && !element.closest("[data-motion-ignore]"))
    .sort(() => rng.next() - 0.5)
    .slice(0, amount);
}

function runEntranceEffect(root: HTMLElement, profile: MotionProfile, gsap: typeof import("gsap").gsap) {
  if (profile.entrance.style === "none") return;

  const rng = createRng(`${profile.seed}:motion:entrance:runtime`);
  const targets = visibleElements(root, profile.entrance.selector, profile.entrance.amount, `${profile.seed}:motion:entrance:targets`);
  if (targets.length === 0) return;

  gsap.fromTo(
    targets,
    {
      autoAlpha: 0,
      x: () => {
        if (profile.entrance.style === "cascade") return 0;
        return rng.bool() ? profile.entrance.distance : -profile.entrance.distance;
      },
      y: () => {
        if (profile.entrance.style === "fly") return rng.bool() ? profile.entrance.distance : -profile.entrance.distance;
        return profile.entrance.style === "float" ? rng.float(24, profile.entrance.distance) : profile.entrance.distance * 0.45;
      },
      rotate: () => (profile.entrance.style === "fly" ? rng.float(-3, 3) : 0),
      filter: profile.intensity === "loud" ? "blur(8px)" : "blur(2px)"
    },
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      rotate: 0,
      filter: "blur(0px)",
      duration: profile.entrance.duration,
      ease: profile.entrance.style === "fly" ? "power3.out" : "expo.out",
      stagger: profile.entrance.stagger,
      clearProps: "opacity,visibility,transform,filter"
    }
  );
}

function runCypherEffect(root: HTMLElement, profile: MotionProfile) {
  if (profile.text.style === "none") return () => undefined;

  const rng = createRng(`${profile.seed}:motion:text:runtime`);
  const elements = visibleElements(root, profile.text.selector, profile.text.amount, `${profile.seed}:motion:text:targets`);
  const timers: number[] = [];
  const originals: Array<[Text, string]> = [];

  elements.forEach((element, index) => {
    const node = firstReadableTextNode(element);
    const original = node?.nodeValue ?? "";
    if (!node || original.trim().length < 3 || original.length > 140) return;

    originals.push([node, original]);
    timers.push(
      window.setTimeout(() => {
        animateTextNode(node, original, profile.text.charset, profile.text.durationMs, rng, timers);
      }, 90 + index * 70)
    );
  });

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    originals.forEach(([node, value]) => {
      node.nodeValue = value;
    });
  };
}

function firstReadableTextNode(element: HTMLElement): Text | null {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script, style, svg, noscript, [data-motion-ignore]")) return NodeFilter.FILTER_REJECT;
      return node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });

  return walker.nextNode() as Text | null;
}

function animateTextNode(node: Text, original: string, charset: string, durationMs: number, rng: ReturnType<typeof createRng>, timers: number[]) {
  const startedAt = performance.now();
  const interval = window.setInterval(() => {
    const progress = Math.min(1, (performance.now() - startedAt) / durationMs);
    const revealCount = Math.floor(original.length * progress);
    node.nodeValue = original
      .split("")
      .map((char, index) => {
        if (/\s/.test(char) || index < revealCount) return char;
        return charset[rng.int(0, charset.length - 1)];
      })
      .join("");

    if (progress >= 1) {
      window.clearInterval(interval);
      node.nodeValue = original;
    }
  }, 32);
  timers.push(interval);
}

function runClockEffect(root: HTMLElement, profile: MotionProfile) {
  if (profile.clock.style === "none") return () => undefined;

  const targets = visibleElements(root, profile.clock.selector, profile.clock.amount, `${profile.seed}:motion:clock:targets`);
  const timers: number[] = [];
  const injected: HTMLElement[] = [];
  const originalPositions = new Map<HTMLElement, string>();

  targets.forEach((target) => {
    const clock = document.createElement("span");
    clock.className = `motion-clock motion-clock--${profile.clock.style}`;
    clock.setAttribute("aria-label", "local time");

    if (profile.clock.style === "corner-badge") {
      const computed = window.getComputedStyle(target).position;
      if (computed === "static") {
        originalPositions.set(target, target.style.position);
        target.style.position = "relative";
      }
      target.append(clock);
    } else {
      target.prepend(clock);
    }

    const update = () => {
      clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    };
    update();
    timers.push(window.setInterval(update, 1000));
    injected.push(clock);
  });

  return () => {
    timers.forEach((timer) => window.clearInterval(timer));
    injected.forEach((clock) => clock.remove());
    originalPositions.forEach((position, target) => {
      target.style.position = position;
    });
  };
}
