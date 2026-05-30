import { RadioPlayer } from "@/components/radio/RadioPlayer";
import { fetchRandomMusicRadioBrowserStations } from "@/lib/real-data";
import { seededRadioStations, toRadioStation } from "@/lib/radio";
import { createRng } from "@/lib/seed";
import type { GeneratedPage, RealDataIntrusion } from "@/lib/types";
import { InlineBookReader, pickRealDataIntrusions, RealDataPanel } from "./RealDataIntrusion";

const embeddedSections = new Set(["article", "watch", "video", "shorts", "guides", "learn", "food", "maps"]);

function shouldEmbed(page: GeneratedPage) {
  if (page.layout === "weather") return false;
  if (embeddedSections.has(page.routeState.routeSection)) return true;
  if (/\b(book|library|radio|station|recipe|wiki)\b/i.test(page.motifs.join(" "))) return true;
  return createRng(`${page.routeState.seed}:embedded-real-data-band`).bool(0.18);
}

function isBroadcastPage(page: GeneratedPage) {
  return page.layout === "streaming" || page.layout === "short-video" || page.routeState.routeSection === "watch" || page.routeState.routeSection === "video";
}

function isBookPage(page: GeneratedPage) {
  return page.layout === "minimal-blog" || page.routeState.routeSection === "article" || /\b(book|library)\b/i.test(page.motifs.join(" "));
}

function uniqueSideItems(items: Array<RealDataIntrusion | undefined>, book?: RealDataIntrusion) {
  return items
    .filter((item): item is RealDataIntrusion => Boolean(item))
    .filter((item, index, list) => item.id !== book?.id && list.findIndex((candidate) => candidate.id === item.id) === index);
}

export async function EmbeddedRealDataBand({ page }: { page: GeneratedPage }) {
  if (!shouldEmbed(page)) return null;

  const book = page.realDataIntrusions.find((intrusion) => intrusion.kind === "book");
  const weather = page.realDataIntrusions.find((intrusion) => intrusion.kind === "weather");
  const recipe = page.realDataIntrusions.find((intrusion) => intrusion.kind === "recipe");
  const selected = pickRealDataIntrusions(`${page.routeState.seed}:embedded-band`, page.realDataIntrusions, 4);

  if (isBroadcastPage(page)) {
    const result = await fetchRandomMusicRadioBrowserStations(12);
    const stations = seededRadioStations(`${page.routeState.seed}:embedded-radio`, result.data.map(toRadioStation), 3);

    if (stations.length) {
      return (
        <section className="shell py-[calc(var(--pad-section)*.8)]">
          <div className={`${page.styleRecipe.classes.panel} grid gap-5`}>
            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-accent text-[11px] uppercase opacity-60">watch queue became a radio shelf</p>
                <h2 className="headline text-3xl">Every thumbnail is a station you can listen to</h2>
              </div>
              {weather ? <p className="max-w-xs text-sm leading-6 opacity-70">{weather.body}</p> : null}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {stations.map((station) => (
                <RadioPlayer key={station.stationuuid} station={station} variant="expanded" className="min-h-full" />
              ))}
            </div>
          </div>
        </section>
      );
    }
  }

  if (!isBroadcastPage(page) && book && (isBookPage(page) || book.readerUrl || createRng(`${page.routeState.seed}:bookstore-band`).bool(0.48))) {
    const side = uniqueSideItems([weather, recipe, ...selected], book).slice(0, 3);

    return (
      <section className="shell py-[calc(var(--pad-section)*.8)]">
        <div className="grid gap-[var(--gap-grid)] lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
          <article className={`${page.styleRecipe.classes.panel} overflow-hidden`}>
            <div className="grid gap-4 p-4 md:grid-cols-[160px_1fr]">
              {book.imageUrl ? (
                <div className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--page-border)] bg-[var(--page-muted)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={book.imageUrl} alt="" className="aspect-[2/3] h-full w-full object-cover" loading="lazy" />
                </div>
              ) : null}
              <div>
                <p className="font-accent text-[11px] uppercase opacity-60">bookstore blog / open shelf</p>
                <h2 className="headline mt-1 text-4xl">{book.title}</h2>
                <p className="mt-3 max-w-2xl leading-7 opacity-78">{book.body}</p>
                <InlineBookReader intrusion={book} />
              </div>
            </div>
          </article>
          <aside className="grid content-start gap-3">
            {side.map((intrusion) => (
              <RealDataPanel key={intrusion.id} intrusion={intrusion} compact className={page.styleRecipe.classes.intrusionPanel} />
            ))}
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="shell py-[calc(var(--pad-section)*.8)]">
      <div className="grid gap-[var(--gap-grid)] lg:grid-cols-[.75fr_1.25fr]">
        <aside className={page.styleRecipe.classes.intrusionPanel}>
          <p className="font-accent text-[11px] uppercase opacity-60">public records drawer</p>
          <h2 className="headline mt-1 text-2xl">Proper facts sorted into the wrong office</h2>
          <p className="mt-2 text-sm leading-6 opacity-75">{weather?.body ?? "A public feed has been filed inside this page."}</p>
        </aside>
        <div className="grid gap-3 sm:grid-cols-2">
          {selected.slice(0, 4).map((intrusion) => (
            <RealDataPanel key={intrusion.id} intrusion={intrusion} className={page.styleRecipe.classes.panel} />
          ))}
        </div>
      </div>
    </section>
  );
}
