import type { CSSProperties, ReactNode } from "react";
import { routeWordBanks } from "@/lib/routeCodec";

const HEADER = "in between space";
const DESCRIPTION = "The liminal space of the internet. Search forever, find nothing.";

type FontDef = { var: string; fallback: string };

const FONT_CATEGORIES: Record<string, FontDef[]> = {
  sans: [
    { var: "--font-inter", fallback: "system-ui, sans-serif" },
    { var: "--font-space", fallback: "system-ui, sans-serif" },
    { var: "--font-archivo", fallback: "system-ui, sans-serif" },
    { var: "--font-manrope", fallback: "system-ui, sans-serif" },
    { var: "--font-sora", fallback: "system-ui, sans-serif" },
    { var: "--font-nunito", fallback: "system-ui, sans-serif" },
    { var: "--font-worksans", fallback: "system-ui, sans-serif" }
  ],
  serif: [
    { var: "--font-lora", fallback: "Georgia, serif" },
    { var: "--font-fraunces", fallback: "Georgia, serif" },
    { var: "--font-playfair", fallback: "Georgia, serif" },
    { var: "--font-dmserif", fallback: "Georgia, serif" },
    { var: "--font-robotoslab", fallback: "Georgia, serif" }
  ],
  display: [
    { var: "--font-bebas", fallback: "Impact, sans-serif" },
    { var: "--font-oswald", fallback: "Impact, sans-serif" },
    { var: "--font-archivoblack", fallback: "Impact, sans-serif" }
  ],
  mono: [
    { var: "--font-ibm-plex-mono", fallback: "ui-monospace, monospace" },
    { var: "--font-spacemono", fallback: "ui-monospace, monospace" },
    { var: "--font-vt323", fallback: "ui-monospace, monospace" }
  ],
  hand: [{ var: "--font-caveat", fallback: "cursive" }],
  pixel: [
    { var: "--font-pressstart", fallback: "ui-monospace, monospace" },
    { var: "--font-vt323", fallback: "ui-monospace, monospace" }
  ]
};

const ALL_FONTS = Object.values(FONT_CATEGORIES).flat();

const ANIMATIONS = ["ibs-fade", "ibs-rise", "ibs-flicker", "ibs-pulse", "ibs-blur", "ibs-sway", "ibs-driftbg"];

const BUTTON_LABELS = [
  "take me there",
  "take me somewhere",
  "go nowhere",
  "wander in",
  "lose yourself",
  "step through",
  "open a door",
  "begin wandering",
  "somewhere else",
  "find out",
  "i'm not sure",
  "let me in",
  "deeper",
  "show me something",
  "anywhere but here",
  "continue",
  "press to forget",
  "no destination",
  "enter the in between",
  "keep looking"
];

function rand() {
  return Math.random();
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}

function chance(p: number) {
  return rand() < p;
}

function fontFamily(font: FontDef) {
  return `var(${font.var}), ${font.fallback}`;
}

function font(category?: keyof typeof FONT_CATEGORIES) {
  const list = category ? FONT_CATEGORIES[category] : ALL_FONTS;
  return fontFamily(pick(list));
}

function randomDestination(): string {
  const { routeSections, adjectives, commerceNouns, mediaNouns, hotelNouns, newsNouns, interfaceNouns, timeFragments, verbs, motifs } =
    routeWordBanks;
  const nouns = [...commerceNouns, ...mediaNouns, ...hotelNouns, ...newsNouns, ...interfaceNouns];
  const parts = [
    pick(adjectives),
    pick(nouns),
    chance(0.5) ? pick(verbs) : pick(timeFragments),
    chance(0.4) ? pick(motifs) : undefined
  ].filter(Boolean);
  return `/${pick(routeSections)}/${parts.join("-")}`;
}

type Theme = {
  dark: boolean;
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
  accentText: string;
  muted: string;
  line: string;
  hue: number;
};

