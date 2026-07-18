"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Generate an access token",
    body: (
      <>
        <Link href="/settings/tokens" className="text-foreground hover:underline">
          Create one under Access tokens
        </Link>{" "}
        — it&apos;s shown once, so copy it right away.
      </>
    ),
  },
  {
    title: "Install the CLI",
    body: (
      <code className="mt-1 block max-w-full overflow-x-auto rounded-[6px] border border-border bg-muted px-2.5 py-1 text-xs whitespace-nowrap text-foreground">
        npm install -g @flash_dev/agent-smith
      </code>
    ),
  },
  {
    title: "Run smith init and paste the token",
    body: "From your project's folder. Smith asks a few questions about your goal, then starts watching your agent's actions against it.",
  },
];

const STEP_MS = 3500;

export function GetStartedCard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STEPS.length);
    }, STEP_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-[14px] border border-border bg-card p-6 sm:p-8">
      <p className="mb-2 font-serif text-[20px] font-medium text-foreground">
        Get Smith watching your first project
      </p>
      <p className="mb-6 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">
        Three steps and your first project will show up here.
      </p>

      <div className="mb-5 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Step ${i + 1} of ${STEPS.length}`}
            aria-current={i === active}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-7 bg-foreground" : "w-1.5 bg-border-strong",
            )}
          />
        ))}
      </div>

      <div className="relative min-h-[76px] sm:min-h-[64px]">
        {STEPS.map((step, i) => (
          <div
            key={i}
            aria-hidden={i !== active}
            className={cn(
              "flex gap-3.5 transition-opacity duration-500",
              i === active ? "relative opacity-100" : "absolute inset-0 opacity-0",
            )}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[12px] font-semibold text-secondary-foreground">
              {i + 1}
            </span>
            <div>
              <p className="mb-0.5 text-[13.5px] font-medium text-foreground">{step.title}</p>
              <div className="text-[13px] leading-relaxed text-muted-foreground">{step.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
