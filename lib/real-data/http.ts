import { realDataConfig } from "@/config/real-data";
import type { RealDataResult, RealDataSource } from "./types";

export type FetchJsonOptions<T> = {
  cache?: RequestCache;
  fallback: T;
  source: Exclude<RealDataSource, "fixture">;
  timeoutMs?: number;
};

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function compactParams(
  params: Record<string, string | number | boolean | undefined | null>
): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  return searchParams;
}

export function boundedList<T>(items: readonly T[], limit: number = realDataConfig.maxSearchResults): T[] {
  return items.slice(0, Math.max(0, limit));
}

export async function fetchJson<T>(url: string, options: FetchJsonOptions<T>): Promise<RealDataResult<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? realDataConfig.requestTimeoutMs
  );

  try {
    const response = await fetch(url, {
      cache: options.cache,
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${url}`);
    }

    const data = (await response.json()) as T;

    return {
      data,
      fallback: false,
      source: options.source
    };
  } catch (error) {
    return {
      data: options.fallback,
      error: errorMessage(error),
      fallback: true,
      source: "fixture"
    };
  } finally {
    clearTimeout(timeout);
  }
}