function buildTheme(): Theme {
  const dark = chance(0.6);
  const hue = Math.floor(rand() * 360);
  const accentHue = (hue + 70 + Math.floor(rand() * 220)) % 360;
  const accent2Hue = (accentHue + 40 + Math.floor(rand() * 120)) % 360;

  const bg = dark
    ? `hsl(${hue}, ${6 + Math.floor(rand() * 28)}%, ${4 + Math.floor(rand() * 9)}%)`
    : `hsl(${hue}, ${10 + Math.floor(rand() * 40)}%, ${87 + Math.floor(rand() * 10)}%)`;
  const fg = dark
    ? `hsl(${hue}, ${4 + Math.floor(rand() * 16)}%, ${82 + Math.floor(rand() * 14)}%)`
    : `hsl(${hue}, ${18 + Math.floor(rand() * 28)}%, ${7 + Math.floor(rand() * 12)}%)`;
  const accent = `hsl(${accentHue}, ${48 + Math.floor(rand() * 42)}%, ${dark ? 55 + Math.floor(rand() * 22) : 40 + Math.floor(rand() * 18)}%)`;
  const accent2 = `hsl(${accent2Hue}, ${50 + Math.floor(rand() * 40)}%, ${dark ? 58 + Math.floor(rand() * 18) : 44 + Math.floor(rand() * 16)}%)`;
  const accentText = dark ? `hsl(${accentHue}, 30%, 7%)` : `hsl(${accentHue}, 22%, 97%)`;
  const muted = dark ? `hsl(${hue}, 8%, 55%)` : `hsl(${hue}, 12%, 42%)`;
  const line = dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.16)";

  return { dark, bg, fg, accent, accent2, accentText, muted, line, hue };
}

export type LandingCtx = {
  theme: Theme;
  animation: string;
  animDuration: string;
  buttonLabel: string;
  destination: string;
};

function buttonBase(ctx: LandingCtx, filled: boolean, extra: CSSProperties = {}): CSSProperties {
  return {
    display: "inline-block",
    textDecoration: "none",
    cursor: "pointer",
    fontFamily: font("sans"),
    padding: "0.7rem 1.5rem",
    borderRadius: `${(rand() * 1.2).toFixed(2)}rem`,
    border: `2px solid ${ctx.theme.accent}`,
    background: filled ? ctx.theme.accent : "transparent",
    color: filled ? ctx.theme.accentText : ctx.theme.accent,
    letterSpacing: "0.02em",
    fontSize: "clamp(0.9rem, 1.6vw, 1.05rem)",
    ...extra
  };
}

function Btn(ctx: LandingCtx, style: CSSProperties = {}, filled = chance(0.6)) {
  return (
    <a href={ctx.destination} style={buttonBase(ctx, filled, style)}>
      {ctx.buttonLabel}
    </a>
  );
}

const headerAnim = (ctx: LandingCtx): CSSProperties => ({
  animation: `${ctx.animation} ${ctx.animDuration}s ease-in-out infinite alternate`
});

/* ---------------- layouts ---------------- */

function centerMinimal(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.4rem", textAlign: "center", padding: "6vw", background: t.bg, color: t.fg }}>
      <h1 style={{ margin: 0, fontFamily: font(), fontSize: "clamp(2.4rem, 7vw, 6rem)", lineHeight: 1.02, letterSpacing: "-0.02em", ...headerAnim(ctx) }}>{HEADER}</h1>
      <p style={{ margin: 0, maxWidth: "42ch", fontFamily: font("sans"), fontSize: "clamp(1rem, 2.2vw, 1.3rem)", lineHeight: 1.5, opacity: 0.85 }}>{DESCRIPTION}</p>
      {Btn(ctx, { marginTop: "0.6rem" })}
    </main>
  );
}

function editorialLeft(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: "1.4rem", padding: "clamp(2rem, 8vw, 8rem)", background: t.bg, color: t.fg }}>
      <h1 style={{ margin: 0, maxWidth: "16ch", fontFamily: font("serif"), fontSize: "clamp(2.6rem, 8vw, 6rem)", lineHeight: 0.98, letterSpacing: "-0.02em", ...headerAnim(ctx) }}>{HEADER}</h1>
      <p style={{ margin: 0, maxWidth: "44ch", fontFamily: font("sans"), fontSize: "clamp(1rem, 2.2vw, 1.3rem)", lineHeight: 1.55, opacity: 0.82 }}>{DESCRIPTION}</p>
      {Btn(ctx, { marginTop: "0.8rem" })}
    </main>
  );
}

