"use client";

import { useEffect, useRef, useState } from "react";

const BLOCKS = 25; // one block per 4 points
const TARGET = 83; // 24 flagged, 4 overridden, 20 kept

/**
 * The Consistency Score, rendered as a row of pixel blocks that fill in as the
 * number counts up. The score is the product's headline number, so it gets the
 * literal treatment: discrete blocks, because it's a count of decisions, not a
 * smooth gauge.
 */
export function ScoreMeter() {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setValue(TARGET);
          return;
        }

        const duration = 1100;
        const start = performance.now();
        let frame = 0;

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // Ease out, then quantise to whole points — the number should tick
          // like a counter, not slide like a slider.
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(eased * TARGET));
          if (t < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filled = Math.round((value / 100) * BLOCKS);

  return (
    <div ref={ref} className="pixel-edge border border-border-strong bg-card p-7 sm:p-9">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-2.5">Consistency score</p>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[54px] leading-none font-bold tracking-[-0.03em] text-foreground tabular-nums sm:text-[68px]">
              {value}
            </span>
            <span className="font-mono text-[13px] tracking-[0.1em] text-success uppercase">
              Holding the line
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: BLOCKS }, (_, i) => (
          <span
            key={i}
            className="h-9 flex-1 transition-colors duration-150"
            style={{
              backgroundColor:
                i < filled ? "var(--success)" : "color-mix(in oklab, var(--muted), transparent 25%)",
            }}
          />
        ))}
      </div>

      <div className="grid gap-x-8 gap-y-4 border-t border-border pt-6 font-mono text-[12px] sm:grid-cols-3">
        <Stat value="24" label="flagged" tint="var(--destructive)" />
        <Stat value="04" label="overridden" tint="var(--warning)" />
        <Stat value="20" label="kept" tint="var(--success)" />
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-muted-foreground">
        Twenty of twenty-four flagged actions were dropped once Smith named the
        contradiction. Four were pushed through anyway — and those four are the
        only reason this isn&apos;t 100.
      </p>
    </div>
  );
}

function Stat({ value, label, tint }: { value: string; label: string; tint: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="size-2.5 shrink-0" style={{ backgroundColor: tint }} />
      <span className="font-semibold text-foreground tabular-nums">{value}</span>
      <span className="tracking-[0.08em] text-faint uppercase">{label}</span>
    </div>
  );
}
