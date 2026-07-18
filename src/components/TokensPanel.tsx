"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/Pill";
import { RelativeTime } from "@/components/RelativeTime";

interface TokenRow {
  id: string;
  label: string | null;
  created_at: string;
  revoked_at: string | null;
}

export function TokensPanel({ initialTokens }: { initialTokens: TokenRow[] }) {
  const [tokens, setTokens] = useState(initialTokens);
  const [label, setLabel] = useState("");
  const [generating, setGenerating] = useState(false);
  const [revealedToken, setRevealedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setGenerating(true);
    setRevealedToken(null);
    const res = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: label.trim() || null }),
    });
    setGenerating(false);
    if (!res.ok) return;

    const data = await res.json();
    setTokens((prev) => [
      { id: data.id, label: data.label, created_at: data.created_at, revoked_at: null },
      ...prev,
    ]);
    setRevealedToken(data.token);
    setLabel("");
  }

  async function revoke(id: string) {
    const res = await fetch(`/api/tokens/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, revoked_at: new Date().toISOString() } : t)),
    );
  }

  async function copyToken() {
    if (!revealedToken) return;
    await navigator.clipboard.writeText(revealedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="mb-3.5 flex flex-col gap-2 sm:flex-row">
        <div className="flex h-[42px] flex-1 items-center rounded-[10px] border border-border-strong bg-card px-3.5 sm:max-w-xs">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. MacBook Pro)"
            className="w-full border-none bg-transparent text-[13.5px] text-foreground placeholder:text-faint focus:outline-none"
          />
        </div>
        <Button
          onClick={generate}
          disabled={generating}
          className="h-auto w-full rounded-[10px] px-4 py-2.5 text-[13px] sm:w-auto"
        >
          {generating ? "Generating…" : "Generate token"}
        </Button>
      </div>

      {revealedToken && (
        <Card className="mb-6 border border-warning/30 bg-warning-soft p-4">
          <p className="mb-2 text-[12.5px] font-medium text-warning">
            Copy this now — you won&apos;t see it again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-[8px] border border-border bg-card px-3 py-2 text-xs text-foreground">
              {revealedToken}
            </code>
            <Button
              variant="outline"
              onClick={copyToken}
              className="h-auto shrink-0 rounded-[8px] px-3 py-2 text-xs"
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-2.5">
        {tokens.length === 0 && (
          <p className="text-[13px] text-faint">No access tokens yet.</p>
        )}
        {tokens.map((token) => (
          <div
            key={token.id}
            className="flex items-center justify-between gap-4 rounded-[12px] border border-border bg-card px-4.5 py-3.5"
          >
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-medium text-foreground">
                {token.label || "Untitled token"}
              </p>
              <p className="text-[12px] text-faint">
                Created <RelativeTime iso={token.created_at} />
              </p>
            </div>
            {token.revoked_at ? (
              <Pill tone="neutral" dot={false}>
                Revoked
              </Pill>
            ) : (
              <Button
                variant="outline"
                onClick={() => revoke(token.id)}
                className="h-auto shrink-0 rounded-[8px] px-3 py-1.5 text-xs"
              >
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
