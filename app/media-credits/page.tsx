import { mediaManifest, realAssets } from "@/lib/media/mediaManifest";
import { attributionText } from "@/lib/media/attribution";

export const metadata = {
  title: "Media credits | in between space"
};

export default function MediaCreditsPage() {
  const byProvider = realAssets.reduce<Record<string, number>>((acc, a) => {
    acc[a.provider] = (acc[a.provider] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#f7f7f2] p-6 text-[#171717]">
      <section className="mx-auto max-w-4xl">
        <h1 className="font-serif text-5xl lowercase">media credits</h1>
        <p className="mt-3 max-w-2xl">
          Runtime pages render from a manifest-first media layer. Real, openly-licensed photos and videos are ingested from free providers
          (Pexels, Pixabay, Openverse, Wikimedia Commons) into <code>content/image-manifest.json</code>, then deliberately misused across unrelated
          web genres. Project-owned generated SVGs are used as deterministic fallbacks and broken-image states. Provider, query, safe-search, license,
          and attribution metadata are preserved for every asset.
        </p>
        <p className="mt-2 font-mono text-sm">
          {realAssets.length} ingested assets ·{" "}
          {Object.entries(byProvider)
            .map(([provider, count]) => `${provider}: ${count}`)
            .join(" · ")}
        </p>
        <div className="mt-6 grid gap-3">
          {mediaManifest.map((asset) => (
            <article key={asset.id} className="border border-[#aaa] bg-white p-4">
              <h2 className="font-mono text-lg">{asset.id}</h2>
              <p>{attributionText(asset)}</p>
              <p className="text-sm">Provider: {asset.provider}; type: {asset.type}; source: {asset.sourceUrl}</p>
              <p className="text-sm">Queries: {asset.queries.join(", ")}</p>
              <p className="text-sm">Safe search: {asset.safety.safeSearchApplied ? asset.safety.safeSearchMode : "not applied"}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
