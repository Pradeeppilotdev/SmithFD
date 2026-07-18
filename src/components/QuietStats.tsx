function Stat({
  value,
  label,
  tone,
}: {
  value: React.ReactNode;
  label: string;
  tone?: "destructive" | "warning" | "success";
}) {
  const toneClass =
    tone === "destructive"
      ? "text-destructive"
      : tone === "warning"
        ? "text-warning"
        : tone === "success"
          ? "text-success"
          : "text-foreground";

  return (
    <div className="flex items-baseline gap-2">
      <b className={`text-[21px] font-semibold tracking-[-0.3px] ${toneClass}`}>{value}</b>
      <span className="text-[13px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function QuietStats({
  stats,
}: {
  stats: { value: React.ReactNode; label: string; tone?: "destructive" | "warning" | "success" }[];
}) {
  return (
    <div className="mb-14 flex flex-wrap gap-11 border-t border-b border-border py-5.5">
      {stats.map((stat) => (
        <Stat key={stat.label} {...stat} />
      ))}
    </div>
  );
}
