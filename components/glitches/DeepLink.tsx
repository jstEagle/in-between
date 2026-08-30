import Link from "next/link";
import type { LinkPacket } from "@/lib/types";

export function DeepLink({ link, className }: { link: LinkPacket; className?: string }) {
  return (
    <Link
      href={link.href}
      prefetch
      className={stableLinkClassName(className)}
      title={link.hoverLabel}
      data-destination-surface={link.destination.surfaceGenre}
      data-destination-content={link.destination.contentGenre}
    >
      {link.label}
    </Link>
  );
}

export function stableLinkClassName(className?: string) {
  return className
    ?.split(/\s+/)
    .filter((classPart) => classPart && !classPart.includes("hover:"))
    .join(" ");
}
