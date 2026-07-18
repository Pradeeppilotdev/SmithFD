function Stat({
  value,
  label,
  tone,
}: {
  value: React.ReactNode;
  label: string;
  tone?: "destructive" | "warning";
}) {
  const toneClass =
    tone === "destructive"
      ? "text-destructive"
      : tone === "warning"
        ? "text-warning"
        : "text-foreground";

  return (
    <div className="flex items-baseline gap-2">
      <b className={`text-[21px] font-semibold tracking-[-0.3px] ${toneClass}`}>{value}</b>
      <span className="text-[13px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function QuietStats({
  flagged,
  awaiting,
  resolved,
  session,
}: {
  flagged: number;
  awaiting: number;
  resolved: number;
  session: React.ReactNode;
}) {
  return (
    <div className="mb-14 flex flex-wrap gap-11 border-t border-b border-border py-5.5">
      <Stat value={flagged} label="drift events" tone="destructive" />
      <Stat value={awaiting} label="awaiting decision" tone="warning" />
      <Stat value={resolved} label="resolved" />
      <Stat value={session} label="session" />
    </div>
  );
}
