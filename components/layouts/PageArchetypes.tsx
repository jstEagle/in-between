import type { CSSProperties, ReactNode } from "react";
import { DeepLink } from "@/components/glitches/DeepLink";
import { MutableText } from "@/components/glitches/MutableText";
import { MediaFrame } from "@/components/blocks/MediaFrame";
import { RealDataPanel } from "@/components/blocks/RealDataIntrusion";
import { PageChrome } from "@/components/blocks/PageChrome";
import { GeneratedBlock } from "@/components/blocks/GeneratedBlocks";
import { InlineBlockLoader, FloatingBriefLoader, VisitorCounter } from "@/components/loaders/LoadingEffects";
import { ProductExperience, SearchExperience, type InteractionItem } from "@/components/interaction/ComposableUI";
import { SearchForm } from "@/components/interaction/SearchForm";
import { languageLabel } from "@/content/i18n";
import { InfiniteShortVideoFeed, InfiniteSocialFeed } from "@/components/infinite/InfiniteGeneratedScroll";
import { contextForBlock } from "@/lib/generatePage";
import { selectImage } from "@/lib/imageEngine";
import { inlineLoaderForBlock, loaderVariantForPage, mediaLoaderConfig } from "@/lib/loadingProfiles";
import { makeLink, makeLinks } from "@/lib/linkEngine";
import { siteIdentity } from "@/lib/siteEngine";
import { entropyLevel, entropyPhase } from "@/lib/entropy";
import { RadioPlayer, type RadioStation } from "@/components/radio/RadioPlayer";
import { fetchRandomMusicRadioBrowserStations } from "@/lib/real-data";
import { seededRadioStations, toRadioStation } from "@/lib/radio";
import { createRng, pick } from "@/lib/seed";
import { chooseComponentGlitch, glitchClassName, type ComponentGlitch } from "@/lib/componentGlitches";
import {
  generateButtonLabel,
  generateFooterLine,
  generateFormLabel,
  generateHeading,
  generateHeadline,
  generateLoadingMessage,
  generateParagraph,
  generateProductDescription,
  generateProductName,
  generateSubheading,
  localizedPhrase
} from "@/lib/textEngine";
import type { MediaLoaderConfig } from "@/lib/loadingProfiles";
import type { BlockPacket, GeneratedPage, LayoutVariation, LinkPacket } from "@/lib/types";
import { reorderByVariation, variedCount } from "@/lib/layoutVariation";

export function PageArchetype({ page }: { page: GeneratedPage }) {
  if (page.layoutGrammar) {
    return (
      <>
        <PageMemoryFragments page={page} />
        <GeneratedGrammarLayout page={page} />
      </>
    );
  }

  let content: ReactNode;

  switch (page.layout) {
    case "streaming":
      content = <StreamingLayout page={page} />;
      break;
    case "minimal-blog":
      content = <MinimalBlogLayout page={page} />;
      break;
    case "store":
      content = <StoreLayout page={page} />;
      break;
    case "portal-2000":
      content = <Portal2000Layout page={page} />;
      break;
    case "search":
      content = <SearchLayout page={page} />;
      break;
    case "news":
      content = <NewsLayout page={page} />;
      break;
    case "dashboard":
      content = <DashboardLayout page={page} />;
      break;
    case "landing":
      content = <LandingLayout page={page} />;
      break;
    case "booking":
      content = <BookingLayout page={page} />;
      break;
    case "forum":
      content = <ForumLayout page={page} />;
      break;
    case "directory":
      content = <DirectoryLayout page={page} />;
      break;
    case "game":
      content = <GamePortalLayout page={page} />;
      break;
    case "app-store":
      content = <AppStoreLayout page={page} />;
      break;
    case "events":
      content = <EventsLayout page={page} />;
      break;
    case "product":
      content = <ProductLayout page={page} />;
      break;
    case "docs":
      content = <DocsLayout page={page} />;
      break;
    case "manual":
      content = <ManualLayout page={page} />;
      break;
    case "link-in-bio":
      content = <LinkInBioLayout page={page} />;
      break;
    case "guestbook":
      content = <GuestbookLayout page={page} />;
      break;
    case "social-feed":
      content = <SocialFeedLayout page={page} />;
      break;
    case "short-video":
      content = <ShortVideoLayout page={page} />;
      break;
    case "finance":
      content = <FinanceLayout page={page} />;
      break;
    case "education":
      content = <EducationLayout page={page} />;
      break;
    case "health":
      content = <HealthLayout page={page} />;
      break;
    case "jobs":
      content = <JobsLayout page={page} />;
      break;
    case "maps":
      content = <MapsLayout page={page} />;
      break;
    case "food":
      content = <FoodLayout page={page} />;
      break;
    case "real-estate":
      content = <RealEstateLayout page={page} />;
      break;
    case "creator":
      content = <CreatorLayout page={page} />;
      break;
    case "weather":
      content = <WeatherLayout page={page} />;
      break;
    case "auctions":
      content = <AuctionsLayout page={page} />;
      break;
    case "music":
      content = <MusicLayout page={page} />;
      break;
    case "chat":
      content = <ChatLayout page={page} />;
      break;
    default:
      content = <MixedLayout page={page} />;
      break;
  }

  const withFragments = (
    <>
      <PageMemoryFragments page={page} />
      {content}
    </>
  );

  if (page.layout === "docs" || page.layout === "education") return withFragments;

  return (
    <ArchetypeGlitchShell glitch={chooseComponentGlitch(`${page.routeState.seed}:${page.layout}`, page.routeState.depth, "page-archetype")}>
      {withFragments}
    </ArchetypeGlitchShell>
  );
}

/* ============================ shared atoms ============================ */

type P = { page: GeneratedPage };

function displayBrand(page: GeneratedPage, fallback = "in between space") {
  const label = siteIdentity(page.routeState.site);
  return label || fallback;
}

