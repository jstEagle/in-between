"use client";

import { useEffect, useState, type ReactNode } from "react";

type AdPosition = "top-right" | "bottom-left" | "center";

const positionClass: Record<AdPosition, string> = {
  "top-right": "right-4 top-20",
  "bottom-left": "bottom-4 left-4",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
};

export function DismissibleAdShell({
  children,
  delayMs,
  position
}: {
  children: ReactNode;
  delayMs: number;
  position: AdPosition;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const id = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs, dismissed]);

  if (!visible || dismissed) return null;

  return (
    <aside className={`fixed z-50 w-[min(360px,calc(100vw-2rem))] ${positionClass[position]}`} aria-label="Advertisement">
      <div className="relative">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-[var(--radius-pill)] border border-black/20 bg-white/90 font-accent text-sm text-black shadow"
          aria-label="Close advertisement"
        >
          x
        </button>
        {children}
      </div>
    </aside>
  );
}
