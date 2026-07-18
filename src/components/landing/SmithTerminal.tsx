"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Tone = "dim" | "smith" | "you" | "flag" | "cmd" | "body" | "choice";

type Line = { text: string; tone: Tone };

/**
 * A real Smith session, shortened: the goal-setting chat, then a contradiction
 * caught mid-flight. This is the product's most characteristic moment, so it
 * plays out in the hero rather than being described.
 */
const TRANSCRIPT: Line[] = [
  { text: "$ smith init", tone: "cmd" },
  { text: "", tone: "dim" },
  { text: "  SMITH 2.0 · goal-fidelity watchdog · project: checkout", tone: "dim" },
  { text: "", tone: "dim" },
  { text: "SMITH   What are you building?", tone: "smith" },
  { text: "YOU     stripe checkout on the pricing page", tone: "you" },
  { text: "SMITH   And what stays untouched?", tone: "smith" },
  { text: "YOU     no new infra, no auth changes", tone: "you" },
  { text: "SMITH   Goal locked. I will be watching.", tone: "smith" },
  { text: "", tone: "dim" },
  { text: "        …47 actions later", tone: "dim" },
  { text: "", tone: "dim" },
  { text: "!! CONTRADICTION — Bash", tone: "flag" },
  { text: "   npm install ioredis --save", tone: "cmd" },
  { text: "", tone: "dim" },
  { text: "   You said no new infrastructure. This adds a", tone: "body" },
  { text: "   datastore client. It is not the checkout flow.", tone: "body" },
  { text: "", tone: "dim" },
  { text: "   [a] allow anyway   [d] deny   [smith argue]", tone: "choice" },
];

const toneClass: Record<Tone, string> = {
  dim: "text-[color-mix(in_oklab,var(--terminal-fg),transparent_62%)]",
  smith: "text-phosphor",
  you: "text-[var(--terminal-fg)]",
  flag: "text-[#e0a244] font-semibold",
  cmd: "text-[color-mix(in_oklab,var(--terminal-fg),transparent_25%)]",
  body: "text-[color-mix(in_oklab,var(--terminal-fg),transparent_35%)]",
  choice: "text-[color-mix(in_oklab,var(--terminal-fg),transparent_50%)]",
};

const CHAR_MS = 12;
const LINE_PAUSE_MS = 190;

export function SmithTerminal() {
  const totalChars = useMemo(
    () => TRANSCRIPT.reduce((sum, line) => sum + line.text.length, 0),
    [],
  );
  const [revealed, setRevealed] = useState(0);
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Hold off until the panel is actually on screen, so the sequence isn't half
  // over by the time anyone looks at it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(totalChars);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    let count = 0;

    // Walk the transcript one character at a time, pausing at each line break so
    // the conversation lands with the rhythm of someone actually typing it.
    const step = () => {
      count += 1;
      setRevealed(count);
      if (count >= totalChars) return;

      let cursor = 0;
      let atLineEnd = false;
      for (const line of TRANSCRIPT) {
        cursor += line.text.length;
        if (cursor === count) {
          atLineEnd = true;
          break;
        }
        if (cursor > count) break;
      }

      timer = setTimeout(step, atLineEnd ? LINE_PAUSE_MS : CHAR_MS);
    };

    timer = setTimeout(step, 520);
    return () => clearTimeout(timer);
  }, [started, totalChars]);

  const done = revealed >= totalChars;
  let consumed = 0;

  return (
    <div
      ref={rootRef}
      className="pixel-edge scanlines relative overflow-hidden border border-border-strong bg-[var(--terminal-bg)] shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)]"
    >
      {/* Title bar: three pixel blocks instead of the usual traffic lights. */}
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
        <span className="size-2 bg-[#4a4740]" />
        <span className="size-2 bg-[#4a4740]" />
        <span className="size-2 bg-phosphor/70" />
        <span className="ml-2 font-mono text-[11px] tracking-[0.08em] text-white/35 uppercase">
          smith — watching
        </span>
      </div>

      <div className="relative p-5 sm:p-6">
        <pre className="overflow-x-auto font-mono text-[11.5px] leading-[1.72] sm:text-[12.5px]">
          {TRANSCRIPT.map((line, i) => {
            const start = consumed;
            consumed += line.text.length;
            const shown = Math.max(0, Math.min(line.text.length, revealed - start));
            const isActive = revealed > start && revealed < consumed;
            const visible = revealed >= start;

            return (
              <div key={i} className={toneClass[line.tone]}>
                {/* A zero-width space keeps blank lines at full line-height, and
                    unrevealed lines hold their space so nothing shifts. */}
                <span style={{ visibility: visible ? "visible" : "hidden" }}>
                  {line.text.slice(0, shown) || "​"}
                </span>
                {isActive && <span className="pixel-caret ml-px" />}
              </div>
            );
          })}
          {done && <span className="pixel-caret" />}
        </pre>
      </div>
    </div>
  );
}