function PageMemoryFragments({ page }: P) {
  const ctx = contextForBlock(page, "page-memory-fragments");
  const rng = createRng(ctx.componentSeed);
  const entropy = entropyLevel(page.routeState.depth);
  if (entropy <= 0 && rng.bool(0.72)) return null;

  const mode = pick(`${ctx.componentSeed}:mode`, ["cookie", "account", "utility", "ratings", "classifieds", "none"]);

  if (mode === "none" || rng.bool(0.38 - entropy * 0.28)) return null;

  const label = displayBrand(page);
  const link = makeLink(ctx, "memory-fragment-action", generateButtonLabel(ctx));

  if (mode === "cookie") {
    return (
      <div className="border-b border-[var(--page-border)] bg-[var(--page-muted)]/75">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-2 text-xs">
          <span className="font-accent uppercase opacity-70">{label} remembers {page.motifs[0] ?? "your tab"}</span>
          <DeepLink link={link} className="rounded-[var(--radius-button)] border border-[var(--page-border)] bg-[var(--page-bg)] px-2 py-1 font-accent uppercase" />
        </div>
      </div>
    );
  }

  if (mode === "account") {
    return (
      <div className="border-b border-dashed border-[var(--page-border)] bg-[var(--page-bg)]">
        <div className="shell grid gap-1 py-1.5 font-accent text-[11px] uppercase opacity-75 sm:grid-cols-[1fr_auto]">
          <span>signed in as guest-{rng.int(100, 999)} · cart restored from {rng.int(1999, 2023)}</span>
          <span>{page.genreFormula.residue}</span>
        </div>
      </div>
    );
  }

  if (mode === "ratings") {
    return (
      <div className="border-b border-[var(--page-border)] bg-[var(--page-accent)] text-white">
        <div className="shell flex flex-wrap items-center gap-3 py-1.5 text-xs">
          <span className="font-accent uppercase">{label}</span>
          <Stars seed={ctx.componentSeed} />
          <span className="opacity-85">{rng.int(12, 9804)} reviews for {page.motifs[1] ?? "availability"}</span>
        </div>
      </div>
    );
  }

  if (mode === "classifieds") {
    return (
      <div className="border-b border-[var(--page-border)] bg-[#ffffcc] text-black">
        <div className="shell flex gap-5 overflow-hidden py-1 font-intrusion text-xs">
          {makeLinks(ctx, 5, "classified").map((item) => (
            <DeepLink key={item.id} link={item} className="shrink-0 old-link" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[var(--page-border)] bg-[var(--page-fg)] text-[var(--page-bg)]">
      <div className="shell flex flex-wrap items-center justify-between gap-2 py-1.5 font-accent text-[11px] uppercase">
        <span>{generateLoadingMessage(ctx)} · {label}</span>
        <span>{page.languageBlend.primary} / {entropyPhase(page.routeState.depth)} / {page.webMood}</span>
      </div>
    </div>
  );
}

function ArchetypeGlitchShell({ glitch, children }: { glitch: ComponentGlitch; children: ReactNode }) {
  if (glitch.kind === "none") return <>{children}</>;

  const style =
    glitch.kind === "offset"
      ? ({ transform: `translate(${glitch.x}px, ${glitch.y}px)` } as CSSProperties)
      : glitch.kind === "clipped" || glitch.kind === "collapsed"
        ? ({ maxHeight: glitch.maxHeight, overflow: "hidden" } as CSSProperties)
        : glitch.kind === "sliced"
          ? ({ clipPath: `inset(${glitch.inset})` } as CSSProperties)
          : ({ "--glitch-duplicate-x": `${glitch.x}px`, "--glitch-duplicate-y": `${glitch.y}px` } as CSSProperties);

  return (
    <div className={glitchClassName(glitch)} data-glitch={glitch.kind} style={style}>
      {children}
    </div>
  );
}

function A({ link, className = "", children }: { link: LinkPacket; className?: string; children: ReactNode }) {
  return (
    <a href={link.href} className={className}>
      {children}
    </a>
  );
}

function CleanMedia({
  image,
  className = "",
  rounded = "rounded-[var(--radius-media)]",
  loader,
  motion = false
}: {
  image: ReturnType<typeof selectImage>;
  className?: string;
  rounded?: string;
  loader?: MediaLoaderConfig | null;
  motion?: boolean;
}) {
  return (
    <div className={`overflow-hidden ${rounded} border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)] ${className}`}>
      <MediaFrame image={image} plain loader={loader} motion={motion} />
    </div>
  );
}

function GuaranteedVideoMedia({
  image,
  className = "",
  rounded = "rounded-[var(--radius-media)]"
}: {
  image: ReturnType<typeof selectImage>;
  className?: string;
  rounded?: string;
}) {
  return <CleanMedia image={image} className={className} rounded={rounded} motion={Boolean(image.videoSrc)} />;
}

function Stars({ seed }: { seed: string }) {
  const n = createRng(`${seed}:stars`).int(2, 5);
  return (
    <span className="text-[var(--page-accent)]" aria-label={`${n} stars`}>
      {"★★★★★".slice(0, n)}
      <span className="opacity-30">{"★★★★★".slice(n)}</span>
    </span>
  );
}

function price(seed: string) {
  const rng = createRng(`${seed}:price`);
  const list = ["$14.95", "$404.00", "€8,800", "¥0", "$" + rng.int(7, 98) + "." + rng.int(0, 99).toString().padStart(2, "0"), "3 payments of later"];
  return list[rng.int(0, list.length - 1)];
}

function views(seed: string) {
  const rng = createRng(`${seed}:views`);
  const n = rng.int(1, 990);
  const unit = ["views", "K views", "M views"][rng.int(0, 2)];
  const ago = rng.int(1, 11);
  const span = ["minutes", "hours", "days", "years"][rng.int(0, 3)];
  return `${n}${unit === "views" ? "" : ""} ${unit} · ${ago} ${span} ago`;
}

function ColumnsFooter({ page }: P) {
  const ctx = contextForBlock(page, "footer");
  return (
    <footer className="mt-12 border-t-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]/60">
      <div className="shell grid gap-[var(--gap-grid)] py-8 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((col) => (
          <div key={col}>
            <p className="mb-2 font-accent text-[11px] uppercase tracking-wide opacity-70">{["Company", "Help", "Account", "Elsewhere"][col]}</p>
            <ul className="grid gap-1 text-sm">
              {makeLinks(ctx, 4, `footer-${col}`).map((l) => (
                <li key={l.id}>
                  <DeepLink link={l} className="opacity-80 hover:underline" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="shell pb-6 text-xs opacity-60">{generateFooterLine(ctx)}</div>
    </footer>
  );
}

function TinyFooter({ page }: P) {
  const ctx = contextForBlock(page, "footer");
  return (
    <footer className="mx-auto w-full max-w-[680px] px-5 py-12 text-center text-xs opacity-55">
      <p>{generateFooterLine(ctx)}</p>
      <p className="mt-1 font-accent">
        <a href="/media-credits" className="old-link">
          media credits
        </a>{" "}
        · {page.languageBlend.primary}
      </p>
    </footer>
  );
}

function OldWebFooter({ page }: P) {
  const ctx = contextForBlock(page, "footer");
  const r = createRng(`${ctx.componentSeed}:oldweb`);
  return (
    <footer className="mt-8 border-t-2 border-[var(--page-border)] bg-[var(--page-muted)] py-5 text-center text-xs">
      <p>Best viewed in {[800, 1024, 640][r.int(0, 2)]}×{[600, 768, 480][r.int(0, 2)]} · Netscape Navigator recommended</p>
      <p className="mt-1">You are visitor number {r.int(10000, 99999)} since {r.int(1998, 2004)}</p>
      <p className="mt-1 font-accent">{generateFooterLine(ctx)}</p>
    </footer>
  );
}

function MiniHeader({ page, links = 4, center = false }: P & { links?: number; center?: boolean }) {
  const ctx = contextForBlock(page, "mini-header");
  const home = makeLink(ctx, "brand-home", "Home");
  return (
    <header className={`site-header border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]`}>
      <div className={`shell flex items-center gap-4 py-3 ${center ? "justify-center" : "justify-between"}`}>
        <a href={home.href} className="site-brand headline lowercase no-underline">
          {displayBrand(page)}
        </a>
        {!center && (
          <nav className="flex flex-wrap gap-x-4 font-accent text-[11px] uppercase">
            {page.navigation.slice(0, links).map((l) => (
              <DeepLink key={l.id} link={l} className="hover:underline" />
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

/* ============================ layout variation helpers ============================ */

function v(page: GeneratedPage) {
  return page.layoutVariation;
}

function vCount(page: GeneratedPage, min: number, max: number) {
  return variedCount(page.routeState.seed, min, max, page.layoutVariation.density);
}

function gridColsClass(cols: LayoutVariation["gridCols"]) {
  const map: Record<LayoutVariation["gridCols"], string> = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
  };
  return map[cols];
}

function aspectClass(aspect: LayoutVariation["mediaAspect"]) {
  const map: Record<LayoutVariation["mediaAspect"], string> = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    tall: "aspect-[3/4]",
    portrait: "aspect-[9/16]"
  };
  return map[aspect];
}

function gapClass(scale: LayoutVariation["gapScale"]) {
  return scale === "tight" ? "gap-2" : scale === "loose" ? "gap-6" : "gap-4";
}

function siteHomeHref(page: GeneratedPage) {
  return makeLink(contextForBlock(page, "site-home"), "brand-home", "Home").href;
}

function titleClass(scale: LayoutVariation["titleScale"]) {
  return scale === "sm" ? "text-xl" : scale === "lg" ? "text-3xl" : scale === "xl" ? "text-4xl md:text-5xl" : "text-2xl";
}

function cardSurface(page: GeneratedPage, extra = "") {
  const style = v(page).cardStyle;
  if (style === "border") return `border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)] ${extra}`.trim();
  if (style === "flat") return `bg-[var(--page-muted)]/35 ${extra}`.trim();
  if (style === "elevated") return `${page.styleRecipe.classes.panel} shadow-[var(--shadow-card)] ${extra}`.trim();
  return `${page.styleRecipe.classes.panel} ${extra}`.trim();
}

function LayoutFooter({ page }: P) {
  switch (v(page).footerMode) {
    case "oldweb":
      return <OldWebFooter page={page} />;
    case "columns":
      return <ColumnsFooter page={page} />;
    default:
      return <TinyFooter page={page} />;
  }
}

function LayoutPromo({ page }: P) {
  if (!v(page).showPromo) return null;
  const ctx = contextForBlock(page, "promo");
  const r = createRng(ctx.componentSeed);
  return (
    <div className="bg-[var(--page-accent)] text-white">
      <div className="shell flex flex-wrap items-center justify-between gap-2 py-1.5 font-accent text-[11px] uppercase">
        <span>{generateLoadingMessage(ctx)} · {page.motifs[r.int(0, page.motifs.length - 1)] ?? "checkout"}</span>
        <span>{page.languageBlend.primary} · {r.int(0, 999)} watching</span>
      </div>
    </div>
  );
}

function LayoutBreadcrumb({ page, ctx, trail }: P & { ctx: ReturnType<typeof contextForBlock>; trail?: string[] }) {
  if (!v(page).showBreadcrumb) return null;
  const crumbs = trail ?? ["Home", page.genreFormula.content, page.motifs[1] ?? "listings"];
  return (
    <div className="shell flex flex-wrap items-center gap-2 py-3 font-accent text-[11px] opacity-60">
      {crumbs.map((c, i) => (
        <span key={c} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {i === crumbs.length - 1 ? <span className="opacity-90">{c}</span> : <DeepLink link={makeLink(ctx, `crumb-${i}`, c)} className="hover:underline" />}
        </span>
      ))}
    </div>
  );
}

function VariedHeader({ page, links }: P & { links?: number }) {
  const mode = v(page).headerMode;
  const count = links ?? v(page).navLinks;
  if (mode === "chrome") return <PageChrome page={page} />;
  if (mode === "promo") {
    return (
      <>
        <LayoutPromo page={page} />
        <MiniHeader page={page} links={count} />
      </>
    );
  }
  if (mode === "centered") return <MiniHeader page={page} links={count} center />;
  if (mode === "sticky") {
    const ctx = contextForBlock(page, "sticky-header");
    const home = makeLink(ctx, "brand-home", "Home");
    return (
      <header className="site-header sticky top-0 z-20 border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)]/90 backdrop-blur">
        <div className="shell flex items-center justify-between py-2.5">
          <a href={home.href} className="site-brand headline lowercase no-underline">{displayBrand(page)}</a>
          <nav className="flex flex-wrap gap-x-3 font-accent text-[11px] uppercase">
            {page.navigation.slice(0, count).map((l) => (
              <DeepLink key={l.id} link={l} className="hover:underline" />
            ))}
          </nav>
        </div>
      </header>
    );
  }
  if (mode === "compact") {
    const ctx = contextForBlock(page, "compact-header");
    const home = makeLink(ctx, "brand-home", "Home");
    return (
      <header className="border-b border-[var(--page-border)]">
        <div className="shell flex items-center justify-between py-2 text-sm">
          <a href={home.href} className="site-brand font-bold no-underline">{displayBrand(page, "in between")}</a>
          <span className="font-accent text-[10px] opacity-60">{page.motifs[0]}</span>
        </div>
      </header>
    );
  }
  return <MiniHeader page={page} links={count} />;
}

function IntrusionAside({ page, id, links = 6 }: P & { id: string; links?: number }) {
  if (!v(page).showIntrusion) return null;
  const ctx = contextForBlock(page, id);
  return (
    <div className="grid h-fit gap-4">
      <div className={page.styleRecipe.classes.intrusionPanel}>
        <p className="font-accent text-[11px] uppercase">Elsewhere on {page.genreFormula.residue}</p>
        <ul className="mt-2 grid gap-2 text-sm">
          {makeLinks(ctx, links, `${id}-intrusion`).map((l) => (
            <li key={l.id}>
              <DeepLink link={l} className="hover:underline" />
            </li>
          ))}
        </ul>
      </div>
      {v(page).showSecondaryMedia ? <CleanMedia image={selectImage(ctx, "fake ad")} className={aspectClass(v(page).mediaAspect)} /> : null}
    </div>
  );
}

function SidebarShell({ page, main, aside }: P & { main: ReactNode; aside: ReactNode }) {
  const side = v(page).sidebarSide;
  return (
    <div className={`shell grid gap-[var(--gap-grid)] py-[var(--pad-section)] ${side === "left" ? "lg:grid-cols-[280px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_280px]"}`}>
      {side === "left" ? (
        <>
          <aside className="grid h-fit gap-4">{aside}</aside>
          <div className="min-w-0">{main}</div>
        </>
      ) : (
        <>
          <div className="min-w-0">{main}</div>
          <aside className="grid h-fit gap-4">{aside}</aside>
        </>
      )}
    </div>
  );
}

/* ============================ generated grammar ============================ */

function GeneratedGrammarLayout({ page }: P) {
  const grammar = page.layoutGrammar!;
  const hero = page.blocks.find((block) => block.type === "hero");
  const footer = page.blocks.find((block) => block.type === "footer");
  const body = grammarBlocks(page, page.blocks.filter((block) => block.type !== "hero" && block.type !== "footer"));
  const sidebar = grammar.sidebar === "none" ? null : <GrammarSidebar page={page} />;
  const heroNode = hero && grammar.heroPlacement !== "omitted" ? <GrammarHero page={page} id={hero.id} /> : null;

  return (
    <div data-generated-frame={grammar.frame} data-generated-rhythm={grammar.rhythm}>
      <GrammarHeader page={page} />
      {grammar.showUtilityStrip ? <GrammarUtilityStrip page={page} /> : null}
      {grammar.showLocalNav ? <GrammarLocalNav page={page} /> : null}
      <GrammarFrame page={page} hero={heroNode} body={body} footer={footer} sidebar={sidebar} />
    </div>
  );
}

function grammarBlocks(page: GeneratedPage, blocks: BlockPacket[]) {
  const grammar = page.layoutGrammar!;
  const ordered = reorderByVariation(`${page.routeState.seed}:grammar-blocks`, blocks, grammar.blockOrder);
  return ordered.slice(0, grammar.maxBlocksBeforeFooter);
}

function GrammarHero({ page, id }: P & { id: string }) {
  const ctx = contextForBlock(page, id);
  const grammar = page.layoutGrammar!;
  const image = selectImage(ctx, page.layout === "streaming" || page.layout === "short-video" ? "featured video" : "hero background");
  const cta = makeLink(ctx, "grammar-hero-cta", generateButtonLabel(ctx));
  const showMedia = grammar.frame === "split" || grammar.frame === "magazine" || grammar.frame === "portal" || grammar.frame === "masonry";

  return (
    <section className={`${page.styleRecipe.classes.panel} overflow-hidden`}>
      <div className={`grid gap-[var(--gap-grid)] ${showMedia ? "lg:grid-cols-[minmax(0,1fr)_minmax(220px,.7fr)]" : ""}`}>
        <div className={`grid content-center gap-3 ${grammar.alignment === "center" ? "text-center" : grammar.alignment === "right" ? "text-right" : ""}`}>
          <p className="font-accent text-[11px] uppercase opacity-65">{page.genreFormula.surface} / {page.webMood}</p>
          <h1 className="headline max-w-[18ch] text-[length:var(--text-h2)] leading-tight">{page.title}</h1>
          <p className="max-w-2xl text-sm leading-6 opacity-80">{page.subtitle}</p>
          <div className={`flex flex-wrap gap-2 ${grammar.alignment === "center" ? "justify-center" : grammar.alignment === "right" ? "justify-end" : ""}`}>
            <DeepLink link={cta} className={page.styleRecipe.classes.button} />
            <span className={page.styleRecipe.classes.tag}>{page.motifs[0] ?? page.routeState.site.currentNode}</span>
          </div>
        </div>
        {showMedia ? <CleanMedia image={image} className="min-h-0 aspect-[4/3]" loader={mediaLoaderConfig(ctx)} motion={Boolean(image.videoSrc)} /> : null}
      </div>
    </section>
  );
}

function GrammarFrame({
  page,
  hero,
  body,
  footer,
  sidebar
}: P & {
  hero: ReactNode;
  body: BlockPacket[];
  footer?: BlockPacket;
  sidebar: ReactNode;
}) {
  const grammar = page.layoutGrammar!;
  const bodyNodes = body.map((block, index) => (
    <div key={block.id} className={grammarBlockClass(page, block, index)}>
      <GeneratedBlock page={page} block={block} />
    </div>
  ));
  const footerNode = footer ? <GeneratedBlock page={page} block={footer} /> : <LayoutFooter page={page} />;

  if (grammar.frame === "app-shell") {
    return (
      <div className={`grid min-h-screen ${grammar.sidebar === "right" ? "lg:grid-cols-[minmax(0,1fr)_260px]" : "lg:grid-cols-[260px_minmax(0,1fr)]"}`}>
        {grammar.sidebar !== "right" ? <aside className="border-r border-[var(--page-border)] bg-[var(--page-muted)]/35">{sidebar}</aside> : null}
        <main className="min-w-0">
          {grammar.heroPlacement === "first" ? hero : null}
          <div className={grammarMainClass(page)}>
            {grammar.heroPlacement === "inline" || grammar.heroPlacement === "aside" ? <div className={grammarHeroClass(page)}>{hero}</div> : null}
            {bodyNodes}
          </div>
          {footerNode}
        </main>
        {grammar.sidebar === "right" ? <aside className="border-l border-[var(--page-border)] bg-[var(--page-muted)]/35">{sidebar}</aside> : null}
      </div>
    );
  }

  if (grammar.frame === "split") {
    return (
      <>
        <main className={`shell grid gap-[var(--gap-grid)] py-[var(--pad-section)] ${grammar.sidebar === "left" ? "lg:grid-cols-[.72fr_1.28fr]" : "lg:grid-cols-[1.28fr_.72fr]"}`}>
          {grammar.sidebar === "left" ? (
            <aside className="grid content-start gap-[var(--gap-grid)]">{hero}{sidebar}</aside>
          ) : null}
          <div className={`grid min-w-0 ${grammarGapClass(page)}`}>
            {grammar.sidebar === "none" ? hero : null}
            {bodyNodes}
          </div>
          {grammar.sidebar !== "left" ? (
            <aside className="grid content-start gap-[var(--gap-grid)]">{grammar.sidebar === "right" ? sidebar : hero}</aside>
          ) : null}
        </main>
        {footerNode}
      </>
    );
  }

  if (grammar.frame === "sidebar") {
    return (
      <>
        {grammar.heroPlacement === "first" ? hero : null}
        <main className={`shell grid gap-[var(--gap-grid)] py-[var(--pad-section)] ${grammar.sidebar === "left" ? "lg:grid-cols-[280px_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_280px]"}`}>
          {grammar.sidebar === "left" ? <aside className="grid content-start gap-[var(--gap-grid)]">{sidebar}</aside> : null}
          <div className={`grid min-w-0 ${grammarGapClass(page)}`}>
            {grammar.heroPlacement === "inline" ? hero : null}
            {bodyNodes}
          </div>
          {grammar.sidebar === "right" ? <aside className="grid content-start gap-[var(--gap-grid)]">{sidebar}</aside> : null}
        </main>
        {footerNode}
      </>
    );
  }

  if (grammar.frame === "portal" || grammar.frame === "masonry") {
    return (
      <>
        {grammar.heroPlacement === "first" ? hero : null}
        <main className={`shell py-[var(--pad-section)] ${alignmentClass(grammar.alignment)}`}>
          {grammar.heroPlacement === "inline" ? <div className="mb-[var(--gap-grid)]">{hero}</div> : null}
          <div className={`${grammar.frame === "masonry" ? "columns-1 gap-[var(--gap-grid)] md:columns-2 xl:columns-3" : `grid ${grammarGapClass(page)} ${grammarColumnClass(grammar.columns)}`}`}>
            {bodyNodes}
          </div>
        </main>
        {footerNode}
      </>
    );
  }

  if (grammar.frame === "magazine") {
    return (
      <>
        <main className={`shell py-[var(--pad-section)] ${alignmentClass(grammar.alignment)}`}>
          {grammar.heroPlacement !== "omitted" ? <div className="mb-[var(--gap-grid)] border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pb-[var(--gap-grid)]">{hero}</div> : null}
          <div className={`grid ${grammarGapClass(page)} ${grammarColumnClass(grammar.columns)}`}>
            {bodyNodes}
          </div>
        </main>
        {footerNode}
      </>
    );
  }

  return (
    <>
      <main className={`mx-auto grid w-full ${grammar.alignment === "center" ? "max-w-4xl" : "max-w-[var(--container-max)]"} ${grammarGapClass(page)} px-3 py-[var(--pad-section)] md:px-8 ${alignmentClass(grammar.alignment)}`}>
        {grammar.heroPlacement !== "omitted" ? hero : null}
        {bodyNodes}
      </main>
      {footerNode}
    </>
  );
}

function GrammarHeader({ page }: P) {
  const grammar = page.layoutGrammar!;
  const ctx = contextForBlock(page, "grammar-header");
  const home = makeLink(ctx, "brand-home", "Home");

  if (grammar.header === "side-rail") return null;

  if (grammar.header === "utility") {
    return (
      <header className="site-header border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
        <div className="shell grid gap-2 py-2 text-xs md:grid-cols-[1fr_auto_1fr] md:items-center">
          <a href={home.href} className="site-brand headline lowercase no-underline">{siteIdentity(page.routeState.site)}</a>
          <span className="font-accent uppercase opacity-60">{page.genreFormula.surface}</span>
          <nav className="flex flex-wrap gap-3 md:justify-end">
            {page.navigation.slice(0, 3).map((link) => <DeepLink key={link.id} link={link} className="hover:underline" />)}
          </nav>
        </div>
      </header>
    );
  }

  if (grammar.header === "masthead") {
    return (
      <header className="site-header border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
        <div className={`shell py-5 ${grammar.alignment === "center" ? "text-center" : ""}`}>
          <a href={home.href} className="site-brand headline text-3xl lowercase no-underline">{siteIdentity(page.routeState.site)}</a>
          <nav className={`mt-3 flex flex-wrap gap-4 font-accent text-[11px] uppercase ${grammar.alignment === "center" ? "justify-center" : ""}`}>
            {page.navigation.slice(0, 5).map((link) => <DeepLink key={link.id} link={link} className="hover:underline" />)}
          </nav>
        </div>
      </header>
    );
  }

  if (grammar.header === "compact") {
    return (
      <header className="site-header border-b border-[var(--page-border)]">
        <div className="shell flex items-center justify-between gap-3 py-2">
          <a href={home.href} className="site-brand font-bold lowercase no-underline">{siteIdentity(page.routeState.site)}</a>
          <span className="truncate font-accent text-[10px] uppercase opacity-60">{page.motifs.slice(0, 2).join(" / ")}</span>
        </div>
      </header>
    );
  }

  return <MiniHeader page={page} links={page.layoutVariation.navLinks} />;
}

function GrammarUtilityStrip({ page }: P) {
  const ctx = contextForBlock(page, "grammar-utility");
  return (
    <div className="border-b border-[var(--page-border)] bg-[var(--page-muted)]/55">
      <div className="shell flex flex-wrap items-center justify-between gap-2 py-1.5 font-accent text-[11px] uppercase opacity-75">
        <span>{generateLoadingMessage(ctx)} · {page.routeState.site.siteDepth}/{page.routeState.site.siteBudget}</span>
        <span>{page.webMood}</span>
      </div>
    </div>
  );
}

function GrammarLocalNav({ page }: P) {
  const ctx = contextForBlock(page, "grammar-local-nav");
  return (
    <nav className="shell flex gap-2 overflow-x-auto border-b border-[var(--page-border)] py-2 font-accent text-[11px] uppercase">
      {makeLinks(ctx, page.layoutGrammar!.frame === "portal" ? 10 : 6, "local-nav").map((link, index) => (
        <DeepLink
          key={link.id}
          link={link}
          className={`shrink-0 border border-[var(--page-border)] px-2 py-1 ${index === 0 ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : "bg-[var(--page-bg)]"}`}
        />
      ))}
    </nav>
  );
}

function GrammarSidebar({ page }: P) {
  const ctx = contextForBlock(page, "grammar-sidebar");
  const realItems = page.realDataIntrusions.slice(0, 2);

  return (
    <div className="grid h-fit gap-3 p-3">
      <div className={page.styleRecipe.classes.intrusionPanel}>
        <p className="font-accent text-[11px] uppercase opacity-65">{page.genreFormula.content}</p>
        <ul className="mt-2 grid gap-1 text-sm">
          {makeLinks(ctx, 6, "grammar-side").map((link) => (
            <li key={link.id}><DeepLink link={link} className="hover:underline" /></li>
          ))}
        </ul>
      </div>
      {realItems.map((item) => (
        <RealDataPanel key={item.id} intrusion={item} compact className={page.styleRecipe.classes.panel} />
      ))}
    </div>
  );
}

function grammarMainClass(page: GeneratedPage) {
  const grammar = page.layoutGrammar!;
  if (grammar.frame === "portal") return `grid ${grammarGapClass(page)} ${grammarColumnClass(grammar.columns)} p-3 md:p-5`;
  if (grammar.frame === "masonry") return "columns-1 gap-[var(--gap-grid)] p-3 md:columns-2 md:p-5 xl:columns-3";
  return `grid ${grammarGapClass(page)} p-3 md:p-5`;
}

function grammarBlockClass(page: GeneratedPage, block: BlockPacket, index: number) {
  const grammar = page.layoutGrammar!;
  const base = `min-w-0 overflow-hidden ${grammar.frame === "masonry" ? "mb-[var(--gap-grid)] break-inside-avoid" : ""}`;
  if (grammar.frame === "magazine" && index === 0) return `${base} md:col-span-2`;
  if (grammar.frame === "portal" && block.type === "realData") return `${base} md:col-span-2`;
  if (grammar.rhythm === "wandering" && index % 3 === 1) return `${base} md:translate-x-[4%]`;
  if (grammar.rhythm === "quiet" && block.type === "ad") return `${base} opacity-80`;
  return base;
}

function grammarHeroClass(page: GeneratedPage) {
  const grammar = page.layoutGrammar!;
  if (grammar.heroPlacement === "aside") return "lg:row-span-2";
  if (grammar.frame === "portal") return "md:col-span-2";
  return "";
}

function grammarGapClass(page: GeneratedPage) {
  if (page.layoutGrammar!.rhythm === "dense") return "gap-2";
  if (page.layoutGrammar!.rhythm === "quiet") return "gap-8";
  return gapClass(page.layoutVariation.gapScale);
}

function grammarColumnClass(columns: NonNullable<GeneratedPage["layoutGrammar"]>["columns"]) {
  if (columns === 4) return "md:grid-cols-2 xl:grid-cols-4";
  if (columns === 3) return "md:grid-cols-2 xl:grid-cols-3";
  if (columns === 2) return "md:grid-cols-2";
  return "grid-cols-1";
}

function alignmentClass(alignment: NonNullable<GeneratedPage["layoutGrammar"]>["alignment"]) {
  if (alignment === "center") return "text-center";
  if (alignment === "right") return "text-right";
  if (alignment === "justified") return "[text-align:initial]";
  return "text-left";
}

/* ============================ mixed (default) ============================ */

function MixedLayout({ page }: P) {
  const skin = page.layoutSkin;
  const varn = v(page);
  const hero = page.blocks.find((b) => b.type === "hero");
  const middle = page.blocks.filter((b) => b.type !== "hero" && b.type !== "footer");
  const footer = page.blocks.find((b) => b.type === "footer");
  const orderedMiddle = reorderByVariation(`${page.routeState.seed}:mixed`, middle, varn.blockOrder);
  const heroSlice = varn.density > 1.1 ? 3 : varn.density < 0.85 ? 1 : 2;

  if (skin === "hero-heavy" && hero) {
    return (
      <>
        <VariedHeader page={page} />
        <GeneratedBlock page={page} block={hero} />
        {orderedMiddle.slice(0, heroSlice).map((block) => (
          <GeneratedBlock key={block.id} page={page} block={block} />
        ))}
        {footer ? <GeneratedBlock page={page} block={footer} /> : null}
        <LayoutFooter page={page} />
      </>
    );
  }

  if (skin === "sidebar-intrusion") {
    const ctx = contextForBlock(page, "mixed-sidebar");
    return (
      <>
        <VariedHeader page={page} />
        <LayoutPromo page={page} />
        <SidebarShell
          page={page}
          main={
            <>
              {reorderByVariation(`${page.routeState.seed}:mixed-main`, page.blocks.filter((b) => b.type !== "footer"), varn.blockOrder).map((block) => (
                <GeneratedBlock key={block.id} page={page} block={block} />
              ))}
            </>
          }
          aside={
            <>
              <div className={page.styleRecipe.classes.intrusionPanel}>
                <p className="font-accent text-[11px] uppercase">Elsewhere on {page.genreFormula.residue}</p>
                <ul className="mt-2 grid gap-2 text-sm">
                  {makeLinks(ctx, vCount(page, 5, 10), "intrusion").map((l) => (
                    <li key={l.id}>
                      <DeepLink link={l} className="hover:underline" />
                    </li>
                  ))}
                </ul>
              </div>
              <CleanMedia image={selectImage(ctx, "fake ad")} className={aspectClass(varn.mediaAspect)} />
            </>
          }
        />
        {footer ? <GeneratedBlock page={page} block={footer} /> : null}
        <LayoutFooter page={page} />
      </>
    );
  }

  if (skin === "stacked-zigzag") {
    const offset = varn.mirrorLayout ? "md:ml-[10%]" : "md:mr-[10%]";
    return (
      <>
        <VariedHeader page={page} />
        <div className={`shell grid ${gapClass(varn.gapScale)} py-[var(--pad-section)]`}>
          {orderedMiddle.map((block, i) => (
            <div key={block.id} className={i % 2 === 1 ? `${offset} md:max-w-[85%]` : "md:max-w-[92%]"}>
              <GeneratedBlock page={page} block={block} />
            </div>
          ))}
        </div>
        {footer ? <GeneratedBlock page={page} block={footer} /> : null}
        <LayoutFooter page={page} />
      </>
    );
  }

  if (skin === "footer-first") {
    const body = reorderByVariation(`${page.routeState.seed}:mixed-ff`, page.blocks.filter((b) => b.type !== "footer"), varn.blockOrder);
    return (
      <>
        <VariedHeader page={page} />
        {footer ? <GeneratedBlock page={page} block={footer} /> : null}
        {body.map((block) => (
          <GeneratedBlock key={block.id} page={page} block={block} />
        ))}
      </>
    );
  }

  if (varn.showSidebar && !hero) {
    const ctx = contextForBlock(page, "mixed-aside");
    return (
      <>
        <VariedHeader page={page} />
        <LayoutPromo page={page} />
        <SidebarShell
          page={page}
          main={
            <div className={`grid ${gapClass(varn.gapScale)}`}>
              {orderedMiddle.map((block) => (
                <GeneratedBlock key={block.id} page={page} block={block} />
              ))}
            </div>
          }
          aside={<IntrusionAside page={page} id="mixed-aside" links={vCount(page, 4, 9)} />}
        />
        {footer ? <GeneratedBlock page={page} block={footer} /> : null}
        <LayoutFooter page={page} />
      </>
    );
  }

  return (
    <>
      <VariedHeader page={page} />
      <LayoutPromo page={page} />
      {reorderByVariation(`${page.routeState.seed}:mixed-default`, page.blocks, varn.blockOrder).map((block) => (
        <GeneratedBlock key={block.id} page={page} block={block} />
      ))}
      <LayoutFooter page={page} />
    </>
  );
}

/* ============================ streaming ============================ */

function VideoTile({ page, id, role = "video thumbnail" }: P & { id: string; role?: string }) {
  const ctx = contextForBlock(page, id);
  const image = selectImage(ctx, role);
  const link = makeLink(ctx, id, generateProductName(ctx, 0));
  const dur = createRng(`${ctx.componentSeed}:dur`);
  return (
    <A link={link} className="group grid min-w-0 gap-2 no-underline">
      <div className="relative overflow-hidden rounded-[var(--radius-media)]">
        <GuaranteedVideoMedia image={image} className="aspect-video" rounded="" />
        <span className="absolute bottom-1.5 right-1.5 rounded-[4px] bg-black/80 px-1.5 py-[1px] font-accent text-[10px] text-white">
          {dur.int(0, 1)}:{dur.int(10, 59)}:{dur.int(10, 59)}
        </span>
      </div>
      <p className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-[var(--page-accent)]">{link.label}</p>
      <p className="font-accent text-[11px] opacity-70">{page.motifs[1] ?? "channel"} · {views(ctx.componentSeed)}</p>
    </A>
  );
}

function Shelf({ page, id, title }: P & { id: string; title: string }) {
  const ctx = contextForBlock(page, id);
  const count = vCount(page, 4, 9);
  return (
    <section className={`grid ${gapClass(v(page).gapScale)}`}>
      <div className="flex items-end justify-between">
        <h2 className={`headline ${titleClass(v(page).titleScale)}`}>{title}</h2>
        <DeepLink link={makeLink(ctx, `${id}-more`, "See all")} className="font-accent text-[11px] uppercase opacity-70 hover:underline" />
      </div>
      <div className={`grid grid-flow-col overflow-x-auto pb-2 [grid-auto-columns:minmax(190px,1fr)] ${gapClass(v(page).gapScale)}`}>
        {Array.from({ length: count }).map((_, i) => (
          <VideoTile key={i} page={page} id={`${id}-tile-${i}`} role={i % 4 === 0 ? "product image" : "video thumbnail"} />
        ))}
      </div>
    </section>
  );
}

function StreamingLayout({ page }: P) {
  const ctx = contextForBlock(page, "streaming");
  const skin = page.layoutSkin;
  const chips = makeLinks(ctx, 9, "chip");
  const shelfTitles = [
    `Continue Watching: ${page.motifs[0] ?? "Deluxe Twin Room"}`,
    "Trending Suites Near You",
    `Because you booked ${page.motifs[1] ?? "checkout"}`,
    "Recently Viewed Rooms",
    "Available in HD until checkout"
  ];
  const featured = selectImage(ctx, "featured video");
  const fLink = makeLink(ctx, "featured", generateHeading(ctx));
  const featuredLoader = inlineLoaderForBlock(page, "streaming-featured");
  const tileCount = createRng(ctx.componentSeed).int(8, 14);

  if (skin === "theater-grid") {
    return (
      <div data-scheme={page.theme.scheme}>
        <header className="site-header border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
          <div className="shell flex items-center justify-between py-3">
            <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} ▶</a>
            <DeepLink link={makeLink(ctx, "upload", "Upload")} className={page.styleRecipe.classes.button} />
          </div>
        </header>
        <main className="shell py-6">
          <h1 className="headline mb-4 text-2xl">{generateHeading(ctx)}</h1>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: tileCount }).map((_, i) => (
              <VideoTile key={i} page={page} id={`theater-${i}`} />
            ))}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (skin === "channel-list") {
    const channels = makeLinks(ctx, 12, "channel");
    return (
      <div data-scheme={page.theme.scheme} className="grid min-h-screen md:grid-cols-[220px_1fr]">
        <aside className="border-r-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]/40 p-3">
          <a href={siteHomeHref(page)} className="site-brand headline text-sm lowercase no-underline">channels</a>
          <nav className="mt-4 grid gap-1">
            {channels.map((c, i) => (
              <DeepLink key={c.id} link={c} className={`truncate rounded-[var(--radius-input)] px-2 py-1.5 text-sm ${i === 0 ? "bg-[var(--page-accent)] text-white" : "opacity-75 hover:bg-[var(--page-muted)]"}`} />
            ))}
          </nav>
        </aside>
        <div>
          <A link={fLink} className="relative block no-underline">
            <GuaranteedVideoMedia image={featured} className="aspect-video max-h-[50vh]" rounded="" />
            <div className="absolute bottom-0 left-0 p-4 text-white [text-shadow:0_1px_8px_rgba(0,0,0,.8)]">
              <h1 className="headline text-2xl">{fLink.label}</h1>
              <p className="mt-1 text-sm opacity-90">{page.subtitle}</p>
            </div>
          </A>
          <div className="shell grid gap-3 py-4">
            {shelfTitles.slice(0, 2).map((t, i) => (
              <Shelf key={i} page={page} id={`ch-shelf-${i}`} title={t} />
            ))}
          </div>
          <ColumnsFooter page={page} />
        </div>
      </div>
    );
  }

  if (skin === "broadcast-ticker") {
    return (
      <div data-scheme={page.theme.scheme}>
        <div className="overflow-hidden border-b border-[var(--page-border)] bg-[var(--page-fg)] text-[var(--page-bg)]">
          <div className="animate-pulse whitespace-nowrap py-1 font-accent text-[11px] uppercase">
            {makeLinks(ctx, vCount(page, 6, 12), "ticker").map((l) => l.label).join(" · ")} · {page.motifs[0]}
          </div>
        </div>
        <VariedHeader page={page} />
        <main className="shell py-6">
          <div className={`grid ${gapClass(v(page).gapScale)} ${gridColsClass(v(page).gridCols)}`}>
            {Array.from({ length: vCount(page, 6, 12) }).map((_, i) => (
              <VideoTile key={i} page={page} id={`ticker-${i}`} />
            ))}
          </div>
        </main>
        <LayoutFooter page={page} />
      </div>
    );
  }

  if (skin === "playlist-rows") {
    const rows = createRng(ctx.componentSeed).int(6, 10);
    return (
      <div data-scheme={page.theme.scheme}>
        <MiniHeader page={page} links={4} />
        <main className="shell max-w-3xl py-6">
          <h1 className="headline text-2xl">{page.title}</h1>
          <p className="mt-1 text-sm opacity-70">{page.subtitle}</p>
          <ul className="mt-4 grid gap-2">
            {Array.from({ length: rows }).map((_, i) => {
              const c = contextForBlock(page, `playlist-${i}`);
              const l = makeLink(c, `playlist-${i}`, generateProductName(c, i));
              const pr = createRng(c.componentSeed);
              return (
                <li key={i}>
                  <A link={l} className={`${page.styleRecipe.classes.panel} flex items-center gap-4 no-underline hover:bg-[var(--page-muted)]/30`}>
                    <span className="w-6 shrink-0 text-center font-accent text-xs opacity-50">{i + 1}</span>
                    <CleanMedia image={selectImage(c, "video thumbnail")} className="h-14 w-24 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{l.label}</p>
                      <p className="font-accent text-[11px] opacity-60">{page.motifs[i % page.motifs.length]} · {views(c.componentSeed)}</p>
                    </div>
                    <span className="shrink-0 font-accent text-[11px] opacity-50">{pr.int(0, 1)}:{pr.int(10, 59)}</span>
                  </A>
                </li>
              );
            })}
          </ul>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div data-scheme={page.theme.scheme}>
      <header className="site-header sticky top-0 z-20 border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-4 py-2">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} ▶</a>
          <form action={makeLink(ctx, "search").href} className="mx-auto flex w-full max-w-xl">
            <input className="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[color-mix(in_srgb,var(--page-bg)_70%,white)] px-3 py-1.5 text-sm" placeholder={`Search ${page.motifs[0] ?? "rooms"}`} />
            <button className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-l-0 border-[var(--page-border)] bg-[var(--page-accent)] px-4 text-sm text-white">⌕</button>
          </form>
          <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-pill)] bg-[var(--page-accent)] text-sm font-bold text-white">{(page.languageBlend.primary[0] ?? "G").toUpperCase()}</span>
        </div>
        <div className="mx-auto flex w-full max-w-[1600px] gap-2 overflow-x-auto px-4 pb-2">
          {chips.map((c, i) => (
            <DeepLink key={c.id} link={c} className={`whitespace-nowrap rounded-[var(--radius-pill)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-3 py-1 text-xs ${i === 0 ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : "bg-[var(--page-muted)]/50"}`} />
          ))}
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-6">
        <A link={fLink} className="group relative grid overflow-hidden rounded-[var(--radius-card)] no-underline">
          <GuaranteedVideoMedia image={featured} className="aspect-[21/9] max-h-[60vh]" rounded="" />
          {featuredLoader ? (
            <FloatingBriefLoader
              variant={featuredLoader.variant}
              message={featuredLoader.message}
              durationMs={featuredLoader.durationMs}
              className="absolute right-4 top-4 rounded-[var(--radius-tag)] bg-black/70 px-3 py-2"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 max-w-2xl p-6 text-white">
            <p className="font-accent text-[11px] uppercase tracking-wide opacity-80">Featured · {page.genreFormula.content}</p>
            <h1 className="headline mt-1 text-3xl leading-tight md:text-5xl [text-shadow:0_2px_18px_rgba(0,0,0,.6)]">{fLink.label}</h1>
            <p className="mt-2 line-clamp-2 max-w-xl text-sm text-white/85">{page.subtitle}</p>
            <span className="mt-3 inline-block rounded-[var(--radius-button)] bg-white px-5 py-2 text-sm font-bold text-black">▶ Watch / Reserve</span>
          </div>
        </A>
        {reorderByVariation(`${page.routeState.seed}:shelves`, shelfTitles, v(page).blockOrder)
          .slice(0, v(page).shelfCount)
          .map((t, i) => (
          <Shelf key={i} page={page} id={`shelf-${i}`} title={t} />
        ))}
        <RealDataSeam page={page} id="streaming-seam" />
      </main>
      <LayoutFooter page={page} />
    </div>
  );
}

/* ============================ minimal blog ============================ */

function MinimalBlogLayout({ page }: P) {
  const ctx = contextForBlock(page, "blog");
  const skin = page.layoutSkin;
  const date = createRng(ctx.componentSeed);
  const months = ["January", "March", "April", "June", "September", "November"];
  const showImage = date.bool(0.45);
  const image = selectImage(ctx, "blog image");
  const further = makeLinks(ctx, 5, "further");
  const style = {
    fontFamily: "var(--font-lora), Georgia, serif",
    "--page-font-headline": "var(--font-lora), Georgia, serif"
  } as CSSProperties;

  if (skin === "magazine") {
    const cols = createRng(ctx.componentSeed).int(4, 6);
    return (
      <div style={style}>
        <header className="border-b-4 border-[var(--page-fg)] py-6 text-center">
          <a href={siteHomeHref(page)} className="site-brand headline text-4xl no-underline">{displayBrand(page)}</a>
          <p className="mt-1 font-accent text-[11px] uppercase tracking-[0.3em] opacity-60">{page.genreFormula.content} · {months[date.int(0, months.length - 1)]} {date.int(2003, 2024)}</p>
        </header>
        <main className="shell py-8">
          <h1 className="headline mb-6 text-4xl leading-tight">{page.title}</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: cols }).map((_, i) => {
              const c = contextForBlock(page, `mag-${i}`);
              const l = makeLink(c, `mag-${i}`, generateHeadline(c, i));
              return (
                <article key={i} className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
                  <CleanMedia image={selectImage(c, "blog image")} className={`mb-3 ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`} />
                  <h2 className={`headline leading-tight ${i === 0 ? "text-2xl" : "text-lg"}`}>
                    <DeepLink link={l} className="hover:underline" />
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm opacity-80">{generateProductDescription(c, i)}</p>
                </article>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "index") {
    const posts = createRng(ctx.componentSeed).int(8, 14);
    return (
      <div style={style}>
        <header className="shell border-b border-[var(--page-border)] py-6">
          <a href={siteHomeHref(page)} className="site-brand font-accent text-xs uppercase tracking-[0.3em] no-underline opacity-70">{displayBrand(page)}</a>
          <h1 className="headline mt-2 text-3xl">{generateHeading(ctx)}</h1>
        </header>
        <main className="shell max-w-2xl py-6">
          <ul className="grid gap-0 divide-y divide-[var(--page-border)]">
            {Array.from({ length: posts }).map((_, i) => {
              const c = contextForBlock(page, `idx-${i}`);
              const l = makeLink(c, `idx-${i}`, generateHeadline(c, i));
              return (
                <li key={i} className="flex items-baseline justify-between gap-4 py-3">
                  <DeepLink link={l} className="font-semibold hover:underline" />
                  <span className="shrink-0 font-accent text-[11px] opacity-50">{months[date.int(0, months.length - 1)].slice(0, 3)} {date.int(1, 28)}</span>
                </li>
              );
            })}
          </ul>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "newsletter") {
    return (
      <div style={style}>
        <main className="mx-auto max-w-lg px-5 py-16 text-center">
          <a href={siteHomeHref(page)} className="site-brand font-accent text-xs uppercase tracking-[0.3em] no-underline opacity-70">{displayBrand(page)}</a>
          <h1 className="headline mt-6 text-3xl leading-tight">{page.title}</h1>
          <p className="mt-4 text-lg leading-8 opacity-90">{page.subtitle}</p>
          {showImage && <CleanMedia image={image} className="mx-auto mt-8 aspect-[16/9] max-w-md" />}
          <form action={makeLink(ctx, "subscribe").href} className="mt-8 grid gap-2 text-left">
            <input className="border border-[var(--page-border)] bg-transparent px-3 py-2 text-sm" placeholder="Your email for the next issue" />
            <button className={page.styleRecipe.classes.button}>Subscribe to {page.motifs[0] ?? "updates"}</button>
          </form>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "timeline") {
    const entries = createRng(ctx.componentSeed).int(5, 8);
    return (
      <div style={style}>
        <header className="shell py-8 text-center">
          <a href={siteHomeHref(page)} className="site-brand font-accent text-xs uppercase tracking-[0.3em] no-underline opacity-70">{displayBrand(page)}</a>
          <h1 className="headline mt-3 text-3xl">{page.title}</h1>
        </header>
        <main className="shell max-w-xl py-4">
          <div className="relative border-l-2 border-[var(--page-border)] pl-6">
            {Array.from({ length: entries }).map((_, i) => {
              const c = contextForBlock(page, `tl-${i}`);
              const l = makeLink(c, `tl-${i}`, generateHeadline(c, i));
              return (
                <article key={i} className="relative mb-8">
                  <span className="absolute -left-[31px] grid h-4 w-4 place-items-center rounded-[var(--radius-pill)] bg-[var(--page-accent)]" />
                  <p className="font-accent text-[11px] uppercase opacity-60">{date.int(2003, 2024)} · entry {i + 1}</p>
                  <h2 className="headline mt-1 text-xl"><DeepLink link={l} className="hover:underline" /></h2>
                  <p className="mt-2 text-sm leading-7 opacity-85">{generateParagraph(c, 0)}</p>
                </article>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <header className="mx-auto w-full max-w-[680px] px-5 pt-10 text-center">
        <a href={siteHomeHref(page)} className="site-brand font-accent text-xs uppercase tracking-[0.3em] no-underline opacity-70">
          {displayBrand(page)}
        </a>
      </header>
      <article className="mx-auto w-full max-w-[680px] px-5 py-10">
        <p className="font-accent text-[11px] uppercase tracking-wide opacity-60">
          {months[date.int(0, months.length - 1)]} {date.int(1, 28)}, {date.int(2003, 2024)} · {page.genreFormula.content}
        </p>
        <h1 className="headline mt-3 text-[clamp(1.9rem,5vw,3rem)] leading-[1.08]">{page.title}</h1>
        <p className="mt-4 text-[1.2rem] leading-8 opacity-90">{page.subtitle}</p>
        <p className="mt-4 flex items-center gap-2 font-accent text-xs opacity-60">
          <span className="inline-block h-6 w-6 rounded-[var(--radius-pill)] bg-[var(--page-accent)]" /> by a quiet guest · {date.int(3, 14)} min read
        </p>
        {showImage && <CleanMedia image={image} className="mt-8 aspect-[16/9]" loader={mediaLoaderConfig(ctx)} />}
        <div className="mt-8 grid gap-5 text-[1.06rem] leading-8">
          {[0, 1, 2, 3, 4].map((i) =>
            i === 2 ? (
              <blockquote key={i} className="border-l-2 border-[var(--page-accent)] pl-4 italic opacity-90">
                {generateHeadline(ctx, i)}.
              </blockquote>
            ) : (
              <MutableText
                key={i}
                as="p"
                initial={generateParagraph(ctx, i)}
                variants={[generateParagraph({ ...ctx, componentSeed: `${ctx.componentSeed}:m:${i}` }, i)]}
              />
            )
          )}
        </div>
        <hr className="my-10 border-[var(--page-border)]" />
        <p className="font-accent text-[11px] uppercase tracking-wide opacity-60">Further reading</p>
        <ul className="mt-3 grid gap-2">
          {further.map((l) => (
            <li key={l.id} className="text-[1.02rem]">
              <span className="opacity-40">→ </span>
              <DeepLink link={l} className="underline decoration-[var(--page-accent)] underline-offset-4 hover:opacity-70" />
            </li>
          ))}
        </ul>
      </article>
      <RealDataSeam page={page} id="blog-seam" />
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ store ============================ */

function StoreLayout({ page }: P) {
  const ctx = contextForBlock(page, "store");
  const varn = v(page);
  const cols = vCount(page, 6, 14);
  const storeItems: InteractionItem[] = Array.from({ length: cols }).map((_, i) => {
    const c = contextForBlock(page, `store-item-${i}`);
    const link = makeLink(c, `store-${i}`, "Add to cart");
    const imageRoles = ["product image", "catalog detail", "video thumbnail"];
    return {
      id: c.componentId,
      title: generateProductName(c, i),
      description: generateProductDescription(c, i),
      href: link.href,
      price: price(c.componentSeed),
      meta: `${createRng(c.componentSeed).int(1, 400)} reviews`,
      tags: [page.motifs[i % page.motifs.length] ?? "store", page.genreFormula.content, i % 3 === 0 ? "video" : "image", createRng(`${c.componentSeed}:sale`).bool(0.4) ? "sale" : "regular"].filter(Boolean),
      images: imageRoles.map((role, imageIndex) => {
        const image = selectImage({ ...c, componentSeed: `${c.componentSeed}:carousel:${imageIndex}` }, role);
        return { src: image.src, alt: image.alt, label: role, cssFilter: image.cssFilter, pixelated: image.pixelated, aging: image.aging };
      })
    };
  });
  const promoBar = varn.showPromo ? <LayoutPromo page={page} /> : null;

  if (page.layoutSkin === "wide-grid") {
    return (
      <div>
        {promoBar}
        <VariedHeader page={page} />
        <LayoutBreadcrumb page={page} ctx={ctx} />
        <main className="shell py-8">
          <h1 className={`headline ${titleClass(varn.titleScale)}`}>{generateHeading(ctx)}</h1>
          <p className="mt-1 opacity-70">{page.subtitle}</p>
          <div className={`mt-6 grid ${gapClass(varn.gapScale)} ${gridColsClass(varn.gridCols)}`}>
            {storeItems.map((item, i) => {
              const c = contextForBlock(page, item.id);
              const link = makeLink(c, item.id, item.title);
              return (
                <A key={item.id} link={link} className={`${cardSurface(page, "grid gap-2 no-underline")}`}>
                  <CleanMedia image={selectImage(c, "product image")} className={aspectClass(varn.mediaAspect)} />
                  <h3 className="line-clamp-2 text-sm font-semibold">{item.title}</h3>
                  <p className="font-semibold">{item.price}</p>
                </A>
              );
            })}
          </div>
        </main>
        <LayoutFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "compact-list") {
    return (
      <div>
        {promoBar}
        <MiniHeader page={page} links={5} />
        <main className="shell py-6">
          <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
          <div className="mt-4 grid gap-2">
            {storeItems.map((item, i) => {
              const c = contextForBlock(page, item.id);
              const link = makeLink(c, item.id, item.title);
              return (
                <A key={item.id} link={link} className={`${page.styleRecipe.classes.panel} flex gap-4 no-underline hover:bg-[var(--page-muted)]/30`}>
                  <CleanMedia image={selectImage(c, "product image")} className="h-20 w-20 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="line-clamp-1 text-sm opacity-75">{item.description}</p>
                    <p className="mt-1 font-accent text-[11px] opacity-60">{item.meta}</p>
                  </div>
                  <span className="shrink-0 font-semibold">{item.price}</span>
                </A>
              );
            })}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "mosaic") {
    return (
      <div>
        {promoBar}
        <PageChrome page={page} />
        <main className="shell py-8">
          <h1 className="headline text-3xl">{generateHeading(ctx)}</h1>
          <div className="mt-6 grid auto-rows-[140px] grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {storeItems.map((item, i) => {
              const c = contextForBlock(page, item.id);
              const link = makeLink(c, item.id, item.title);
              const span = i % 5 === 0 ? "col-span-2 row-span-2" : "";
              return (
                <A key={item.id} link={link} className={`${page.styleRecipe.classes.panel} relative overflow-hidden p-0 no-underline ${span}`}>
                  <CleanMedia image={selectImage(c, "product image")} className="absolute inset-0 h-full" rounded="" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                    <p className="line-clamp-1 text-xs font-semibold">{item.title}</p>
                    <p className="text-[11px]">{item.price}</p>
                  </div>
                </A>
              );
            })}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "carousel-hero") {
    const heroItem = storeItems[0];
    const heroCtx = contextForBlock(page, heroItem?.id ?? "store-hero");
    return (
      <div>
        {promoBar}
        <MiniHeader page={page} links={4} />
        <section className="shell py-6">
          <div className={`${page.styleRecipe.classes.panel} grid gap-4 overflow-hidden p-0 lg:grid-cols-2`}>
            <CleanMedia image={selectImage(heroCtx, "product image")} className="aspect-square lg:aspect-auto" rounded="" motion />
            <div className="grid content-center gap-3 p-6">
              <p className="font-accent text-[11px] uppercase opacity-60">Featured · {page.motifs[0]}</p>
              <h1 className="headline text-3xl">{heroItem?.title ?? generateHeading(ctx)}</h1>
              <p className="opacity-80">{heroItem?.description ?? page.subtitle}</p>
              <p className="text-2xl font-bold">{heroItem?.price}</p>
              <DeepLink link={makeLink(heroCtx, "hero-cta", "Shop now")} className={`${page.styleRecipe.classes.button} w-fit`} />
            </div>
          </div>
          <div className="mt-6 grid grid-flow-col gap-3 overflow-x-auto pb-2 [grid-auto-columns:minmax(160px,1fr)]">
            {storeItems.slice(1, 8).map((item) => {
              const c = contextForBlock(page, item.id);
              const link = makeLink(c, item.id, item.title);
              return (
                <A key={item.id} link={link} className="grid gap-1 no-underline">
                  <CleanMedia image={selectImage(c, "product image")} className="aspect-square" />
                  <p className="line-clamp-1 text-xs font-semibold">{item.title}</p>
                </A>
              );
            })}
          </div>
        </section>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      {promoBar}
      <VariedHeader page={page} />
      <LayoutBreadcrumb page={page} ctx={ctx} />
      {varn.showSidebar ? (
        <SidebarShell
          page={page}
          aside={
            <>
              <div className={cardSurface(page)}>
                <h2 className="mb-2 font-bold">{languageLabel(page.languageBlend.primary, "featuredDepartments")}</h2>
                <ul className="grid gap-1 text-sm">
                  {makeLinks(ctx, vCount(page, 5, 10), "dept").map((l) => (
                    <li key={l.id}>
                      <DeepLink link={l} className="hover:underline" />
                    </li>
                  ))}
                </ul>
              </div>
              {varn.showIntrusion ? <IntrusionAside page={page} id="store-side" links={vCount(page, 4, 8)} /> : null}
            </>
          }
          main={
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h1 className={`headline ${titleClass(varn.titleScale)}`}>{generateHeading(ctx)}</h1>
                <span className="font-accent text-xs opacity-60">{createRng(ctx.componentSeed).int(12, 980)} · {languageLabel(page.languageBlend.primary, "sort")}</span>
              </div>
              {varn.listStyle === "cards" ? (
                <div className={`grid ${gapClass(varn.gapScale)} ${gridColsClass(varn.gridCols)}`}>
                  {storeItems.map((item) => {
                    const c = contextForBlock(page, item.id);
                    const link = makeLink(c, item.id, item.title);
                    return (
                      <A key={item.id} link={link} className={cardSurface(page, "grid gap-2 no-underline")}>
                        <CleanMedia image={selectImage(c, "product image")} className={aspectClass(varn.mediaAspect)} />
                        <h3 className="line-clamp-2 text-sm font-semibold">{item.title}</h3>
                        <p className="font-semibold">{item.price}</p>
                      </A>
                    );
                  })}
                </div>
              ) : (
                <ProductExperience
                  items={storeItems}
                  links={makeLinks(ctx, vCount(page, 5, 10), "dept")}
                  classes={page.styleRecipe.classes}
                  title={generateHeading({ ...ctx, componentSeed: `${ctx.componentSeed}:store-controls` })}
                  placeholder={`${languageLabel(page.languageBlend.primary, "search")} ${page.motifs[0] ?? "store"}`}
                  labels={page.languageBlend.primary}
                />
              )}
            </div>
          }
        />
      ) : (
        <main className="shell pb-10">
          <h1 className={`headline mb-4 ${titleClass(varn.titleScale)}`}>{generateHeading(ctx)}</h1>
          <div className={`grid ${gapClass(varn.gapScale)} ${gridColsClass(varn.gridCols)}`}>
            {storeItems.map((item) => {
              const c = contextForBlock(page, item.id);
              const link = makeLink(c, item.id, item.title);
              return (
                <A key={item.id} link={link} className={cardSurface(page, "grid gap-2 no-underline")}>
                  <CleanMedia image={selectImage(c, "product image")} className={aspectClass(varn.mediaAspect)} />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="font-semibold">{item.price}</p>
                </A>
              );
            })}
          </div>
        </main>
      )}
      <RealDataSeam page={page} id="store-seam" />
      <LayoutFooter page={page} />
    </div>
  );
}

/* ============================ 2000s portal ============================ */

function Portal2000Layout({ page }: P) {
  const ctx = contextForBlock(page, "portal");
  const skin = page.layoutSkin;
  const style = {
    fontFamily: "'Times New Roman', Times, serif",
    "--page-font-headline": "'Times New Roman', Times, serif",
    "--page-font-accent": "var(--font-vt323), monospace"
  } as CSSProperties;
  const r = createRng(ctx.componentSeed);
  const sections = ["News", "Shopping", "Travel", "Games", "Local", "Webmail", "Directory", "Chat"];

  if (skin === "link-farm") {
    const links = makeLinks(ctx, 40, "farm");
    return (
      <div style={style} className="text-[14px]">
        <div className="bg-[var(--page-accent)] py-1 text-center font-accent text-sm text-white">★ {page.title} — link directory ★</div>
        <header className="border-b-2 border-[var(--page-border)] py-3 text-center">
          <a href={siteHomeHref(page)} className="site-brand text-3xl font-bold italic no-underline">{displayBrand(page)}</a>
        </header>
        <main className="mx-auto max-w-[980px] px-3 py-4">
          <div className="columns-2 gap-6 sm:columns-3 md:columns-4">
            {links.map((l, i) => (
              <p key={l.id} className="mb-1 break-inside-avoid">
                <DeepLink link={{ ...l, label: generateHeadline(ctx, i) }} className="old-link text-[13px]" />
              </p>
            ))}
          </div>
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (skin === "frameset") {
    return (
      <div style={style} className="grid min-h-screen grid-rows-[auto_1fr_auto] text-[14px]">
        <div className="border-b-2 border-[var(--page-border)] bg-[var(--page-accent)] px-3 py-1 text-center text-sm text-white">
          <a href={siteHomeHref(page)} className="font-bold text-white no-underline">{displayBrand(page)}</a> — {page.motifs[0]}
        </div>
        <div className="grid md:grid-cols-[160px_1fr]">
          <nav className="border-r-2 border-[var(--page-border)] bg-[var(--page-muted)] p-2">
            {sections.map((s, i) => (
              <DeepLink key={s} link={makeLink(ctx, `frame-${i}`, s)} className="block py-0.5 text-[13px] old-link" />
            ))}
          </nav>
          <main className="overflow-auto p-4">
            <h1 className="text-xl font-bold underline">{page.title}</h1>
            <p className="mt-2 text-sm">{page.subtitle}</p>
            <ul className="mt-4 grid gap-1">
              {makeLinks(ctx, 10, "frame-link").map((l, i) => (
                <li key={l.id}><DeepLink link={{ ...l, label: generateHeadline(ctx, i) }} className="old-link" /></li>
              ))}
            </ul>
          </main>
        </div>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (skin === "webring") {
    const ring = makeLinks(ctx, 16, "ring");
    return (
      <div style={style} className="text-center text-[14px]">
        <div className="bg-[#ffffcc] py-2 text-black">
          <p className="font-accent text-xs">YOU ARE IN THE WEBRING</p>
          <p className="font-bold">{page.genreFormula.residue} · {page.genreFormula.content}</p>
        </div>
        <header className="py-6">
          <a href={siteHomeHref(page)} className="site-brand text-3xl font-bold no-underline">◄ {displayBrand(page)} ►</a>
          <p className="mt-2 text-sm">{page.title}</p>
        </header>
        <main className="mx-auto max-w-lg px-4">
          <div className="flex items-center justify-center gap-4 border-2 border-[var(--page-border)] bg-white py-4">
            <DeepLink link={ring[0]} className="old-link font-bold" />
            <span className="font-accent">|</span>
            <span className="font-bold underline">{page.motifs[0] ?? "this site"}</span>
            <span className="font-accent">|</span>
            <DeepLink link={ring[1] ?? ring[0]} className="old-link font-bold" />
          </div>
          <ul className="mt-6 grid gap-2 text-left">
            {ring.slice(2).map((l, i) => (
              <li key={l.id}>» <DeepLink link={{ ...l, label: generateHeadline(ctx, i) }} className="old-link" /></li>
            ))}
          </ul>
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style} className="text-[15px]">
      <div className="bg-[var(--page-accent)] py-1 text-center font-accent text-sm text-white">
        ★ Welcome to the {displayBrand(page)} portal — {r.int(1998, 2004)} edition — please sign the guestbook ★
      </div>
      <header className="border-y-2 border-[var(--page-border)] bg-[var(--page-muted)]">
        <div className="mx-auto flex w-full max-w-[980px] items-center justify-between px-3 py-2">
          <a href={siteHomeHref(page)} className="site-brand text-2xl font-bold italic no-underline">{displayBrand(page)}<sup className="text-xs">™</sup></a>
          <form action={makeLink(ctx, "search").href} className="flex">
            <input className="border border-[var(--page-border)] bg-white px-2 py-1 text-sm" placeholder="search the web ring" />
            <button className="border border-l-0 border-[var(--page-border)] bg-[var(--page-accent)] px-2 text-sm text-white">Go!</button>
          </form>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1 border-t border-[var(--page-border)] bg-white px-3 py-1 text-[13px]">
          {sections.map((s, i) => (
            <span key={s} className="flex gap-3">
              {i > 0 && <span className="opacity-40">|</span>}
              <DeepLink link={makeLink(ctx, `nav-${i}`, s)} className="old-link font-bold" />
            </span>
          ))}
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-[980px] gap-3 px-3 py-3 md:grid-cols-[180px_1fr_180px]">
        <aside className="grid h-fit gap-3">
          <div className="border-2 border-[var(--page-border)] bg-white p-2">
            <p className="bg-[var(--page-accent)] px-1 font-accent text-sm text-white">CATEGORIES</p>
            <ul className="mt-1 grid gap-[2px] text-[13px]">
              {makeLinks(ctx, 10, "cat").map((l) => (
                <li key={l.id}>» <DeepLink link={l} className="old-link" /></li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-[var(--page-border)] bg-[#000] p-2 text-center text-white">
            <p className="font-accent text-sm">VISITORS</p>
            <VisitorCounter seed={ctx.componentSeed} />
          </div>
        </aside>

        <div className="grid gap-3">
          <div className="border-2 border-[var(--page-border)] bg-white p-3">
            <h1 className="text-2xl font-bold underline">{page.title}</h1>
            <p className="mt-1 text-sm">{page.subtitle}</p>
          </div>
          <div className="border-2 border-[var(--page-border)] bg-white p-3">
            <p className="mb-1 bg-[var(--page-muted)] px-1 font-bold">Today's Headlines</p>
            <ul className="grid gap-1 text-[14px]">
              {makeLinks(ctx, 8, "head").map((l, i) => (
                <li key={l.id} className="border-b border-dotted border-[var(--page-border)] pb-1">
                  <span className="font-accent text-xs opacity-60">{r.int(1, 12)}:{r.int(10, 59)} — </span>
                  <DeepLink link={{ ...l, label: generateHeadline(ctx, i) }} className="old-link" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="grid h-fit gap-3">
          <div className="border-2 border-[var(--page-border)] bg-[#ffffcc] p-2 text-center text-black">
            <p className="font-accent text-xs">SPONSORED</p>
            <CleanMedia image={selectImage(ctx, "fake ad")} className="my-1 aspect-square" rounded="" />
            <p className="text-[12px] font-bold">{localizedPhrase(ctx, ctx.componentSeed)}</p>
          </div>
          <div className="border-2 border-[var(--page-border)] bg-white p-2">
            <p className="font-accent text-xs">POLL</p>
            <p className="text-[13px]">Is the {page.motifs[0]} still available?</p>
            {["Yes", "No", "Already left"].map((o) => (
              <label key={o} className="flex items-center gap-1 text-[13px]"><input type="radio" name="poll" /> {o}</label>
            ))}
          </div>
        </aside>
      </main>
      <OldWebFooter page={page} />
    </div>
  );
}

/* ============================ search results ============================ */

function SearchLayout({ page }: P) {
  const ctx = contextForBlock(page, "search");
  const skin = page.layoutSkin;
  const searched = page.routeState.searchQuery;
  const q = searched ?? `${page.motifs[0] ?? "quiet"} ${page.genreFormula.content}`;
  const searchFallback = makeLink(ctx, "search").href;
  const results = createRng(ctx.componentSeed).int(7, 10);
  const searchLoader = inlineLoaderForBlock(page, "search");
  const resultItems: InteractionItem[] = Array.from({ length: results }).map((_, i) => {
    const c = contextForBlock(page, `result-${i}`);
    const link = makeLink(c, `result-${i}`, generateHeading(c));
    return {
      id: c.componentId,
      title: link.label,
      description: generateProductDescription(c, i),
      href: link.href,
      meta: displayBrand(page),
      tags: [page.motifs[i % page.motifs.length] ?? "result", page.genreFormula.content, page.genreFormula.action, i % 2 ? "image" : "directory"].filter(Boolean),
      images: []
    };
  });
  const palette = ["#4285F4", "#DB4437", "#F4B400", "#4285F4", "#0F9D58", "#DB4437"];
  const brand = "inbetween".split("");
  const style = { fontFamily: "var(--font-archivo), Arial, sans-serif" } as CSSProperties;

  if (skin === "results-cards") {
    return (
      <div style={style} className="min-h-screen">
        <MiniHeader page={page} links={3} center />
        <main className="shell py-8">
          <SearchForm
            fallbackHref={searchFallback}
            defaultValue={q}
            ariaLabel="Search"
            formClassName="mx-auto flex max-w-2xl"
            inputClassName="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-4 py-2.5 text-sm"
            buttonClassName={page.styleRecipe.classes.button}
            buttonLabel="Search"
          />
          <p className="mt-4 text-center text-xs opacity-60">
            {createRng(ctx.componentSeed).int(1100, 99000).toLocaleString()} results for <span className="opacity-100">{q}</span>
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resultItems.map((item, i) => {
              const c = contextForBlock(page, item.id);
              const link = makeLink(c, item.id, item.title);
              return (
                <A key={item.id} link={link} className={`${page.styleRecipe.classes.panel} grid gap-2 no-underline`}>
                  <CleanMedia image={selectImage(c, i % 2 ? "news thumbnail" : "product image")} className="aspect-video" />
                  <h3 className="font-semibold leading-tight">{item.title}</h3>
                  <p className="line-clamp-2 text-xs opacity-75">{item.description}</p>
                </A>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "image-grid") {
    const imgs = createRng(ctx.componentSeed).int(12, 20);
    return (
      <div style={style} className="min-h-screen">
        <header className="shell flex items-center gap-4 py-4">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} images</a>
          <SearchForm
            fallbackHref={searchFallback}
            defaultValue={q}
            ariaLabel="Search images"
            formClassName="flex min-w-0 flex-1"
            inputClassName="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-3 py-1.5 text-sm"
          />
        </header>
        <main className="shell py-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: imgs }).map((_, i) => {
              const c = contextForBlock(page, `img-${i}`);
              const l = makeLink(c, `img-${i}`, generateProductName(c, i));
              return (
                <A key={i} link={l} className="group relative aspect-square overflow-hidden no-underline">
                  <CleanMedia image={selectImage(c, "product image")} className="h-full" rounded="" />
                  <p className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">{l.label}</p>
                </A>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  if (skin === "minimal-query") {
    return (
      <div style={style} className="flex min-h-screen flex-col items-center justify-center px-5">
        <p className="text-center text-5xl font-bold tracking-tight">
          {brand.map((c, i) => (
            <span key={i} style={{ color: palette[i % palette.length] }}>{c}</span>
          ))}
        </p>
        <SearchForm
          fallbackHref={searchFallback}
          defaultValue={q}
          ariaLabel="Search"
          formClassName="mt-8 flex w-full max-w-xl"
          inputClassName="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-4 py-3 text-lg"
          buttonClassName="border-[length:var(--border-w)] [border-style:var(--border-style)] border-l-0 border-[var(--page-border)] bg-[var(--page-muted)] px-6"
          buttonLabel="⌕"
        />
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {makeLinks(ctx, 4, "lucky").map((l) => (
            <DeepLink key={l.id} link={l} className="text-sm underline underline-offset-4" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={style} className="min-h-screen bg-[color-mix(in_srgb,var(--page-bg)_60%,white)]">
      <div className="flex justify-end gap-4 px-5 py-3 text-sm">
        <a href="/account" className="hover:underline">Account</a>
        <DeepLink link={makeLink(ctx, "images", "Images")} className="hover:underline" />
        <span className="grid h-7 w-7 place-items-center rounded-[var(--radius-pill)] bg-[var(--page-accent)] text-xs text-white">G</span>
      </div>
      <div className="mx-auto w-full max-w-[680px] px-5 pt-6">
        <p className="text-center text-5xl font-bold tracking-tight">
          {brand.map((c, i) => (
            <span key={i} style={{ color: palette[i % palette.length] }}>{c}</span>
          ))}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[680px] px-5 pb-12 pt-6">
        <p className="mb-1 text-sm opacity-80">results for <span className="font-semibold">{q}</span></p>
        <p className="mb-4 text-xs opacity-60">{createRng(ctx.componentSeed).int(11000, 9900000).toLocaleString()} ({(createRng(ctx.componentSeed).int(12, 88) / 100).toFixed(2)})</p>
        {searchLoader ? (
          <InlineBlockLoader variant={searchLoader.variant} message={searchLoader.message} durationMs={searchLoader.durationMs} stuck={searchLoader.stuck} />
        ) : null}
        <SearchExperience items={resultItems} suggestions={makeLinks(ctx, 6, "related")} classes={page.styleRecipe.classes} initialQuery={q} loaderVariant={loaderVariantForPage(page)} labels={page.languageBlend.primary} />
      </div>
    </div>
  );
}

/* ============================ newspaper ============================ */

function NewsLayout({ page }: P) {
  const ctx = contextForBlock(page, "news");
  const lead = selectImage(ctx, "news thumbnail");
  const r = createRng(ctx.componentSeed);
  const style = {
    fontFamily: "var(--font-playfair), Georgia, serif",
    "--page-font-headline": "var(--font-playfair), Georgia, serif"
  } as CSSProperties;

  const masthead = (
    <header className="border-b-4 border-double border-[var(--page-fg)]">
      <div className="shell py-4 text-center">
        <p className="font-accent text-[11px] uppercase tracking-[0.3em] opacity-70">
          {["Mon", "Tue", "Wed", "Thu", "Fri"][r.int(0, 4)]} · {r.int(1, 28)} · {page.languageBlend.primary} Edition · No. {r.int(100, 9999)}
        </p>
        <h1 className="headline text-[clamp(2.4rem,7vw,5rem)] leading-none">{displayBrand(page)}</h1>
        <p className="mt-1 border-y border-[var(--page-border)] py-1 font-accent text-[11px] uppercase tracking-wide">
          {page.webMood} · markets {r.int(-9, 22)}% · weather {r.int(38, 88)}°
        </p>
      </div>
    </header>
  );

  if (page.layoutSkin === "wire-feed") {
    const rows = r.int(10, 16);
    return (
      <div style={style}>
        {masthead}
        <main className="shell max-w-3xl py-6">
          <h2 className="headline mb-4 text-2xl">{page.title}</h2>
          <ul className="grid gap-0 divide-y divide-[var(--page-border)] border-y border-[var(--page-border)]">
            {Array.from({ length: rows }).map((_, i) => {
              const c = contextForBlock(page, `wire-${i}`);
              const l = makeLink(c, `wire-${i}`, generateHeadline(c, i));
              const wr = createRng(c.componentSeed);
              return (
                <li key={i} className="flex items-baseline justify-between gap-4 py-3">
                  <DeepLink link={l} className="font-semibold hover:underline" />
                  <span className="shrink-0 font-accent text-[11px] opacity-50">{wr.int(1, 59)}m ago</span>
                </li>
              );
            })}
          </ul>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "tabloid") {
    return (
      <div style={style}>
        {masthead}
        <main className="shell py-6">
          <article className="mb-6">
            <h2 className="headline text-5xl leading-[0.95]">{page.title}</h2>
            <CleanMedia image={lead} className="my-4 aspect-[16/9]" loader={mediaLoaderConfig(ctx)} />
            <p className="text-lg leading-8">{generateParagraph(ctx, 0)}</p>
          </article>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => {
              const c = contextForBlock(page, `tab-${i}`);
              const l = makeLink(c, `tab-${i}`, generateHeadline(c, i));
              return (
                <article key={i} className="border-t-2 border-[var(--page-fg)] pt-2">
                  <CleanMedia image={selectImage(c, "news thumbnail")} className="mb-2 aspect-[4/3]" />
                  <h3 className="headline text-base leading-tight">
                    <DeepLink link={l} className="hover:underline" />
                  </h3>
                </article>
              );
            })}
          </div>
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "magazine-spread") {
    return (
      <div style={style}>
        {masthead}
        <main className="shell py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <article>
              <CleanMedia image={lead} className="aspect-[3/4]" loader={mediaLoaderConfig(ctx)} />
            </article>
            <article className="grid content-center gap-4">
              <p className="font-accent text-[11px] uppercase tracking-wide opacity-60">Cover story</p>
              <h2 className="headline text-4xl leading-[1.05]">{page.title}</h2>
              <p className="text-lg leading-8">{generateParagraph(ctx, 0)}</p>
              <p className="leading-7 opacity-90">{generateParagraph(ctx, 1)}</p>
            </article>
          </div>
          <div className="mt-8 grid gap-4 border-t-2 border-[var(--page-fg)] pt-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => {
              const c = contextForBlock(page, `spread-${i}`);
              const l = makeLink(c, `spread-${i}`, generateHeadline(c, i));
              return (
                <article key={i}>
                  <h3 className="headline text-lg"><DeepLink link={l} className="hover:underline" /></h3>
                  <p className="mt-2 text-sm leading-6 opacity-85">{generateProductDescription(c, i)}</p>
                </article>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "local-briefing") {
    const briefs = createRng(ctx.componentSeed).int(6, 10);
    return (
      <div style={style}>
        {masthead}
        <main className="shell grid gap-6 py-6 lg:grid-cols-[1fr_280px]">
          <div>
            <h2 className="headline mb-4 text-2xl">{page.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: briefs }).map((_, i) => {
                const c = contextForBlock(page, `local-${i}`);
                const l = makeLink(c, `local-${i}`, generateHeadline(c, i));
                return (
                  <article key={i} className={`${page.styleRecipe.classes.panel} grid gap-2`}>
                    <CleanMedia image={selectImage(c, "news thumbnail")} className="aspect-[16/10]" />
                    <h3 className="font-semibold leading-tight"><DeepLink link={l} className="hover:underline" /></h3>
                    <p className="line-clamp-2 text-xs opacity-75">{generateProductDescription(c, i)}</p>
                  </article>
                );
              })}
            </div>
          </div>
          <aside className="grid h-fit gap-3">
            <div className={page.styleRecipe.classes.intrusionPanel}>
              <p className="font-accent text-[11px] uppercase">Local {page.motifs[0]}</p>
              <ul className="mt-2 grid gap-1 text-sm">
                {makeLinks(ctx, 6, "local").map((l) => (
                  <li key={l.id}><DeepLink link={l} className="hover:underline" /></li>
                ))}
              </ul>
            </div>
          </aside>
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      {masthead}

      <main className="shell grid gap-6 py-6 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-5">
          <article className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pb-5">
            <h2 className="headline text-4xl leading-[1.05]">{page.title}</h2>
            <p className="mt-1 font-accent text-[11px] uppercase opacity-60">By a nearby correspondent</p>
            <CleanMedia image={lead} className="my-3 aspect-[16/8]" loader={mediaLoaderConfig(ctx)} />
            <div className="columns-1 gap-5 text-[1.02rem] leading-7 [column-fill:balance] md:columns-2">
              {[0, 1, 2].map((i) => (
                <p key={i} className="mb-3 break-inside-avoid first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.8]">
                  {generateParagraph(ctx, i)}
                </p>
              ))}
            </div>
          </article>
          <div className="grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => {
              const c = contextForBlock(page, `news-col-${i}`);
              const l = makeLink(c, `col-${i}`, generateHeadline(c, i));
              return (
                <article key={i} className="border-t-2 border-[var(--page-fg)] pt-2">
                  <h3 className="headline text-lg leading-tight">
                    <DeepLink link={l} className="hover:underline" />
                  </h3>
                  <p className="mt-1 text-sm leading-6 opacity-85">{generateProductDescription(c, i)}</p>
                </article>
              );
            })}
          </div>
        </div>
        <aside className="grid h-fit gap-4">
          <div className="border-2 border-[var(--page-fg)] p-3">
            <p className="border-b border-[var(--page-border)] pb-1 font-accent text-[11px] uppercase">In Brief</p>
            <ul className="mt-2 grid gap-2">
              {makeLinks(ctx, 7, "brief").map((l, i) => (
                <li key={l.id} className="border-b border-dotted border-[var(--page-border)] pb-1 text-sm">
                  <DeepLink link={{ ...l, label: generateHeadline(ctx, i + 3) }} className="hover:underline" />
                </li>
              ))}
            </ul>
          </div>
          <CleanMedia image={selectImage(ctx, "fake ad")} className="aspect-[4/5]" />
        </aside>
      </main>
      <OldWebFooter page={page} />
    </div>
  );
}

/* ============================ dashboard ============================ */

function DashboardLayout({ page }: P) {
  const ctx = contextForBlock(page, "dash");
  const skin = page.layoutSkin;
  const nav = makeLinks(ctx, 7, "navitem");
  const metrics = ["Active Suites", "Quiet Carts", "Open Floors", "Pending Breakfasts"];
  const r = createRng(ctx.componentSeed);
  const bars = Array.from({ length: 12 }).map((_, i) => r.int(15, 100));
  const dashLoader = inlineLoaderForBlock(page, "dash");
  const style = { "--page-font-accent": "var(--font-spacemono), monospace" } as CSSProperties;

  const metricsGrid = (
    <div className="grid gap-[var(--gap-grid)] sm:grid-cols-2 lg:grid-cols-4">
      {dashLoader ? (
        <div className="sm:col-span-2 lg:col-span-4">
          <InlineBlockLoader variant={dashLoader.variant} message={dashLoader.message} durationMs={dashLoader.durationMs} stuck={dashLoader.stuck} />
        </div>
      ) : null}
      {metrics.map((m, i) => {
        const mr = createRng(`${ctx.componentSeed}:m:${i}`);
        return (
          <div key={m} className={page.styleRecipe.classes.panel}>
            <p className="font-accent text-[11px] uppercase opacity-60">{m}</p>
            <p className="mt-2 text-3xl font-semibold">{mr.int(0, 9999).toLocaleString()}</p>
            <p className={`mt-1 text-xs ${mr.bool() ? "text-[var(--page-accent)]" : "text-[var(--page-danger)]"}`}>{mr.bool() ? "▲" : "▼"} {mr.int(1, 40)}% vs previous tab</p>
          </div>
        );
      })}
    </div>
  );

  if (skin === "topnav") {
    return (
      <div style={style}>
        <header className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]/40">
          <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
            <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)}</a>
            <nav className="flex flex-wrap gap-1">
              {nav.slice(0, 6).map((l, i) => (
                <DeepLink key={l.id} link={l} className={`rounded-[var(--radius-input)] px-3 py-1.5 text-sm ${i === 0 ? "bg-[var(--page-accent)] text-white" : "opacity-75 hover:bg-[var(--page-muted)]"}`} />
              ))}
            </nav>
          </div>
        </header>
        <main className="shell grid gap-5 py-5">
          <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
          {metricsGrid}
          <div className={page.styleRecipe.classes.panel}>
            <div className="flex h-40 items-end gap-1.5">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-[3px] bg-[var(--page-accent)]" style={{ height: `${h}%`, opacity: 0.5 + h / 200 }} />
              ))}
            </div>
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "widgets") {
    const widgets = createRng(ctx.componentSeed).int(6, 9);
    return (
      <div style={style} className="min-h-screen bg-[var(--page-muted)]/20">
        <header className="shell flex items-center justify-between py-4">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} widgets</a>
          <input className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-transparent px-3 py-1.5 text-sm" placeholder="Filter…" />
        </header>
        <main className="shell grid gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: widgets }).map((_, i) => {
            const c = contextForBlock(page, `widget-${i}`);
            const wr = createRng(c.componentSeed);
            return (
              <div key={i} className={`${page.styleRecipe.classes.panel} grid gap-2`}>
                <p className="font-accent text-[11px] uppercase opacity-60">{generateProductName(c, i)}</p>
                <p className="text-2xl font-semibold">{wr.int(0, 999)}</p>
                <p className="text-xs opacity-70">{generateProductDescription(c, i)}</p>
              </div>
            );
          })}
        </main>
      </div>
    );
  }

  if (skin === "kanban") {
    const cols = ["To do", "In progress", "Done"];
    return (
      <div style={style}>
        <MiniHeader page={page} links={4} />
        <main className="shell py-5">
          <h1 className="headline mb-4 text-2xl">{generateHeading(ctx)}</h1>
          <div className="grid gap-4 md:grid-cols-3">
            {cols.map((col, ci) => (
              <div key={col} className="rounded-[var(--radius-card)] bg-[var(--page-muted)]/40 p-3">
                <p className="mb-3 font-accent text-[11px] uppercase opacity-60">{col}</p>
                <div className="grid gap-2">
                  {Array.from({ length: createRng(`${ctx.componentSeed}:k${ci}`).int(2, 4) }).map((_, i) => {
                    const c = contextForBlock(page, `kanban-${ci}-${i}`);
                    const l = makeLink(c, `kanban-${ci}-${i}`, generateHeadline(c, i));
                    return (
                      <div key={i} className={`${page.styleRecipe.classes.panel} text-sm`}>
                        <DeepLink link={l} className="font-semibold hover:underline" />
                        <p className="mt-1 line-clamp-2 text-xs opacity-70">{generateProductDescription(c, i)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "compact-metrics") {
    return (
      <div style={style}>
        <header className="shell flex items-center justify-between border-b border-[var(--page-border)] py-2">
          <a href={siteHomeHref(page)} className="site-brand text-sm font-bold no-underline">{displayBrand(page)}</a>
          <span className="font-accent text-[10px] opacity-60">{page.motifs[0]}</span>
        </header>
        <main className="shell py-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => {
              const mr = createRng(`${ctx.componentSeed}:cm${i}`);
              return (
                <div key={m} className="flex items-center justify-between border border-[var(--page-border)] px-3 py-2 text-sm">
                  <span className="font-accent text-[10px] uppercase opacity-60">{m}</span>
                  <span className="font-semibold">{mr.int(0, 9999).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <ul className="mt-4 grid gap-1 text-sm">
            {makeLinks(ctx, 8, "compact-act").map((l, i) => (
              <li key={l.id} className="flex justify-between border-b border-[var(--page-border)] py-1.5">
                <DeepLink link={l} className="truncate hover:underline" />
                <span className="font-accent text-[10px] opacity-50">{createRng(`${ctx.componentSeed}:ca${i}`).int(1, 59)}m</span>
              </li>
            ))}
          </ul>
        </main>
      </div>
    );
  }

  return (
    <div style={style} className="grid min-h-screen md:grid-cols-[230px_1fr]">
      <aside className="border-r-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]/40 p-4">
        <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)}</a>
        <p className="mt-1 font-accent text-[10px] uppercase opacity-50">workspace · {page.motifs[0]}</p>
        <nav className="mt-5 grid gap-1">
          {["Overview", ...nav.map((n) => n.label.split(" ").slice(0, 2).join(" "))].slice(0, 8).map((label, i) => (
            <DeepLink
              key={i}
              link={nav[Math.max(0, i - 1)] ?? nav[0]}
              className={`rounded-[var(--radius-input)] px-3 py-2 text-sm ${i === 0 ? "bg-[var(--page-accent)] text-white" : "hover:bg-[var(--page-muted)]"}`}
            />
          ))}
        </nav>
      </aside>
      <div className="grid content-start gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pb-3">
          <div>
            <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
            <p className="font-accent text-xs opacity-60">Signed in as guest · plan: previous</p>
          </div>
          <input className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-transparent px-3 py-1.5 text-sm" placeholder="Filter floors…" />
        </div>
        <div className="grid gap-[var(--gap-grid)] sm:grid-cols-2 lg:grid-cols-4">
          {dashLoader ? (
            <div className="sm:col-span-2 lg:col-span-4">
              <InlineBlockLoader variant={dashLoader.variant} message={dashLoader.message} durationMs={dashLoader.durationMs} stuck={dashLoader.stuck} />
            </div>
          ) : null}
          {metrics.map((m, i) => {
            const mr = createRng(`${ctx.componentSeed}:m:${i}`);
            return (
              <div key={m} className={page.styleRecipe.classes.panel}>
                <p className="font-accent text-[11px] uppercase opacity-60">{m}</p>
                <p className="mt-2 text-3xl font-semibold">{mr.int(0, 9999).toLocaleString()}</p>
                <p className={`mt-1 text-xs ${mr.bool() ? "text-[var(--page-accent)]" : "text-[var(--page-danger)]"}`}>{mr.bool() ? "▲" : "▼"} {mr.int(1, 40)}% vs previous tab</p>
              </div>
            );
          })}
        </div>
        <div className="grid gap-[var(--gap-grid)] lg:grid-cols-[1.4fr_1fr]">
          <div className={page.styleRecipe.classes.panel}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Occupancy (impossible)</h2>
              <span className="font-accent text-xs opacity-50">last 12 windows</span>
            </div>
            <div className="flex h-40 items-end gap-1.5">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-[3px] bg-[var(--page-accent)]" style={{ height: `${h}%`, opacity: 0.5 + (h / 200) }} />
              ))}
            </div>
          </div>
          <div className={page.styleRecipe.classes.panel}>
            <h2 className="mb-2 font-semibold">Recent activity</h2>
            <ul className="grid gap-2 text-sm">
              {makeLinks(ctx, 5, "activity").map((l, i) => (
                <li key={l.id} className="flex items-center justify-between border-b border-[var(--page-border)] pb-1">
                  <DeepLink link={l} className="truncate hover:underline" />
                  <span className="font-accent text-[11px] opacity-50">{createRng(`${ctx.componentSeed}:a${i}`).int(1, 59)}m</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <TinyFooter page={page} />
      </div>
    </div>
  );
}

/* ============================ landing ============================ */

function LandingLayout({ page }: P) {
  const ctx = contextForBlock(page, "landing");
  const cta = makeLink(ctx, "cta", generateButtonLabel(ctx));
  const features = [0, 1, 2].map((i) => contextForBlock(page, `feat-${i}`));
  const icons = ["◷", "❖", "⬡", "◐", "✦", "⬢"];
  const r = createRng(ctx.componentSeed);

  if (page.layoutSkin === "split-hero") {
    const heroImage = selectImage(ctx, "hero background");
    return (
      <div>
        <MiniHeader page={page} links={5} />
        <section className="shell grid items-center gap-8 py-12 lg:grid-cols-2">
          <div>
            <span className="rounded-[var(--radius-pill)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-3 py-1 font-accent text-[11px] uppercase">
              {page.genreFormula.content}
            </span>
            <h1 className="headline mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]">{page.title}</h1>
            <p className="mt-4 text-lg opacity-80">{page.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <DeepLink link={cta} className={page.styleRecipe.classes.button} />
              <DeepLink link={makeLink(ctx, "demo", "See pricing")} className="text-sm underline underline-offset-4" />
            </div>
          </div>
          <CleanMedia image={heroImage} className="aspect-[4/3]" motion />
        </section>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "stacked-form") {
    return (
      <div>
        <MiniHeader page={page} links={3} center />
        <section className="shell mx-auto max-w-xl py-16 text-center">
          <h1 className="headline text-4xl">{page.title}</h1>
          <p className="mt-3 opacity-80">{page.subtitle}</p>
          <form action={makeLink(ctx, "signup").href} className={`${page.styleRecipe.classes.panel} mt-8 grid gap-3 text-left`}>
            {["Work email", "Company floor", "Preferred suite"].map((f, i) => (
              <label key={f} className="grid gap-1 text-sm">
                <span className="font-accent text-[11px] uppercase opacity-60">{f}</span>
                <input className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-transparent px-3 py-2" defaultValue={i === 2 ? page.motifs[0] : undefined} />
              </label>
            ))}
            <button className={page.styleRecipe.classes.button}>{generateButtonLabel(ctx)}</button>
          </form>
        </section>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "video-bg") {
    const bg = selectImage(ctx, "hero background");
    return (
      <div className="relative min-h-screen">
        <CleanMedia image={bg} className="fixed inset-0 h-full opacity-30" rounded="" motion />
        <div className="relative">
          <MiniHeader page={page} links={4} />
          <section className="shell flex min-h-[70vh] flex-col items-center justify-center gap-5 py-16 text-center">
            <h1 className="headline max-w-[16ch] text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95]">{page.title}</h1>
            <p className="max-w-xl text-lg opacity-90">{page.subtitle}</p>
            <DeepLink link={cta} className={page.styleRecipe.classes.button} />
          </section>
          <ColumnsFooter page={page} />
        </div>
      </div>
    );
  }

  if (page.layoutSkin === "pricing-table") {
    const tiers = ["Starter", "Pro", "Enterprise"];
    return (
      <div>
        <MiniHeader page={page} links={4} center />
        <section className="shell py-12 text-center">
          <h1 className="headline text-4xl">{page.title}</h1>
          <p className="mt-2 opacity-80">{page.subtitle}</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {tiers.map((tier, i) => {
              const c = contextForBlock(page, `tier-${i}`);
              const pr = createRng(c.componentSeed);
              return (
                <div key={tier} className={`${page.styleRecipe.classes.panel} grid gap-3 ${i === 1 ? "ring-2 ring-[var(--page-accent)]" : ""}`}>
                  <p className="font-accent text-[11px] uppercase opacity-60">{tier}</p>
                  <p className="text-3xl font-bold">{price(c.componentSeed)}<span className="text-sm font-normal opacity-60">/mo</span></p>
                  <ul className="grid gap-1 text-left text-sm opacity-80">
                    {[0, 1, 2].map((j) => (
                      <li key={j}>✓ {generateFormLabel(c, j)}</li>
                    ))}
                  </ul>
                  <DeepLink link={makeLink(c, `tier-${i}`, "Choose plan")} className={`${page.styleRecipe.classes.button} w-full text-center`} />
                </div>
              );
            })}
          </div>
        </section>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      <MiniHeader page={page} links={5} />
      <section className="shell flex flex-col items-center gap-5 py-16 text-center">
        <span className="rounded-[var(--radius-pill)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-3 py-1 font-accent text-[11px] uppercase tracking-wide">
          New · {page.genreFormula.content}
        </span>
        <h1 className="headline max-w-[18ch] text-[clamp(2.4rem,7vw,5rem)] leading-[0.95]">{page.title}</h1>
        <p className="max-w-2xl text-lg leading-7 opacity-80">{page.subtitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <DeepLink link={cta} className={page.styleRecipe.classes.button} />
          <DeepLink link={makeLink(ctx, "demo", "Watch the tour")} className="text-sm underline underline-offset-4" />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 opacity-50">
          <span className="font-accent text-[11px] uppercase">Trusted by</span>
          {["NEARBY", "QUIETCO", "FLOOR&CO", "SUITE+", "PREV.IO"].map((b) => (
            <span key={b} className="font-bold tracking-tight">{b}</span>
          ))}
        </div>
      </section>
      <section className="shell grid gap-[var(--gap-grid)] py-8 md:grid-cols-3">
        {features.map((c, i) => (
          <div key={i} className={`${page.styleRecipe.classes.panel} grid gap-2`}>
            <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-card)] bg-[var(--page-accent)] text-xl text-white">{icons[i]}</span>
            <h3 className="headline text-lg">{generateProductName(c, i)}</h3>
            <p className="text-sm leading-6 opacity-80">{generateProductDescription(c, i)}</p>
          </div>
        ))}
      </section>
      <section className="bg-[var(--page-fg)] text-[var(--page-bg)]">
        <div className="shell grid gap-[var(--gap-grid)] py-10 text-center sm:grid-cols-3">
          {["Suites resolved", "Quiet uptime", "Floors indexed"].map((s, i) => (
            <div key={s}>
              <p className="headline text-4xl">{r.int(2, 99)}{["M", "%", "K"][i]}</p>
              <p className="font-accent text-[11px] uppercase opacity-70">{s}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="shell flex flex-col items-center gap-4 py-16 text-center">
        <h2 className="headline text-3xl">{generateHeading(ctx)}</h2>
        <p className="max-w-xl opacity-80">{generateSubheading(ctx)}</p>
        <DeepLink link={makeLink(ctx, "cta2", "Reserve your account")} className={page.styleRecipe.classes.button} />
      </section>
      <ColumnsFooter page={page} />
    </div>
  );
}

/* ============================ booking ============================ */

function BookingLayout({ page }: P) {
  const ctx = contextForBlock(page, "booking");
  const skin = page.layoutSkin;
  const hero = selectImage(ctx, "hotel booking hero");
  const r = createRng(ctx.componentSeed);
  const stays = Array.from({ length: 6 }, (_, i) => {
    const c = contextForBlock(page, `stay-${i}`);
    return {
      ctx: c,
      title: generateProductName(c, i),
      desc: generateProductDescription(c, i),
      link: makeLink(c, `stay-${i}`, i % 2 ? "View availability" : "Reserve stay"),
      price: `$${r.int(74, 420)}`,
      image: selectImage(c, i % 2 ? "suite photo" : "breakfast listing")
    };
  });

  if (skin === "room-grid") {
    return (
      <div>
        <MiniHeader page={page} links={4} />
        <main className="shell py-6">
          <h1 className="headline text-3xl">{page.title}</h1>
          <p className="mt-1 opacity-80">{page.subtitle}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((stay, i) => (
              <A key={stay.link.id} link={stay.link} className={`${page.styleRecipe.classes.panel} grid gap-2 overflow-hidden p-0 no-underline`}>
                <CleanMedia image={stay.image} className="aspect-[16/10]" rounded="" />
                <div className="px-3 pb-3">
                  <h2 className="font-semibold">{stay.title}</h2>
                  <p className="text-sm font-bold">{stay.price}</p>
                </div>
              </A>
            ))}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (skin === "calendar-strip") {
    const days = createRng(ctx.componentSeed).int(7, 14);
    return (
      <div>
        <MiniHeader page={page} links={3} center />
        <main className="shell max-w-3xl py-8">
          <h1 className="headline text-center text-2xl">{page.title}</h1>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: days }).map((_, i) => {
              const dr = createRng(`${ctx.componentSeed}:d${i}`);
              return (
                <button key={i} className={`shrink-0 rounded-[var(--radius-card)] border px-4 py-3 text-center ${i === 0 ? "border-[var(--page-accent)] bg-[var(--page-muted)]" : "border-[var(--page-border)]"}`}>
                  <p className="font-accent text-[10px] uppercase opacity-60">{dr.int(1, 28)}</p>
                  <p className="font-semibold">${dr.int(80, 320)}</p>
                </button>
              );
            })}
          </div>
          <form action={makeLink(ctx, "book").href} className={`${page.styleRecipe.classes.panel} mt-6 grid gap-3`}>
            {["Check-in", "Check-out", "Guests"].map((f) => (
              <label key={f} className="grid gap-1 text-sm"><span className="font-accent text-[10px] uppercase opacity-60">{f}</span><input className="border border-[var(--page-border)] px-3 py-2" /></label>
            ))}
            <button className={page.styleRecipe.classes.button}>Search availability</button>
          </form>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "compact-form") {
    return (
      <div>
        <main className="shell mx-auto flex min-h-screen max-w-md flex-col justify-center py-12">
          <h1 className="headline text-2xl">{page.title}</h1>
          <p className="mt-2 text-sm opacity-80">{page.subtitle}</p>
          <form action={makeLink(ctx, "booking-search").href} className={`${page.styleRecipe.classes.panel} mt-6 grid gap-3`}>
            {["Destination", "Dates", "Guests"].map((f, i) => (
              <label key={f} className="grid gap-1 text-sm">
                <span className="font-accent text-[10px] uppercase opacity-60">{f}</span>
                <input className="border border-[var(--page-border)] px-3 py-2" defaultValue={i === 0 ? page.motifs[0] : undefined} />
              </label>
            ))}
            <button className={page.styleRecipe.classes.button}>Find rooms</button>
          </form>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      <MiniHeader page={page} links={5} />
      <main className="shell grid gap-6 py-6">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="relative min-h-[360px] overflow-hidden rounded-[var(--radius-card)]">
            <CleanMedia image={hero} className="absolute inset-0 h-full" rounded="" motion />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute bottom-0 max-w-2xl p-6 text-white">
              <p className="font-accent text-xs uppercase opacity-75">Availability mirror</p>
              <h1 className="headline mt-1 text-4xl leading-tight md:text-6xl">{page.title}</h1>
              <p className="mt-2 max-w-xl text-sm text-white/85">{page.subtitle}</p>
            </div>
          </div>
          <form action={makeLink(ctx, "booking-search", "Search rooms").href} className={`${page.styleRecipe.classes.panel} grid content-start gap-4`}>
            {["Arrive", "Depart", "Guests"].map((label, i) => (
              <label key={label} className="grid gap-1 text-sm">
                <span className="font-accent text-[11px] uppercase opacity-60">{label}</span>
                <input className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)] px-3 py-2" defaultValue={i === 2 ? `${r.int(1, 4)} guests` : `${r.int(3, 28)} / ${r.int(1, 12)}`} />
              </label>
            ))}
            <button className={page.styleRecipe.classes.button}>Check availability</button>
            <p className="font-accent text-xs opacity-60">{generateLoadingMessage(ctx)} only after checkout</p>
          </form>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stays.map((stay, i) => (
            <A key={stay.link.id} link={stay.link} className="grid overflow-hidden rounded-[var(--radius-card)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)] no-underline">
              <CleanMedia image={stay.image} className="aspect-[16/10]" />
              <div className="grid gap-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold leading-tight">{stay.title}</h2>
                  <span className="font-accent text-sm">{stay.price}</span>
                </div>
                <p className="line-clamp-2 text-sm opacity-75">{stay.desc}</p>
                <p className="font-accent text-[11px] uppercase opacity-60">{i % 2 ? "breakfast included" : "non-refundable memory"}</p>
              </div>
            </A>
          ))}
        </section>
      </main>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ games ============================ */

function GamePortalLayout({ page }: P) {
  const ctx = contextForBlock(page, "games");
  const skin = page.layoutSkin;
  const r = createRng(ctx.componentSeed);
  const games = Array.from({ length: 9 }, (_, i) => {
    const c = contextForBlock(page, `game-${i}`);
    return {
      ctx: c,
      title: generateProductName(c, i),
      link: makeLink(c, `game-${i}`, i % 3 === 0 ? "Play now" : generateProductName(c, i)),
      image: selectImage(c, i % 2 ? "arcade game thumbnail" : "kids portal game")
    };
  });

  if (skin === "featured-play") {
    const featured = games[0];
    return (
      <div className="min-h-screen bg-[color-mix(in_srgb,var(--page-bg)_82%,var(--page-accent))]">
        <MiniHeader page={page} links={4} />
        <main className="shell grid gap-6 py-6 lg:grid-cols-[1fr_320px]">
          <A link={featured.link} className="relative overflow-hidden rounded-[var(--radius-card)] no-underline">
            <CleanMedia image={featured.image} className="aspect-video" motion />
            <div className="absolute bottom-0 left-0 p-4 text-white [text-shadow:0_1px_8px_rgba(0,0,0,.8)]">
              <h1 className="headline text-3xl">{featured.title}</h1>
              <span className="mt-2 inline-block rounded bg-[var(--page-accent)] px-4 py-2 text-sm font-bold">▶ PLAY</span>
            </div>
          </A>
          <aside className="grid h-fit gap-2">
            {games.slice(1, 6).map((game) => (
              <A key={game.link.id} link={game.link} className="flex gap-2 no-underline">
                <CleanMedia image={game.image} className="h-14 w-20 shrink-0" />
                <p className="line-clamp-2 text-sm font-semibold">{game.title}</p>
              </A>
            ))}
          </aside>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "leaderboard") {
    const scores = createRng(ctx.componentSeed).int(8, 12);
    return (
      <div>
        <header className="bg-[var(--page-accent)] py-3 text-center text-white">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline text-white">high scores</a>
        </header>
        <main className="shell max-w-lg py-6">
          <ol className="grid gap-0 divide-y divide-[var(--page-border)]">
            {Array.from({ length: scores }).map((_, i) => {
              const c = contextForBlock(page, `score-${i}`);
              const l = makeLink(c, `score-${i}`, generateProductName(c, i));
              const sr = createRng(c.componentSeed);
              return (
                <li key={i} className="flex items-center justify-between py-3">
                  <span className="font-accent text-lg opacity-50">#{i + 1}</span>
                  <DeepLink link={l} className="flex-1 font-semibold hover:underline" />
                  <span className="font-bold">{sr.int(1000, 999999).toLocaleString()}</span>
                </li>
              );
            })}
          </ol>
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (skin === "category-shelves") {
    const cats = ["Puzzle", "Action", "Kids", "Multiplayer"];
    return (
      <div>
        <MiniHeader page={page} links={4} />
        <main className="shell py-6">
          <h1 className="headline text-2xl">{page.title}</h1>
          {cats.map((cat, ci) => (
            <section key={cat} className="mt-6">
              <h2 className="headline mb-3 text-lg">{cat}</h2>
              <div className="grid grid-flow-col gap-3 overflow-x-auto pb-2 [grid-auto-columns:minmax(140px,1fr)]">
                {games.filter((_, i) => i % cats.length === ci).map((game) => (
                  <A key={game.link.id} link={game.link} className="grid gap-1 no-underline">
                    <CleanMedia image={game.image} className="aspect-square" />
                    <p className="line-clamp-1 text-xs font-semibold">{game.title}</p>
                  </A>
                ))}
              </div>
            </section>
          ))}
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color-mix(in_srgb,var(--page-bg)_82%,var(--page-accent))]">
      <header className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)]">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} arcade</a>
          <nav className="flex flex-wrap gap-2 font-accent text-xs uppercase">
            {["New", "Puzzle", "Multiplayer", "Rooms", "High scores"].map((label, i) => (
              <DeepLink key={label} link={makeLink(ctx, `game-nav-${i}`, label)} className="rounded-[var(--radius-pill)] bg-[var(--page-muted)] px-3 py-1" />
            ))}
          </nav>
        </div>
      </header>
      <main className="shell grid gap-6 py-6">
        <section className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="font-accent text-xs uppercase opacity-70">Games portal with adult admin categories</p>
            <h1 className="headline mt-1 text-4xl md:text-6xl">{page.title}</h1>
            <p className="mt-2 max-w-2xl text-sm opacity-75">{page.subtitle}</p>
          </div>
          <div className={`${page.styleRecipe.classes.panel} grid gap-2 font-accent text-sm`}>
            {["online guests", "stuck sessions", "ticket prizes"].map((label) => (
              <div key={label} className="flex justify-between">
                <span>{label}</span>
                <span>{r.int(12, 9999)}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, i) => (
            <A key={game.link.id} link={game.link} className="group grid overflow-hidden rounded-[var(--radius-card)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)] no-underline shadow-[var(--shadow-card)]">
              <CleanMedia image={game.image} className="aspect-[4/3]" motion={i === 0} />
              <div className="flex items-center justify-between gap-3 p-3">
                <h2 className="line-clamp-1 font-semibold group-hover:text-[var(--page-accent)]">{game.title}</h2>
                <span className="rounded-[var(--radius-tag)] bg-[var(--page-accent)] px-2 py-1 font-accent text-[11px] text-white">PLAY</span>
              </div>
            </A>
          ))}
        </section>
      </main>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ app store ============================ */

function AppStoreLayout({ page }: P) {
  const ctx = contextForBlock(page, "app-store");
  const skin = page.layoutSkin;
  const appIcon = selectImage(ctx, "app icon product");
  const screenshots = Array.from({ length: 4 }, (_, i) => selectImage(contextForBlock(page, `shot-${i}`), i % 2 ? "software screenshot" : "app preview"));
  const stats = ["Version", "Size", "Age", "Rank"].map((label, i) => ({ label, value: i === 0 ? `2.${createRng(ctx.componentSeed).int(1, 9)}.${i}` : i === 1 ? `${createRng(`${ctx.componentSeed}:size`).int(8, 900)} MB` : i === 2 ? "4+" : `#${createRng(`${ctx.componentSeed}:rank`).int(1, 80)}` }));

  if (skin === "featured-row") {
    const apps = createRng(ctx.componentSeed).int(6, 10);
    return (
      <div>
        <MiniHeader page={page} links={4} />
        <main className="shell py-6">
          <h1 className="headline text-2xl">Featured apps</h1>
          <div className="mt-4 grid grid-flow-col gap-4 overflow-x-auto pb-2 [grid-auto-columns:minmax(120px,1fr)]">
            {Array.from({ length: apps }).map((_, i) => {
              const c = contextForBlock(page, `app-${i}`);
              const l = makeLink(c, `app-${i}`, generateProductName(c, i));
              return (
                <A key={i} link={l} className="grid place-items-center gap-2 text-center no-underline">
                  <CleanMedia image={selectImage(c, "app icon product")} className="h-20 w-20" />
                  <p className="line-clamp-2 text-xs font-semibold">{l.label}</p>
                </A>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "category-tabs") {
    const tabs = ["Top charts", "Categories", "Updates", "Search"];
    const items = createRng(ctx.componentSeed).int(8, 12);
    return (
      <div>
        <header className="border-b border-[var(--page-border)]">
          <div className="shell flex gap-2 overflow-x-auto py-3">
            {tabs.map((t, i) => (
              <DeepLink key={t} link={makeLink(ctx, `tab-${i}`, t)} className={`whitespace-nowrap rounded-[var(--radius-pill)] px-3 py-1 text-sm ${i === 0 ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : "opacity-70"}`} />
            ))}
          </div>
        </header>
        <main className="shell py-4">
          <ol className="grid gap-0 divide-y divide-[var(--page-border)]">
            {Array.from({ length: items }).map((_, i) => {
              const c = contextForBlock(page, `chart-${i}`);
              const l = makeLink(c, `chart-${i}`, generateProductName(c, i));
              return (
                <li key={i} className="flex items-center gap-3 py-3">
                  <span className="w-6 font-accent text-sm opacity-50">{i + 1}</span>
                  <CleanMedia image={selectImage(c, "app icon product")} className="h-12 w-12 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <DeepLink link={l} className="font-semibold hover:underline" />
                    <p className="line-clamp-1 text-xs opacity-70">{generateProductDescription(c, i)}</p>
                  </div>
                  <DeepLink link={makeLink(c, `get-${i}`, "Get")} className={`${page.styleRecipe.classes.button} shrink-0 text-xs`} />
                </li>
              );
            })}
          </ol>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (skin === "minimal-download") {
    return (
      <div>
        <main className="shell mx-auto flex min-h-screen max-w-md flex-col items-center justify-center py-12 text-center">
          <CleanMedia image={appIcon} className="h-28 w-28" />
          <h1 className="headline mt-4 text-2xl">{page.title}</h1>
          <p className="mt-2 text-sm opacity-80">{page.subtitle}</p>
          <DeepLink link={makeLink(ctx, "download", "Download")} className={`${page.styleRecipe.classes.button} mt-6`} />
          <p className="mt-2 font-accent text-[10px] opacity-50">Free · contains reservations</p>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      <MiniHeader page={page} links={4} />
      <main className="shell grid gap-8 py-6">
        <section className="grid gap-5 md:grid-cols-[140px_minmax(0,1fr)_220px]">
          <CleanMedia image={appIcon} className="aspect-square" />
          <div>
            <h1 className="headline text-4xl">{page.title}</h1>
            <p className="mt-2 max-w-2xl text-sm opacity-75">{page.subtitle}</p>
            <div className="mt-4 grid max-w-xl grid-cols-4 gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="border-r border-[var(--page-border)] pr-2 last:border-r-0">
                  <p className="font-accent text-[10px] uppercase opacity-50">{stat.label}</p>
                  <p className="font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid content-start gap-2">
            <DeepLink link={makeLink(ctx, "download", "Download")} className={`${page.styleRecipe.classes.button} text-center`} />
            <p className="text-center font-accent text-[11px] opacity-60">contains in-app reservations</p>
          </div>
        </section>
        <section className="grid grid-flow-col gap-3 overflow-x-auto pb-2 [grid-auto-columns:minmax(150px,200px)]">
          {screenshots.map((image, i) => (
            <CleanMedia key={i} image={image} className="aspect-[9/16] max-h-[360px]" loader={mediaLoaderConfig(contextForBlock(page, `shot-${i}`))} motion={i === 0} />
          ))}
        </section>
        <RealDataSeam page={page} id="app-store-seam" />
        <section className="grid gap-3 md:grid-cols-3">
          {["What is new", "Privacy labels", "Compatibility"].map((heading, i) => (
            <div key={heading} className={page.styleRecipe.classes.panel}>
              <h2 className="font-semibold">{heading}</h2>
              <p className="mt-2 text-sm opacity-75">{generateParagraph(contextForBlock(page, `app-copy-${i}`), i)}</p>
            </div>
          ))}
        </section>
      </main>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ events ============================ */

function EventsLayout({ page }: P) {
  const ctx = contextForBlock(page, "events");
  const skin = page.layoutSkin;
  const events = Array.from({ length: 8 }, (_, i) => {
    const c = contextForBlock(page, `event-${i}`);
    return {
      ctx: c,
      date: `${createRng(c.componentSeed).int(1, 28)}`,
      month: ["JAN", "MAR", "APR", "JUN", "SEP", "NOV"][i % 6],
      title: generateHeadline(c, i),
      link: makeLink(c, `event-${i}`, "Reserve ticket"),
      image: selectImage(c, i % 2 ? "event venue" : "ticket offer")
    };
  });

  if (skin === "calendar-grid") {
    return (
      <div>
        <MiniHeader page={page} links={4} />
        <main className="shell py-6">
          <h1 className="headline text-2xl">{page.title}</h1>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => {
              const c = contextForBlock(page, `cal-${i}`);
              const hasEvent = createRng(c.componentSeed).bool(0.25);
              const l = makeLink(c, `cal-${i}`, generateHeadline(c, i));
              return (
                <div key={i} className={`${page.styleRecipe.classes.panel} min-h-[80px] p-2 text-center ${hasEvent ? "ring-2 ring-[var(--page-accent)]" : ""}`}>
                  <p className="font-accent text-[10px] opacity-60">{i + 1}</p>
                  {hasEvent && <DeepLink link={l} className="mt-1 line-clamp-2 text-[10px] font-semibold hover:underline" />}
                </div>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "featured-event") {
    const featured = events[0];
    return (
      <div>
        <MiniHeader page={page} links={4} />
        <main className="shell py-6">
          <section className={`${page.styleRecipe.classes.panel} grid gap-4 overflow-hidden p-0 lg:grid-cols-2`}>
            <CleanMedia image={featured.image} className="aspect-[16/10]" rounded="" motion />
            <div className="grid content-center gap-3 p-6">
              <p className="font-accent text-xs uppercase opacity-60">{featured.month} {featured.date}</p>
              <h1 className="headline text-3xl">{featured.title}</h1>
              <p className="opacity-80">{generateParagraph(featured.ctx, 0)}</p>
              <DeepLink link={featured.link} className={page.styleRecipe.classes.button} />
            </div>
          </section>
          <h2 className="headline mb-3 mt-8 text-xl">Upcoming</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {events.slice(1, 5).map((event) => (
              <A key={event.link.id} link={event.link} className={`${page.styleRecipe.classes.panel} no-underline`}>
                <p className="font-accent text-xs opacity-60">{event.month} {event.date}</p>
                <p className="font-semibold">{event.title}</p>
              </A>
            ))}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (skin === "compact-list") {
    return (
      <div>
        <header className="shell border-b border-[var(--page-border)] py-4">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">events</a>
        </header>
        <main className="shell max-w-2xl py-4">
          <ul className="grid gap-0 divide-y divide-[var(--page-border)]">
            {events.map((event) => (
              <li key={event.link.id}>
                <A link={event.link} className="flex items-center justify-between gap-4 py-3 no-underline hover:bg-[var(--page-muted)]/30">
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="font-accent text-xs opacity-60">{event.month} {event.date}</p>
                  </div>
                  <span className="text-sm">→</span>
                </A>
              </li>
            ))}
          </ul>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      <MiniHeader page={page} links={6} />
      <main className="shell grid gap-6 py-6">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-accent text-xs uppercase opacity-60">Events directory</p>
            <h1 className="headline text-4xl md:text-6xl">{page.title}</h1>
            <p className="mt-2 max-w-2xl text-sm opacity-75">{page.subtitle}</p>
          </div>
          <form action={makeLink(ctx, "event-search", "Search events").href} className="flex min-w-[280px]">
            <input className="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)] px-3 py-2" placeholder="Search dates" />
            <button className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-l-0 border-[var(--page-border)] bg-[var(--page-accent)] px-4 text-white">Go</button>
          </form>
        </section>
        <section className="grid gap-3">
          {events.map((event, i) => (
            <A key={event.link.id} link={event.link} className="grid gap-4 border-t border-[var(--page-border)] py-4 no-underline md:grid-cols-[88px_180px_minmax(0,1fr)_140px]">
              <div className="font-accent">
                <p className="text-xs opacity-55">{event.month}</p>
                <p className="text-4xl">{event.date}</p>
              </div>
              <CleanMedia image={event.image} className="aspect-[4/3]" />
              <div>
                <h2 className="headline text-2xl">{event.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm opacity-75">{generateParagraph(event.ctx, i)}</p>
              </div>
              <span className="self-center justify-self-start rounded-[var(--radius-button)] bg-[var(--page-fg)] px-4 py-2 text-sm text-[var(--page-bg)] md:justify-self-end">Tickets</span>
            </A>
          ))}
        </section>
      </main>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ manual ============================ */

function ManualLayout({ page }: P) {
  const ctx = contextForBlock(page, "manual");
  const skin = page.layoutSkin;
  const topics = ["Setup", "Billing", "Availability", "Account", "Troubleshooting", "Legacy buttons"];

  if (skin === "article-steps") {
    const steps = createRng(ctx.componentSeed).int(5, 8);
    return (
      <div>
        <MiniHeader page={page} links={3} />
        <main className="shell max-w-2xl py-8">
          <h1 className="headline text-3xl">{page.title}</h1>
          <p className="mt-2 opacity-80">{page.subtitle}</p>
          <ol className="mt-8 grid gap-6">
            {Array.from({ length: steps }).map((_, i) => {
              const c = contextForBlock(page, `step-${i}`);
              return (
                <li key={i} className="grid gap-2 sm:grid-cols-[auto_1fr]">
                  <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-pill)] bg-[var(--page-accent)] text-sm text-white">{i + 1}</span>
                  <div>
                    <h2 className="font-semibold">{generateHeadline(c, i)}</h2>
                    <p className="mt-1 text-sm leading-7 opacity-85">{generateParagraph(c, i)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "faq-accordion") {
    return (
      <div>
        <header className="shell py-6 text-center">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">FAQ</a>
          <h1 className="headline mt-2 text-2xl">{page.title}</h1>
        </header>
        <main className="shell max-w-xl pb-10">
          {topics.map((topic, i) => {
            const c = contextForBlock(page, `faq-${i}`);
            return (
              <details key={topic} className="mb-2 border-b border-[var(--page-border)] pb-2" open={i === 0}>
                <summary className="cursor-pointer font-semibold">{topic}</summary>
                <p className="mt-2 text-sm leading-7 opacity-85">{generateParagraph(c, i)}</p>
              </details>
            );
          })}
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "search-first") {
    return (
      <div>
        <main className="shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">help center</a>
          <h1 className="headline mt-4 text-2xl">How can we help?</h1>
          <form action={makeLink(ctx, "manual-search").href} className="mt-6 flex w-full max-w-xl">
            <input className="min-w-0 flex-1 border border-[var(--page-border)] px-4 py-3 text-lg" placeholder="Search help articles" />
            <button className={page.styleRecipe.classes.button}>Search</button>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {topics.map((t, i) => (
              <DeepLink key={t} link={makeLink(ctx, `sf-${i}`, t)} className={`${page.styleRecipe.classes.tag}`} />
            ))}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      <header className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)]">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">help center</a>
          <form action={makeLink(ctx, "manual-search", "Search help").href} className="flex min-w-[280px]">
            <input className="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)] px-3 py-2 text-sm" placeholder="Search help articles" />
            <button className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-l-0 border-[var(--page-border)] px-3 text-sm">Search</button>
          </form>
        </div>
      </header>
      <main className="shell grid gap-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="grid h-fit gap-2 lg:sticky lg:top-4">
          {topics.map((topic, i) => (
            <DeepLink key={topic} link={makeLink(ctx, `manual-topic-${i}`, topic)} className="rounded-[var(--radius-input)] px-3 py-2 text-sm hover:bg-[var(--page-muted)]" />
          ))}
        </aside>
        <article className="max-w-3xl">
          <p className="font-accent text-xs uppercase opacity-60">Product manual</p>
          <h1 className="headline mt-1 text-4xl md:text-5xl">{page.title}</h1>
          <p className="mt-3 text-lg opacity-75">{page.subtitle}</p>
          <div className="mt-8 grid gap-6">
            {topics.slice(0, 4).map((topic, i) => {
              const c = contextForBlock(page, `manual-section-${i}`);
              return (
                <section key={topic} className="border-t border-[var(--page-border)] pt-5">
                  <h2 className="headline text-2xl">{topic}</h2>
                  <p className="mt-2 leading-7 opacity-85">{generateParagraph(c, i)}</p>
                  <div className="mt-3 rounded-[var(--radius-card)] bg-[var(--page-muted)] p-4 font-mono text-xs">
                    status: {generateLoadingMessage(c)}; result: {page.genreFormula.action}
                  </div>
                </section>
              );
            })}
          </div>
        </article>
      </main>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ forum ============================ */

function ForumLayout({ page }: P) {
  const ctx = contextForBlock(page, "forum");
  const varn = v(page);
  const rows = vCount(page, 6, 16);

  if (page.layoutSkin === "cards") {
    return (
      <div>
        <MiniHeader page={page} links={5} />
        <main className="shell py-5">
          <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: rows }).map((_, i) => {
              const c = contextForBlock(page, `thread-${i}`);
              const l = makeLink(c, `thread-${i}`, generateHeadline(c, i));
              const rr = createRng(c.componentSeed);
              return (
                <article key={i} className={page.styleRecipe.classes.panel}>
                  <h2 className="font-semibold leading-tight"><DeepLink link={l} className="hover:underline" /></h2>
                  <p className="mt-2 line-clamp-2 text-sm opacity-75">{generateProductDescription(c, i)}</p>
                  <p className="mt-3 font-accent text-[11px] opacity-50">{rr.int(0, 4040)} replies · guest_{rr.int(10, 99)}</p>
                </article>
              );
            })}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "compact") {
    return (
      <div>
        <MiniHeader page={page} links={3} />
        <main className="shell max-w-2xl py-4">
          <h1 className="headline text-xl">{generateHeading(ctx)}</h1>
          <ul className="mt-3 grid gap-0 divide-y divide-[var(--page-border)] text-sm">
            {Array.from({ length: rows }).map((_, i) => {
              const c = contextForBlock(page, `thread-${i}`);
              const l = makeLink(c, `thread-${i}`, generateHeadline(c, i));
              const rr = createRng(c.componentSeed);
              return (
                <li key={i} className="flex items-center justify-between gap-2 py-2">
                  <DeepLink link={l} className="truncate font-medium hover:underline" />
                  <span className="shrink-0 font-accent text-[10px] opacity-50">{rr.int(0, 404)} · {rr.int(1, 23)}h</span>
                </li>
              );
            })}
          </ul>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "split-board") {
    const boards = makeLinks(ctx, 6, "board");
    return (
      <div className="grid min-h-screen md:grid-cols-[200px_1fr]">
        <aside className="border-r border-[var(--page-border)] bg-[var(--page-muted)]/30 p-3">
          <p className="font-accent text-[10px] uppercase opacity-60">Boards</p>
          <nav className="mt-2 grid gap-1">
            {boards.map((l, i) => (
              <DeepLink key={l.id} link={l} className={`rounded px-2 py-1.5 text-sm ${i === 0 ? "bg-[var(--page-accent)] text-white" : "opacity-75 hover:bg-[var(--page-muted)]"}`} />
            ))}
          </nav>
        </aside>
        <main className="shell py-5">
          <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
          <div className="mt-4 grid gap-2">
            {Array.from({ length: Math.min(rows, 8) }).map((_, i) => {
              const c = contextForBlock(page, `split-${i}`);
              const l = makeLink(c, `split-${i}`, generateHeadline(c, i));
              return (
                <article key={i} className={`${page.styleRecipe.classes.panel} flex items-center justify-between gap-3`}>
                  <DeepLink link={l} className="font-semibold hover:underline" />
                  <span className="font-accent text-[10px] opacity-50">{createRng(c.componentSeed).int(0, 200)} replies</span>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  if (page.layoutSkin === "pinned-hero") {
    const hero = contextForBlock(page, "forum-hero");
    const heroLink = makeLink(hero, "hero-thread", generateHeadline(hero, 0));
    return (
      <div>
        <MiniHeader page={page} links={4} />
        <section className={`${page.styleRecipe.classes.panel} shell my-4 grid gap-2 sm:grid-cols-[auto_1fr]`}>
          <span className="text-2xl">📌</span>
          <div>
            <h2 className="headline text-xl"><DeepLink link={heroLink} className="hover:underline" /></h2>
            <p className="mt-1 text-sm opacity-80">{generateProductDescription(hero, 0)}</p>
          </div>
        </section>
        <main className="shell pb-5">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--page-border)]">
            {Array.from({ length: rows }).map((_, i) => {
              const c = contextForBlock(page, `thread-${i}`);
              const l = makeLink(c, `thread-${i}`, generateHeadline(c, i));
              return (
                <div key={i} className="flex items-center justify-between border-t border-[var(--page-border)] px-3 py-2 text-sm first:border-t-0 hover:bg-[var(--page-muted)]/30">
                  <DeepLink link={l} className="font-medium hover:underline" />
                  <span className="font-accent text-[10px] opacity-50">{createRng(c.componentSeed).int(0, 404)} replies</span>
                </div>
              );
            })}
          </div>
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (varn.listStyle === "cards" || page.layoutSkin === "cards") {
    return (
      <div>
        <VariedHeader page={page} />
        <main className="shell py-5">
          <h1 className={`headline ${titleClass(varn.titleScale)}`}>{generateHeading(ctx)}</h1>
          <div className={`mt-4 grid ${gapClass(varn.gapScale)} ${gridColsClass(varn.gridCols)}`}>
            {Array.from({ length: rows }).map((_, i) => {
              const c = contextForBlock(page, `thread-${i}`);
              const l = makeLink(c, `thread-${i}`, generateHeadline(c, i));
              const rr = createRng(c.componentSeed);
              return (
                <article key={i} className={cardSurface(page)}>
                  <h2 className="font-semibold leading-tight"><DeepLink link={l} className="hover:underline" /></h2>
                  <p className="mt-2 line-clamp-2 text-sm opacity-75">{generateProductDescription(c, i)}</p>
                  <p className="mt-3 font-accent text-[11px] opacity-50">{rr.int(0, 4040)} replies</p>
                </article>
              );
            })}
          </div>
        </main>
        <LayoutFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      <VariedHeader page={page} />
      <LayoutPromo page={page} />
      <main className="shell py-5">
        <p className="mb-3 font-accent text-[11px] opacity-60">
          Board <span className="opacity-40">»</span> {page.genreFormula.content} <span className="opacity-40">»</span> {page.motifs[0] ?? "general"}
        </p>
        <div className="flex items-center justify-between gap-2">
          <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
          <DeepLink link={makeLink(ctx, "newthread", "New thread")} className={page.styleRecipe.classes.button} />
        </div>
        <div className="mt-3 overflow-hidden rounded-[var(--radius-card)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
          <div className="grid grid-cols-[1fr_70px_90px] gap-2 bg-[var(--page-muted)] px-3 py-2 font-accent text-[11px] uppercase opacity-70 sm:grid-cols-[1fr_90px_70px_150px]">
            <span>Topic</span>
            <span className="hidden text-center sm:block">Author</span>
            <span className="text-center">Replies</span>
            <span className="text-right">Last post</span>
          </div>
          {Array.from({ length: rows }).map((_, i) => {
            const c = contextForBlock(page, `thread-${i}`);
            const l = makeLink(c, `thread-${i}`, generateHeadline(c, i));
            const rr = createRng(c.componentSeed);
            const sticky = rr.bool(0.18);
            return (
              <div key={i} className="grid grid-cols-[1fr_70px_90px] items-center gap-2 border-t-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-3 py-2 text-sm hover:bg-[var(--page-muted)]/30 sm:grid-cols-[1fr_90px_70px_150px]">
                <span className="min-w-0">
                  <span className="mr-1 opacity-50">{sticky ? "📌" : rr.bool() ? "🗎" : "🔒"}</span>
                  <DeepLink link={l} className="font-semibold hover:underline" />
                  <span className="ml-2 hidden font-accent text-[10px] opacity-50 sm:inline">{page.languageBlend.primary}</span>
                </span>
                <span className="hidden truncate text-center font-accent text-[11px] opacity-70 sm:block">guest_{rr.int(10, 99)}</span>
                <span className="text-center font-accent text-xs">{rr.int(0, 4040)}</span>
                <span className="text-right font-accent text-[11px] opacity-60">{rr.int(1, 23)}h ago</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between font-accent text-xs opacity-60">
          <span>Pages: {["1", "2", "3", "…", "77"].join("  ")}</span>
          <span>{createRng(ctx.componentSeed).int(3, 240)} guests online · 0 registered</span>
        </div>
      </main>
      <LayoutFooter page={page} />
    </div>
  );
}

/* ============================ directory ============================ */

function DirectoryLayout({ page }: P) {
  const ctx = contextForBlock(page, "directory");
  const skin = page.layoutSkin;
  const varn = v(page);
  const cats = reorderByVariation(
    `${page.routeState.seed}:dir-cats`,
    ["Arts", "Business", "Computers", "Games", "Health", "News", "Recreation", "Reference", "Regional", "Society", "Shopping", "Travel"],
    varn.blockOrder
  );
  const visibleCats = cats.slice(0, vCount(page, 8, cats.length));

  if (skin === "a-z-list") {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return (
      <div>
        <header className="shell border-b border-[var(--page-border)] py-6 text-center">
          <a href={siteHomeHref(page)} className="site-brand headline text-2xl lowercase no-underline">{displayBrand(page)} directory</a>
          <p className="mt-1 text-sm opacity-70">A–Z index · {page.genreFormula.content}</p>
        </header>
        <main className="shell py-6">
          {letters.map((letter) => {
            const count = createRng(`${ctx.componentSeed}:${letter}`).int(0, 4);
            if (count === 0) return null;
            return (
              <section key={letter} className="mb-6">
                <h2 className="headline mb-2 text-3xl opacity-40">{letter}</h2>
                <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: count }).map((_, i) => {
                    const c = contextForBlock(page, `az-${letter}-${i}`);
                    const l = makeLink(c, `az-${letter}-${i}`, generateProductName(c, i));
                    return <li key={i}><DeepLink link={l} className="text-sm hover:underline" /></li>;
                  })}
                </ul>
              </section>
            );
          })}
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (skin === "featured-tree") {
    const featured = makeLinks(ctx, 3, "feat");
    return (
      <div>
        <header className="shell py-6 text-center">
          <a href={siteHomeHref(page)} className="site-brand headline text-3xl lowercase no-underline">{displayBrand(page)}</a>
        </header>
        <main className="shell max-w-3xl py-4">
          <section className="mb-8">
            <p className="font-accent text-[11px] uppercase opacity-60">Featured</p>
            <ul className="mt-2 grid gap-2">
              {featured.map((l, i) => (
                <li key={l.id} className="text-lg font-semibold"><DeepLink link={{ ...l, label: generateHeadline(ctx, i) }} className="hover:underline" /></li>
              ))}
            </ul>
          </section>
          {cats.slice(0, 8).map((cat, i) => {
            const c = contextForBlock(page, `tree-${i}`);
            const sub = makeLinks(c, createRng(c.componentSeed).int(3, 6), `tree-sub-${i}`);
            return (
              <details key={cat} className="mb-2 border-b border-[var(--page-border)] pb-2" open={i < 2}>
                <summary className="cursor-pointer font-semibold">{cat}</summary>
                <ul className="mt-2 grid gap-1 pl-4 text-sm">
                  {sub.map((l) => (
                    <li key={l.id}><DeepLink link={l} className="old-link" /></li>
                  ))}
                </ul>
              </details>
            );
          })}
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (skin === "search-first") {
    return (
      <div>
        <header className="shell flex min-h-[40vh] flex-col items-center justify-center py-12 text-center">
          <a href={siteHomeHref(page)} className="site-brand headline text-4xl lowercase no-underline">{displayBrand(page)}</a>
          <form action={makeLink(ctx, "search").href} className="mt-6 flex w-full max-w-xl">
            <input className="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-4 py-3 text-lg" placeholder="search the directory" />
            <button className={page.styleRecipe.classes.button}>Search</button>
          </form>
          <p className="mt-4 text-sm opacity-60">{cats.length} top-level categories · {page.motifs[0]}</p>
        </header>
        <main className="shell grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((cat, i) => (
            <DeepLink key={cat} link={makeLink(ctx, `sf-${i}`, cat)} className={`${page.styleRecipe.classes.panel} text-center font-semibold no-underline hover:bg-[var(--page-muted)]/30`} />
          ))}
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "regional") {
    const regions = ["North", "South", "East", "West", "Central", "Previous"];
    return (
      <div>
        <MiniHeader page={page} links={4} />
        <main className="shell py-6">
          <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((region, i) => {
              const c = contextForBlock(page, `reg-${i}`);
              const sub = makeLinks(c, 5, `reg-sub-${i}`);
              return (
                <section key={region} className={page.styleRecipe.classes.panel}>
                  <h2 className="headline text-lg">{region}</h2>
                  <ul className="mt-2 grid gap-1 text-sm">
                    {sub.map((l) => (
                      <li key={l.id}><DeepLink link={l} className="hover:underline" /></li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      <VariedHeader page={page} />
      <LayoutPromo page={page} />
      <header className={`border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] py-6 ${varn.headerMode === "centered" ? "text-center" : "shell"}`}>
        {varn.headerMode !== "compact" && (
          <form action={makeLink(ctx, "search").href} className={`mx-auto mt-4 flex max-w-lg ${varn.headerMode === "centered" ? "px-5" : ""}`}>
            <input className="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-white px-3 py-2 text-black" placeholder="search the directory" />
            <button className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-l-0 border-[var(--page-border)] bg-[var(--page-accent)] px-5 text-white">Search</button>
          </form>
        )}
      </header>
      <main className={`shell grid ${gapClass(varn.gapScale)} py-8 ${gridColsClass(varn.gridCols)}`}>
        {visibleCats.map((cat, i) => {
          const c = contextForBlock(page, `cat-${i}`);
          const sub = makeLinks(c, vCount(page, 3, 8), `sub-${i}`);
          return (
            <section key={cat} className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pb-3">
              <h2 className="headline text-lg">
                <DeepLink link={makeLink(c, `cat-${i}`, cat)} className="hover:underline" />
                <span className="ml-1 font-accent text-[11px] opacity-50">({createRng(c.componentSeed).int(12, 9000)})</span>
              </h2>
              <ul className="mt-1 grid gap-[2px] text-sm">
                {sub.map((l) => (
                  <li key={l.id} className="truncate">
                    <DeepLink link={l} className="old-link" />
                  </li>
                ))}
              </ul>
              <p className="mt-1 font-accent text-[11px] opacity-50">{generateLoadingMessage(c)}…</p>
            </section>
          );
        })}
      </main>
      <LayoutFooter page={page} />
    </div>
  );
}

/* ============================ single product ============================ */

function ProductLayout({ page }: P) {
  const ctx = contextForBlock(page, "product");
  const skin = page.layoutSkin;
  const main = selectImage(ctx, "product image");
  const thumbs = [0, 1, 2, 3].map((i) => selectImage({ ...ctx, componentSeed: `${ctx.componentSeed}:t:${i}` }, "product image"));
  const name = generateProductName(ctx, 0);
  const r = createRng(ctx.componentSeed);

  if (skin === "gallery-stack") {
    return (
      <div>
        <MiniHeader page={page} links={4} />
        <main className="shell mx-auto max-w-lg py-6">
          <div className="grid gap-2">
            {[main, ...thumbs].map((img, i) => (
              <CleanMedia key={i} image={img} className="aspect-[4/3]" />
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            <h1 className="headline text-2xl">{name}</h1>
            <p className="text-2xl font-bold">{price(ctx.componentSeed)}</p>
            <p className="text-sm leading-6 opacity-85">{generateProductDescription(ctx, 0)}</p>
            <DeepLink link={makeLink(ctx, "add", "Add to cart")} className={`${page.styleRecipe.classes.button} w-full text-center`} />
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "sticky-buy") {
    return (
      <div>
        <PageChrome page={page} />
        <main className="shell py-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <CleanMedia image={main} className="aspect-square" />
            <div className="grid h-fit gap-4 lg:sticky lg:top-24">
              <h1 className="headline text-3xl">{name}</h1>
              <p className="text-3xl font-bold">{price(ctx.componentSeed)}</p>
              <Stars seed={ctx.componentSeed} />
              <p className="text-sm leading-6 opacity-85">{generateProductDescription(ctx, 0)}</p>
              <DeepLink link={makeLink(ctx, "buy", "Buy now")} className={`${page.styleRecipe.classes.button} w-full text-center`} />
            </div>
          </div>
          <div className="mt-10 grid max-w-3xl gap-3 text-sm leading-7">
            {[0, 1, 2].map((i) => <p key={i}>{generateParagraph(ctx, i)}</p>)}
          </div>
        </main>
        <div className="fixed inset-x-0 bottom-0 border-t border-[var(--page-border)] bg-[var(--page-bg)]/95 p-3 backdrop-blur lg:hidden">
          <div className="shell flex items-center justify-between gap-3">
            <span className="font-bold">{price(ctx.componentSeed)}</span>
            <DeepLink link={makeLink(ctx, "add", "Add to cart")} className={page.styleRecipe.classes.button} />
          </div>
        </div>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (skin === "minimal") {
    return (
      <div>
        <main className="shell mx-auto max-w-md py-16 text-center">
          <CleanMedia image={main} className="mx-auto aspect-square max-w-xs" />
          <h1 className="headline mt-6 text-2xl">{name}</h1>
          <p className="mt-2 text-xl font-bold">{price(ctx.componentSeed)}</p>
          <p className="mt-4 text-sm opacity-80">{generateProductDescription(ctx, 0)}</p>
          <DeepLink link={makeLink(ctx, "buy", "Purchase")} className={`${page.styleRecipe.classes.button} mt-6 inline-block`} />
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      <PageChrome page={page} />
      <main className="shell py-6">
        <p className="mb-3 font-accent text-[11px] opacity-60">
          Home / {page.genreFormula.content} / <span className="opacity-90">{name}</span>
        </p>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-3">
            <CleanMedia image={main} className="aspect-square" />
            <div className="grid grid-cols-4 gap-2">
              {thumbs.map((t, i) => (
                <CleanMedia key={i} image={t} className="aspect-square ring-1 ring-[var(--page-border)]" />
              ))}
            </div>
          </div>
          <div className="grid h-fit gap-4">
            <div>
              <h1 className="headline text-3xl leading-tight">{name}</h1>
              <p className="mt-1 flex items-center gap-2 text-sm">
                <Stars seed={ctx.componentSeed} /> <span className="opacity-60">{r.int(4, 990)} reviews · {r.int(1, 40)} answered questions</span>
              </p>
            </div>
            <p className="text-3xl font-bold">{price(ctx.componentSeed)}</p>
            <p className="text-sm leading-6 opacity-85">{generateProductDescription(ctx, 0)}</p>
            <div className="grid gap-2">
              <label className="grid gap-1 text-sm">
                <span className="font-accent text-[11px] uppercase opacity-60">Variant</span>
                <select className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-transparent px-3 py-2">
                  {["Standard", "Quiet", "Previous", "Nearby"].map((o) => (
                    <option key={o}>{o} {page.motifs[0]}</option>
                  ))}
                </select>
              </label>
              <div className="flex items-center gap-3">
                <span className="font-accent text-[11px] uppercase opacity-60">Qty</span>
                <div className="flex items-center border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
                  <span className="px-3">−</span>
                  <span className="border-x-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-4">1</span>
                  <span className="px-3">+</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <DeepLink link={makeLink(ctx, "add", "Add to cart")} className={page.styleRecipe.classes.button} />
              <DeepLink link={makeLink(ctx, "buy", "Reserve now")} className={`${page.styleRecipe.classes.button} !bg-[var(--page-fg)] !text-[var(--page-bg)]`} />
            </div>
            <ul className="grid gap-1 text-xs opacity-70">
              {["Ships to your floor by tomorrow morning", "Returns accepted within previous", "Sold by a nearby guest"].map((b) => (
                <li key={b}>✓ {b}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pt-5">
          <div className="flex gap-5 font-accent text-sm">
            {["Description", "Specifications", "Reviews"].map((t, i) => (
              <span key={t} className={`pb-2 ${i === 0 ? "border-b-2 border-[var(--page-accent)] font-bold" : "opacity-60"}`}>{t}</span>
            ))}
          </div>
          <div className="mt-4 grid max-w-3xl gap-3 text-sm leading-7 opacity-90">
            {[0, 1].map((i) => (
              <p key={i}>{generateParagraph(ctx, i)}</p>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="headline mb-3 text-xl">Customers also viewed</h2>
          <div className="grid grid-flow-col gap-3 overflow-x-auto pb-2 [grid-auto-columns:minmax(160px,1fr)]">
            {Array.from({ length: 6 }).map((_, i) => {
              const c = contextForBlock(page, `also-${i}`);
              return (
                <A key={i} link={makeLink(c, `also-${i}`, "view")} className="grid gap-1 no-underline">
                  <CleanMedia image={selectImage(c, "product image")} className="aspect-square" />
                  <p className="line-clamp-2 text-xs font-semibold">{generateProductName(c, i)}</p>
                  <span className="text-xs font-bold">{price(c.componentSeed)}</span>
                </A>
              );
            })}
          </div>
        </div>
      </main>
      <ColumnsFooter page={page} />
    </div>
  );
}

/* ============================ docs ============================ */

function DocsLayout({ page }: P) {
  const ctx = contextForBlock(page, "docs");
  const skin = page.layoutSkin;
  const sections = ["Getting started", "Concepts", "Suites API", "Booking hooks", "Checkout", "Residue", "Troubleshooting"];
  const style = { "--page-font-accent": "var(--font-spacemono), monospace" } as CSSProperties;

  if (skin === "centered-toc") {
    return (
      <div style={style}>
        <header className="shell py-6 text-center">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} <span className="opacity-50">/ docs</span></a>
        </header>
        <main className="mx-auto max-w-2xl px-5 py-4">
          <h1 className="headline text-4xl leading-tight">{generateHeading(ctx)}</h1>
          <p className="mt-3 opacity-90">{page.subtitle}</p>
          <nav className="my-8 grid gap-1 border-y border-[var(--page-border)] py-4">
            {sections.map((s, i) => {
              const c = contextForBlock(page, `toc-${i}`);
              return (
                <DeepLink key={s} link={makeLink(c, `toc-${i}`, s)} className="py-1.5 text-sm font-medium hover:text-[var(--page-accent)]" />
              );
            })}
          </nav>
          {[0, 1, 2].map((i) => (
            <p key={i} className="mb-4 leading-7 opacity-90">{generateParagraph(ctx, i)}</p>
          ))}
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "api-reference") {
    const endpoints = createRng(ctx.componentSeed).int(5, 8);
    return (
      <div style={style}>
        <header className="border-b border-[var(--page-border)]">
          <div className="shell flex items-center justify-between py-3">
            <a href={siteHomeHref(page)} className="site-brand text-sm font-bold no-underline">API Reference</a>
            <span className="font-accent text-[10px] opacity-60">v{createRng(ctx.componentSeed).int(1, 9)}.0</span>
          </div>
        </header>
        <main className="shell grid gap-6 py-6 lg:grid-cols-[200px_1fr]">
          <aside className="hidden h-fit lg:block">
            {sections.map((s, i) => (
              <DeepLink key={s} link={makeLink(ctx, `api-sec-${i}`, s)} className="block py-1 text-sm opacity-75 hover:opacity-100" />
            ))}
          </aside>
          <div className="grid gap-4">
            {Array.from({ length: endpoints }).map((_, i) => {
              const c = contextForBlock(page, `ep-${i}`);
              const method = ["GET", "POST", "PUT", "DELETE"][createRng(c.componentSeed).int(0, 3)];
              return (
                <div key={i} className={page.styleRecipe.classes.panel}>
                  <p className="font-accent text-xs"><span className="rounded bg-[var(--page-accent)] px-1.5 py-0.5 text-white">{method}</span> /v1/{page.motifs[i % page.motifs.length] ?? "resource"}</p>
                  <p className="mt-2 text-sm">{generateProductDescription(c, i)}</p>
                </div>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "changelog") {
    const releases = createRng(ctx.componentSeed).int(4, 7);
    return (
      <div style={style}>
        <header className="shell py-6">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">changelog</a>
          <h1 className="headline mt-2 text-3xl">{page.title}</h1>
        </header>
        <main className="shell max-w-2xl pb-10">
          {Array.from({ length: releases }).map((_, i) => {
            const c = contextForBlock(page, `rel-${i}`);
            const vr = createRng(c.componentSeed);
            return (
              <article key={i} className="mb-8 border-l-2 border-[var(--page-accent)] pl-4">
                <p className="font-accent text-[11px] uppercase opacity-60">v{vr.int(1, 9)}.{vr.int(0, 9)}.{vr.int(0, 9)} · {vr.int(2020, 2025)}</p>
                <h2 className="headline mt-1 text-xl">{generateHeadline(c, i)}</h2>
                <ul className="mt-2 grid gap-1 text-sm opacity-85">
                  {[0, 1, 2].map((j) => (
                    <li key={j}>• {generateParagraph(c, j)}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <header className="sticky top-0 z-10 border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-4 py-2.5 md:px-8">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} <span className="opacity-50">/ docs</span></a>
          <input className="w-44 max-w-[45vw] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-transparent px-3 py-1 text-sm" placeholder="Search docs ⌘K" />
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-[1320px] gap-8 px-4 py-6 md:px-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,680px)_190px] xl:justify-center">
        <aside className="hidden h-fit min-w-0 lg:sticky lg:top-20 lg:block">
          {sections.map((s, i) => {
            const c = contextForBlock(page, `docs-sec-${i}`);
            return (
              <div key={s} className="mb-4">
                <p className="mb-1 font-accent text-[11px] uppercase opacity-60">{s}</p>
                <ul className="grid gap-1 border-l-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pl-3 text-sm">
                  {makeLinks(c, 4, `docs-${i}`).map((l, j) => (
                    <li key={l.id}>
                      <DeepLink link={l} className={`block truncate ${i === 0 && j === 0 ? "font-semibold text-[var(--page-accent)]" : "opacity-75 hover:opacity-100"}`} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </aside>

        <article className="min-w-0 max-w-[680px]">
          <p className="font-accent text-[11px] uppercase opacity-60">Concepts · v{createRng(ctx.componentSeed).int(1, 9)}.{createRng(ctx.componentSeed).int(0, 9)}</p>
          <h1 className="headline mt-1 max-w-[18ch] text-4xl leading-tight">{generateHeading(ctx)}</h1>
          <p className="mt-3 text-[1.02rem] leading-7 opacity-90">{page.subtitle}</p>
          <div className="my-5 rounded-[var(--radius-card)] border-l-4 border-[var(--page-accent)] bg-[var(--page-muted)]/40 p-3 text-sm">
            <span className="font-accent text-[11px] uppercase opacity-70">Note</span>
            <p className="mt-1">{generateHeadline(ctx, 0)}.</p>
          </div>
          {[0, 1].map((i) => (
            <p key={i} className="mb-4 leading-7 opacity-90">{generateParagraph(ctx, i)}</p>
          ))}
          <div className="my-4 max-w-full overflow-x-auto rounded-[var(--radius-card)] bg-[var(--page-fg)] p-4 font-accent text-sm text-[var(--page-bg)]">
            <pre className="whitespace-pre">{`GET /v1/${page.motifs[0] ?? "suites"}/${page.motifs[1] ?? "available"}
{
  "status": "remembered",
  "depth": ${page.routeState.depth},
  "checkout": "${page.genreFormula.action}"
}`}</pre>
          </div>
          {[2, 3].map((i) => (
            <p key={i} className="mb-4 leading-7 opacity-90">{generateParagraph(ctx, i)}</p>
          ))}
        </article>

        <aside className="hidden h-fit min-w-0 text-sm xl:sticky xl:top-20 xl:block">
          <p className="mb-2 font-accent text-[11px] uppercase opacity-60">On this page</p>
          <ul className="grid gap-1 border-l-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pl-3">
            {makeLinks(ctx, 5, "toc").map((l) => (
              <li key={l.id}>
                <DeepLink link={l} className="opacity-70 hover:opacity-100" />
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ link in bio ============================ */

function LinkInBioLayout({ page }: P) {
  const ctx = contextForBlock(page, "bio");
  const skin = page.layoutSkin;
  const avatar = selectImage(ctx, "profile/avatar");
  const buttons = makeLinks(ctx, createRng(ctx.componentSeed).int(5, 8), "bio-link");
  const emoji = ["✦", "☆", "♥", "▶", "✿", "◆", "☀", "✧"];

  if (skin === "grid-links") {
    return (
      <div className="min-h-screen bg-[var(--page-bg)]">
        <main className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-4 px-5 py-12 text-center">
          <div className="h-20 w-20 overflow-hidden rounded-[var(--radius-pill)]">
            <MediaFrame image={avatar} plain />
          </div>
          <h1 className="headline text-xl">@{(page.motifs[0] ?? "inbetween").replace(/\s+/g, "")}</h1>
          <div className="mt-2 grid w-full grid-cols-2 gap-2">
            {buttons.map((l, i) => (
              <A key={l.id} link={l} className={`${page.styleRecipe.classes.panel} flex items-center justify-center py-4 text-sm font-semibold no-underline hover:bg-[var(--page-accent)] hover:text-white`}>
                {l.label}
              </A>
            ))}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "hero-card") {
    const hero = selectImage(ctx, "hero background");
    return (
      <div className="min-h-screen">
        <CleanMedia image={hero} className="fixed inset-0 h-full opacity-25" rounded="" />
        <main className="relative mx-auto flex w-full max-w-[480px] flex-col items-center gap-4 px-5 py-16">
          <div className={`${page.styleRecipe.classes.panel} w-full grid gap-4 p-6 text-center backdrop-blur`}>
            <div className="mx-auto h-20 w-20 overflow-hidden rounded-[var(--radius-pill)] ring-2 ring-[var(--page-accent)]">
              <MediaFrame image={avatar} plain />
            </div>
            <h1 className="headline text-2xl">@{(page.motifs[0] ?? "inbetween").replace(/\s+/g, "")}</h1>
            <p className="text-sm opacity-80">{page.subtitle}</p>
            <div className="grid gap-2">
              {buttons.slice(0, 5).map((l, i) => (
                <A key={l.id} link={l} className={`${page.styleRecipe.classes.button} text-center no-underline`}>{l.label}</A>
              ))}
            </div>
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "minimal") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <div className="h-16 w-16 overflow-hidden rounded-[var(--radius-pill)]">
          <MediaFrame image={avatar} plain />
        </div>
        <h1 className="headline mt-4 text-lg">@{(page.motifs[0] ?? "inbetween").replace(/\s+/g, "")}</h1>
        <nav className="mt-6 grid gap-2">
          {buttons.map((l) => (
            <DeepLink key={l.id} link={l} className="text-sm underline underline-offset-4" />
          ))}
        </nav>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <main className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-4 px-5 py-12 text-center">
        <div className="h-24 w-24 overflow-hidden rounded-[var(--radius-pill)] ring-4 ring-[var(--page-accent)]">
          <MediaFrame image={avatar} plain />
        </div>
        <h1 className="headline text-2xl">@{(page.motifs[0] ?? "inbetween").replace(/\s+/g, "")}</h1>
        <p className="max-w-xs text-sm opacity-80">{page.subtitle}</p>
        <div className="flex gap-3 text-lg">
          {["✦", "☆", "▶", "✉"].map((s, i) => (
            <DeepLink key={i} link={makeLink(ctx, `social-${i}`, s)} className="grid h-9 w-9 place-items-center rounded-[var(--radius-pill)] bg-[var(--page-muted)]" />
          ))}
        </div>
        <div className="mt-2 grid w-full gap-3">
          {buttons.map((l, i) => (
            <A
              key={l.id}
              link={l}
              className="flex items-center gap-3 rounded-[var(--radius-pill)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[color-mix(in_srgb,var(--page-bg)_85%,white)] px-5 py-3.5 text-sm font-semibold no-underline shadow-[var(--shadow-button)] transition hover:translate-y-[-2px] hover:bg-[var(--page-accent)] hover:text-white"
            >
              <span className="text-lg">{emoji[i % emoji.length]}</span>
              <span className="flex-1 text-center">{l.label}</span>
              <span className="opacity-40">↗</span>
            </A>
          ))}
        </div>
      </main>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ guestbook ============================ */

function GuestbookLayout({ page }: P) {
  const ctx = contextForBlock(page, "guestbook");
  const skin = page.layoutSkin;
  const entries = createRng(ctx.componentSeed).int(6, 10);
  const flags = ["🇩🇪", "🇯🇵", "🇫🇷", "🇰🇷", "🇧🇷", "🇳🇱", "🇸🇪", "🌐"];
  const style = {
    fontFamily: "var(--font-vt323), monospace",
    "--page-font-headline": "var(--font-vt323), monospace"
  } as CSSProperties;

  if (skin === "threaded") {
    return (
      <div style={style} className="text-[17px]">
        <header className="bg-[var(--page-accent)] py-3 text-center text-white">
          <h1 className="headline text-3xl">~ guestbook threads ~</h1>
        </header>
        <main className="mx-auto max-w-[760px] px-4 py-6">
          {Array.from({ length: Math.min(entries, 5) }).map((_, i) => {
            const c = contextForBlock(page, `thread-${i}`);
            const r = createRng(c.componentSeed);
            const replies = r.int(1, 3);
            return (
              <div key={i} className="mb-4 border-2 border-[var(--page-border)] bg-white p-3 text-black">
                <p className="font-bold">{flags[r.int(0, flags.length - 1)]} guest_{r.int(100, 999)}</p>
                <p className="mt-2 leading-6">{generateParagraph(c, 0)}</p>
                <div className="mt-3 ml-4 border-l-2 border-dashed border-[var(--page-border)] pl-3">
                  {Array.from({ length: replies }).map((_, j) => {
                    const rc = contextForBlock(page, `reply-${i}-${j}`);
                    return (
                      <p key={j} className="mb-2 text-sm leading-5 opacity-90">↳ {generateParagraph(rc, 0)}</p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (skin === "mosaic") {
    return (
      <div style={style}>
        <header className="py-4 text-center">
          <h1 className="headline text-2xl">sign the wall</h1>
        </header>
        <main className="shell columns-2 gap-4 pb-8 sm:columns-3">
          {Array.from({ length: entries }).map((_, i) => {
            const c = contextForBlock(page, `mosaic-${i}`);
            const r = createRng(c.componentSeed);
            return (
              <div key={i} className="mb-3 break-inside-avoid border-2 border-[var(--page-border)] bg-[#ffffcc] p-2 text-black" style={{ transform: `rotate(${r.int(-3, 3)}deg)` }}>
                <p className="text-sm leading-5">{generateParagraph(c, 0)}</p>
                <p className="mt-1 text-xs opacity-60">— guest_{r.int(10, 99)}</p>
              </div>
            );
          })}
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (skin === "wall") {
    return (
      <div style={style} className="min-h-screen bg-[var(--page-muted)]/30">
        <header className="shell py-4 text-center">
          <h1 className="headline text-3xl">the wall</h1>
          <p className="text-sm opacity-70">{page.subtitle}</p>
        </header>
        <main className="shell grid gap-2 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: entries }).map((_, i) => {
            const c = contextForBlock(page, `wall-${i}`);
            const r = createRng(c.componentSeed);
            return (
              <div key={i} className="border-2 border-[var(--page-border)] bg-white p-3 text-black">
                <p className="text-xs opacity-60">{r.int(1998, 2009)}</p>
                <p className="mt-1 leading-6">{generateParagraph(c, 0)}</p>
                <p className="mt-2 font-bold">{flags[r.int(0, flags.length - 1)]} guest_{r.int(100, 999)}</p>
              </div>
            );
          })}
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style} className="text-[17px]">
      <header className="bg-[var(--page-accent)] py-3 text-center text-white">
        <h1 className="headline text-3xl">~ sign my guestbook ~</h1>
        <p className="font-accent text-sm opacity-90">{page.genreFormula.surface} · since {createRng(ctx.componentSeed).int(1998, 2005)}</p>
      </header>
      <main className="mx-auto grid w-full max-w-[760px] gap-4 px-4 py-6">
        <form action={makeLink(ctx, "sign").href} className="grid gap-2 border-2 border-[var(--page-border)] bg-[var(--page-muted)]/50 p-4">
          <p className="font-bold underline">Leave a message:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">Name <input className="border-2 border-[var(--page-border)] bg-white px-2 py-1 text-black" /></label>
            <label className="grid gap-1 text-sm">{generateFormLabel(ctx, 0)} <input className="border-2 border-[var(--page-border)] bg-white px-2 py-1 text-black" /></label>
          </div>
          <label className="grid gap-1 text-sm">Message <textarea rows={3} className="border-2 border-[var(--page-border)] bg-white px-2 py-1 text-black" /></label>
          <button className="justify-self-start border-2 border-[var(--page-border)] bg-[var(--page-accent)] px-4 py-1 font-bold text-white">Sign it!</button>
        </form>

        <div className="grid gap-3">
          {Array.from({ length: entries }).map((_, i) => {
            const c = contextForBlock(page, `entry-${i}`);
            const r = createRng(c.componentSeed);
            return (
              <div key={i} className="border-2 border-[var(--page-border)] bg-white p-3 text-black">
                <p className="flex items-center justify-between border-b border-dashed border-[var(--page-border)] pb-1 text-sm">
                  <span className="font-bold">{flags[r.int(0, flags.length - 1)]} guest_{r.int(100, 999)}</span>
                  <span className="opacity-60">{r.int(1998, 2009)}-{String(r.int(1, 12)).padStart(2, "0")}-{String(r.int(1, 28)).padStart(2, "0")}</span>
                </p>
                <p className="mt-2 leading-6">{generateParagraph(c, 0)}</p>
                <p className="mt-1 text-sm opacity-60">— posted from {page.languageBlend.contamination}</p>
              </div>
            );
          })}
        </div>
      </main>
      <OldWebFooter page={page} />
    </div>
  );
}

/* ============================ social feed ============================ */

function FeedPost({ page, id }: P & { id: string }) {
  const ctx = contextForBlock(page, id);
  const r = createRng(ctx.componentSeed);
  const avatar = selectImage(ctx, "profile/avatar");
  const showMedia = r.bool(0.55);
  const media = selectImage({ ...ctx, componentSeed: `${ctx.componentSeed}:media` }, showMedia ? "news thumbnail" : "product image");
  const author = `guest_${r.int(100, 9999)}`;
  const reactions = ["♥", "↻", "✉", "☆"];
  return (
    <article className={`${page.styleRecipe.classes.panel} grid gap-3`}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--page-muted)]">
          <MediaFrame image={avatar} plain />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">@{author}</p>
          <p className="font-accent text-[11px] opacity-60">{views(ctx.componentSeed)} · {page.genreFormula.content}</p>
        </div>
        <span className="font-accent text-[11px] opacity-50">{page.motifs[r.int(0, page.motifs.length - 1)] ?? "feed"}</span>
      </div>
      <p className="text-[15px] leading-6">{generateParagraph(ctx, 0)}</p>
      {showMedia && <CleanMedia image={media} className="aspect-[16/10]" />}
      <div className="flex items-center justify-between border-t-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pt-2 font-accent text-xs opacity-70">
        <div className="flex gap-4">
          {reactions.map((icon, i) => (
            <DeepLink key={i} link={makeLink(ctx, `react-${i}`, icon)} className="hover:text-[var(--page-accent)]" />
          ))}
        </div>
        <span>{r.int(0, 404)} comments · {r.int(1, 99)} shares</span>
      </div>
    </article>
  );
}

function SocialFeedLayout({ page }: P) {
  const ctx = contextForBlock(page, "social");
  const nav = ["Home", "Explore", "Notifications", "Messages", "Bookmarks"];
  const style = { fontFamily: "var(--font-manrope), system-ui, sans-serif" } as CSSProperties;

  if (page.layoutSkin === "single-column") {
    return (
      <div style={style} className="min-h-screen">
        <header className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
          <div className="shell flex items-center justify-between py-3">
            <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} feed</a>
            <DeepLink link={makeLink(ctx, "post", "Compose")} className={page.styleRecipe.classes.button} />
          </div>
        </header>
        <main className="mx-auto max-w-xl px-4 py-5">
          <InfiniteSocialFeed page={page} variant="feed" className="h-[calc(100vh-150px)]" />
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "masonry") {
    return (
      <div style={style} className="min-h-screen">
        <MiniHeader page={page} links={4} />
        <main className="shell py-5">
          <InfiniteSocialFeed page={page} variant="compact" className="h-[calc(100vh-125px)]" />
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "media-first") {
    return (
      <div style={style} className="min-h-screen bg-black text-white">
        <header className="shell flex items-center justify-between py-3">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline text-white">{displayBrand(page)}</a>
          <DeepLink link={makeLink(ctx, "post", "Post")} className={page.styleRecipe.classes.button} />
        </header>
        <main>
          <InfiniteSocialFeed page={page} variant="media-grid" className="h-[calc(100vh-64px)]" />
        </main>
      </div>
    );
  }

  return (
    <div style={style} className="min-h-screen">
      <header className="sticky top-0 z-20 border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)]/90 backdrop-blur">
        <div className="shell flex items-center justify-between py-2.5">
          <a href={siteHomeHref(page)} className="site-brand headline text-xl lowercase no-underline">{displayBrand(page)}</a>
          <input className="hidden w-72 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]/40 px-3 py-1.5 text-sm md:block" placeholder={`Search ${page.motifs[0] ?? "feed"}`} />
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-pill)] bg-[var(--page-accent)] text-xs text-white">{(page.languageBlend.primary[0] ?? "G").toUpperCase()}</span>
          </div>
        </div>
      </header>

      <div className="shell grid gap-[var(--gap-grid)] py-5 lg:grid-cols-[210px_minmax(0,1fr)_280px]">
        <aside className="hidden h-fit lg:block">
          <nav className="grid gap-1">
            {nav.map((label, i) => (
              <DeepLink key={label} link={makeLink(ctx, `nav-${i}`, label)} className={`rounded-[var(--radius-input)] px-3 py-2 text-sm ${i === 0 ? "bg-[var(--page-muted)] font-semibold" : "opacity-75 hover:bg-[var(--page-muted)]/50"}`} />
            ))}
          </nav>
          <DeepLink link={makeLink(ctx, "post", "New post")} className={`${page.styleRecipe.classes.button} mt-4 w-full text-center`} />
        </aside>

        <main className="min-w-0 grid gap-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const c = contextForBlock(page, `story-${i}`);
              const img = selectImage(c, "profile/avatar");
              return (
                <div key={i} className="grid shrink-0 place-items-center gap-1">
                  <div className="rounded-[var(--radius-pill)] p-[2px] ring-2 ring-[var(--page-accent)]">
                    <div className="h-14 w-14 overflow-hidden rounded-[var(--radius-pill)]">
                      <MediaFrame image={img} plain />
                    </div>
                  </div>
                  <span className="max-w-[56px] truncate font-accent text-[10px] opacity-70">guest_{createRng(c.componentSeed).int(10, 99)}</span>
                </div>
              );
            })}
          </div>
          <InfiniteSocialFeed page={page} variant="feed" includeComposer />
        </main>

        <aside className="hidden h-fit lg:grid lg:gap-4">
          <div className={page.styleRecipe.classes.panel}>
            <p className="mb-2 font-accent text-[11px] uppercase opacity-60">Trending in {page.genreFormula.residue}</p>
            <ul className="grid gap-2">
              {makeLinks(ctx, 5, "trend").map((l, i) => (
                <li key={l.id}>
                  <DeepLink link={l} className="block text-sm font-semibold hover:underline" />
                  <span className="font-accent text-[11px] opacity-50">{createRng(`${ctx.componentSeed}:t${i}`).int(1, 99)}K posts</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={page.styleRecipe.classes.intrusionPanel}>
            <p className="font-accent text-[11px] uppercase">Who to follow</p>
            <ul className="mt-2 grid gap-2 text-sm">
              {makeLinks(ctx, 3, "follow").map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2">
                  <DeepLink link={l} className="truncate hover:underline" />
                  <span className={page.styleRecipe.classes.tag}>Follow</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      <ColumnsFooter page={page} />
    </div>
  );
}

/* ============================ short video ============================ */

function ShortTile({ page, id }: P & { id: string }) {
  const ctx = contextForBlock(page, id);
  const image = selectImage(ctx, "video thumbnail");
  const link = makeLink(ctx, id, generateProductName(ctx, 0));
  const r = createRng(ctx.componentSeed);
  const actions = ["♥", "💬", "↻", "☆"];
  return (
    <div className="relative grid aspect-[9/16] max-h-[85vh] overflow-hidden rounded-[var(--radius-card)] bg-black">
      <GuaranteedVideoMedia image={image} className="absolute inset-0 h-full" rounded="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      <div className="absolute bottom-0 left-0 right-12 p-4 text-white">
        <p className="font-semibold">@{`creator_${r.int(100, 999)}`}</p>
        <p className="mt-1 line-clamp-2 text-sm opacity-90">{generateParagraph(ctx, 0)}</p>
        <p className="mt-2 font-accent text-[11px] opacity-70">♫ {page.motifs[0] ?? "ambient checkout"} · {views(ctx.componentSeed)}</p>
      </div>
      <div className="absolute bottom-4 right-2 grid gap-4 text-center text-white">
        {actions.map((a, i) => {
          const actionLink = makeLink(ctx, `act-${i}`, a);
          return (
            <A key={i} link={actionLink} className="grid gap-0.5 text-lg no-underline">
              <span>{a}</span>
              <span className="font-accent text-[10px]">{r.int(0, 9999)}</span>
            </A>
          );
        })}
      </div>
      <A link={link} className="absolute inset-0" aria-label={link.label}>
        <span className="sr-only">{link.label}</span>
      </A>
    </div>
  );
}

function ShortVideoLayout({ page }: P) {
  const ctx = contextForBlock(page, "shorts");
  const tabs = ["For You", "Following", "Nearby", page.genreFormula.content, "Live"];
  const style = { fontFamily: "var(--font-sora), system-ui, sans-serif" } as CSSProperties;

  if (page.layoutSkin === "theater") {
    return (
      <div style={style} className="min-h-screen bg-black text-white">
        <header className="shell flex items-center justify-between py-3">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline text-white">{displayBrand(page)} ▶</a>
          <DeepLink link={makeLink(ctx, "upload", "Upload")} className={page.styleRecipe.classes.button} />
        </header>
        <main className="shell grid gap-4 py-4 lg:grid-cols-[1fr_320px]">
          <ShortTile page={page} id="short-featured" />
          <aside>
            <InfiniteShortVideoFeed page={page} variant="discover" className="h-[calc(100vh-120px)] min-h-[520px]" />
          </aside>
        </main>
      </div>
    );
  }

  if (page.layoutSkin === "reel-scroll") {
    return (
      <div style={style} className="min-h-screen bg-black text-white">
        <header className="absolute left-0 right-0 top-0 z-10 shell flex items-center justify-between py-3">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline text-white">{displayBrand(page)} ▶</a>
        </header>
        <main className="mx-auto max-w-md py-16">
          <InfiniteShortVideoFeed page={page} variant="reel" className="h-[calc(100vh-128px)]" />
        </main>
      </div>
    );
  }

  if (page.layoutSkin === "discover-tabs") {
    return (
      <div style={style}>
        <header className="sticky top-0 z-20 border-b border-[var(--page-border)] bg-[var(--page-bg)]/90 backdrop-blur">
          <div className="shell py-2">
            <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">discover</a>
            <div className="mt-2 flex gap-1 overflow-x-auto">
              {tabs.map((t, i) => (
                <DeepLink key={t} link={makeLink(ctx, `disc-${i}`, t)} className={`whitespace-nowrap rounded-[var(--radius-pill)] px-3 py-1 text-xs ${i === 0 ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : "opacity-70"}`} />
              ))}
            </div>
          </div>
        </header>
        <main className="shell py-4">
          <InfiniteShortVideoFeed page={page} variant="discover" className="h-[calc(100vh-125px)]" />
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style} className="min-h-screen bg-[color-mix(in_srgb,var(--page-bg)_80%,black)]">
      <header className="sticky top-0 z-20 border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)]/85 backdrop-blur">
        <div className="shell flex items-center justify-between py-2">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} ▶</a>
          <div className="flex gap-1 overflow-x-auto font-accent text-[11px] uppercase">
            {tabs.map((t, i) => (
              <DeepLink key={t} link={makeLink(ctx, `tab-${i}`, t)} className={`whitespace-nowrap rounded-[var(--radius-pill)] px-3 py-1 ${i === 0 ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : "opacity-70"}`} />
            ))}
          </div>
        </div>
      </header>
      <main className="shell py-4">
        <p className="mb-4 text-center text-sm opacity-70">{page.subtitle}</p>
        <InfiniteShortVideoFeed page={page} variant="grid" className="mx-auto max-w-[1200px]" />
        <p className="mt-6 text-center font-accent text-xs opacity-50">{generateLoadingMessage(ctx)} · swipe for more {page.motifs[1] ?? "rooms"}</p>
      </main>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ finance ============================ */

function FinanceLayout({ page }: P) {
  const ctx = contextForBlock(page, "finance");
  const r = createRng(ctx.componentSeed);
  const tickers = Array.from({ length: 6 }).map((_, i) => {
    const c = contextForBlock(page, `ticker-${i}`);
    const change = r.int(-12, 18);
    return { label: generateProductName(c, i).slice(0, 12).toUpperCase(), change, price: price(c.componentSeed) };
  });
  const style = { "--page-font-accent": "var(--font-spacemono), monospace" } as CSSProperties;

  if (page.layoutSkin === "terminal") {
    return (
      <div style={style} className="min-h-screen bg-[#0a0a0a] font-mono text-green-400">
        <div className="overflow-hidden border-b border-green-900 px-4 py-1 text-xs">
          {tickers.map((t, i) => (
            <span key={i} className="mr-6">
              {t.label} {t.price}{" "}
              <span className={t.change >= 0 ? "text-green-300" : "text-red-400"}>
                {t.change >= 0 ? "+" : ""}{t.change}%
              </span>
            </span>
          ))}
        </div>
        <main className="shell grid gap-4 py-6 lg:grid-cols-2">
          <pre className="overflow-auto rounded border border-green-900 bg-black/50 p-4 text-xs leading-relaxed">
            {`> ${generateHeading(ctx)}\n> ${page.subtitle}\n\n`}
            {Array.from({ length: 12 }).map((_, i) => {
              const c = contextForBlock(page, `term-${i}`);
              const l = makeLink(c, `term-${i}`, generateProductName(c, i));
              const tr = createRng(c.componentSeed);
              return `${l.label.padEnd(16)} ${price(c.componentSeed).padStart(10)} ${tr.bool() ? "+" : "-"}${tr.int(1, 9)}%\n`;
            }).join("")}
          </pre>
          <div className="grid gap-3">
            {["BUY", "SELL", "HOLD"].map((action, i) => (
              <DeepLink key={action} link={makeLink(ctx, `trade-${i}`, action)} className="block border border-green-700 px-4 py-3 text-center hover:bg-green-950" />
            ))}
            <p className="text-xs opacity-60">{generateLoadingMessage(ctx)}</p>
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "watchlist") {
    return (
      <div style={style}>
        <MiniHeader page={page} links={4} />
        <main className="shell max-w-2xl py-6">
          <h1 className="headline text-2xl">Watchlist</h1>
          <ul className="mt-4 grid gap-0 divide-y divide-[var(--page-border)]">
            {tickers.map((t, i) => {
              const c = contextForBlock(page, `watch-${i}`);
              const l = makeLink(c, `watch-${i}`, t.label);
              return (
                <li key={i} className="flex items-center justify-between py-3">
                  <DeepLink link={l} className="font-semibold hover:underline" />
                  <span>{t.price}</span>
                  <span className={`font-accent text-xs ${t.change >= 0 ? "text-[var(--page-accent)]" : "text-[var(--page-danger)]"}`}>{t.change >= 0 ? "+" : ""}{t.change}%</span>
                </li>
              );
            })}
          </ul>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (page.layoutSkin === "news-heavy") {
    return (
      <div style={style}>
        <div className="overflow-hidden border-b border-[var(--page-border)] bg-[var(--page-fg)] text-[var(--page-bg)]">
          <div className="flex gap-6 overflow-x-auto px-4 py-1 font-accent text-xs whitespace-nowrap">
            {tickers.map((t, i) => <span key={i}>{t.label} {t.price}</span>)}
          </div>
        </div>
        <main className="shell grid gap-6 py-6 lg:grid-cols-[1fr_300px]">
          <div>
            <h1 className="headline mb-4 text-2xl">{generateHeading(ctx)}</h1>
            <div className="grid gap-4">
              {makeLinks(ctx, 8, "fnews").map((l, i) => (
                <article key={l.id} className="border-b border-[var(--page-border)] pb-3">
                  <h2 className="font-semibold"><DeepLink link={{ ...l, label: generateHeadline(ctx, i) }} className="hover:underline" /></h2>
                  <p className="mt-1 line-clamp-2 text-sm opacity-75">{generateProductDescription(ctx, i)}</p>
                </article>
              ))}
            </div>
          </div>
          <aside className={page.styleRecipe.classes.panel}>
            <p className="font-accent text-[11px] uppercase opacity-60">Markets</p>
            <ul className="mt-2 grid gap-2 text-sm">
              {tickers.map((t, i) => (
                <li key={i} className="flex justify-between"><span>{t.label}</span><span className={t.change >= 0 ? "text-[var(--page-accent)]" : "text-[var(--page-danger)]"}>{t.change}%</span></li>
              ))}
            </ul>
          </aside>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <div className="overflow-hidden border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-fg)] text-[var(--page-bg)]">
        <div className="flex gap-8 overflow-x-auto px-4 py-1.5 font-accent text-xs whitespace-nowrap">
          {tickers.map((t, i) => (
            <span key={i}>
              {t.label} {t.price}{" "}
              <span className={t.change >= 0 ? "text-green-400" : "text-red-400"}>
                {t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change)}%
              </span>
            </span>
          ))}
        </div>
      </div>
      <MiniHeader page={page} links={4} />
      <main className="shell grid gap-[var(--gap-grid)] py-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-[var(--gap-grid)]">
          <div className="grid gap-3 sm:grid-cols-3">
            {["Portfolio", "Available cash", "Pending checkout"].map((label, i) => {
              const mr = createRng(`${ctx.componentSeed}:m${i}`);
              return (
                <div key={label} className={page.styleRecipe.classes.panel}>
                  <p className="font-accent text-[11px] uppercase opacity-60">{label}</p>
                  <p className="mt-1 text-2xl font-semibold">{price(`${ctx.componentSeed}:m${i}`)}</p>
                  <p className={`mt-1 text-xs ${mr.bool() ? "text-[var(--page-accent)]" : "text-[var(--page-danger)]"}`}>
                    {mr.bool() ? "▲" : "▼"} {mr.int(1, 24)}% {page.motifs[i] ?? "today"}
                  </p>
                </div>
              );
            })}
          </div>
          <div className={page.styleRecipe.classes.panel}>
            <h2 className="mb-3 font-semibold">{generateHeading(ctx)}</h2>
            <div className="flex h-36 items-end gap-1">
              {Array.from({ length: 20 }).map((_, i) => {
                const h = r.int(10, 100);
                return <div key={i} className="flex-1 rounded-t-[2px] bg-[var(--page-accent)]" style={{ height: `${h}%`, opacity: 0.4 + h / 200 }} />;
              })}
            </div>
          </div>
          <div className={page.styleRecipe.classes.panel}>
            <h2 className="mb-2 font-semibold">Holdings</h2>
            <div className="overflow-hidden rounded-[var(--radius-card)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
              {Array.from({ length: 6 }).map((_, i) => {
                const c = contextForBlock(page, `hold-${i}`);
                const l = makeLink(c, `hold-${i}`, generateProductName(c, i));
                const hr = createRng(c.componentSeed);
                return (
                  <div key={i} className="flex items-center justify-between border-t-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-3 py-2 text-sm first:border-t-0">
                    <DeepLink link={l} className="font-semibold hover:underline" />
                    <span>{price(c.componentSeed)}</span>
                    <span className={`font-accent text-xs ${hr.bool() ? "text-[var(--page-accent)]" : "text-[var(--page-danger)]"}`}>{hr.bool() ? "+" : "−"}{hr.int(1, 15)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <aside className="grid h-fit gap-4">
          <div className={page.styleRecipe.classes.intrusionPanel}>
            <p className="font-accent text-[11px] uppercase">Market news</p>
            <ul className="mt-2 grid gap-2 text-sm">
              {makeLinks(ctx, 5, "mnews").map((l, i) => (
                <li key={l.id}>
                  <DeepLink link={{ ...l, label: generateHeadline(ctx, i) }} className="hover:underline" />
                </li>
              ))}
            </ul>
          </div>
          <DeepLink link={makeLink(ctx, "trade", generateButtonLabel(ctx))} className={`${page.styleRecipe.classes.button} w-full text-center`} />
        </aside>
      </main>
      <ColumnsFooter page={page} />
    </div>
  );
}

/* ============================ education ============================ */

function EducationLayout({ page }: P) {
  const ctx = contextForBlock(page, "learn");
  const skin = page.layoutSkin;
  const courses = createRng(ctx.componentSeed).int(6, 9);
  const style = { fontFamily: "var(--font-worksans), system-ui, sans-serif" } as CSSProperties;

  if (skin === "dashboard") {
    return (
      <div style={style} className="grid min-h-screen md:grid-cols-[220px_1fr]">
        <aside className="border-r border-[var(--page-border)] bg-[var(--page-muted)]/30 p-4">
          <a href={siteHomeHref(page)} className="site-brand headline text-sm lowercase no-underline">academy</a>
          {["Dashboard", "Courses", "Progress", "Certificates"].map((s, i) => (
            <DeepLink key={s} link={makeLink(ctx, `dash-${i}`, s)} className={`mt-2 block rounded px-3 py-2 text-sm ${i === 0 ? "bg-[var(--page-accent)] text-white" : "opacity-75"}`} />
          ))}
        </aside>
        <main className="grid gap-4 p-5">
          <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Courses enrolled", "Hours watched", "Certificates"].map((m, i) => (
              <div key={m} className={page.styleRecipe.classes.panel}>
                <p className="font-accent text-[10px] uppercase opacity-60">{m}</p>
                <p className="text-2xl font-semibold">{createRng(`${ctx.componentSeed}:ed${i}`).int(1, 99)}</p>
              </div>
            ))}
          </div>
          <p className="text-sm opacity-80">{page.subtitle}</p>
        </main>
      </div>
    );
  }

  if (skin === "lesson-player") {
    const lesson = contextForBlock(page, "lesson");
    return (
      <div style={style}>
        <MiniHeader page={page} links={3} />
        <main className="shell grid gap-4 py-5 lg:grid-cols-[1fr_280px]">
          <div>
            <CleanMedia image={selectImage(lesson, "video thumbnail")} className="aspect-video" motion />
            <h1 className="headline mt-4 text-2xl">{page.title}</h1>
            <p className="mt-2 opacity-80">{generateParagraph(lesson, 0)}</p>
          </div>
          <aside className="grid h-fit gap-2">
            {Array.from({ length: 6 }).map((_, i) => {
              const c = contextForBlock(page, `lesson-${i}`);
              const l = makeLink(c, `lesson-${i}`, `Lesson ${i + 1}: ${generateProductName(c, i)}`);
              return (
                <DeepLink key={i} link={l} className={`rounded px-3 py-2 text-sm ${i === 0 ? "bg-[var(--page-muted)] font-semibold" : "opacity-75 hover:bg-[var(--page-muted)]/50"}`} />
              );
            })}
          </aside>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "syllabus") {
    const modules = createRng(ctx.componentSeed).int(4, 6);
    return (
      <div style={style}>
        <header className="shell border-b border-[var(--page-border)] py-6">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} academy</a>
          <h1 className="headline mt-2 text-3xl">{page.title}</h1>
          <p className="mt-1 opacity-80">{page.subtitle}</p>
        </header>
        <main className="shell max-w-2xl py-6">
          {Array.from({ length: modules }).map((_, i) => {
            const c = contextForBlock(page, `mod-${i}`);
            const items = makeLinks(c, 4, `mod-item-${i}`);
            return (
              <section key={i} className="mb-6">
                <h2 className="headline text-lg">Module {i + 1}: {generateProductName(c, i)}</h2>
                <ul className="mt-2 grid gap-1 pl-4">
                  {items.map((l) => (
                    <li key={l.id} className="text-sm"><DeepLink link={l} className="hover:underline" /></li>
                  ))}
                </ul>
              </section>
            );
          })}
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <header className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-accent)] text-white">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-4">
          <a href={siteHomeHref(page)} className="site-brand headline text-2xl lowercase no-underline">{displayBrand(page)} academy</a>
          <form action={makeLink(ctx, "search").href} className="flex">
            <input className="min-w-[200px] border-0 px-3 py-1.5 text-sm text-black" placeholder="Search courses, tabs, suites" />
            <button className="bg-[var(--page-fg)] px-4 text-sm text-[var(--page-bg)]">Search</button>
          </form>
        </div>
      </header>
      <main className="shell grid gap-[var(--gap-grid)] py-6 lg:grid-cols-[240px_1fr]">
        <aside className="grid h-fit gap-3">
          {["My learning", "Wishlist", "Categories", "Instructors"].map((s, i) => (
            <DeepLink key={s} link={makeLink(ctx, `side-${i}`, s)} className={`rounded-[var(--radius-input)] px-3 py-2 text-sm ${i === 0 ? "bg-[var(--page-muted)] font-semibold" : "opacity-75 hover:bg-[var(--page-muted)]/50"}`} />
          ))}
          <div className={page.styleRecipe.classes.intrusionPanel}>
            <p className="text-sm font-semibold">Progress</p>
            <div className="mt-2 h-2 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--page-muted)]">
              <div className="h-full bg-[var(--page-accent)]" style={{ width: `${createRng(ctx.componentSeed).int(12, 78)}%` }} />
            </div>
            <p className="mt-1 font-accent text-[11px] opacity-60">{page.motifs[0] ?? "checkout"} module · {createRng(ctx.componentSeed).int(2, 11)} of 12</p>
          </div>
        </aside>
        <div>
          <h1 className="headline text-3xl">{generateHeading(ctx)}</h1>
          <p className="mt-1 opacity-80">{page.subtitle}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: courses }).map((_, i) => {
              const c = contextForBlock(page, `course-${i}`);
              const l = makeLink(c, `course-${i}`, generateProductName(c, i));
              const cr = createRng(c.componentSeed);
              return (
                <A key={i} link={l} className={`${page.styleRecipe.classes.panel} grid gap-2 no-underline transition hover:shadow-[var(--shadow-card)]`}>
                  <CleanMedia image={selectImage(c, "video thumbnail")} className="aspect-video" />
                  <h3 className="line-clamp-2 font-semibold leading-tight">{l.label}</h3>
                  <p className="line-clamp-2 text-xs opacity-70">{generateProductDescription(c, i)}</p>
                  <div className="flex items-center justify-between font-accent text-[11px] opacity-60">
                    <Stars seed={c.componentSeed} />
                    <span>{cr.int(1, 40)}h · {price(c.componentSeed)}</span>
                  </div>
                </A>
              );
            })}
          </div>
        </div>
      </main>
      <ColumnsFooter page={page} />
    </div>
  );
}

/* ============================ health ============================ */

function HealthLayout({ page }: P) {
  const ctx = contextForBlock(page, "health");
  const skin = page.layoutSkin;
  const r = createRng(ctx.componentSeed);
  const style = { fontFamily: "var(--font-nunito), system-ui, sans-serif" } as CSSProperties;

  if (skin === "magazine") {
    const articles = createRng(ctx.componentSeed).int(4, 6);
    return (
      <div style={style}>
        <header className="shell border-b border-[var(--page-border)] py-6 text-center">
          <a href={siteHomeHref(page)} className="site-brand headline text-3xl lowercase no-underline">wellness</a>
          <p className="mt-1 text-sm opacity-70">{page.genreFormula.content}</p>
        </header>
        <main className="shell py-6">
          <article className="mb-8">
            <CleanMedia image={selectImage(ctx, "blog image")} className="aspect-[21/9]" />
            <h1 className="headline mt-4 text-3xl">{page.title}</h1>
            <p className="mt-3 text-lg leading-8">{generateParagraph(ctx, 0)}</p>
          </article>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: articles }).map((_, i) => {
              const c = contextForBlock(page, `health-art-${i}`);
              const l = makeLink(c, `health-art-${i}`, generateHeadline(c, i));
              return (
                <article key={i}>
                  <CleanMedia image={selectImage(c, "news thumbnail")} className="mb-2 aspect-[4/3]" />
                  <h2 className="font-semibold"><DeepLink link={l} className="hover:underline" /></h2>
                </article>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "tracker") {
    const metrics = ["Steps", "Sleep", "Heart rate", "Hydration", "Mood", "Calories"];
    return (
      <div style={style}>
        <MiniHeader page={page} links={3} center />
        <main className="shell max-w-lg py-8">
          <h1 className="headline text-center text-2xl">{page.title}</h1>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {metrics.map((m, i) => {
              const mr = createRng(`${ctx.componentSeed}:tr${i}`);
              return (
                <div key={m} className={`${page.styleRecipe.classes.panel} text-center`}>
                  <p className="font-accent text-[10px] uppercase opacity-60">{m}</p>
                  <p className="mt-1 text-2xl font-semibold">{mr.int(1, 999)}{i === 1 ? "h" : i === 2 ? " bpm" : ""}</p>
                </div>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "clinic-list") {
    const clinics = createRng(ctx.componentSeed).int(5, 8);
    return (
      <div style={style}>
        <header className="shell py-5">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">find care</a>
          <form action={makeLink(ctx, "search").href} className="mt-3 flex max-w-lg">
            <input className="min-w-0 flex-1 border border-[var(--page-border)] px-3 py-2 text-sm" placeholder="Search clinics near checkout" />
            <button className={page.styleRecipe.classes.button}>Search</button>
          </form>
        </header>
        <main className="shell max-w-2xl pb-8">
          <ul className="grid gap-3">
            {Array.from({ length: clinics }).map((_, i) => {
              const c = contextForBlock(page, `clinic-${i}`);
              const l = makeLink(c, `clinic-${i}`, generateProductName(c, i));
              return (
                <li key={i}>
                  <A link={l} className={`${page.styleRecipe.classes.panel} flex gap-4 no-underline`}>
                    <CleanMedia image={selectImage(c, "product image")} className="h-16 w-16 shrink-0" />
                    <div>
                      <p className="font-semibold">{l.label}</p>
                      <p className="text-xs opacity-70">{generateProductDescription(c, i)}</p>
                      <Stars seed={c.componentSeed} />
                    </div>
                  </A>
                </li>
              );
            })}
          </ul>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <MiniHeader page={page} links={4} center />
      <main className="shell grid gap-[var(--gap-grid)] py-8 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-[var(--gap-grid)]">
          <section className={`${page.styleRecipe.classes.panel} grid gap-3 sm:grid-cols-[1fr_auto]`}>
            <div>
              <p className="font-accent text-[11px] uppercase opacity-60">Today's wellness</p>
              <h1 className="headline mt-1 text-3xl">{page.title}</h1>
              <p className="mt-2 opacity-80">{page.subtitle}</p>
            </div>
            <div className="grid h-fit grid-cols-3 gap-3 text-center">
              {[["Steps", r.int(200, 8000)], ["Sleep", `${r.int(4, 9)}h`], ["Mood", page.motifs[0] ?? "quiet"]].map(([label, val]) => (
                <div key={label as string} className="rounded-[var(--radius-card)] bg-[var(--page-muted)]/60 px-3 py-2">
                  <p className="font-accent text-[10px] uppercase opacity-60">{label}</p>
                  <p className="text-lg font-semibold">{val}</p>
                </div>
              ))}
            </div>
          </section>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => {
              const c = contextForBlock(page, `appt-${i}`);
              const l = makeLink(c, `appt-${i}`, generateHeadline(c, i));
              return (
                <div key={i} className={page.styleRecipe.classes.panel}>
                  <p className="font-accent text-[11px] uppercase opacity-60">{generateFormLabel(c, i)}</p>
                  <h3 className="mt-1 font-semibold"><DeepLink link={l} className="hover:underline" /></h3>
                  <p className="mt-1 text-sm opacity-75">{generateProductDescription(c, i)}</p>
                  <DeepLink link={makeLink(c, `book-${i}`, "Book")} className={`${page.styleRecipe.classes.button} mt-3 inline-block text-xs`} />
                </div>
              );
            })}
          </div>
        </div>
        <aside className="grid h-fit gap-4">
          <form action={makeLink(ctx, "checkin").href} className={`${page.styleRecipe.classes.panel} grid gap-2`}>
            <p className="font-semibold">Quick check-in</p>
            {["Preferred hallway", "Number of guests", "Symptoms (optional)"].map((f, i) => (
              <label key={f} className="grid gap-1 text-sm">
                <span className="font-accent text-[11px] uppercase opacity-60">{f}</span>
                <input className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-transparent px-3 py-1.5" defaultValue={i === 2 ? "" : page.motifs[i] ?? "available"} />
              </label>
            ))}
            <button className={page.styleRecipe.classes.button}>Submit to {page.genreFormula.action}</button>
          </form>
          <CleanMedia image={selectImage(ctx, "blog image")} className="aspect-[4/3]" />
        </aside>
      </main>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ jobs ============================ */

function JobsLayout({ page }: P) {
  const ctx = contextForBlock(page, "jobs");
  const skin = page.layoutSkin;
  const rows = createRng(ctx.componentSeed).int(8, 12);
  const style = { fontFamily: "var(--font-inter), system-ui, sans-serif" } as CSSProperties;

  if (skin === "cards") {
    return (
      <div style={style}>
        <MiniHeader page={page} links={4} />
        <main className="shell py-6">
          <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: rows }).map((_, i) => {
              const c = contextForBlock(page, `job-${i}`);
              const l = makeLink(c, `job-${i}`, generateHeadline(c, i));
              return (
                <article key={i} className={page.styleRecipe.classes.panel}>
                  <h2 className="font-semibold"><DeepLink link={l} className="hover:underline" /></h2>
                  <p className="mt-1 text-sm opacity-70">{generateProductName(c, i)}</p>
                  <p className="mt-2 font-bold">{price(c.componentSeed)}/yr</p>
                  <DeepLink link={makeLink(c, `apply-${i}`, "Apply")} className={`${page.styleRecipe.classes.button} mt-3 inline-block text-xs`} />
                </article>
              );
            })}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (skin === "map-jobs") {
    const mapImage = selectImage(ctx, "hero background");
    return (
      <div style={style}>
        <header className="shell py-4">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">jobs map</a>
        </header>
        <main className="shell grid gap-4 pb-8 lg:grid-cols-[1fr_320px]">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--page-border)]">
            <CleanMedia image={mapImage} className="aspect-[16/10] min-h-[280px]" rounded="" />
            {Array.from({ length: 5 }).map((_, i) => {
              const pr = createRng(`${ctx.componentSeed}:jp${i}`);
              return (
                <span key={i} className="absolute grid h-6 w-6 place-items-center rounded-[var(--radius-pill)] bg-[var(--page-accent)] text-[10px] text-white" style={{ left: `${pr.int(10, 85)}%`, top: `${pr.int(15, 75)}%` }}>{i + 1}</span>
              );
            })}
          </div>
          <aside className="grid h-fit gap-2">
            {Array.from({ length: Math.min(rows, 6) }).map((_, i) => {
              const c = contextForBlock(page, `jmap-${i}`);
              const l = makeLink(c, `jmap-${i}`, generateHeadline(c, i));
              return (
                <div key={i} className={`${page.styleRecipe.classes.panel} text-sm`}>
                  <DeepLink link={l} className="font-semibold hover:underline" />
                  <p className="text-xs opacity-60">{price(c.componentSeed)}/yr</p>
                </div>
              );
            })}
          </aside>
        </main>
      </div>
    );
  }

  if (skin === "featured-company") {
    const featured = contextForBlock(page, "featured-co");
    const fLink = makeLink(featured, "featured-co", generateProductName(featured, 0));
    return (
      <div style={style}>
        <header className="border-b border-[var(--page-border)] bg-[var(--page-muted)]/40">
          <div className="shell py-6">
            <a href={siteHomeHref(page)} className="site-brand headline text-2xl lowercase no-underline">{displayBrand(page)} careers</a>
          </div>
        </header>
        <section className={`${page.styleRecipe.classes.panel} shell my-6 grid gap-4 sm:grid-cols-[auto_1fr]`}>
          <CleanMedia image={selectImage(featured, "product image")} className="h-20 w-20 shrink-0" />
          <div>
            <h2 className="headline text-xl"><DeepLink link={fLink} className="hover:underline" /></h2>
            <p className="mt-1 opacity-80">{generateProductDescription(featured, 0)}</p>
            <p className="mt-2 font-accent text-xs opacity-60">{createRng(ctx.componentSeed).int(3, 40)} open roles</p>
          </div>
        </section>
        <main className="shell pb-8">
          <div className="grid gap-3">
            {Array.from({ length: rows }).map((_, i) => {
              const c = contextForBlock(page, `job-${i}`);
              const l = makeLink(c, `job-${i}`, generateHeadline(c, i));
              return (
                <article key={i} className={`${page.styleRecipe.classes.panel} flex justify-between gap-3`}>
                  <div>
                    <h3 className="font-semibold"><DeepLink link={l} className="hover:underline" /></h3>
                    <p className="text-sm opacity-70">{generateProductName(c, i)}</p>
                  </div>
                  <span className="shrink-0 font-semibold">{price(c.componentSeed)}/yr</span>
                </article>
              );
            })}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <header className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]/40">
        <div className="shell py-6">
          <a href={siteHomeHref(page)} className="site-brand headline text-2xl lowercase no-underline">{displayBrand(page)} careers</a>
          <form action={makeLink(ctx, "search").href} className="mt-4 flex max-w-2xl">
            <input className="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-white px-4 py-2.5 text-sm text-black" placeholder={`${page.motifs[0] ?? "quiet"} ${page.genreFormula.content} near checkout`} />
            <button className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-l-0 border-[var(--page-border)] bg-[var(--page-accent)] px-6 text-white">Search jobs</button>
          </form>
        </div>
      </header>
      <main className="shell grid gap-[var(--gap-grid)] py-6 lg:grid-cols-[220px_1fr]">
        <aside className="grid h-fit gap-3 text-sm">
          {["Remote", "Full-time", "Part-time", "Contract", "Previous shift"].map((f, i) => (
            <label key={f} className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={createRng(`${ctx.componentSeed}:f${i}`).bool()} /> {f}
            </label>
          ))}
          <p className="mt-2 font-accent text-[11px] uppercase opacity-60">Salary range</p>
          <input type="range" className="w-full" />
        </aside>
        <div>
          <p className="mb-3 font-accent text-xs opacity-60">{createRng(ctx.componentSeed).int(12, 840)} openings · sorted by {page.motifs[1] ?? "nearby"}</p>
          <div className="grid gap-3">
            {Array.from({ length: rows }).map((_, i) => {
              const c = contextForBlock(page, `job-${i}`);
              const l = makeLink(c, `job-${i}`, generateHeadline(c, i));
              const jr = createRng(c.componentSeed);
              return (
                <article key={i} className={`${page.styleRecipe.classes.panel} flex flex-wrap items-start justify-between gap-3`}>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold"><DeepLink link={l} className="hover:underline" /></h2>
                    <p className="mt-0.5 text-sm opacity-70">{generateProductName(c, i)} · {page.genreFormula.residue}</p>
                    <p className="mt-2 line-clamp-2 text-sm opacity-85">{generateProductDescription(c, i)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[page.motifs[i % page.motifs.length], "checkout", jr.bool() ? "remote" : "on-site"].filter(Boolean).map((tag) => (
                        <span key={tag} className={page.styleRecipe.classes.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid shrink-0 gap-2 text-right">
                    <span className="font-semibold">{price(c.componentSeed)}/yr</span>
                    <DeepLink link={makeLink(c, `apply-${i}`, "Apply")} className={page.styleRecipe.classes.button} />
                    <span className="font-accent text-[11px] opacity-50">{jr.int(1, 14)}d ago</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <ColumnsFooter page={page} />
    </div>
  );
}

/* ============================ maps / local ============================ */

function MapsLayout({ page }: P) {
  const ctx = contextForBlock(page, "maps");
  const skin = page.layoutSkin;
  const places = createRng(ctx.componentSeed).int(6, 9);
  const mapImage = selectImage(ctx, "hero background");
  const style = { fontFamily: "var(--font-worksans), system-ui, sans-serif" } as CSSProperties;

  if (skin === "list-first") {
    return (
      <div style={style}>
        <MiniHeader page={page} links={4} />
        <main className="shell max-w-2xl py-5">
          <form action={makeLink(ctx, "search").href} className="flex">
            <input className="min-w-0 flex-1 border border-[var(--page-border)] px-3 py-2 text-sm" placeholder={`Search ${page.motifs[0]}`} />
            <button className={page.styleRecipe.classes.button}>Go</button>
          </form>
          <ul className="mt-4 grid gap-2">
            {Array.from({ length: places }).map((_, i) => {
              const c = contextForBlock(page, `place-${i}`);
              const l = makeLink(c, `place-${i}`, generateProductName(c, i));
              const pr = createRng(c.componentSeed);
              return (
                <li key={i}>
                  <A link={l} className={`${page.styleRecipe.classes.panel} flex items-center justify-between no-underline`}>
                    <span className="font-semibold">{l.label}</span>
                    <span className="font-accent text-xs opacity-60">{pr.int(0, 9)}.{pr.int(0, 9)} mi</span>
                  </A>
                </li>
              );
            })}
          </ul>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "full-bleed") {
    return (
      <div style={style} className="relative min-h-screen">
        <CleanMedia image={mapImage} className="fixed inset-0 h-full opacity-90" rounded="" />
        <header className="relative shell flex items-center justify-between py-4">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline drop-shadow">{displayBrand(page)} maps</a>
          <input className="w-48 border border-[var(--page-border)] bg-white/90 px-3 py-1.5 text-sm" placeholder="Search" />
        </header>
        <div className="relative shell mt-4 max-w-xs">
          <div className={`${page.styleRecipe.classes.panel} backdrop-blur`}>
            <p className="font-semibold">You are here</p>
            <p className="text-xs opacity-70">{page.motifs[0]} · {page.languageBlend.contamination}</p>
            <ul className="mt-2 grid gap-1 text-sm">
              {makeLinks(ctx, 4, "near").map((l) => (
                <li key={l.id}><DeepLink link={l} className="hover:underline" /></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (skin === "directions") {
    return (
      <div style={style}>
        <header className="shell py-4">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">directions</a>
        </header>
        <main className="shell grid gap-4 pb-8 lg:grid-cols-[360px_1fr]">
          <div className={`${page.styleRecipe.classes.panel} grid gap-2`}>
            <label className="grid gap-1 text-sm"><span className="font-accent text-[10px] uppercase opacity-60">From</span><input className="border border-[var(--page-border)] px-3 py-2" defaultValue={page.motifs[0]} /></label>
            <label className="grid gap-1 text-sm"><span className="font-accent text-[10px] uppercase opacity-60">To</span><input className="border border-[var(--page-border)] px-3 py-2" defaultValue={page.motifs[1] ?? "checkout"} /></label>
            <DeepLink link={makeLink(ctx, "route", "Get directions")} className={`${page.styleRecipe.classes.button} text-center`} />
            <ol className="mt-2 grid gap-2 text-sm">
              {Array.from({ length: 5 }).map((_, i) => {
                const c = contextForBlock(page, `dir-${i}`);
                return <li key={i}>{i + 1}. {generateHeadline(c, i)}</li>;
              })}
            </ol>
          </div>
          <CleanMedia image={mapImage} className="aspect-[4/3] min-h-[320px] lg:aspect-auto" />
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <header className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
        <div className="shell flex flex-wrap items-center gap-3 py-3">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} maps</a>
          <form action={makeLink(ctx, "search").href} className="flex min-w-0 flex-1 max-w-xl">
            <input className="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-3 py-2 text-sm" placeholder={`Search ${page.motifs[0] ?? "nearby"} ${page.genreFormula.content}`} />
            <button className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-l-0 border-[var(--page-border)] bg-[var(--page-accent)] px-4 text-white">Go</button>
          </form>
        </div>
      </header>
      <main className="shell grid gap-[var(--gap-grid)] py-5 lg:grid-cols-[1fr_360px]">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
          <CleanMedia image={mapImage} className="aspect-[16/10] min-h-[320px]" rounded="" />
          <div className="absolute left-4 top-4 rounded-[var(--radius-card)] bg-white/90 px-3 py-2 text-sm text-black shadow-[var(--shadow-card)]">
            <p className="font-semibold">You are here</p>
            <p className="font-accent text-[11px] opacity-60">possibly · {page.languageBlend.contamination}</p>
          </div>
          {Array.from({ length: 4 }).map((_, i) => {
            const pr = createRng(`${ctx.componentSeed}:pin${i}`);
            return (
              <span
                key={i}
                className="absolute grid h-8 w-8 place-items-center rounded-[var(--radius-pill)] bg-[var(--page-accent)] text-xs text-white shadow-[var(--shadow-button)]"
                style={{ left: `${pr.int(10, 80)}%`, top: `${pr.int(15, 75)}%` }}
              >
                {i + 1}
              </span>
            );
          })}
        </div>
        <aside className="grid h-fit gap-3">
          <p className="font-accent text-[11px] uppercase opacity-60">Nearby {page.genreFormula.content}</p>
          {Array.from({ length: places }).map((_, i) => {
            const c = contextForBlock(page, `place-${i}`);
            const l = makeLink(c, `place-${i}`, generateProductName(c, i));
            const pr = createRng(c.componentSeed);
            return (
              <A key={i} link={l} className={`${page.styleRecipe.classes.panel} flex gap-3 no-underline hover:bg-[var(--page-muted)]/30`}>
                <CleanMedia image={selectImage(c, "news thumbnail")} className="h-16 w-16 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{l.label}</p>
                  <p className="text-xs opacity-70">{pr.int(0, 9)}.{pr.int(0, 9)} mi · <Stars seed={c.componentSeed} /></p>
                  <p className="line-clamp-1 text-xs opacity-60">{generateProductDescription(c, i)}</p>
                </div>
              </A>
            );
          })}
        </aside>
      </main>
      <OldWebFooter page={page} />
    </div>
  );
}

/* ============================ food delivery ============================ */

function FoodLayout({ page }: P) {
  const ctx = contextForBlock(page, "food");
  const skin = page.layoutSkin;
  const restaurants = createRng(ctx.componentSeed).int(6, 8);
  const categories = ["Breakfast", "Nearby", "Previous orders", page.motifs[0] ?? "Quiet", "Checkout specials"];

  if (skin === "order-tracker") {
    const steps = ["Order placed", "Preparing", "On the way", "Arriving"];
    const active = createRng(ctx.componentSeed).int(1, 3);
    return (
      <div>
        <MiniHeader page={page} links={3} center />
        <main className="shell mx-auto max-w-md py-10 text-center">
          <p className="font-accent text-[11px] uppercase opacity-60">Order #{createRng(ctx.componentSeed).int(1000, 9999)}</p>
          <h1 className="headline mt-2 text-2xl">{page.title}</h1>
          <div className="mt-8 grid gap-4">
            {steps.map((step, i) => (
              <div key={step} className={`flex items-center gap-3 text-left ${i <= active ? "opacity-100" : "opacity-40"}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-pill)] text-sm ${i <= active ? "bg-[var(--page-accent)] text-white" : "bg-[var(--page-muted)]"}`}>{i + 1}</span>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 font-accent text-sm opacity-70">{createRng(ctx.componentSeed).int(8, 35)} min · driver guest_{createRng(ctx.componentSeed).int(10, 99)}</p>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "menu-focus") {
    const items = createRng(ctx.componentSeed).int(8, 12);
    return (
      <div>
        <header className="shell border-b border-[var(--page-border)] py-4 text-center">
          <a href={siteHomeHref(page)} className="site-brand headline text-2xl lowercase no-underline">{generateProductName(ctx, 0)}</a>
          <p className="mt-1 text-sm opacity-70">{page.subtitle}</p>
        </header>
        <main className="shell max-w-lg py-6">
          <div className="grid gap-0 divide-y divide-[var(--page-border)]">
            {Array.from({ length: items }).map((_, i) => {
              const c = contextForBlock(page, `menu-${i}`);
              const l = makeLink(c, `menu-${i}`, generateProductName(c, i));
              return (
                <div key={i} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <DeepLink link={l} className="font-semibold hover:underline" />
                    <p className="mt-0.5 line-clamp-2 text-xs opacity-75">{generateProductDescription(c, i)}</p>
                  </div>
                  <span className="shrink-0 font-semibold">{price(c.componentSeed)}</span>
                </div>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "deals-bar") {
    return (
      <div>
        <div className="bg-[var(--page-accent)] text-white">
          <div className="shell py-2 text-center font-accent text-xs uppercase">🔥 {page.motifs[0]} deals · free delivery on {page.motifs[1]}</div>
        </div>
        <header className="shell py-4">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} eats</a>
        </header>
        <div className="shell flex gap-2 overflow-x-auto pb-2">
          {categories.map((c, i) => (
            <DeepLink key={c} link={makeLink(ctx, `deal-${i}`, c)} className={`whitespace-nowrap rounded-[var(--radius-pill)] border px-3 py-1 text-sm ${i === 0 ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : ""}`} />
          ))}
        </div>
        <main className="shell grid gap-3 pb-10 sm:grid-cols-2">
          {Array.from({ length: restaurants }).map((_, i) => {
            const c = contextForBlock(page, `rest-${i}`);
            const l = makeLink(c, `rest-${i}`, generateProductName(c, i));
            return (
              <A key={i} link={l} className={`${page.styleRecipe.classes.panel} relative grid gap-2 no-underline`}>
                <span className="absolute right-2 top-2 rounded bg-[var(--page-danger)] px-2 py-0.5 text-[10px] text-white">DEAL</span>
                <CleanMedia image={selectImage(c, "product image")} className="aspect-[16/10]" />
                <h3 className="font-semibold">{l.label}</h3>
                <span className="text-sm font-bold">{price(c.componentSeed)}</span>
              </A>
            );
          })}
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  return (
    <div>
      <header className="bg-[var(--page-accent)] text-white">
        <div className="shell py-4">
          <a href={siteHomeHref(page)} className="site-brand headline text-2xl lowercase no-underline">{displayBrand(page)} eats</a>
          <form action={makeLink(ctx, "search").href} className="mt-3 flex max-w-lg">
            <input className="min-w-0 flex-1 border-0 px-3 py-2 text-sm text-black" placeholder="Address, suite, or hallway" defaultValue={page.motifs[1] ?? "available floor"} />
            <button className="bg-[var(--page-fg)] px-4 text-sm text-[var(--page-bg)]">Deliver</button>
          </form>
        </div>
      </header>
      <div className="shell flex gap-2 overflow-x-auto py-3">
        {categories.map((c, i) => (
          <DeepLink key={c} link={makeLink(ctx, `cat-${i}`, c)} className={`whitespace-nowrap rounded-[var(--radius-pill)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] px-4 py-1.5 text-sm ${i === 0 ? "bg-[var(--page-fg)] text-[var(--page-bg)]" : "bg-[var(--page-muted)]/40"}`} />
        ))}
      </div>
      <main className="shell pb-10">
        <div className={`${page.styleRecipe.classes.intrusionPanel} mb-5 flex flex-wrap items-center justify-between gap-2`}>
          <span className="text-sm">Order #{createRng(ctx.componentSeed).int(1000, 9999)} · {generateLoadingMessage(ctx)}</span>
          <span className="font-accent text-[11px]">{createRng(ctx.componentSeed).int(12, 45)} min · driver: guest_{createRng(ctx.componentSeed).int(10, 99)}</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: restaurants }).map((_, i) => {
            const c = contextForBlock(page, `rest-${i}`);
            const l = makeLink(c, `rest-${i}`, generateProductName(c, i));
            const rr = createRng(c.componentSeed);
            return (
              <A key={i} link={l} className={`${page.styleRecipe.classes.panel} grid gap-2 no-underline`}>
                <CleanMedia image={selectImage(c, "product image")} className="aspect-[16/10]" />
                <h3 className="font-semibold">{l.label}</h3>
                <p className="line-clamp-2 text-xs opacity-75">{generateProductDescription(c, i)}</p>
                <div className="flex items-center justify-between text-xs">
                  <Stars seed={c.componentSeed} />
                  <span className="font-accent opacity-60">{rr.int(15, 55)} min · {price(c.componentSeed)} fee</span>
                </div>
              </A>
            );
          })}
        </div>
      </main>
      <ColumnsFooter page={page} />
    </div>
  );
}

/* ============================ real estate ============================ */

function RealEstateLayout({ page }: P) {
  const ctx = contextForBlock(page, "homes");
  const skin = page.layoutSkin;
  const listings = createRng(ctx.componentSeed).int(6, 9);
  const style = { fontFamily: "var(--font-robotoslab), Georgia, serif", "--page-font-headline": "var(--font-robotoslab), Georgia, serif" } as CSSProperties;

  if (skin === "map-list") {
    const mapImage = selectImage(ctx, "hero background");
    return (
      <div style={style}>
        <MiniHeader page={page} links={4} />
        <main className="shell grid gap-4 pb-10 lg:grid-cols-[1fr_380px]">
          <CleanMedia image={mapImage} className="aspect-[16/10] min-h-[360px] sticky top-4" rounded="" />
          <div className="grid gap-3">
            {Array.from({ length: listings }).map((_, i) => {
              const c = contextForBlock(page, `listing-${i}`);
              const l = makeLink(c, `listing-${i}`, generateProductName(c, i));
              return (
                <A key={i} link={l} className={`${page.styleRecipe.classes.panel} flex gap-3 no-underline`}>
                  <CleanMedia image={selectImage(c, "product image")} className="h-20 w-28 shrink-0" />
                  <div>
                    <p className="font-bold">{price(c.componentSeed)}</p>
                    <p className="font-semibold">{l.label}</p>
                    <p className="text-xs opacity-70">{generateProductDescription(c, i)}</p>
                  </div>
                </A>
              );
            })}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (skin === "floor-plan") {
    const featured = contextForBlock(page, "floor-featured");
    return (
      <div style={style}>
        <MiniHeader page={page} links={4} />
        <main className="shell grid gap-6 py-6 lg:grid-cols-2">
          <CleanMedia image={selectImage(featured, "product image")} className="aspect-square" />
          <div>
            <h1 className="headline text-3xl">{generateProductName(featured, 0)}</h1>
            <p className="mt-2 text-2xl font-bold">{price(featured.componentSeed)}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              {[["Beds", createRng(featured.componentSeed).int(1, 5)], ["Baths", createRng(featured.componentSeed).int(1, 3)], ["Sqft", createRng(featured.componentSeed).int(400, 3200)]].map(([l, v]) => (
                <div key={l as string} className={page.styleRecipe.classes.panel}>
                  <p className="font-accent text-[10px] uppercase opacity-60">{l}</p>
                  <p className="font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 leading-7 opacity-90">{generateParagraph(featured, 0)}</p>
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "luxury-hero") {
    const hero = selectImage(ctx, "hero background");
    return (
      <div style={style}>
        <section className="relative">
          <CleanMedia image={hero} className="aspect-[21/9] max-h-[70vh]" rounded="" motion />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 shell pb-8 text-white">
            <p className="font-accent text-[11px] uppercase opacity-80">Exclusive · {page.genreFormula.content}</p>
            <h1 className="headline mt-2 text-4xl md:text-5xl">{page.title}</h1>
            <p className="mt-2 max-w-xl opacity-90">{page.subtitle}</p>
          </div>
        </section>
        <main className="shell grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: Math.min(listings, 6) }).map((_, i) => {
            const c = contextForBlock(page, `lux-${i}`);
            const l = makeLink(c, `lux-${i}`, generateProductName(c, i));
            return (
              <A key={i} link={l} className={`${page.styleRecipe.classes.panel} grid gap-2 p-0 overflow-hidden no-underline`}>
                <CleanMedia image={selectImage(c, "product image")} className="aspect-[4/3]" rounded="" />
                <div className="px-3 pb-3">
                  <p className="text-xl font-bold">{price(c.componentSeed)}</p>
                  <p className="font-semibold">{l.label}</p>
                </div>
              </A>
            );
          })}
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <MiniHeader page={page} links={5} />
      <section className="shell py-5">
        <h1 className="headline text-3xl">{generateHeading(ctx)}</h1>
        <p className="mt-1 opacity-80">{page.subtitle}</p>
        <form action={makeLink(ctx, "search").href} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
          {["Location", "Price max", "Beds"].map((f, i) => (
            <input key={f} className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-transparent px-3 py-2 text-sm" placeholder={f} defaultValue={i === 0 ? page.motifs[0] : undefined} />
          ))}
          <button className={page.styleRecipe.classes.button}>Search listings</button>
        </form>
      </section>
      <main className="shell grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: listings }).map((_, i) => {
          const c = contextForBlock(page, `listing-${i}`);
          const l = makeLink(c, `listing-${i}`, generateProductName(c, i));
          const lr = createRng(c.componentSeed);
          return (
            <A key={i} link={l} className={`${page.styleRecipe.classes.panel} grid gap-2 overflow-hidden p-0 no-underline`}>
              <CleanMedia image={selectImage(c, "product image")} className="aspect-[4/3]" rounded="" />
              <div className="grid gap-1 px-3 pb-3">
                <p className="text-xl font-bold">{price(c.componentSeed)}</p>
                <h3 className="font-semibold leading-tight">{l.label}</h3>
                <p className="font-accent text-xs opacity-70">{lr.int(1, 5)} bd · {lr.int(1, 3)} ba · {lr.int(400, 3200)} sqft · {page.genreFormula.content}</p>
                <p className="line-clamp-2 text-xs opacity-75">{generateProductDescription(c, i)}</p>
              </div>
            </A>
          );
        })}
      </main>
      <ColumnsFooter page={page} />
    </div>
  );
}

/* ============================ creator tools ============================ */

function CreatorLayout({ page }: P) {
  const ctx = contextForBlock(page, "creators");
  const skin = page.layoutSkin;
  const assets = createRng(ctx.componentSeed).int(8, 12);
  const style = { "--page-font-accent": "var(--font-spacemono), monospace" } as CSSProperties;

  if (skin === "gallery") {
    return (
      <div style={style}>
        <MiniHeader page={page} links={4} center />
        <main className="shell py-6">
          <h1 className="headline text-center text-2xl">{generateHeading(ctx)}</h1>
          <p className="mt-1 text-center text-sm opacity-70">{page.subtitle}</p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: assets }).map((_, i) => {
              const c = contextForBlock(page, `asset-${i}`);
              const l = makeLink(c, `asset-${i}`, generateProductName(c, i));
              return (
                <A key={i} link={l} className="group relative aspect-square overflow-hidden no-underline">
                  <CleanMedia image={selectImage(c, "product image")} className="h-full transition group-hover:scale-105" rounded="" />
                </A>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "timeline") {
    const events = createRng(ctx.componentSeed).int(5, 8);
    return (
      <div style={style}>
        <MiniHeader page={page} links={3} />
        <main className="shell max-w-xl py-6">
          <h1 className="headline text-2xl">Activity</h1>
          <div className="mt-6 border-l-2 border-[var(--page-border)] pl-6">
            {Array.from({ length: events }).map((_, i) => {
              const c = contextForBlock(page, `evt-${i}`);
              const l = makeLink(c, `evt-${i}`, generateHeadline(c, i));
              return (
                <article key={i} className="relative mb-6">
                  <span className="absolute -left-[31px] h-3 w-3 rounded-[var(--radius-pill)] bg-[var(--page-accent)]" />
                  <p className="font-accent text-[10px] uppercase opacity-60">{createRng(c.componentSeed).int(1, 30)}d ago</p>
                  <DeepLink link={l} className="font-semibold hover:underline" />
                  <p className="mt-1 text-sm opacity-75">{generateProductDescription(c, i)}</p>
                </article>
              );
            })}
          </div>
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "monetize") {
    return (
      <div style={style}>
        <MiniHeader page={page} links={4} />
        <main className="shell max-w-2xl py-8">
          <h1 className="headline text-3xl">{generateHeading(ctx)}</h1>
          <p className="mt-2 opacity-80">{page.subtitle}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["Tips", "Subscriptions", "Sales"].map((m, i) => {
              const mr = createRng(`${ctx.componentSeed}:mon${i}`);
              return (
                <div key={m} className={page.styleRecipe.classes.panel}>
                  <p className="font-accent text-[10px] uppercase opacity-60">{m}</p>
                  <p className="mt-1 text-2xl font-semibold">{price(`${ctx.componentSeed}:mon${i}`)}</p>
                  <p className="text-xs opacity-70">▲ {mr.int(1, 40)}% this month</p>
                </div>
              );
            })}
          </div>
          <DeepLink link={makeLink(ctx, "payout", "Request payout")} className={`${page.styleRecipe.classes.button} mt-6 inline-block`} />
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style} className="grid min-h-screen md:grid-cols-[200px_1fr]">
      <aside className="border-r-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]/30 p-4">
        <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">studio</a>
        <nav className="mt-5 grid gap-1 text-sm">
          {["Projects", "Assets", "Templates", "Analytics", "Export"].map((s, i) => (
            <DeepLink key={s} link={makeLink(ctx, `studio-${i}`, s)} className={`rounded-[var(--radius-input)] px-3 py-2 ${i === 0 ? "bg-[var(--page-accent)] text-white" : "opacity-75 hover:bg-[var(--page-muted)]"}`} />
          ))}
        </nav>
      </aside>
      <div className="grid content-start gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="headline text-2xl">{generateHeading(ctx)}</h1>
            <p className="font-accent text-xs opacity-60">{page.genreFormula.content} · {page.motifs[0] ?? "feed"} metrics</p>
          </div>
          <DeepLink link={makeLink(ctx, "upload", "Upload asset")} className={page.styleRecipe.classes.button} />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {["Views", "Exports", "Templates sold", "Quiet revenue"].map((m, i) => {
            const mr = createRng(`${ctx.componentSeed}:s${i}`);
            return (
              <div key={m} className={page.styleRecipe.classes.panel}>
                <p className="font-accent text-[11px] uppercase opacity-60">{m}</p>
                <p className="mt-1 text-2xl font-semibold">{mr.int(0, 99999).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
        <div>
          <h2 className="mb-3 font-semibold">Asset library</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: assets }).map((_, i) => {
              const c = contextForBlock(page, `asset-${i}`);
              const l = makeLink(c, `asset-${i}`, generateProductName(c, i));
              return (
                <A key={i} link={l} className="grid gap-1 no-underline">
                  <CleanMedia image={selectImage(c, i % 3 === 0 ? "fake ad" : "product image")} className="aspect-square" />
                  <p className="truncate text-xs font-semibold">{l.label}</p>
                  <span className="font-accent text-[10px] opacity-50">{price(c.componentSeed)}</span>
                </A>
              );
            })}
          </div>
        </div>
        <TinyFooter page={page} />
      </div>
    </div>
  );
}

/* ============================ weather ============================ */

function WeatherLayout({ page }: P) {
  const ctx = contextForBlock(page, "weather");
  const skin = page.layoutSkin;
  const r = createRng(ctx.componentSeed);
  const realWeather = page.realDataIntrusions.find((intrusion) => intrusion.kind === "weather");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const icons = ["☀", "⛅", "☁", "🌧", "⛈", "🌫", "❄"];
  const style = { fontFamily: "var(--font-space), system-ui, sans-serif" } as CSSProperties;

  if (skin === "minimal") {
    return (
      <div style={style} className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <p className="font-accent text-[11px] uppercase opacity-60">{page.motifs[0] ?? "nearby floor"}</p>
        <span className="my-4 text-8xl">{icons[r.int(0, icons.length - 1)]}</span>
        <h1 className="headline text-7xl">{r.int(38, 88)}°</h1>
        <p className="mt-2 text-lg opacity-80">{generateHeadline(ctx, 0)}</p>
        <p className="mt-4 text-sm opacity-60">Feels like {r.int(35, 90)}°</p>
        {realWeather ? (
          <RealDataPanel intrusion={realWeather} compact className={`${page.styleRecipe.classes.intrusionPanel} mt-8 max-w-sm text-left`} />
        ) : null}
        <TinyFooter page={page} />
      </div>
    );
  }

  if (skin === "radar") {
    const radar = selectImage(ctx, "hero background");
    return (
      <div style={style}>
        <header className="shell flex items-center justify-between py-3">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">radar</a>
          <span className="font-accent text-xs">{page.motifs[0]}</span>
        </header>
        <main className="shell pb-8">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--page-border)]">
            <CleanMedia image={radar} className="aspect-square max-h-[70vh]" rounded="" />
            <div className="absolute left-4 top-4 rounded bg-black/70 px-3 py-2 text-white">
              <p className="text-3xl font-bold">{r.int(38, 88)}°</p>
              <p className="text-xs opacity-80">{generateHeadline(ctx, 0)}</p>
            </div>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {realWeather ? (
              <li className="sm:col-span-2">
                <RealDataPanel intrusion={realWeather} compact className={page.styleRecipe.classes.intrusionPanel} />
              </li>
            ) : null}
            {makeLinks(ctx, 4, "alert").map((l, i) => (
              <li key={l.id} className={page.styleRecipe.classes.intrusionPanel}>
                <DeepLink link={{ ...l, label: generateHeadline(ctx, i) }} className="text-sm font-semibold hover:underline" />
              </li>
            ))}
          </ul>
        </main>
      </div>
    );
  }

  if (skin === "hourly-strip") {
    const hours = createRng(ctx.componentSeed).int(12, 18);
    return (
      <div style={style}>
        <header className="shell py-4">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">hourly</a>
          <p className="mt-1 text-4xl font-bold">{r.int(38, 88)}° · {page.motifs[0]}</p>
        </header>
        <main className="shell pb-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: hours }).map((_, i) => {
              const hr = createRng(`${ctx.componentSeed}:h${i}`);
              return (
                <div key={i} className={`${page.styleRecipe.classes.panel} shrink-0 text-center`}>
                  <p className="font-accent text-[10px] opacity-60">{hr.int(1, 12)}{hr.bool() ? "am" : "pm"}</p>
                  <p className="my-1 text-xl">{icons[hr.int(0, icons.length - 1)]}</p>
                  <p className="text-sm font-semibold">{hr.int(35, 85)}°</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {days.map((d, i) => {
              const dr = createRng(`${ctx.componentSeed}:d${i}`);
              return (
                <div key={d} className={`${page.styleRecipe.classes.panel} text-center`}>
                  <p className="font-accent text-[10px] uppercase opacity-60">{d}</p>
                  <p className="my-1 text-lg">{icons[dr.int(0, icons.length - 1)]}</p>
                  <p className="text-sm">{dr.int(40, 85)}°</p>
                </div>
              );
            })}
          </div>
          {realWeather ? (
            <RealDataPanel intrusion={realWeather} compact className={`${page.styleRecipe.classes.intrusionPanel} mt-6`} />
          ) : null}
        </main>
        <TinyFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <header className="shell flex items-center justify-between py-4">
        <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)} weather</a>
        <form action={makeLink(ctx, "loc").href} className="flex">
          <input className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-transparent px-3 py-1 text-sm" defaultValue={page.motifs[0] ?? "nearby floor"} />
        </form>
      </header>
      <main className="shell grid gap-[var(--gap-grid)] pb-10 lg:grid-cols-[1.2fr_1fr]">
        <section className={`${page.styleRecipe.classes.panel} grid gap-4 sm:grid-cols-[auto_1fr]`}>
          <span className="text-7xl">{icons[r.int(0, icons.length - 1)]}</span>
          <div>
            <p className="font-accent text-[11px] uppercase opacity-60">{page.webMood}</p>
            <h1 className="headline text-6xl">{r.int(38, 88)}°</h1>
            <p className="mt-1 text-lg opacity-80">{generateHeadline(ctx, 0)}</p>
            <p className="mt-2 text-sm opacity-70">Feels like {r.int(35, 90)}° · {page.genreFormula.content} index {r.int(1, 10)}/10</p>
          </div>
        </section>
        {realWeather ? (
          <RealDataPanel intrusion={realWeather} compact className={page.styleRecipe.classes.intrusionPanel} />
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {["Air quality", "Pollen", "UV index", "Checkout humidity"].map((w, i) => {
            const wr = createRng(`${ctx.componentSeed}:w${i}`);
            return (
              <div key={w} className={page.styleRecipe.classes.panel}>
                <p className="font-accent text-[11px] uppercase opacity-60">{w}</p>
                <p className="mt-1 text-xl font-semibold">{wr.int(1, 99)}{i === 2 ? "" : " AQI"}</p>
                <p className="text-xs opacity-70">{generateLoadingMessage({ ...ctx, componentSeed: `${ctx.componentSeed}:w${i}` })}</p>
              </div>
            );
          })}
        </div>
        <section className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">7-day {page.motifs[1] ?? "forecast"}</h2>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d, i) => {
              const dr = createRng(`${ctx.componentSeed}:d${i}`);
              return (
                <div key={d} className={`${page.styleRecipe.classes.panel} text-center`}>
                  <p className="font-accent text-[11px] uppercase opacity-60">{d}</p>
                  <p className="my-2 text-2xl">{icons[dr.int(0, icons.length - 1)]}</p>
                  <p className="text-sm font-semibold">{dr.int(40, 85)}°</p>
                  <p className="text-xs opacity-50">{dr.int(30, 55)}°</p>
                </div>
              );
            })}
          </div>
        </section>
        <section className="lg:col-span-2">
          <ul className="grid gap-2 sm:grid-cols-2">
            {makeLinks(ctx, 4, "alert").map((l, i) => (
              <li key={l.id} className={page.styleRecipe.classes.intrusionPanel}>
                <DeepLink link={{ ...l, label: generateHeadline(ctx, i + 2) }} className="font-semibold hover:underline" />
                <p className="mt-1 text-xs opacity-75">{generateProductDescription(ctx, i)}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <TinyFooter page={page} />
    </div>
  );
}

/* ============================ auctions ============================ */

function AuctionsLayout({ page }: P) {
  const ctx = contextForBlock(page, "auctions");
  const skin = page.layoutSkin;
  const items = createRng(ctx.componentSeed).int(6, 10);
  const style = { fontFamily: "var(--font-archivo), system-ui, sans-serif" } as CSSProperties;

  if (skin === "live-list") {
    return (
      <div style={style}>
        <header className="shell flex items-center justify-between border-b border-[var(--page-border)] py-3">
          <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">live auctions</a>
          <span className="rounded bg-[var(--page-danger)] px-2 py-0.5 font-accent text-[10px] uppercase text-white">Live</span>
        </header>
        <main className="shell max-w-2xl py-4">
          <ul className="grid gap-2">
            {Array.from({ length: items }).map((_, i) => {
              const c = contextForBlock(page, `lot-${i}`);
              const l = makeLink(c, `lot-${i}`, generateProductName(c, i));
              const ar = createRng(c.componentSeed);
              return (
                <li key={i}>
                  <A link={l} className={`${page.styleRecipe.classes.panel} flex items-center gap-4 no-underline`}>
                    <CleanMedia image={selectImage(c, "product image")} className="h-16 w-16 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{l.label}</p>
                      <p className="font-accent text-[10px] text-[var(--page-danger)]">{ar.int(0, 59)}m {ar.int(0, 59)}s left</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{price(c.componentSeed)}</p>
                      <p className="font-accent text-[10px] opacity-50">{ar.int(1, 44)} bids</p>
                    </div>
                  </A>
                </li>
              );
            })}
          </ul>
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  if (skin === "featured-lot") {
    const featured = contextForBlock(page, "featured-lot");
    const fLink = makeLink(featured, "featured-lot", generateProductName(featured, 0));
    const ar = createRng(featured.componentSeed);
    return (
      <div style={style}>
        <MiniHeader page={page} links={4} />
        <main className="shell py-6">
          <section className={`${page.styleRecipe.classes.panel} grid gap-6 lg:grid-cols-2`}>
            <CleanMedia image={selectImage(featured, "product image")} className="aspect-square" />
            <div>
              <p className="font-accent text-[11px] uppercase text-[var(--page-danger)]">Featured lot · ending soon</p>
              <h1 className="headline mt-2 text-3xl"><DeepLink link={fLink} className="hover:underline" /></h1>
              <p className="mt-2 opacity-80">{generateProductDescription(featured, 0)}</p>
              <p className="mt-4 text-3xl font-bold">{price(featured.componentSeed)}</p>
              <p className="font-accent text-sm text-[var(--page-danger)]">{ar.int(0, 5)}h {ar.int(1, 59)}m remaining · {ar.int(5, 99)} bids</p>
              <DeepLink link={makeLink(featured, "bid", "Place bid")} className={`${page.styleRecipe.classes.button} mt-4 inline-block`} />
            </div>
          </section>
          <h2 className="headline mb-3 mt-8 text-xl">More lots</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: Math.min(items, 6) }).map((_, i) => {
              const c = contextForBlock(page, `lot-${i}`);
              const l = makeLink(c, `lot-${i}`, generateProductName(c, i));
              return (
                <article key={i} className={`${page.styleRecipe.classes.panel} text-sm`}>
                  <DeepLink link={l} className="font-semibold hover:underline" />
                  <p className="font-bold">{price(c.componentSeed)}</p>
                </article>
              );
            })}
          </div>
        </main>
        <ColumnsFooter page={page} />
      </div>
    );
  }

  if (skin === "countdown-banner") {
    return (
      <div style={style}>
        <div className="bg-[var(--page-fg)] py-2 text-center font-accent text-xs uppercase text-[var(--page-bg)]">
          ⏱ Ending in {createRng(ctx.componentSeed).int(1, 12)}h · {items} active lots · {page.motifs[0]}
        </div>
        <header className="shell py-4">
          <a href={siteHomeHref(page)} className="site-brand headline text-2xl lowercase no-underline">auctions</a>
          <p className="text-sm opacity-70">{page.subtitle}</p>
        </header>
        <main className="shell grid gap-3 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: items }).map((_, i) => {
            const c = contextForBlock(page, `lot-${i}`);
            const l = makeLink(c, `lot-${i}`, generateProductName(c, i));
            const ar = createRng(c.componentSeed);
            return (
              <article key={i} className={`${page.styleRecipe.classes.panel} grid gap-1 p-0 overflow-hidden`}>
                <A link={l} className="no-underline">
                  <CleanMedia image={selectImage(c, "product image")} className="aspect-square" rounded="" />
                </A>
                <div className="px-2 pb-2">
                  <h3 className="line-clamp-1 text-sm font-semibold"><DeepLink link={l} className="hover:underline" /></h3>
                  <p className="font-bold">{price(c.componentSeed)}</p>
                  <p className="font-accent text-[10px] text-[var(--page-danger)]">{ar.int(0, 23)}h left</p>
                </div>
              </article>
            );
          })}
        </main>
        <OldWebFooter page={page} />
      </div>
    );
  }

  return (
    <div style={style}>
      <header className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]/50">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
          <a href={siteHomeHref(page)} className="site-brand headline text-2xl lowercase no-underline">{displayBrand(page)} auctions</a>
          <div className="flex gap-2 font-accent text-[11px] uppercase">
            {["Live", "Ending soon", "Classifieds", "Local pickup"].map((t, i) => (
              <DeepLink key={t} link={makeLink(ctx, `tab-${i}`, t)} className={`rounded-[var(--radius-pill)] px-3 py-1 ${i === 0 ? "bg-[var(--page-accent)] text-white" : "opacity-70"}`} />
            ))}
          </div>
        </div>
      </header>
      <main className="shell py-6">
        <p className="mb-4 text-sm opacity-70">{page.subtitle}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: items }).map((_, i) => {
            const c = contextForBlock(page, `lot-${i}`);
            const l = makeLink(c, `lot-${i}`, generateProductName(c, i));
            const ar = createRng(c.componentSeed);
            const hours = ar.int(0, 23);
            const mins = ar.int(1, 59);
            return (
              <article key={i} className={`${page.styleRecipe.classes.panel} grid gap-2`}>
                <A link={l} className="no-underline">
                  <CleanMedia image={selectImage(c, "product image")} className="aspect-square" />
                </A>
                <h3 className="font-semibold leading-tight"><DeepLink link={l} className="hover:underline" /></h3>
                <p className="line-clamp-2 text-xs opacity-75">{generateProductDescription(c, i)}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-60">Current bid</p>
                    <p className="text-lg font-bold">{price(c.componentSeed)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-accent text-[11px] text-[var(--page-danger)]">{hours}h {mins}m left</p>
                    <p className="font-accent text-[10px] opacity-50">{ar.int(1, 44)} bids</p>
                  </div>
                </div>
                <DeepLink link={makeLink(c, `bid-${i}`, "Place bid")} className={`${page.styleRecipe.classes.button} w-full text-center`} />
              </article>
            );
          })}
        </div>
      </main>
      <OldWebFooter page={page} />
    </div>
  );
}

/* ============================ music (spotify-like, every album is a live radio station) ============================ */

function MusicStationCard({ page, id, station, index }: P & { id: string; station?: RadioStation; index: number }) {
  const c = contextForBlock(page, id);
  const label = station?.name?.trim() || generateProductName(c, index);
  const link = makeLink(c, id, label);
  const initial = (label.trim()[0] ?? "♪").toUpperCase();
  const subtitle = station
    ? [station.country, station.codec ? station.codec.toUpperCase() : ""].filter(Boolean).join(" · ") || "internet radio"
    : generateProductDescription(c, index);

  return (
    <A link={link} className="group grid min-w-0 gap-2 rounded-[var(--radius-card)] bg-white/[.04] p-3 no-underline transition hover:bg-white/[.1]">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-media)] bg-black/30 shadow-[0_8px_24px_rgba(0,0,0,.35)]">
        {station?.favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={station.favicon} alt="" className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[color-mix(in_srgb,var(--page-accent)_45%,black)] font-headline text-5xl text-white/85">{initial}</div>
        )}
        <span className="absolute bottom-2 right-2 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-[var(--page-accent)] text-lg text-black opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
          ▶
        </span>
      </div>
      <p className="line-clamp-1 text-sm font-semibold">{label}</p>
      <p className="line-clamp-1 text-xs opacity-60">{subtitle}</p>
    </A>
  );
}

async function MusicLayout({ page }: P) {
  const ctx = contextForBlock(page, "music");
  const rng = createRng(ctx.componentSeed);
  const radioResult = await fetchRandomMusicRadioBrowserStations(18).catch(() => null);
  const stations = radioResult?.data?.length
    ? seededRadioStations(`${ctx.componentSeed}:music`, radioResult.data.map(toRadioStation), 14)
    : [];
  const featured = stations[0];
  const greeting = pick(`${ctx.componentSeed}:greeting`, [
    "Good previous afternoon",
    "Welcome back to earlier",
    "Resuming a station you never started",
    "Good evening, guest 77,775"
  ]);
  const playlists = makeLinks(ctx, 9, "playlist");
  const shelves = [
    { title: `Made for ${page.motifs[0] ?? "a previous guest"}`, offset: 0 },
    { title: "Stations you left playing", offset: 5 },
    { title: `Because you tuned out of ${page.motifs[1] ?? "checkout"}`, offset: 9 }
  ];
  const linerNote = page.realDataIntrusions.find((item) => item.kind === "art" || item.kind === "book") ?? page.realDataIntrusions[0];

  return (
    <div data-scheme="dark" className="grid min-h-screen grid-rows-[1fr_auto] bg-[color-mix(in_srgb,var(--page-fg)_92%,black)] text-[color-mix(in_srgb,var(--page-bg)_95%,white)]">
      <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden flex-col gap-4 border-r border-white/10 bg-black/40 p-4 md:flex">
          <a href={siteHomeHref(page)} className="site-brand headline text-lg lowercase no-underline">{displayBrand(page)} ♪ sound</a>
          <nav className="grid gap-1 font-accent text-sm">
            {[["Home", "music-home"], ["Search", "music-search"], ["Your Library", "music-library"]].map(([label, slot]) => (
              <DeepLink key={slot} link={makeLink(ctx, slot, label)} className="rounded-[var(--radius-input)] px-2 py-1.5 opacity-80 hover:bg-white/10 hover:opacity-100" />
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-hidden border-t border-white/10 pt-3">
            <p className="mb-2 font-accent text-[11px] uppercase opacity-50">Playlists</p>
            <ul className="grid gap-1 text-sm">
              {playlists.map((l) => (
                <li key={l.id}>
                  <DeepLink link={l} className="line-clamp-1 opacity-70 hover:underline hover:opacity-100" />
                </li>
              ))}
            </ul>
          </div>
          <p className="font-accent text-[10px] uppercase opacity-40">{page.languageBlend.primary} · offline since {rng.int(2009, 2021)}</p>
        </aside>

        <main className="min-w-0 overflow-hidden">
          <div className="bg-gradient-to-b from-[var(--page-accent)]/35 to-transparent px-4 py-6 md:px-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h1 className="headline text-3xl">{greeting}</h1>
              <div className="flex gap-2 font-accent text-[11px] uppercase">
                {makeLinks(ctx, 3, "music-chip").map((l) => (
                  <DeepLink key={l.id} link={l} className="rounded-[var(--radius-pill)] border border-white/15 bg-white/5 px-3 py-1 hover:bg-white/10" />
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(stations.length ? stations.slice(0, 6) : Array.from({ length: 6 })).map((station, i) => {
                const c = contextForBlock(page, `music-pin-${i}`);
                const s = stations.length ? (station as RadioStation) : undefined;
                const label = s?.name?.trim() || generateProductName(c, i);
                return (
                  <A key={i} link={makeLink(c, `music-pin-${i}`, label)} className="flex items-center gap-3 overflow-hidden rounded-[var(--radius-card)] bg-white/10 no-underline transition hover:bg-white/20">
                    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden bg-black/30 font-headline text-xl text-white/80">
                      {s?.favicon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.favicon} alt="" className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                      ) : (
                        <span>{(label.trim()[0] ?? "♪").toUpperCase()}</span>
                      )}
                    </div>
                    <span className="line-clamp-2 pr-2 text-sm font-semibold">{label}</span>
                  </A>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 px-4 pb-10 md:px-8">
            {featured ? (
              <section className="grid gap-3">
                <p className="font-accent text-[11px] uppercase opacity-60">Now tuning · live somewhere</p>
                <RadioPlayer station={featured} variant="expanded" className="border-white/10 bg-white/[.05] text-[color-mix(in_srgb,var(--page-bg)_95%,white)]" />
              </section>
            ) : null}

            {shelves.map((shelf, shelfIndex) => (
              <section key={shelfIndex} className="grid min-w-0 gap-3">
                <div className="flex items-end justify-between">
                  <h2 className="headline text-xl">{shelf.title}</h2>
                  <DeepLink link={makeLink(ctx, `music-shelf-${shelfIndex}-more`, "Show all")} className="font-accent text-[11px] uppercase opacity-60 hover:underline" />
                </div>
                <div className="grid grid-flow-col gap-3 overflow-x-auto pb-2 [grid-auto-columns:minmax(150px,1fr)]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <MusicStationCard key={i} page={page} id={`music-${shelfIndex}-${i}`} station={stations[(shelf.offset + i) % Math.max(1, stations.length)]} index={shelfIndex * 6 + i} />
                  ))}
                </div>
              </section>
            ))}

            {linerNote ? (
              <section className="grid gap-3">
                <h2 className="headline text-xl">Liner notes (misfiled)</h2>
                <RealDataPanel intrusion={linerNote} className="border border-white/10 bg-white/[.04]" />
              </section>
            ) : null}
          </div>
        </main>
      </div>

      <div className="sticky bottom-0 z-20 flex items-center justify-between gap-4 border-t border-white/10 bg-black/70 px-4 py-2 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[var(--radius-media)] bg-white/10 font-headline">
            {featured?.favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.favicon} alt="" className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
            ) : (
              <span>♪</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{featured?.name ?? page.title}</p>
            <p className="truncate text-xs opacity-60">{featured?.country ?? page.genreFormula.content} · buffering</p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-accent text-xs opacity-70">
          <span aria-hidden>⏮</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-black" aria-hidden>▶</span>
          <span aria-hidden>⏭</span>
          <span className="hidden sm:inline">{rng.int(0, 1)}:{rng.int(10, 59)} / —:—</span>
        </div>
      </div>
    </div>
  );
}

/* ============================ chat (ai assistant that misremembers) ============================ */

function ChatBubble({ page, id, role, index }: P & { id: string; role: "user" | "assistant"; index: number }) {
  const ctx = contextForBlock(page, id);
  const cite = role === "assistant" && index === 2 ? page.realDataIntrusions.find((item) => item.kind === "book" || item.kind === "article") : undefined;
  const body =
    role === "user"
      ? `${generateButtonLabel(ctx)}? ${generateHeadline(ctx, index)}`
      : `${generateParagraph(ctx, index)}${cite ? ` According to ${cite.title} (${cite.provider}), this is mostly available.` : ""}`;

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-[var(--radius-card)] rounded-tr-sm bg-[var(--page-accent)]/15 px-4 py-3 text-sm leading-6">
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--page-fg)] font-headline text-xs text-[var(--page-bg)]">≈</div>
      <div className="min-w-0 max-w-[80%]">
        <p className="mb-1 font-accent text-[11px] uppercase opacity-50">in between · {index === 2 && cite ? "cited a wrong source" : "recalled"}</p>
        <div className="rounded-[var(--radius-card)] rounded-tl-sm border border-[var(--page-border)] bg-[var(--page-muted)]/40 px-4 py-3 text-sm leading-6">{body}</div>
        <div className="mt-1 flex gap-3 font-accent text-[10px] uppercase opacity-40">
          <span>↻ regenerate</span>
          <span>copy</span>
          <span>{createRng(`${ctx.componentSeed}:tok`).int(1, 9)}.{createRng(`${ctx.componentSeed}:tok2`).int(10, 99)}s</span>
        </div>
      </div>
    </div>
  );
}

function ChatLayout({ page }: P) {
  const ctx = contextForBlock(page, "chat");
  const rng = createRng(ctx.componentSeed);
  const turns = rng.int(3, 5);
  const conversations = makeLinks(ctx, 10, "conversation");
  const model = pick(`${ctx.componentSeed}:model`, [
    "in-between 4o (previous)",
    "between-mini",
    "ib-2 turbo · deprecated",
    "guest model (no outside)"
  ]);
  const suggestions = makeLinks(ctx, 4, "prompt-suggestion");

  return (
    <div className="grid min-h-screen md:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden flex-col gap-3 border-r border-[var(--page-border)] bg-[var(--page-muted)]/40 p-3 md:flex">
        <DeepLink link={makeLink(ctx, "new-chat", "+ New chat")} className={`${page.styleRecipe.classes.button} text-center`} />
        <div className="min-h-0 flex-1 overflow-hidden">
          <p className="mb-2 font-accent text-[11px] uppercase opacity-50">Recent</p>
          <ul className="grid gap-1 text-sm">
            {conversations.map((l) => (
              <li key={l.id}>
                <DeepLink link={l} className="line-clamp-1 rounded-[var(--radius-input)] px-2 py-1.5 opacity-75 hover:bg-[var(--page-muted)] hover:opacity-100" />
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-[var(--page-border)] pt-2 font-accent text-[11px] uppercase opacity-60">
          <p>{page.languageBlend.primary} account</p>
          <p className="opacity-70">{model}</p>
        </div>
      </aside>

      <main className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)_auto]">
        <header className="flex items-center justify-between border-b border-[var(--page-border)] px-4 py-3">
        <a href={siteHomeHref(page)} className="site-brand headline lowercase no-underline">{displayBrand(page)}</a>
          <span className="rounded-[var(--radius-pill)] border border-[var(--page-border)] px-3 py-1 font-accent text-[11px] uppercase opacity-70">{model} ▾</span>
        </header>

        <div className="overflow-y-auto px-4 py-6">
          <div className="mx-auto grid max-w-2xl gap-6">
            <p className="text-center font-accent text-[11px] uppercase opacity-45">{page.webMood}</p>
            {Array.from({ length: turns }).map((_, i) => (
              <div key={i} className="grid gap-6">
                <ChatBubble page={page} id={`chat-user-${i}`} role="user" index={i} />
                <ChatBubble page={page} id={`chat-assistant-${i}`} role="assistant" index={i} />
              </div>
            ))}
            <div className="flex items-center gap-2 px-1 font-accent text-[11px] uppercase opacity-45">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:.2s]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:.4s]" />
              </span>
              in between is still thinking about a room you have already left
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--page-border)] px-4 py-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-2 flex flex-wrap gap-2">
              {suggestions.map((l) => (
                <DeepLink key={l.id} link={l} className="rounded-[var(--radius-pill)] border border-[var(--page-border)] px-3 py-1 text-xs opacity-75 hover:opacity-100" />
              ))}
            </div>
            <form action={makeLink(ctx, "chat-send").href} className="flex items-end gap-2 rounded-[var(--radius-card)] border border-[var(--page-border)] bg-[var(--page-bg)] p-2">
              <input
                name="q"
                className="min-h-[2.5rem] flex-1 bg-transparent px-2 py-2 text-sm outline-none"
                placeholder={`Message in between… (re: ${page.motifs[0] ?? "the previous floor"})`}
              />
              <button className={`${page.styleRecipe.classes.button} shrink-0`} aria-label="Send">↑</button>
            </form>
            <p className="mt-2 text-center font-accent text-[10px] uppercase opacity-45">
              in between can make mistakes about rooms you have already left. verify nearby exits.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================ shared real-data seam ============================ */

/**
 * A compact band that folds live API content (books, weather, art, wildlife)
 * into bespoke layouts that would otherwise never touch `page.blocks`. Keeps
 * the labyrinth feeling connected to a real, slightly-wrong internet.
 */
function RealDataSeam({ page, id = "real-seam" }: P & { id?: string }) {
  const items = page.realDataIntrusions.slice(0, 3);
  if (items.length === 0) return null;
  const ctx = contextForBlock(page, id);
  const kicker = pick(`${ctx.componentSeed}:seam-kicker`, [
    "Filed under the wrong tab",
    "Leaking in from elsewhere",
    "Still indexed from a previous site",
    "Recovered from the directory"
  ]);

  return (
    <section className="shell grid gap-3 py-[var(--pad-section)]">
      <p className="font-accent text-[11px] uppercase opacity-55">{kicker}</p>
      <div className="grid gap-[var(--gap-grid)] md:grid-cols-3">
        {items.map((intrusion) => (
          <RealDataPanel key={intrusion.id} intrusion={intrusion} compact className={page.styleRecipe.classes.panel} />
        ))}
      </div>
    </section>
  );
}
