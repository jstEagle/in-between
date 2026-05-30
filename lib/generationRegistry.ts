import { generationConfig } from "@/config/generation";
import type { BlockPacket, LayoutArchetype, LinkRole, SiteKind } from "./types";

export type LayoutPolicy = {
  siteKind: SiteKind;
  compatibleSecondary: readonly LayoutArchetype[];
  preferredIntrusions: readonly BlockPacket["type"][];
  linkRoles: readonly LinkRole[];
};

export const layoutPolicies: Partial<Record<LayoutArchetype, LayoutPolicy>> = {
  "minimal-blog": {
    siteKind: "blog",
    compatibleSecondary: generationConfig.compatibleSecondaryLayouts.blog,
    preferredIntrusions: ["productGrid", "directory", "realData"],
    linkRoles: ["home", "index", "item", "related", "search", "exit"]
  },
  store: {
    siteKind: "store",
    compatibleSecondary: generationConfig.compatibleSecondaryLayouts.store,
    preferredIntrusions: ["newsPortal", "dashboard", "realData"],
    linkRoles: ["home", "index", "item", "category", "action", "search", "exit"]
  },
  forum: {
    siteKind: "forum",
    compatibleSecondary: generationConfig.compatibleSecondaryLayouts.forum,
    preferredIntrusions: ["form", "directory", "ad"],
    linkRoles: ["home", "index", "item", "related", "action", "exit"]
  },
  docs: {
    siteKind: "docs",
    compatibleSecondary: generationConfig.compatibleSecondaryLayouts.docs,
    preferredIntrusions: ["dashboard", "directory", "realData"],
    linkRoles: ["home", "index", "item", "next", "search", "exit"]
  },
  streaming: {
    siteKind: "streaming",
    compatibleSecondary: generationConfig.compatibleSecondaryLayouts.streaming,
    preferredIntrusions: ["productGrid", "ad", "realData"],
    linkRoles: ["home", "index", "item", "next", "related", "exit"]
  },
  booking: {
    siteKind: "booking",
    compatibleSecondary: generationConfig.compatibleSecondaryLayouts.booking,
    preferredIntrusions: ["newsPortal", "productGrid", "realData"],
    linkRoles: ["home", "index", "item", "category", "action", "search", "exit"]
  },
  directory: {
    siteKind: "directory",
    compatibleSecondary: generationConfig.compatibleSecondaryLayouts.directory,
    preferredIntrusions: ["newsPortal", "productGrid", "realData"],
    linkRoles: ["home", "index", "item", "category", "search", "exit"]
  }
};

export const blockPolicies: Record<BlockPacket["type"], { defaultRole: LinkRole; canIntrude: boolean }> = {
  hero: { defaultRole: "item", canIntrude: false },
  productGrid: { defaultRole: "item", canIntrude: true },
  newsPortal: { defaultRole: "item", canIntrude: true },
  blogArticle: { defaultRole: "item", canIntrude: true },
  directory: { defaultRole: "index", canIntrude: true },
  form: { defaultRole: "action", canIntrude: true },
  ad: { defaultRole: "exit", canIntrude: true },
  realData: { defaultRole: "related", canIntrude: true },
  dashboard: { defaultRole: "index", canIntrude: true },
  footer: { defaultRole: "related", canIntrude: false }
};
