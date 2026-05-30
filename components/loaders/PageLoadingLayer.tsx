"use client";

import type { GeneratedPage } from "@/lib/types";
import { pageLoadingOverlay } from "@/lib/loadingProfiles";
import { FakePageOverlay } from "./LoadingEffects";

export function PageLoadingLayer({ page }: { page: GeneratedPage }) {
  const overlay = pageLoadingOverlay(page);

  return (
    <FakePageOverlay
      show={overlay.show}
      durationMs={overlay.durationMs}
      variant={overlay.variant}
      message={overlay.message}
      wrongGenre={overlay.wrongGenre}
    />
  );
}
