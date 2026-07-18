/**
 * Visual companion to the score label — a kept/overridden bar plus a plain
 * sentence, so "COMPROMISED" or "WAVERING" doesn't have to be taken on faith.
 * Renders nothing until there's at least one flagged decision to show.
 */
export function ScoreProgress({
  flagged,
  overridden,
}: {
  flagged: number;
  overridden: number;
}) {
  if (flagged === 0) return null;

  const kept = Math.max(flagged - overridden, 0);
  const keptPct = Math.round((kept / flagged) * 100);

  return (
    <div className="w-full max-w-[200px]">
      <div className="mb-1.5 h-1.5 w-full overflow-hidden rounded-full bg-destructive/20">
        <div
          className="h-full rounded-full bg-success transition-[width]"
          style={{ width: `${keptPct}%` }}
        />
      </div>
      <span className="text-[12px] text-faint">
        {kept} of {flagged} flagged {flagged === 1 ? "decision" : "decisions"} kept
      </span>
    </div>
  );
}
