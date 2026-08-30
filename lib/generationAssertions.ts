import { decodeRoute } from "./routeCodec";
import { contextForBlock, generatePageModel } from "./generatePage";
import { chooseLayoutComposition } from "./layoutComposition";
import { makeLink } from "./linkEngine";

function invariant(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

export function assertGenerationInvariants() {
  const oldRoute = decodeRoute("/products/featured-checkout-for-quiet-membership");
  invariant(Boolean(oldRoute.site.siteSeed), "old URLs should derive a site seed");
  invariant(oldRoute.site.siteBudget >= 6 && oldRoute.site.siteBudget <= 14, "site budget should stay in the configured medium-depth range");

  const page = generatePageModel("/article/quiet-author-index-3-abc12");
  const ctx = contextForBlock(page, "assertions");
  const home = makeLink(ctx, "brand-home", "Home");
  const item = makeLink(ctx, "post-1", "Breakfast software");
  const nav = makeLink(ctx, "nav-4");

  invariant(home.href.includes(page.routeState.site.siteToken), "home links should preserve the current mini-site token");
  invariant(item.href.includes(page.routeState.site.siteToken) || item.href.includes("-exit-"), "item links should stay in-site unless they intentionally exit");
  invariant(nav.href.startsWith(`/${nav.destination.routeSection}/`), "links should expose the same route section they describe");
  invariant(nav.hoverLabel.includes(nav.destination.contentGenre), "link hover text should describe the destination page");
  invariant(page.layoutComposition.primary === page.layout, "layout remains compatible with the legacy primary layout field");
  invariant(page.layoutGrammar === null || Boolean(page.layoutGrammar.frame), "when present, layout grammar should carry a frame");

  const composition = chooseLayoutComposition("assertions", "minimal-blog", "blog", 12, 0.5);
  invariant(composition.primary === "minimal-blog", "composition should always keep the requested primary layout");
  invariant(composition.mode === "pure" || Boolean(composition.secondary), "layered compositions should name a secondary layout");

  return true;
}
