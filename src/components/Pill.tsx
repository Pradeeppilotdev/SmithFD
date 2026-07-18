import { cn } from "@/lib/utils";

const pillTone = {
  success: "text-success bg-success-soft",
  warning: "text-warning bg-warning-soft",
  destructive: "text-destructive bg-destructive-soft",
  neutral: "text-muted-foreground bg-muted",
};

export function Pill({
  tone,
  dot = true,
  children,
  className,
}: {
  tone: keyof typeof pillTone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px] font-medium",
        pillTone[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const badgeTone = {
  success: "text-success bg-success-soft",
  warning: "text-warning bg-warning-soft",
  destructive: "text-destructive bg-destructive-soft",
  neutral: "text-muted-foreground bg-muted",
};

export function Badge({
  tone,
  children,
}: {
  tone: keyof typeof badgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-[5px] px-1.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        badgeTone[tone],
      )}
    >
      {children}
    </span>
  );
}

export function TermChip({
  state = "in",
  children,
}: {
  state?: "in" | "out" | "violated";
  children: React.ReactNode;
}) {
  if (state === "violated") {
    return (
      <span className="rounded-full border border-destructive/25 bg-destructive-soft px-3.5 py-1 text-[12.5px] font-medium text-destructive line-through decoration-destructive">
        {children}
      </span>
    );
  }
  if (state === "out") {
    return (
      <span className="rounded-full border border-border-strong px-3.5 py-1 text-[12.5px] font-medium text-faint line-through decoration-faint">
        {children}
      </span>
    );
  }
  return (
    <span className="rounded-full border border-border-strong bg-card px-3.5 py-1 text-[12.5px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}