function terminal(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const green = t.dark ? "hsl(135, 70%, 62%)" : "hsl(135, 55%, 28%)";
  const mono = font("mono");
  return (
    <main style={{ minHeight: "100vh", background: t.dark ? "#07090b" : "#101418", color: green, fontFamily: mono, padding: "clamp(1.2rem, 5vw, 4rem)", display: "flex", flexDirection: "column", justifyContent: "center", fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)" }}>
      <div style={{ maxWidth: "70ch", lineHeight: 1.7 }}>
        <div style={{ opacity: 0.6 }}>last login: never · tty/in-between</div>
        <div style={{ marginTop: "1rem" }}>
          <span style={{ opacity: 0.7 }}>visitor@void</span>:<span style={{ opacity: 0.7 }}>~</span>$ whoami
        </div>
        <h1 style={{ margin: "0.3rem 0 1.2rem", fontFamily: mono, fontSize: "clamp(1.8rem, 5vw, 3.2rem)", fontWeight: 700, letterSpacing: "0.04em", ...headerAnim(ctx) }}>{HEADER}</h1>
        <div style={{ opacity: 0.85 }}># {DESCRIPTION}</div>
        <div style={{ marginTop: "1.4rem" }}>
          $ <a href={ctx.destination} style={{ color: green, textDecoration: "underline" }}>{ctx.buttonLabel}</a>
          <span style={{ display: "inline-block", width: "0.6ch", height: "1.1em", marginLeft: "0.3ch", background: green, verticalAlign: "text-bottom", animation: "ibs-blink 1s steps(1) infinite" }} />
        </div>
      </div>
    </main>
  );
}

function brutalist(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  return (
    <main style={{ minHeight: "100vh", background: t.accent, color: t.accentText, padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.8rem" }}>
      <h1 style={{ margin: 0, fontFamily: font("display"), fontSize: "clamp(3rem, 16vw, 13rem)", lineHeight: 0.82, textTransform: "uppercase", letterSpacing: "-0.02em", ...headerAnim(ctx) }}>{HEADER}</h1>
      <p style={{ margin: 0, maxWidth: "40ch", fontFamily: font("sans"), fontWeight: 700, fontSize: "clamp(1.05rem, 2.4vw, 1.5rem)", lineHeight: 1.3, textTransform: "uppercase" }}>{DESCRIPTION}</p>
      <a href={ctx.destination} style={{ alignSelf: "flex-start", textDecoration: "none", background: t.accentText, color: t.accent, fontFamily: font("display"), textTransform: "uppercase", fontSize: "clamp(1.1rem, 3vw, 1.8rem)", padding: "0.6rem 1.8rem", border: `4px solid ${t.accentText}`, boxShadow: `10px 10px 0 ${t.bg}` }}>{ctx.buttonLabel}</a>
    </main>
  );
}

function swissGrid(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, padding: "clamp(1.5rem, 5vw, 4rem)", display: "grid", gridTemplateRows: "auto 1fr auto", gap: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: font("mono"), fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.muted, borderBottom: `1px solid ${t.line}`, paddingBottom: "1rem" }}>
        <span>01 — index</span>
        <span>∞</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "1.6rem" }}>
        <h1 style={{ margin: 0, fontFamily: font("sans"), fontSize: "clamp(2.6rem, 9vw, 7rem)", lineHeight: 0.95, letterSpacing: "-0.03em", fontWeight: 700, ...headerAnim(ctx) }}>{HEADER}</h1>
        <p style={{ margin: 0, maxWidth: "36ch", marginLeft: "auto", textAlign: "right", fontFamily: font("sans"), fontSize: "clamp(1rem, 2vw, 1.25rem)", lineHeight: 1.5, color: t.muted }}>{DESCRIPTION}</p>
      </div>
      <div style={{ borderTop: `1px solid ${t.line}`, paddingTop: "1.2rem" }}>{Btn(ctx, {}, false)}</div>
    </main>
  );
}

