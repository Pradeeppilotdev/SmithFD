import Link from "next/link";
import { Badge } from "@/components/Pill";
import { RelativeTime } from "@/components/RelativeTime";
import { DriftEvent, DriftStatus } from "@/types";

const dotClass: Record<DriftStatus, string> = {
  flagged: "border-destructive bg-destructive",
  resolved: "border-success bg-success-soft",
  noted: "border-faint bg-background",
};

const badgeTone: Record<DriftStatus, "destructive" | "success" | "neutral"> = {
  flagged: "destructive",
  resolved: "success",
  noted: "neutral",
};

const badgeLabel: Record<DriftStatus, string> = {
  flagged: "Flagged",
  resolved: "Resolved",
  noted: "Noted",
};

function renderDescription(event: DriftEvent) {
  if (!event.violatedClause) return event.description;
  const parts = event.description.split(`“${event.violatedClause}”`);
  if (parts.length !== 2) return event.description;
  return (
    <>
      {parts[0]}
      <em className="font-serif text-destructive italic">“{event.violatedClause}”</em>
      {parts[1]}
    </>
  );
}

export function Timeline({ events }: { events: DriftEvent[] }) {
  return (
    <div className="relative pl-6.5">
      <div className="absolute top-1.5 bottom-1.5 left-1.5 w-px bg-border" />
      <div className="space-y-7.5">
        {events.map((event) => (
          <div key={event.id} className="relative">
            <span
              className={`absolute -left-6.5 top-1.5 size-3.5 rounded-full border-2 ${dotClass[event.status]}`}
            />
            <div className="mb-1 flex flex-wrap items-baseline gap-2.5">
              <Link
                href={`/chat/chat_${event.id}`}
                className="text-sm font-medium tracking-[-0.1px] text-foreground hover:underline"
              >
                {event.title}
              </Link>
              <Badge tone={badgeTone[event.status]}>{badgeLabel[event.status]}</Badge>
              <span className="text-[12.5px] text-faint">
                <RelativeTime iso={event.detectedAt} />
              </span>
            </div>
            <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
              {renderDescription(event)}
            </p>
            {event.relatedAction && (
              <code className="mt-2 inline-block rounded-[7px] border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                {event.relatedAction}
              </code>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
