"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#score", label: "The score" },
  { href: "#features", label: "Features" },
];

/**
 * The desktop nav is `hidden md:flex` — below that breakpoint it disappears
 * with no replacement, so anchor links only work by scrolling. This gives
 * mobile visitors the same jump-links behind a single toggle button.
 */
export function MobileNav({ githubUrl }: { githubUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="pixel-edge flex size-8 items-center justify-center border border-border-strong text-foreground"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background px-6 py-5 shadow-[0_18px_30px_-24px_rgba(0,0,0,0.4)]">
          <nav className="flex flex-col gap-4 font-mono text-[13px] tracking-[0.04em] text-faint">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