function gradientPoster(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const angle = Math.floor(rand() * 360);
  return (
    <main style={{ minHeight: "100vh", background: `linear-gradient(${angle}deg, ${t.accent}, ${t.accent2})`, color: t.accentText, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1.6rem", padding: "6vw" }}>
      <h1 style={{ margin: 0, fontFamily: font("serif"), fontSize: "clamp(2.6rem, 9vw, 7rem)", lineHeight: 1, fontWeight: 600, ...headerAnim(ctx) }}>{HEADER}</h1>
      <p style={{ margin: 0, maxWidth: "40ch", fontFamily: font("sans"), fontSize: "clamp(1.05rem, 2.3vw, 1.4rem)", lineHeight: 1.5, opacity: 0.92 }}>{DESCRIPTION}</p>
      <a href={ctx.destination} style={{ marginTop: "0.6rem", textDecoration: "none", background: t.accentText, color: t.accent, fontFamily: font("sans"), fontWeight: 600, padding: "0.85rem 2.2rem", borderRadius: "999px", fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)" }}>{ctx.buttonLabel}</a>
    </main>
  );
}

function error404(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const mono = font("mono");
  return (
    <main style={{ minHeight: "100vh", background: t.dark ? "#0c0c0c" : "#f4f4f4", color: t.dark ? "#e6e6e6" : "#202020", fontFamily: mono, display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(1.5rem, 6vw, 6rem)", gap: "1.2rem" }}>
      <div style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)", fontWeight: 700, lineHeight: 1, ...headerAnim(ctx) }}>404</div>
      <h1 style={{ margin: 0, fontFamily: mono, fontSize: "clamp(1.4rem, 4vw, 2.4rem)", fontWeight: 600 }}>{HEADER}</h1>
      <p style={{ margin: 0, maxWidth: "52ch", fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)", lineHeight: 1.6, opacity: 0.78 }}>{DESCRIPTION}</p>
      <hr style={{ width: "100%", border: "none", borderTop: `1px solid ${t.line}`, margin: "0.4rem 0" }} />
      <a href={ctx.destination} style={{ color: t.accent, fontSize: "1rem" }}>&larr; {ctx.buttonLabel}</a>
    </main>
  );
}

function searchEngine(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  return (
    <main style={{ minHeight: "100vh", background: t.dark ? "#101012" : "#ffffff", color: t.fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.6rem", padding: "6vw", textAlign: "center" }}>
      <h1 style={{ margin: 0, fontFamily: font(), fontSize: "clamp(2.4rem, 7vw, 5rem)", letterSpacing: "-0.03em", ...headerAnim(ctx) }}>{HEADER}</h1>
      <p style={{ margin: 0, fontFamily: font("sans"), color: t.muted, fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)" }}>{DESCRIPTION}</p>
      <div style={{ display: "flex", alignItems: "center", width: "min(560px, 90vw)", border: `1px solid ${t.line}`, borderRadius: "999px", padding: "0.3rem 0.3rem 0.3rem 1.2rem", boxShadow: t.dark ? "none" : "0 1px 6px rgba(0,0,0,0.12)" }}>
        <span style={{ flex: 1, textAlign: "left", color: t.muted, fontFamily: font("sans") }}>search the in between…</span>
        <a href={ctx.destination} style={buttonBase(ctx, true, { borderRadius: "999px", padding: "0.55rem 1.4rem" })}>{ctx.buttonLabel}</a>
      </div>
      <div style={{ fontFamily: font("mono"), fontSize: "0.78rem", color: t.muted }}>about 0 results (∞ seconds)</div>
    </main>
  );
}

function marquee(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const f = font("display");
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2.5rem", overflow: "hidden" }}>
      <div style={{ overflow: "hidden", whiteSpace: "nowrap", borderBlock: `2px solid ${t.fg}`, padding: "0.5rem 0" }}>
        <span style={{ display: "inline-block", fontFamily: f, fontSize: "clamp(3rem, 12vw, 9rem)", textTransform: "uppercase", animation: "ibs-marquee 18s linear infinite" }}>
          {`${HEADER} \u00a0\u00a0\u2022\u00a0\u00a0 ${HEADER} \u00a0\u00a0\u2022\u00a0\u00a0 ${HEADER} \u00a0\u00a0\u2022\u00a0\u00a0 `}
        </span>
      </div>
      <div style={{ padding: "0 clamp(1.5rem, 6vw, 6rem)", display: "flex", flexDirection: "column", gap: "1.4rem", alignItems: "flex-start" }}>
        <p style={{ margin: 0, maxWidth: "42ch", fontFamily: font("sans"), fontSize: "clamp(1.05rem, 2.4vw, 1.4rem)", lineHeight: 1.45 }}>{DESCRIPTION}</p>
        {Btn(ctx)}
      </div>
    </main>
  );
}

function stickyNote(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const rot = (rand() * 8 - 4).toFixed(1);
  const note = `hsl(${(t.hue + 40) % 360}, 70%, ${t.dark ? 60 : 78}%)`;
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center", padding: "6vw" }}>
      <div style={{ transform: `rotate(${rot}deg)`, background: note, color: "#1a1a1a", padding: "clamp(1.5rem, 5vw, 3rem)", width: "min(440px, 90vw)", boxShadow: "0 16px 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <h1 style={{ margin: 0, fontFamily: font("hand"), fontSize: "clamp(2.6rem, 8vw, 4rem)", lineHeight: 0.95, ...headerAnim(ctx) }}>{HEADER}</h1>
        <p style={{ margin: 0, fontFamily: font("hand"), fontSize: "clamp(1.3rem, 3vw, 1.8rem)", lineHeight: 1.25 }}>{DESCRIPTION}</p>
        <a href={ctx.destination} style={{ alignSelf: "flex-start", fontFamily: font("hand"), fontSize: "1.5rem", color: "#1a1a1a", textDecoration: "underline", textUnderlineOffset: "3px" }}>{ctx.buttonLabel} &rarr;</a>
      </div>
    </main>
  );
}

function magazineCover(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, padding: "clamp(1.5rem, 4vw, 3rem)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px solid ${t.fg}`, paddingBottom: "0.8rem", fontFamily: font("mono"), textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "0.78rem" }}>
        <span>issue ∞</span>
        <span>nothing inside</span>
        <span>{t.dark ? "night ed." : "day ed."}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
        <h1 style={{ margin: 0, fontFamily: font("serif"), fontSize: "clamp(3rem, 13vw, 10rem)", lineHeight: 0.86, letterSpacing: "-0.03em", ...headerAnim(ctx) }}>{HEADER}</h1>
        <p style={{ margin: 0, maxWidth: "40ch", fontFamily: font("serif"), fontStyle: "italic", fontSize: "clamp(1.1rem, 2.6vw, 1.6rem)", lineHeight: 1.3, color: t.muted }}>{DESCRIPTION}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `3px solid ${t.fg}`, paddingTop: "1rem" }}>
        {Btn(ctx, {}, true)}
        <span style={{ fontFamily: font("mono"), letterSpacing: "0.3em", fontSize: "1.4rem" }}>||||·|||·||</span>
      </div>
    </main>
  );
}

function neonVapor(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const neon = `hsl(${(t.hue + 200) % 360}, 95%, 65%)`;
  const neon2 = `hsl(${(t.hue + 320) % 360}, 95%, 68%)`;
  return (
    <main style={{ minHeight: "100vh", background: `radial-gradient(circle at 50% 120%, hsl(${t.hue}, 60%, 18%), #05030d 70%)`, color: "#f5f5ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1.8rem", padding: "6vw", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: "auto 0 0 0", height: "45%", backgroundImage: `linear-gradient(${neon} 1px, transparent 1px), linear-gradient(90deg, ${neon} 1px, transparent 1px)`, backgroundSize: "44px 44px", opacity: 0.25, transform: "perspective(300px) rotateX(60deg)", transformOrigin: "bottom" }} />
      <h1 style={{ margin: 0, fontFamily: font("display"), fontSize: "clamp(2.8rem, 11vw, 8rem)", textTransform: "uppercase", color: neon, textShadow: `0 0 8px ${neon}, 0 0 24px ${neon2}`, letterSpacing: "0.04em", zIndex: 1, ...headerAnim(ctx) }}>{HEADER}</h1>
      <p style={{ margin: 0, maxWidth: "40ch", fontFamily: font("mono"), fontSize: "clamp(1rem, 2.2vw, 1.3rem)", lineHeight: 1.5, zIndex: 1, color: "#d7d7f5" }}>{DESCRIPTION}</p>
      <a href={ctx.destination} style={{ zIndex: 1, textDecoration: "none", color: "#05030d", background: neon, fontFamily: font("mono"), fontWeight: 700, padding: "0.8rem 2rem", borderRadius: "4px", boxShadow: `0 0 18px ${neon}`, textTransform: "uppercase" }}>{ctx.buttonLabel}</a>
    </main>
  );
}

function splitScreen(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const vertical = chance(0.5);
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: vertical ? "column" : "row" }}>
      <div style={{ flex: 1, background: t.accent, color: t.accentText, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(1.5rem, 5vw, 4rem)" }}>
        <h1 style={{ margin: 0, fontFamily: font(), fontSize: "clamp(2.4rem, 7vw, 5.5rem)", lineHeight: 0.95, letterSpacing: "-0.02em", ...headerAnim(ctx) }}>{HEADER}</h1>
      </div>
      <div style={{ flex: 1, background: t.bg, color: t.fg, display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.6rem", padding: "clamp(1.5rem, 5vw, 4rem)" }}>
        <p style={{ margin: 0, maxWidth: "38ch", fontFamily: font("sans"), fontSize: "clamp(1.05rem, 2.4vw, 1.4rem)", lineHeight: 1.5 }}>{DESCRIPTION}</p>
        {Btn(ctx)}
      </div>
    </main>
  );
}

function loadingScreen(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const mono = font("mono");
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.6rem", padding: "6vw", textAlign: "center" }}>
      <h1 style={{ margin: 0, fontFamily: font(), fontSize: "clamp(2.2rem, 6vw, 4.5rem)", letterSpacing: "-0.02em", ...headerAnim(ctx) }}>{HEADER}</h1>
      <p style={{ margin: 0, maxWidth: "40ch", fontFamily: font("sans"), color: t.muted, fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}>{DESCRIPTION}</p>
      <div style={{ width: "min(420px, 80vw)", height: "10px", border: `1px solid ${t.line}`, borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: t.accent, animation: "ibs-progress 3.5s ease-in-out infinite" }} />
      </div>
      <div style={{ fontFamily: mono, fontSize: "0.85rem", color: t.muted }}>loading the in between… ∞%</div>
      {Btn(ctx, { marginTop: "0.4rem" }, false)}
    </main>
  );
}

function receipt(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const mono = font("mono");
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center", padding: "6vw" }}>
      <div style={{ width: "min(360px, 92vw)", background: t.dark ? "#16161a" : "#fffef9", color: t.dark ? "#e8e8e8" : "#1a1a1a", fontFamily: mono, padding: "1.6rem", boxShadow: "0 12px 30px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "0.92rem" }}>
        <h1 style={{ margin: 0, textAlign: "center", fontFamily: mono, fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "0.1em", ...headerAnim(ctx) }}>{HEADER}</h1>
        <div style={{ borderTop: "1px dashed currentColor", margin: "0.3rem 0" }} />
        <p style={{ margin: 0, lineHeight: 1.5 }}>{DESCRIPTION}</p>
        <div style={{ borderTop: "1px dashed currentColor", margin: "0.3rem 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>items found</span><span>0</span></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span>total</span><span>nothing</span></div>
        <div style={{ borderTop: "1px dashed currentColor", margin: "0.3rem 0" }} />
        <a href={ctx.destination} style={{ textAlign: "center", color: "inherit", textDecoration: "underline" }}>[ {ctx.buttonLabel} ]</a>
        <div style={{ textAlign: "center", letterSpacing: "0.3em", marginTop: "0.4rem" }}>|||·||·|||·|</div>
      </div>
    </main>
  );
}

function dossier(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const mono = font("mono");
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center", padding: "6vw", fontFamily: mono }}>
      <div style={{ width: "min(640px, 92vw)", border: `1px solid ${t.fg}`, padding: "clamp(1.5rem, 4vw, 2.5rem)", position: "relative" }}>
        <div style={{ position: "absolute", top: "-0.7rem", left: "1.2rem", background: t.bg, padding: "0 0.6rem", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.muted }}>file · ∞</div>
        <h1 style={{ margin: "0 0 1rem", fontFamily: mono, fontSize: "clamp(1.8rem, 5vw, 3rem)", letterSpacing: "0.06em", ...headerAnim(ctx) }}>{HEADER}</h1>
        <div style={{ borderTop: `1px solid ${t.line}`, paddingTop: "1rem", display: "grid", gap: "0.6rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
          <div><span style={{ color: t.muted }}>status &nbsp;</span> unresolved</div>
          <div><span style={{ color: t.muted }}>summary</span> {DESCRIPTION}</div>
        </div>
        <a href={ctx.destination} style={{ display: "inline-block", marginTop: "1.4rem", color: t.accent, textDecoration: "none", borderBottom: `2px solid ${t.accent}` }}>&gt; {ctx.buttonLabel}</a>
      </div>
    </main>
  );
}

function newspaper(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const paper = t.dark ? "#15140f" : "#f3efe2";
  const ink = t.dark ? "#e8e4d6" : "#1b1a15";
  return (
    <main style={{ minHeight: "100vh", background: paper, color: ink, padding: "clamp(1.5rem, 5vw, 4rem)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.2rem", fontFamily: font("serif") }}>
      <div style={{ textAlign: "center", borderBottom: `4px double ${ink}`, paddingBottom: "0.8rem" }}>
        <h1 style={{ margin: 0, fontFamily: font("serif"), fontSize: "clamp(2.6rem, 9vw, 6.5rem)", letterSpacing: "-0.02em", ...headerAnim(ctx) }}>{HEADER}</h1>
        <div style={{ marginTop: "0.4rem", fontFamily: font("mono"), fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>vol. ∞ — no. 0 · price: nothing · the day after never</div>
      </div>
      <p style={{ margin: "0 auto", maxWidth: "60ch", columnCount: 2, columnGap: "2rem", textAlign: "justify", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.55, fontStyle: "italic" }}>{DESCRIPTION}</p>
      <div style={{ textAlign: "center" }}>
        <a href={ctx.destination} style={{ color: ink, fontFamily: font("mono"), textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `2px solid ${ink}`, textDecoration: "none", paddingBottom: "2px" }}>{ctx.buttonLabel}</a>
      </div>
    </main>
  );
}

function cardStack(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const card = t.dark ? `hsl(${t.hue}, 10%, 12%)` : "#ffffff";
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center", padding: "6vw" }}>
      <div style={{ width: "min(520px, 92vw)", background: card, borderRadius: "1.2rem", padding: "clamp(2rem, 6vw, 3.5rem)", boxShadow: "0 30px 60px rgba(0,0,0,0.28)", border: `1px solid ${t.line}`, display: "flex", flexDirection: "column", gap: "1.3rem", textAlign: "center", alignItems: "center" }}>
        <span style={{ fontFamily: font("mono"), fontSize: "0.72rem", letterSpacing: "0.24em", textTransform: "uppercase", color: t.muted }}>welcome</span>
        <h1 style={{ margin: 0, fontFamily: font(), fontSize: "clamp(2rem, 6vw, 3.4rem)", letterSpacing: "-0.02em", ...headerAnim(ctx) }}>{HEADER}</h1>
        <p style={{ margin: 0, fontFamily: font("sans"), fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.55, color: t.muted }}>{DESCRIPTION}</p>
        {Btn(ctx, { width: "100%", textAlign: "center", padding: "0.85rem 1rem" }, true)}
      </div>
    </main>
  );
}

function bottomBar(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(1.5rem, 6vw, 5rem)", gap: "1.2rem" }}>
      <span style={{ fontFamily: font("mono"), fontSize: "0.78rem", letterSpacing: "0.24em", textTransform: "uppercase", color: t.muted }}>you have arrived nowhere</span>
      <h1 style={{ margin: 0, fontFamily: font("display"), fontSize: "clamp(2.6rem, 10vw, 8rem)", lineHeight: 0.9, textTransform: chance(0.5) ? "uppercase" : "none", ...headerAnim(ctx) }}>{HEADER}</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.4rem", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${t.line}`, paddingTop: "1.2rem" }}>
        <p style={{ margin: 0, maxWidth: "44ch", fontFamily: font("sans"), fontSize: "clamp(1rem, 2vw, 1.25rem)", lineHeight: 1.5, color: t.muted }}>{DESCRIPTION}</p>
        {Btn(ctx)}
      </div>
    </main>
  );
}

function modalDialog(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const surface = t.dark ? `hsl(${t.hue}, 8%, 14%)` : "#ffffff";
  return (
    <main style={{ minHeight: "100vh", background: `${t.bg}`, display: "flex", alignItems: "center", justifyContent: "center", padding: "6vw", position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "relative", width: "min(480px, 92vw)", background: surface, color: t.fg, borderRadius: "0.8rem", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: `1px solid ${t.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1.2rem", borderBottom: `1px solid ${t.line}`, fontFamily: font("sans") }}>
          <strong style={{ fontSize: "0.95rem", ...headerAnim(ctx) }}>{HEADER}</strong>
          <span aria-hidden style={{ color: t.muted, fontSize: "1.1rem" }}>×</span>
        </div>
        <div style={{ padding: "1.6rem 1.2rem", display: "flex", flexDirection: "column", gap: "1.3rem" }}>
          <p style={{ margin: 0, fontFamily: font("sans"), fontSize: "1.05rem", lineHeight: 1.55, color: t.muted }}>{DESCRIPTION}</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem" }}>{Btn(ctx, { padding: "0.6rem 1.3rem" }, true)}</div>
        </div>
      </div>
    </main>
  );
}

function bigIndex(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  const no = String(Math.floor(rand() * 999)).padStart(3, "0");
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", alignContent: "center", padding: "clamp(1.5rem, 6vw, 5rem)", gap: "0.5rem" }}>
      <div style={{ fontFamily: font("mono"), fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.muted }}>entry no. {no} / ∞</div>
      <div style={{ fontFamily: font("display"), fontSize: "clamp(5rem, 26vw, 22rem)", lineHeight: 0.8, color: t.accent, ...headerAnim(ctx) }}>∅</div>
      <h1 style={{ margin: "0.4rem 0 0", fontFamily: font("serif"), fontSize: "clamp(1.8rem, 5vw, 3.4rem)", letterSpacing: "-0.02em" }}>{HEADER}</h1>
      <p style={{ margin: 0, maxWidth: "46ch", fontFamily: font("sans"), fontSize: "clamp(1rem, 2vw, 1.25rem)", lineHeight: 1.5, color: t.muted }}>{DESCRIPTION}</p>
      <div style={{ marginTop: "1rem" }}>{Btn(ctx, {}, false)}</div>
    </main>
  );
}

function tickerBanner(ctx: LandingCtx): ReactNode {
  const t = ctx.theme;
  return (
    <main style={{ minHeight: "100vh", background: t.bg, color: t.fg, display: "flex", flexDirection: "column" }}>
      <div style={{ overflow: "hidden", whiteSpace: "nowrap", background: t.accent, color: t.accentText, padding: "0.5rem 0", fontFamily: font("mono"), fontSize: "0.95rem", letterSpacing: "0.05em" }}>
        <span style={{ display: "inline-block", animation: "ibs-marquee 22s linear infinite" }}>
          {`${DESCRIPTION} \u00a0\u00a0\u2022\u00a0\u00a0 ${DESCRIPTION} \u00a0\u00a0\u2022\u00a0\u00a0 `}
        </span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.6rem", padding: "6vw", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontFamily: font(), fontSize: "clamp(2.6rem, 9vw, 7rem)", letterSpacing: "-0.02em", ...headerAnim(ctx) }}>{HEADER}</h1>
        {Btn(ctx, {}, true)}
      </div>
    </main>
  );
}

const LAYOUTS: ((ctx: LandingCtx) => ReactNode)[] = [
  centerMinimal,
  editorialLeft,
  terminal,
  brutalist,
  swissGrid,
  gradientPoster,
  error404,
  searchEngine,
  marquee,
  stickyNote,
  magazineCover,
  neonVapor,
  splitScreen,
  loadingScreen,
  receipt,
  dossier,
  newspaper,
  cardStack,
  bottomBar,
  modalDialog,
  bigIndex,
  tickerBanner
];

export function RandomLanding() {
  const ctx: LandingCtx = {
    theme: buildTheme(),
    animation: pick(ANIMATIONS),
    animDuration: (3 + rand() * 6).toFixed(2),
    buttonLabel: pick(BUTTON_LABELS),
    destination: randomDestination()
  };
  const layout = pick(LAYOUTS);
  return layout(ctx);
}
