"use client";

import { usePathname } from "next/navigation";
import { routeLoaderFromPath } from "@/lib/loadingProfiles";
import { RouteLoadingShell } from "./LoadingEffects";

export function RouteLoading() {
  const pathname = usePathname();
  const config = routeLoaderFromPath(pathname ?? "/");
  return <RouteLoadingShell variant={config.variant} message={config.message} progress={config.progress} />;
}
