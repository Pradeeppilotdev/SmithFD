"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades its children up once they scroll into view. Purely decorative — the
 * content is in the DOM from the start, and `prefers-reduced-motion` flattens
 * the transition to nothing via the `.reveal` rule in globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // min-w-0 matters here: this div is often the direct child of a CSS
      // grid row (e.g. wrapping SmithTerminal in the hero). Grid/flex items
      // default to min-width: auto, so unwrappable content deeper in the
      // tree (long monospace lines) would otherwise force the whole track —
      // and the page — wider than the viewport on mobile.
      className={cn("reveal min-w-0", className)}
      data-shown={shown}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
