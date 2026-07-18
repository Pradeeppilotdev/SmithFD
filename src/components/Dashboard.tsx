"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Pill } from "@/components/Pill";
import { IntentHero } from "@/components/IntentHero";
import { QuietStats } from "@/components/QuietStats";
import { DecisionCard } from "@/components/DecisionCard";
import { Timeline } from "@/components/Timeline";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { RelativeTime } from "@/components/RelativeTime";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatThread, DriftEvent, ProjectGoal, SmithCheckpoint } from "@/types";

export function Dashboard({
  goal,
  driftEvents,
  checkpoints: initialCheckpoints,
  chats,
}: {
  goal: ProjectGoal;
  driftEvents: DriftEvent[];
  checkpoints: SmithCheckpoint[];
  chats: ChatThread[];
}) {
  const [loading, setLoading] = useState(true);
  const [checkpoints, setCheckpoints] = useState(initialCheckpoints);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(timer);
  }, []);

  function approve(id: string) {
    setCheckpoints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "done", executedAt: new Date().toISOString() }
          : c,
      ),
    );
  }

  function reject(id: string) {
    setCheckpoints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "failed" } : c)),
    );
  }

  const flaggedCount = driftEvents.filter((e) => e.status === "flagged").length;
  const pending = checkpoints.filter((c) => c.status === "pending");
  const resolvedCount = checkpoints.filter((c) => c.status === "done").length;

  return (
    <div className="mx-auto max-w-[1400px] px-8 pb-24">
      <TopBar
        showLogo
        crumbs={[{ label: "Projects" }, { label: goal.name }]}
        right={<div className="flex items-center gap-1"><ThemeToggle /><Pill tone="success">Watching</Pill></div>}
      />

      {loading ? (
        <div className="pt-11">
          <DashboardSkeleton />
        </div>
      ) : (
        <div className="animate-in fade-in pt-11 duration-300">
          <IntentHero goal={goal} />

          <QuietStats
            flagged={flaggedCount}
            awaiting={pending.length}
            resolved={resolvedCount}
            session={<RelativeTime iso={goal.declaredAt} mode="elapsed" />}
          />

          {pending.length > 0 && (
            <>
              <div className="mb-4.5 flex items-baseline justify-between">
                <h2 className="text-[15px] font-semibold tracking-[-0.1px]">
                  Awaiting your decision
                </h2>
              </div>
              {pending.map((checkpoint) => {
                const thread = chats.find((c) => c.refId === checkpoint.id);
                const quote = thread?.messages.find((m) => m.role === "smith")?.content;
                return (
                  <DecisionCard
                    key={checkpoint.id}
                    checkpoint={checkpoint}
                    quote={quote}
                    onApprove={() => approve(checkpoint.id)}
                    onReject={() => reject(checkpoint.id)}
                  />
                );
              })}
              <div className="h-14" />
            </>
          )}

          <div className="mb-4.5 flex items-baseline justify-between">
            <h2 className="text-[15px] font-semibold tracking-[-0.1px]">Activity</h2>
          </div>
          <Timeline events={driftEvents} />

          <div className="mt-16 flex justify-between border-t border-border pt-5 text-[12.5px] text-faint">
            <span>
              {goal.name} · declared <RelativeTime iso={goal.declaredAt} mode="relative" />
            </span>
            <span>Smith · goal kept in Supermemory · checks via Groq</span>
          </div>
        </div>
      )}
    </div>
  );
}
