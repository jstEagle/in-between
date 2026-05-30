"use client";

import { useEffect, useRef, useState } from "react";

type MutableTextProps = {
  initial: string;
  variants: string[];
  className?: string;
  as?: "span" | "p" | "h2";
};

export function MutableText({ initial, variants, className, as = "span" }: MutableTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [entryCount, setEntryCount] = useState(0);
  const text = entryCount > 1 && variants.length > 0 ? variants[(entryCount - 2) % variants.length] : initial;
  const Tag = as;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setEntryCount((count) => count + 1);
      },
      { threshold: 0.65 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  );
}
