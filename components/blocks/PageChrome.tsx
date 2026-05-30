import type { GeneratedPage, LinkPacket } from "@/lib/types";
import { DeepLink } from "@/components/glitches/DeepLink";
import { SearchForm } from "@/components/interaction/SearchForm";
import { contextForBlock } from "@/lib/generatePage";
import { makeLink } from "@/lib/linkEngine";
import { createRng } from "@/lib/seed";
import { siteIdentity } from "@/lib/siteEngine";
import { languageLabel } from "@/content/i18n";

export function PageChrome({ page }: { page: GeneratedPage }) {
  switch (page.design.chromeVariant) {
    case "centered":
      return <CenteredChrome page={page} />;
    case "portal":
      return <PortalChrome page={page} />;
    case "mega":
      return <MegaChrome page={page} />;
    case "minimal":
      return <MinimalChrome page={page} />;
    case "stacked":
      return <StackedChrome page={page} />;
    default:
      return <ClassicChrome page={page} />;
  }
}

/* ---------------- shared pieces ---------------- */

function Brand({ page, className = "" }: { page: GeneratedPage; className?: string }) {
  const ctx = contextForBlock(page, "chrome-brand");
  const home = makeLink(ctx, "brand-home", "Home");
  return (
    <a href={home.href} className={`site-brand headline no-underline ${className}`}>
      {page.routeState.site.siteDepth > 0 ? siteIdentity(page.routeState.site) : "in between space"}
    </a>
  );
}

function SearchBox({ page, className = "" }: { page: GeneratedPage; className?: string }) {
  const ctx = contextForBlock(page, "chrome-search");
  const search = languageLabel(page.languageBlend.primary, "search");
  const action = makeLink(ctx, "chrome-search-submit", search).href;
  const placeholder = `${search} ${page.motifs[0] ?? "available"} ${page.motifs[1] ?? "listings"}`;
  return (
    <SearchForm
      fallbackHref={action}
      ariaLabel={search}
      placeholder={placeholder}
      formClassName={`flex items-stretch ${className}`}
      inputClassName="min-w-0 flex-1 border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[color-mix(in_srgb,var(--page-bg)_70%,white)] px-2 py-1 text-xs"
      buttonClassName="border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] border-l-0 bg-[var(--page-accent)] px-3 text-xs text-white"
      buttonLabel={languageLabel(page.languageBlend.primary, "go")}
    />
  );
}

function Utilities({ page }: { page: GeneratedPage }) {
  const cart = createRng(`${page.routeState.seed}:cart`).int(0, 77);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-accent text-[11px]">
      <span>{page.languageBlend.primary} ▾</span>
      <a href="/account" className="old-link">
        {languageLabel(page.languageBlend.primary, "guestLogin")}
      </a>
      <span className="rounded-[var(--radius-pill)] bg-[var(--page-accent)] px-2 py-[2px] text-white">{languageLabel(page.languageBlend.primary, "cart")} {cart}</span>
    </div>
  );
}

function NavLinks({ links, className = "", linkClass }: { links: LinkPacket[]; className?: string; linkClass?: (i: number) => string }) {
  return (
    <nav className={className}>
      {links.map((link, index) => (
        <DeepLink key={link.id} link={link} className={linkClass ? linkClass(index) : index % 3 === 0 ? "old-link" : "hover:underline"} />
      ))}
    </nav>
  );
}

function Ticker({ page }: { page: GeneratedPage }) {
  return (
    <div
      className="ticker border-t-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)]/70 py-1 font-accent text-[11px]"
      data-secondary={page.layoutComposition.secondary ?? "none"}
    >
      <span>
        {page.webMood} / {languageLabel(page.languageBlend.primary, "surface")}: {page.genreFormula.surface} / {languageLabel(page.languageBlend.primary, "content")}: {page.genreFormula.content} / {languageLabel(page.languageBlend.primary, "action")}: {page.genreFormula.action} /
        {languageLabel(page.languageBlend.primary, "residue")}: {page.genreFormula.residue} / {languageLabel(page.languageBlend.primary, "depth")} {page.routeState.depth} / {languageLabel(page.languageBlend.primary, "mediaProfile")}: {page.mediaProfile.name} / {languageLabel(page.languageBlend.primary, "languageFallback")}:{" "}
        {page.languageBlend.fallback} /&nbsp;
      </span>
    </div>
  );
}

function headerBorder() {
  return "border-b-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)]";
}

/* ---------------- variants ---------------- */

function ClassicChrome({ page }: { page: GeneratedPage }) {
  return (
    <header className={`site-header ${headerBorder()} backdrop-blur`}>
      <div className="shell flex flex-col gap-[var(--gap-tight)] py-[var(--pad-chrome)] sm:flex-row sm:items-end sm:justify-between">
        <Brand page={page} className="text-2xl lowercase" />
        <NavLinks links={page.navigation} className="flex flex-wrap gap-x-4 gap-y-2 font-accent text-xs" />
      </div>
      <Ticker page={page} />
    </header>
  );
}

