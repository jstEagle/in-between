import { generateFaviconSvg } from "@/lib/favicon";

export function GET(request: Request) {
  const url = new URL(request.url);
  const seed = url.searchParams.get("seed") ?? "in-between-space/home";
  const label = url.searchParams.get("label") ?? "in between space";

  return new Response(generateFaviconSvg(seed, label), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
