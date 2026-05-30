import type { CSSProperties, ReactNode } from "react";
import { DeepLink } from "@/components/glitches/DeepLink";
import { MutableText } from "@/components/glitches/MutableText";
import { InlineBlockLoader } from "@/components/loaders/LoadingEffects";
import { ProductExperience, type InteractionItem } from "@/components/interaction/ComposableUI";
import { RadioPlayer } from "@/components/radio/RadioPlayer";
import { chooseComponentGlitch, glitchClassName, type ComponentGlitch } from "@/lib/componentGlitches";
import { languageLabel } from "@/content/i18n";
import { contextForBlock } from "@/lib/generatePage";
import { selectImage } from "@/lib/imageEngine";
import { inlineLoaderForBlock, mediaLoaderConfig } from "@/lib/loadingProfiles";
import { makeLink, makeLinks } from "@/lib/linkEngine";
import { fetchRandomMusicRadioBrowserStations } from "@/lib/real-data";
import { seededRadioStations, toRadioStation } from "@/lib/radio";
import { createRng } from "@/lib/seed";
import {
  generateButtonLabel,
  generateFooterLine,
  generateFormLabel,
  generateHeadline,
  generateHeading,
  generateLoadingMessage,
  generateParagraph,
  generateProductDescription,
  generateProductName,
  generateSubheading,
  localizedPhrase
} from "@/lib/textEngine";
import type { BlockPacket, GeneratedPage, RealDataIntrusion } from "@/lib/types";
import { GeneratedAd } from "./GeneratedAd";
import { MediaFrame } from "./MediaFrame";
import { InlineBookReader, pickRealDataIntrusions, RealDataPanel } from "./RealDataIntrusion";

type BlockProps = { page: GeneratedPage; id: string };

export function GeneratedBlock({ page, block }: { page: GeneratedPage; block: BlockPacket }) {
  let content: ReactNode;

  switch (block.type) {
    case "hero":
      content = <Hero page={page} id={block.id} />;
      break;
    case "productGrid":
      content = <ProductGrid page={page} id={block.id} />;
      break;
    case "newsPortal":
      content = <NewsPortal page={page} id={block.id} />;
      break;
    case "blogArticle":
      content = <BlogArticle page={page} id={block.id} />;
      break;
    case "directory":
      content = <DirectoryBlock page={page} id={block.id} />;
      break;
    case "form":
      content = <FormBlock page={page} id={block.id} />;
      break;
    case "ad":
      content = <AdBlock page={page} id={block.id} />;
      break;
    case "realData":
      content = <RealDataBlock page={page} id={block.id} />;
      break;
    case "dashboard":
      content = <DashboardBlock page={page} id={block.id} />;
      break;
    case "footer":
      content = <FooterElsewhere page={page} id={block.id} />;
      break;
  }

  return (
    <BrokenBlockShell glitch={chooseComponentGlitch(`${page.routeState.seed}:${block.id}`, page.routeState.depth, block.type)}>
      {content}
    </BrokenBlockShell>
  );
}

/* ---------------- shared ---------------- */

function BrokenBlockShell({ glitch, children }: { glitch: ComponentGlitch; children: ReactNode }) {
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

function Section({ children, className = "", flush = false }: { children: ReactNode; className?: string; flush?: boolean }) {
  return <section className={`${flush ? "" : "shell"} py-[var(--pad-section)] ${className}`}>{children}</section>;
}

function Kicker({ children }: { children: ReactNode }) {
  return <p className="font-accent text-[11px] uppercase tracking-[0.12em] opacity-75">{children}</p>;
}

function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`headline text-[length:var(--text-h2)] ${className}`}>{children}</h2>;
}

/* ---------------- hero variants ---------------- */

