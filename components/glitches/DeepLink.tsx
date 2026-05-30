import type { LinkPacket } from "@/lib/types";

export function DeepLink({ link, className }: { link: LinkPacket; className?: string }) {
  return (
    <a href={link.href} className={stableLinkClassName(className)}>
      {link.label}
    </a>
  );
}

export function stableLinkClassName(className?: string) {
  return className
    ?.split(/\s+/)
    .filter((classPart) => classPart && !classPart.includes("hover:"))
    .join(" ");
}
