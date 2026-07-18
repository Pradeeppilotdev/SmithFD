"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure origin, denied permission) — the command is
      // right there in the label, so selecting it by hand still works.
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Command copied" : `Copy ${command}`}
      className={cn(
        "pixel-edge group flex items-center gap-3 border border-border-strong bg-card px-4 py-3 font-mono text-[13px] text-muted-foreground transition-colors hover:border-faint hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <span className="shrink-0 text-faint select-none">$</span>
      <span className="min-w-0 flex-1 truncate">{command}</span>
      {copied ? (
        <Check className="size-3.5 shrink-0 text-success" />
      ) : (
        <Copy className="size-3.5 shrink-0 text-faint group-hover:text-muted-foreground" />
      )}
    </button>
  );
}