function Hero({ page, id }: BlockProps) {
  switch (page.design.heroVariant) {
    case "full-bleed":
      return <HeroFullBleed page={page} id={id} />;
    case "masthead":
      return <HeroMasthead page={page} id={id} />;
    case "centered":
      return <HeroCentered page={page} id={id} />;
    case "card-stack":
      return <HeroCardStack page={page} id={id} />;
    case "dashboard":
      return <HeroDashboard page={page} id={id} />;
    case "catalog":
      return <HeroCatalog page={page} id={id} />;
    default:
      return <HeroSplit page={page} id={id} />;
  }
}

function MotifTags({ page }: { page: GeneratedPage }) {
  return (
    <div className="mb-3 flex flex-wrap gap-[var(--gap-tight)]">
      {page.motifs.slice(0, 4).map((motif) => (
        <span className={page.styleRecipe.classes.tag} key={motif}>
          {motif}
        </span>
      ))}
    </div>
  );
}

function HeroHeadline({ page, text, className = "" }: { page: GeneratedPage; text: string; className?: string }) {
  return <h1 className={`headline max-w-[15ch] text-[length:var(--text-hero)] ${className}`}>{text}</h1>;
}

function HeroSplit({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const image = selectImage(ctx, "hero background");
  const cta = makeLink(ctx, "hero-cta", generateButtonLabel(ctx));
  const secondary = makeLink(ctx, "hero-secondary", languageLabel(page.languageBlend.primary, "openGuestDirectory"));

  return (
    <section className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
      <div className="shell grid min-h-[var(--hero-min-h)] content-end gap-[var(--gap-grid)] py-[var(--pad-section)] lg:grid-cols-[1.35fr_.65fr] lg:items-end">
        <div>
          <MotifTags page={page} />
          <HeroHeadline page={page} text={page.title} className="leading-[0.88]" />
          <MutableText
            as="p"
            initial={page.subtitle}
            variants={[
              generateSubheading({ ...ctx, componentSeed: `${ctx.componentSeed}:variant-a` }),
              generateSubheading({ ...ctx, componentSeed: `${ctx.componentSeed}:variant-b` })
            ]}
            className="mt-5 max-w-3xl text-lg leading-7"
          />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <DeepLink link={cta} className={recipe.classes.button} />
            <DeepLink link={secondary} className="text-sm underline underline-offset-4" />
          </div>
        </div>
        <div className="grid gap-[var(--gap-grid)]">
          <MediaFrame image={image} className="aspect-[4/3]" label={generateLoadingMessage(ctx)} loader={mediaLoaderConfig(ctx)} />
          <BookingStrip page={page} id={`${id}-booking`} />
        </div>
      </div>
    </section>
  );
}

function HeroFullBleed({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const image = selectImage(ctx, "hero background");
  const cta = makeLink(ctx, "hero-cta", generateButtonLabel(ctx));

  return (
    <section className="relative min-h-[var(--hero-min-h)] overflow-hidden border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
      <MediaFrame image={image} className="absolute inset-0 h-full w-full rounded-none border-0" plain motion />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />
      <div className="shell relative flex min-h-[var(--hero-min-h)] flex-col justify-end gap-[var(--gap-grid)] py-[var(--pad-section)] text-white">
        <Kicker>{page.genreFormula.surface} · {page.webMood}</Kicker>
        <HeroHeadline page={page} text={page.title} className="max-w-[18ch] leading-[0.9] [text-shadow:0_2px_24px_rgba(0,0,0,.5)]" />
        <p className="max-w-2xl text-lg leading-7 text-white/90">{page.subtitle}</p>
        <div className="mt-2">
          <BookingStrip page={page} id={`${id}-booking`} overlay />
        </div>
        <DeepLink link={cta} className={`${recipe.classes.button} w-fit`} />
      </div>
    </section>
  );
}

function HeroMasthead({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const decks = [0, 1, 2].map((i) => generateHeadline(ctx, i));
  return (
    <section className="border-b-[3px] [border-style:var(--border-style)] border-[var(--page-fg)]">
      <div className="shell flex min-h-[var(--hero-min-h)] flex-col justify-center gap-[var(--gap-grid)] py-[var(--pad-section)]">
        <div className="flex items-center justify-between border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pb-2 font-accent text-[11px] uppercase">
          <span>{page.languageBlend.primary} {languageLabel(page.languageBlend.primary, "desk")}</span>
          <span>{page.motifs[0]} · {page.routeState.depth} {languageLabel(page.languageBlend.primary, "editions")}</span>
        </div>
        <HeroHeadline page={page} text={page.title} className="max-w-[20ch] leading-[0.92]" />
        <p className="max-w-3xl text-xl leading-8">{page.subtitle}</p>
        <div className="grid gap-[var(--gap-grid)] border-t-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pt-4 md:grid-cols-3">
          {decks.map((deck, index) => (
            <div key={index} className="border-l-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pl-3">
              <Kicker>{languageLabel(page.languageBlend.primary, "column")} {index + 1}</Kicker>
              <p className="mt-1 leading-6">{deck}.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroCentered({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const cta = makeLink(ctx, "hero-cta", generateButtonLabel(ctx));
  const secondary = makeLink(ctx, "hero-secondary", localizedPhrase(ctx, `${ctx.componentSeed}:hero-2`));

  return (
    <section className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
      <div className="shell flex min-h-[var(--hero-min-h)] flex-col items-center justify-center gap-[var(--gap-grid)] py-[var(--pad-section)] text-center">
        <Kicker>{page.genreFormula.content} · since {createRng(ctx.componentSeed).int(1999, 2024)}</Kicker>
        <HeroHeadline page={page} text={page.title} className="max-w-[20ch] text-balance leading-[0.95]" />
        <p className="max-w-2xl text-lg leading-7 opacity-90">{page.subtitle}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <DeepLink link={cta} className={recipe.classes.button} />
          <DeepLink link={secondary} className="text-sm underline underline-offset-4" />
        </div>
      </div>
    </section>
  );
}

function HeroCardStack({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  return (
    <section className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
      <div className="shell grid gap-[var(--gap-grid)] py-[var(--pad-section)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <MotifTags page={page} />
            <HeroHeadline page={page} text={page.title} className="leading-[0.92]" />
          </div>
          <p className="max-w-sm text-sm leading-6 opacity-90">{page.subtitle}</p>
        </div>
        <div className="grid gap-[var(--gap-grid)] sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => {
            const cardCtx = { ...ctx, componentId: `${id}-card-${index}`, componentSeed: `${ctx.componentSeed}:card:${index}` };
            const image = selectImage(cardCtx, index === 1 ? "video thumbnail" : "product image");
            const link = makeLink(cardCtx, `hero-card-${index}`, generateButtonLabel(cardCtx, index));
            return (
              <article key={index} className={`${recipe.classes.panel} grid gap-2`}>
                <MediaFrame image={image} className="aspect-[16/10]" loader={mediaLoaderConfig(cardCtx)} />
                <H2 className="text-xl">{generateProductName(cardCtx, index)}</H2>
                <p className="text-sm leading-6">{generateProductDescription(cardCtx, index)}</p>
                <DeepLink link={link} className="text-sm font-semibold underline underline-offset-4" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HeroDashboard({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const tiles = ["availableFloors", "bookingsWaiting", "cartWeather", "quietListings"] as const;
  return (
    <section className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
      <div className="shell grid gap-[var(--gap-grid)] py-[var(--pad-section)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Kicker>signed in as guest · {page.genreFormula.action}</Kicker>
            <HeroHeadline page={page} text={page.title} className="text-[length:var(--text-h2)] leading-tight md:text-[length:var(--text-hero)]" />
          </div>
          <DeepLink link={makeLink(ctx, "hero-cta", generateButtonLabel(ctx))} className={recipe.classes.button} />
        </div>
        <div className="grid gap-[var(--gap-grid)] sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile, index) => {
            const r = createRng(`${ctx.componentSeed}:tile:${index}`);
            return (
            <div key={tile} className={`${recipe.classes.panel}`}>
                <p className="font-accent text-[11px] uppercase opacity-70">{languageLabel(page.languageBlend.primary, tile)}</p>
                <p className="mt-2 text-3xl font-semibold">{r.int(0, 9999)}</p>
                <p className="mt-1 text-xs opacity-70">{r.bool() ? "+" : "-"}{r.int(1, 40)}% {languageLabel(page.languageBlend.primary, "sincePreviousTab")}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HeroCatalog({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  return (
    <section className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]">
      <div className={`bg-[var(--page-accent)] text-white`}>
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-2 font-accent text-xs uppercase">
          <span>{languageLabel(page.languageBlend.primary, "freeShipping")} {languageLabel(page.languageBlend.primary, "freeShippingSuffix")} · {page.motifs[0]}</span>
          <span>{languageLabel(page.languageBlend.primary, "ends")} {createRng(ctx.componentSeed).int(1, 28)} {languageLabel(page.languageBlend.primary, "morning")}</span>
        </div>
      </div>
      <div className="shell grid gap-[var(--gap-grid)] py-[var(--pad-section)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <HeroHeadline page={page} text={page.title} className="text-[length:var(--text-h2)] leading-tight md:text-[clamp(2rem,6vw,4rem)]" />
          <DeepLink link={makeLink(ctx, "hero-cta", languageLabel(page.languageBlend.primary, "continueShoppingLater"))} className={recipe.classes.button} />
        </div>
        <div className="grid grid-flow-col gap-[var(--gap-grid)] overflow-x-auto pb-2 [grid-auto-columns:minmax(180px,1fr)]">
          {[0, 1, 2, 3, 4].map((index) => {
            const cardCtx = { ...ctx, componentId: `${id}-strip-${index}`, componentSeed: `${ctx.componentSeed}:strip:${index}` };
            const image = selectImage(cardCtx, "product image");
            const link = makeLink(cardCtx, `strip-${index}`, languageLabel(page.languageBlend.primary, "add"));
            return (
              <article key={index} className={`${recipe.classes.panel} grid gap-2`}>
                <MediaFrame image={image} className="aspect-square" loader={mediaLoaderConfig(cardCtx)} />
                <p className="text-sm font-semibold leading-tight">{generateProductName(cardCtx, index)}</p>
                <div className="flex items-center justify-between">
                  <span className="font-accent text-sm">{priceFor(cardCtx.componentSeed)}</span>
                  <DeepLink link={link} className="text-xs font-semibold underline" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BookingStrip({ page, id, overlay = false }: BlockProps & { overlay?: boolean }) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const labels = [0, 1, 2].map((index) => generateFormLabel(ctx, index));

  return (
    <form
      className={`${overlay ? "border-[length:var(--border-w)] border-white/40 bg-white/10 backdrop-blur p-3 text-white rounded-[var(--radius-card)]" : recipe.classes.panel} grid gap-2 sm:grid-cols-3`}
      action={makeLink(ctx, "booking-submit").href}
    >
      {labels.map((label, index) => (
        <label key={label} className="grid gap-1 text-xs">
          <span className="font-accent uppercase">{label}</span>
          <input
            className="min-w-0 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-white px-2 py-2 text-black"
            defaultValue={index === 2 ? page.motifs[0] : ""}
          />
        </label>
      ))}
    </form>
  );
}

/* ---------------- content blocks ---------------- */

function ProductGrid({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const rng = createRng(ctx.componentSeed);
  const inlineLoader = inlineLoaderForBlock(page, id);
  const items = Array.from({ length: rng.int(4, page.routeState.depth > 10 ? 9 : 6) });
  const productItems: InteractionItem[] = items.map((_, index) => {
    const itemCtx = { ...ctx, componentId: `${id}-product-${index}`, componentSeed: `${ctx.componentSeed}:product:${index}` };
    const link = makeLink(itemCtx, `product-${index}`, generateButtonLabel(itemCtx, index));
    const imageRoles = ["product image", "video thumbnail", "catalog detail"];
    return {
      id: itemCtx.componentId,
      title: generateProductName(itemCtx, index),
      description: generateProductDescription(itemCtx, index),
      href: link.href,
      price: priceFor(itemCtx.componentSeed),
      meta: link.label,
      tags: [page.motifs[index % page.motifs.length] ?? "listing", page.genreFormula.content, index % 2 ? "video" : "product"].filter(Boolean),
      images: imageRoles.map((role, imageIndex) => {
        const image = selectImage({ ...itemCtx, componentSeed: `${itemCtx.componentSeed}:image-option:${imageIndex}` }, role);
        return { src: image.src, alt: image.alt, label: role, cssFilter: image.cssFilter, pixelated: image.pixelated, aging: image.aging };
      })
    };
  });
  // sidebar position varies per block, sometimes absent entirely.
  const layout = rng.int(0, 2); // 0 = sidebar left, 1 = sidebar right, 2 = no sidebar
  const cols = layout === 2 ? "" : layout === 0 ? "lg:grid-cols-[220px_1fr]" : "lg:grid-cols-[1fr_220px]";

  const sidebar =
    layout === 2 ? null : (
      <aside className={`${recipe.classes.intrusionPanel} ${layout === 1 ? "lg:order-last" : ""}`}>
        <h3 className="mb-2 font-bold">{languageLabel(page.languageBlend.primary, "featuredDepartments")}</h3>
        <ul className="grid gap-1">
          {makeLinks(ctx, 7, "department").map((link) => (
            <li key={link.id}>
              <DeepLink link={link} className="old-link" />
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs">{generateLoadingMessage(ctx)}...</p>
      </aside>
    );

  return (
    <Section className={`grid gap-[var(--gap-grid)] ${cols}`}>
      {layout === 0 && sidebar}
      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <H2 className="text-3xl">{generateHeading(ctx)}</H2>
          <span className={recipe.classes.tag}>{languageLabel(page.languageBlend.primary, "cart")} {rng.int(0, 77)}</span>
        </div>
        {inlineLoader ? (
          <InlineBlockLoader variant={inlineLoader.variant} message={inlineLoader.message} durationMs={inlineLoader.durationMs} stuck={inlineLoader.stuck} />
        ) : null}
        <ProductExperience
          items={productItems}
          links={makeLinks(ctx, 7, "department")}
          classes={recipe.classes}
          title={generateHeading({ ...ctx, componentSeed: `${ctx.componentSeed}:interactive-title` })}
          placeholder={`${languageLabel(page.languageBlend.primary, "search")} ${page.motifs[0] ?? "products"}`}
        />
      </div>
      {layout === 1 && sidebar}
    </Section>
  );
}

function NewsPortal({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const headlines = Array.from({ length: page.routeState.depth > 8 ? 9 : 6 });
  const image = selectImage(ctx, "news thumbnail");
  const railLeft = createRng(`${ctx.componentSeed}:rail`).bool();
  const inlineLoader = inlineLoaderForBlock(page, id);

  const rail = (
    <aside className={recipe.classes.intrusionPanel}>
      <h3 className="font-bold">{languageLabel(page.languageBlend.primary, "alsoInCheckout")}</h3>
      <p className="mt-2 leading-6">{generateParagraph(ctx, 0)}</p>
    </aside>
  );

  return (
    <Section className={`grid gap-[var(--gap-grid)] ${railLeft ? "xl:grid-cols-[310px_1fr]" : "xl:grid-cols-[1fr_310px]"}`}>
      {railLeft && rail}
      <div className={recipe.classes.panel}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pb-2">
          <H2 className="text-2xl">{languageLabel(page.languageBlend.primary, "localPortal")} / {page.motifs[0]}</H2>
          <span className="text-sm">{languageLabel(page.languageBlend.primary, "weather")}: {createRng(ctx.componentSeed).int(38, 91)}F {languageLabel(page.languageBlend.primary, "archived")}</span>
        </div>
        <div className="grid gap-[var(--gap-grid)] md:grid-cols-[.8fr_1.2fr]">
          <MediaFrame image={image} className="aspect-[4/3]" label={languageLabel(page.languageBlend.primary, "breakingPreview")} loader={mediaLoaderConfig(ctx)} />
          <ul className="grid gap-2">
            {inlineLoader ? (
              <li>
                <InlineBlockLoader variant={inlineLoader.variant} message={inlineLoader.message} durationMs={inlineLoader.durationMs} stuck={inlineLoader.stuck} />
              </li>
            ) : null}
            {headlines.map((_, index) => {
              const link = makeLink(ctx, `headline-${index}`, generateHeadline(ctx, index));
              return (
                <li key={index} className="border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] pb-2">
                  <DeepLink link={link} className="font-semibold hover:underline" />
                  <p className="font-accent text-[11px] uppercase opacity-75">
                    {index + 3}:0{index} AM / market {createRng(`${ctx.componentSeed}:${index}`).int(-14, 44)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {!railLeft && rail}
    </Section>
  );
}

function BlogArticle({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const image = selectImage(ctx, "blog image");

  return (
    <Section className="grid gap-[var(--gap-grid)] lg:grid-cols-[minmax(0,1fr)_280px]">
      <article className={recipe.classes.panel}>
        <Kicker>
          {page.languageBlend.primary} with {page.languageBlend.contamination}
        </Kicker>
        <H2 className="mt-1 max-w-3xl text-4xl leading-tight">{generateHeading(ctx)}</H2>
        <MediaFrame image={image} className="my-4 aspect-[16/7]" label={languageLabel(page.languageBlend.primary, "articleIllustration")} loader={mediaLoaderConfig(ctx)} />
        {[0, 1, 2].map((index) => (
          <MutableText
            key={index}
            as="p"
            initial={generateParagraph(ctx, index)}
            variants={[generateParagraph({ ...ctx, componentSeed: `${ctx.componentSeed}:mutated:${index}` }, index)]}
            className="mb-4 max-w-3xl leading-7"
          />
        ))}
      </article>
      <aside className={recipe.classes.intrusionPanel}>
        <h3 className="mb-2 font-bold">{languageLabel(page.languageBlend.primary, "relatedRoomPosts")}</h3>
        <ul className="grid gap-2">
          {makeLinks(ctx, 6, "article-side").map((link) => (
            <li key={link.id}>
              <DeepLink link={link} className="old-link" />
            </li>
          ))}
        </ul>
      </aside>
    </Section>
  );
}

function DirectoryBlock({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const links = makeLinks(ctx, page.routeState.depth > 15 ? 18 : 12, "directory");
  const cols = createRng(`${ctx.componentSeed}:cols`).int(2, 4);

  return (
    <Section>
      <div className={recipe.classes.intrusionPanel}>
        <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_auto]">
          <h2 className="font-accent text-xl uppercase">{languageLabel(page.languageBlend.primary, "openDirectory")}</h2>
          <span className="text-xs">{languageLabel(page.languageBlend.primary, "lastChecked")}: {createRng(ctx.componentSeed).int(1998, 2028)}</span>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {links.map((link, index) => (
            <DeepLink key={link.id} link={{ ...link, label: `${index + 1}. ${link.label}` }} className="old-link text-sm" />
          ))}
        </div>
      </div>
    </Section>
  );
}

function FormBlock({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const submit = makeLink(ctx, "form-submit", generateButtonLabel(ctx));

  return (
    <Section>
      <form className={`${recipe.classes.panel} grid gap-[var(--gap-grid)] md:grid-cols-2`} action={submit.href}>
        <div>
          <H2 className="text-3xl">{generateHeading(ctx)}</H2>
          <p className="mt-2 leading-6">{generateSubheading(ctx)}</p>
        </div>
        <div className="grid gap-3">
          {[0, 1, 2, 3].map((index) => (
            <label key={index} className="grid gap-1 text-sm">
              <span className="font-accent uppercase">{generateFormLabel(ctx, index)}</span>
              <input
                className="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-white/90 px-3 py-2 text-black"
                defaultValue={index === 1 ? page.motifs[index] : ""}
              />
            </label>
          ))}
          <DeepLink link={submit} className={recipe.classes.button} />
        </div>
      </form>
    </Section>
  );
}

function AdBlock({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);

  return (
    <Section className="!py-[calc(var(--pad-section)*0.6)]">
      <GeneratedAd ctx={ctx} />
    </Section>
  );
}

async function RealDataBlock({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const rng = createRng(ctx.componentSeed);
  const intrusions = pickRealDataIntrusions(ctx.componentSeed, page.realDataIntrusions, rng.int(2, 4));
  const book = page.realDataIntrusions.find((intrusion) => intrusion.kind === "book");
  const weather = page.realDataIntrusions.find((intrusion) => intrusion.kind === "weather");
  const recipeIntrusion = page.realDataIntrusions.find((intrusion) => intrusion.kind === "recipe");
  const variant = page.layout === "streaming" || page.layout === "short-video"
    ? "broadcast"
    : page.layout === "minimal-blog" || page.layout === "docs" || page.layout === "education"
      ? "bookstore"
      : rng.bool(0.42)
        ? "bookstore"
        : rng.bool(0.55)
          ? "records"
          : "broadcast";
  const radioResult = variant === "broadcast" ? await fetchRandomMusicRadioBrowserStations(12) : undefined;
  const radioStations = radioResult ? seededRadioStations(`${ctx.componentSeed}:stations`, radioResult.data.map(toRadioStation), 3) : [];

  if (!intrusions.length) return null;

  if (variant === "bookstore" && book) {
    const side = [weather, recipeIntrusion, ...intrusions]
      .filter((intrusion): intrusion is RealDataIntrusion => Boolean(intrusion))
      .filter((intrusion) => intrusion.id !== book.id);

    return (
      <Section className="grid gap-[var(--gap-grid)] lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
        <article className={`${recipe.classes.panel} overflow-hidden`}>
          <div className="grid gap-4 p-4 md:grid-cols-[160px_1fr]">
            {book.imageUrl ? (
              <div className="overflow-hidden rounded-[var(--radius-media)] border border-[var(--page-border)] bg-[var(--page-muted)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={book.imageUrl} alt="" className="aspect-[2/3] h-full w-full object-cover" loading="lazy" />
              </div>
            ) : null}
            <div>
              <p className="font-accent text-[11px] uppercase opacity-60">bookstore blog / open shelf</p>
              <H2 className="mt-1 text-4xl">{book.title}</H2>
              <p className="mt-3 max-w-2xl leading-7 opacity-78">{book.body}</p>
              <InlineBookReader intrusion={book} />
            </div>
          </div>
        </article>
        <aside className="grid content-start gap-3">
          {side.slice(0, 3).map((intrusion) => (
            <RealDataPanel key={intrusion.id} intrusion={intrusion} compact className={recipe.classes.intrusionPanel} />
          ))}
        </aside>
      </Section>
    );
  }

  if (variant === "broadcast" && radioStations.length) {
    return (
      <Section>
        <div className={`${recipe.classes.panel} grid gap-5`}>
          <div className="grid gap-2 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-accent text-[11px] uppercase opacity-60">watch queue became a radio shelf</p>
              <H2 className="text-3xl">Live stations filed as playable thumbnails</H2>
            </div>
            {weather ? <p className="max-w-xs text-sm opacity-70">{weather.body}</p> : null}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {radioStations.map((station) => (
              <RadioPlayer key={station.stationuuid} station={station} variant="expanded" className="min-h-full" />
            ))}
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section className="grid gap-[var(--gap-grid)] lg:grid-cols-[.75fr_1.25fr]">
      <aside className={recipe.classes.intrusionPanel}>
        <p className="font-accent text-[11px] uppercase opacity-60">public records drawer</p>
        <H2 className="mt-1 text-2xl">The page is using proper facts as office furniture</H2>
        <p className="mt-2 text-sm leading-6 opacity-75">
          Weather, species records, museum labels, recipes, and encyclopedia scraps have been sorted into {page.genreFormula.action}.
        </p>
      </aside>
      <div className="grid gap-3 sm:grid-cols-2">
        {intrusions.map((intrusion) => (
          <RealDataPanel key={intrusion.id} intrusion={intrusion} className={recipe.classes.panel} />
        ))}
      </div>
    </Section>
  );
}

function DashboardBlock({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);
  const recipe = page.styleRecipe;
  const metrics = ["bookingsWaiting", "cartWeather", "visibleFloors", "newsletterRooms"] as const;
  const image = selectImage(ctx, "dashboard preview");
  const inlineLoader = inlineLoaderForBlock(page, id);

  return (
    <Section className="grid gap-[var(--gap-grid)] lg:grid-cols-[1fr_.75fr]">
      <div className={recipe.classes.panel}>
        <H2 className="text-2xl">{languageLabel(page.languageBlend.primary, "accountSurface")}</H2>
        {inlineLoader ? (
          <InlineBlockLoader variant={inlineLoader.variant} message={inlineLoader.message} durationMs={inlineLoader.durationMs} stuck={inlineLoader.stuck} />
        ) : null}
        <div className="mt-4 grid gap-[var(--gap-grid)] sm:grid-cols-2">
          {metrics.map((metric, index) => (
            <div key={metric} className="rounded-[var(--radius-card)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-white/60 p-3">
              <p className="font-accent text-[11px] uppercase opacity-70">{languageLabel(page.languageBlend.primary, metric)}</p>
              <p className="mt-3 text-3xl font-semibold">{createRng(`${ctx.componentSeed}:metric:${index}`).int(0, 9999)}</p>
              <p className="text-xs">{generateLoadingMessage({ ...ctx, componentSeed: `${ctx.componentSeed}:metric:${index}` })}</p>
            </div>
          ))}
        </div>
      </div>
      <MediaFrame image={image} className="aspect-[4/3]" label={languageLabel(page.languageBlend.primary, "emptyChartPreview")} loader={mediaLoaderConfig(ctx)} />
    </Section>
  );
}

function FooterElsewhere({ page, id }: BlockProps) {
  const ctx = contextForBlock(page, id);

  return (
    <footer className="mt-8 border-t-2 border-[var(--page-border)] bg-[var(--page-muted)]/80">
      <div className="shell grid gap-[var(--gap-grid)] py-[var(--pad-section)] md:grid-cols-3">
        <div>
          <h2 className="headline text-2xl">{languageLabel(page.languageBlend.primary, "guestbookPolicySitemap")}</h2>
          <p className="mt-2 text-sm leading-6">{generateFooterLine(ctx)}</p>
        </div>
        <ul className="grid gap-1 font-accent text-xs">
          {makeLinks(ctx, 8, "footer").map((link) => (
            <li key={link.id}>
              <DeepLink link={link} className="old-link" />
            </li>
          ))}
        </ul>
        <div className="text-sm">
          <p>
            {languageLabel(page.languageBlend.primary, "language")}: {page.languageBlend.primary} / {page.languageBlend.contamination}
          </p>
          <p>{languageLabel(page.languageBlend.primary, "support")}: 1-800-{createRng(ctx.componentSeed).int(100, 999)}-ROOM</p>
          <p className="mt-3 font-accent text-xs">
            {languageLabel(page.languageBlend.primary, "mediaMetadataRetainedIn")} <a href="/media-credits" className="old-link">/media-credits</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}

function priceFor(seed: string) {
  const rng = createRng(`${seed}:price`);
  const prices = ["$14.95", "$404.00", "€8,800", "¥0", "3 payments of later", `$${rng.int(7, 98)}.${rng.int(0, 99).toString().padStart(2, "0")}`];
  return prices[rng.int(0, prices.length - 1)];
}
