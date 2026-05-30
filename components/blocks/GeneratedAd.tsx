import type { GeneratedComponentContext, GeneratedPage } from "@/lib/types";
import { contextForBlock } from "@/lib/generatePage";
import { selectImage } from "@/lib/imageEngine";
import { makeLink } from "@/lib/linkEngine";
import { mediaLoaderConfig } from "@/lib/loadingProfiles";
import { createRng, pick } from "@/lib/seed";
import { generateButtonLabel, localizedPhrase } from "@/lib/textEngine";
import { MediaFrame } from "./MediaFrame";
import { DismissibleAdShell } from "./GeneratedAdClient";

type GeneratedAdProps = {
  ctx: GeneratedComponentContext;
  className?: string;
  variant?: "banner" | "card" | "popover";
};

const callsToAction = [
  "Restore previous checkout",
  "Open local offer",
  "Download familiar version",
  "Reserve nearby access",
  "Compare public memory",
  "Continue with guest account"
];

const disclosures = ["sponsored", "public notice", "promoted result", "partner bulletin", "local offer"];

export function GeneratedAd({ ctx, className = "", variant = "banner" }: GeneratedAdProps) {
  const rng = createRng(`${ctx.componentSeed}:generated-ad`);
  const role = rng.bool(0.42) ? "video thumbnail fake ad" : "fake ad";
  const image = selectImage(ctx, role);
  const tagline = adTagline(ctx);
  const cta = ctx.languageBlend.primary === "English" ? pick(`${ctx.componentSeed}:ad-cta`, callsToAction) : generateButtonLabel(ctx);
  const disclosure = pick(`${ctx.componentSeed}:ad-disclosure`, disclosures);
  const link = makeLink(ctx, "generated-ad", cta);
  const isCard = variant === "card" || variant === "popover";

  return (
    <a
      href={link.href}
      className={`group grid h-full min-h-0 w-full overflow-hidden rounded-[var(--radius-card)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-muted)] text-[var(--page-fg)] no-underline shadow-[var(--shadow-panel)] ${isCard ? "" : "md:grid-cols-[minmax(180px,34%)_1fr]"} ${className}`}
      data-ad-variant={variant}
    >
      <div className={`min-h-0 ${isCard ? "aspect-[16/10]" : "aspect-[16/9] md:aspect-auto"}`}>
        <MediaFrame image={image} plain motion={rng.bool(0.5)} loader={mediaLoaderConfig(ctx)} />
      </div>
      <div className="grid min-w-0 content-center gap-3 p-4">
        <p className="font-accent text-[10px] uppercase tracking-wide opacity-65">{disclosure}</p>
        <p className={`headline leading-tight ${variant === "popover" ? "text-xl" : "text-2xl"}`}>{tagline}</p>
        <span className="w-fit rounded-[var(--radius-button)] border-[length:var(--border-w)] [border-style:var(--border-style)] border-[var(--page-border)] bg-[var(--page-bg)] px-3 py-1.5 font-accent text-xs uppercase">
          {cta}
        </span>
      </div>
    </a>
  );
}

export function RandomPageAd({ page }: { page: GeneratedPage }) {
  const rng = createRng(`${page.routeState.seed}:random-page-ad`);
  const suppressedLayouts: GeneratedPage["layout"][] = ["docs", "education", "search"];
  if (suppressedLayouts.includes(page.layout) || !rng.bool(0.24)) return null;

  const ctx = contextForBlock(page, "random-page-ad");
  const position = pick(`${page.routeState.seed}:random-page-ad-position`, ["top-right", "bottom-left", "center"] as const);

  return (
    <DismissibleAdShell delayMs={rng.int(900, 3400)} position={position}>
      <GeneratedAd ctx={ctx} variant="popover" />
    </DismissibleAdShell>
  );
}

export function adTagline(ctx: GeneratedComponentContext) {
  const subject = localizedPhrase(ctx, `${ctx.componentSeed}:ad-subject`);
  const endings = [
    `for ${ctx.motifs[0] ?? "today"}`,
    `before ${ctx.genreFormula.action}`,
    `with ${ctx.genreFormula.residue}`,
    "while supplies remember",
    "from a sponsor you already visited"
  ];
  return `${subject} ${pick(`${ctx.componentSeed}:ad-ending`, endings)}`;
}