function CenteredChrome({ page }: { page: GeneratedPage }) {
  return (
    <header className={`site-header ${headerBorder()} text-center`}>
      <div className="shell flex flex-col items-center gap-[var(--gap-tight)] py-[calc(var(--pad-chrome)*1.6)]">
        <Brand page={page} className="text-[clamp(1.6rem,4vw,2.6rem)] lowercase tracking-[var(--tracking)]" />
        <p className="font-accent text-[11px] uppercase opacity-70">
          {page.genreFormula.surface} · {languageLabel(page.languageBlend.primary, "remembering")} {page.genreFormula.residue}
        </p>
        <NavLinks
          links={page.navigation}
          className="mt-1 flex flex-wrap justify-center gap-x-5 gap-y-1 font-accent text-xs"
          linkClass={() => "hover:underline"}
        />
      </div>
    </header>
  );
}

function PortalChrome({ page }: { page: GeneratedPage }) {
  const year = createRng(`${page.routeState.seed}:portal-year`).int(1998, 2027);
  return (
    <header className="site-header">
      <div className={`bg-[var(--page-muted)]/80 ${headerBorder()}`}>
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-1 font-accent text-[11px]">
          <span>
            {page.languageBlend.primary} {languageLabel(page.languageBlend.primary, "edition")} · {languageLabel(page.languageBlend.primary, "est")} {year} · {page.webMood}
          </span>
          <Utilities page={page} />
        </div>
      </div>
      <div className={`shell flex flex-col gap-2 py-[var(--pad-chrome)] lg:flex-row lg:items-center lg:justify-between ${headerBorder()}`}>
        <Brand page={page} className="text-xl lowercase" />
        <SearchBox page={page} className="w-full max-w-sm" />
      </div>
      <div className={`bg-[color-mix(in_srgb,var(--page-bg)_85%,white)] ${headerBorder()}`}>
        <nav className="shell flex flex-wrap items-center gap-x-2 gap-y-1 py-1 text-[12px]">
          {page.navigation.map((link, index) => (
            <span key={link.id} className="flex items-center gap-2">
              {index > 0 && <span className="opacity-40">|</span>}
              <DeepLink link={link} className="old-link" />
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}

function MegaChrome({ page }: { page: GeneratedPage }) {
  return (
    <header className="site-header">
      <div className={`bg-[var(--page-muted)]/60 ${headerBorder()}`}>
        <div className="shell flex items-center justify-end py-1">
          <Utilities page={page} />
        </div>
      </div>
      <div className="shell grid gap-[var(--gap-grid)] py-[calc(var(--pad-chrome)*1.4)] lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Brand page={page} className="text-[clamp(1.8rem,4.5vw,3rem)] lowercase leading-none" />
          <p className="mt-1 font-accent text-[11px] uppercase opacity-70">
            {page.genreFormula.content} · {page.genreFormula.action}
          </p>
        </div>
        <SearchBox page={page} className="w-full lg:w-72" />
      </div>
      <NavLinks
        links={page.navigation}
        className={`shell flex flex-wrap gap-x-6 gap-y-2 py-2 font-accent text-[13px] ${headerBorder()} border-t-[length:var(--border-w)]`}
        linkClass={() => "font-medium uppercase hover:text-[var(--page-accent)]"}
      />
    </header>
  );
}

function MinimalChrome({ page }: { page: GeneratedPage }) {
  return (
    <header className="site-header">
      <div className="shell flex items-center justify-between py-[calc(var(--pad-chrome)*1.3)]">
        <Brand page={page} className="text-base lowercase tracking-[0.04em]" />
        <NavLinks
          links={page.navigation.slice(0, 3)}
          className="flex gap-x-6 font-accent text-[11px] uppercase"
          linkClass={() => "hover:underline"}
        />
      </div>
    </header>
  );
}

function StackedChrome({ page }: { page: GeneratedPage }) {
  const half = Math.ceil(page.navigation.length / 2);
  return (
    <header className={`site-header ${headerBorder()}`}>
      <Ticker page={page} />
      <div className="shell grid gap-[var(--gap-grid)] py-[var(--pad-chrome)] md:grid-cols-[auto_1fr] md:items-end">
        <div>
          <Brand page={page} className="text-3xl lowercase leading-none" />
          <p className="mt-1 font-accent text-[11px] uppercase opacity-70">{page.webMood}</p>
        </div>
        <div className="grid gap-1">
          <NavLinks links={page.navigation.slice(0, half)} className="flex flex-wrap gap-x-4 gap-y-1 font-accent text-xs" />
          <NavLinks
            links={page.navigation.slice(half)}
            className="flex flex-wrap gap-x-4 gap-y-1 font-accent text-[11px] opacity-80"
            linkClass={() => "old-link"}
          />
        </div>
      </div>
    </header>
  );
}
