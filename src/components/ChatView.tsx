"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shimmer } from "@/components/Shimmer";
import { Pill } from "@/components/Pill";
import { TopBar } from "@/components/TopBar";
import { RelativeTime } from "@/components/RelativeTime";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatMessage, ChatThread, DriftEvent, ProjectGoal, SmithCheckpoint } from "@/types";

const SMITH_REPLIES = [
  "Noted — I'll factor that into how I evaluate similar cases going forward.",
  "Got it. I'll hold this at its current status until you confirm the next step.",
  "Makes sense. Want me to turn that into a checkpoint so it applies automatically next time?",
  "Understood. Flagging that context in the case log for anyone who reviews this later.",
];

function pickReply(seed: number) {
  return SMITH_REPLIES[seed % SMITH_REPLIES.length];
}

function Avatar({ role }: { role: "smith" | "user" }) {
  if (role === "smith") {
    return (
      <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-foreground text-[11.5px] font-semibold text-background">
        S
      </div>
    );
  }
  return (
    <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-border-strong bg-card text-[11.5px] font-semibold text-muted-foreground">
      Y
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="mb-7.5 flex max-w-[800px] gap-4">
      <Avatar role={message.role} />
      <div className="min-w-0">
        <div className="mb-1.5 flex items-baseline gap-2.5">
          <span className="text-[13px] font-semibold tracking-[-0.1px]">
            {message.role === "smith" ? "Smith" : "You"}
          </span>
          <span className="text-xs text-faint">
            <RelativeTime iso={message.createdAt} mode="clock" />
          </span>
        </div>
        <div className="space-y-2.5 text-sm leading-relaxed text-foreground">
          <p>{message.content}</p>
          {message.cite && <blockquote className="cite text-sm">{message.cite}</blockquote>}
        </div>
        {message.verdict && (
          <div className="mt-3">
            <Pill tone="success" dot={false}>
              {message.verdict}
            </Pill>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="mb-7.5 flex max-w-[800px] gap-4">
      <Avatar role="smith" />
      <div className="pt-1">
        <Shimmer className="h-3.5 w-32" />
      </div>
    </div>
  );
}

function statusPill(thread: ChatThread, checkpoint?: SmithCheckpoint, driftEvent?: DriftEvent) {
  if (checkpoint) {
    if (checkpoint.status === "pending") return <Pill tone="warning">Awaiting you</Pill>;
    if (checkpoint.status === "done") return <Pill tone="success">Resolved</Pill>;
    if (checkpoint.status === "failed") return <Pill tone="destructive">Rejected</Pill>;
  }
  if (driftEvent) {
    if (driftEvent.status === "flagged") return <Pill tone="destructive">Flagged</Pill>;
    if (driftEvent.status === "resolved") return <Pill tone="success">Resolved</Pill>;
    if (driftEvent.status === "noted") return <Pill tone="neutral">Noted</Pill>;
  }
  return null;
}

export function ChatView({
  thread,
  goal,
  driftEvent,
  checkpoint,
}: {
  thread: ChatThread;
  goal: ProjectGoal;
  driftEvent?: DriftEvent;
  checkpoint?: SmithCheckpoint;
}) {
  const [messages, setMessages] = useState(thread.messages);
  const [checkpointStatus, setCheckpointStatus] = useState(checkpoint?.status);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: `user_${Date.now()}`, role: "user", content: text, createdAt: new Date().toISOString() },
    ]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `smith_${Date.now()}`,
          role: "smith",
          content: pickReply(prev.length),
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 1100);
  }

  const isPendingDecision = checkpoint && checkpointStatus === "pending";

  return (
    <div className="mx-auto flex min-h-screen max-w-[1120px] flex-col px-8">
      <TopBar
        crumbs={[
          { label: "Projects", href: "/" },
          { label: goal.name, href: "/" },
          { label: thread.title },
        ]}
        right={<div className="flex items-center gap-1"><ThemeToggle />{statusPill(thread, checkpoint, driftEvent)}</div>}
      />

      <div className="mb-9 pt-9">
        <h1 className="mb-3 max-w-xl font-serif text-[26px] leading-[1.25] font-medium tracking-[-0.2px] text-foreground">
          {thread.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
          {thread.clauseChip && (
            <>
              <span>Flagged against</span>
              <span className="rounded-full border border-destructive/25 bg-destructive-soft px-2.5 py-0.5 text-[12.5px] font-medium text-destructive line-through decoration-destructive">
                {thread.clauseChip}
              </span>
            </>
          )}
          {thread.command && (
            <>
              <span>{thread.clauseChip ? "when the agent ran" : "Related to"}</span>
              <code className="rounded-[6px] border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground">
                {thread.command}
              </code>
            </>
          )}
        </div>
      </div>

      <div className="flex-1">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {typing && <TypingIndicator />}

        {thread.amendment && (
          <div className="mt-1.5 mb-7.5 ml-[46px] max-w-[754px] rounded-[14px] border border-border bg-card p-5.5">
            <p className="mb-2.5 text-[11.5px] font-semibold tracking-[0.07em] text-faint uppercase">
              Proposed amendment
            </p>
            <div className="space-y-1.5 text-[13.5px] leading-relaxed">
              <div className="text-faint line-through">{thread.amendment.before}</div>
              <div className="inline-block rounded-[4px] bg-success-soft px-1.5 py-0.5 text-success">
                {thread.amendment.after}
              </div>
            </div>
            <p className="mt-2.5 text-[12.5px] text-faint">{thread.amendment.note}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 mt-3 border-t border-border bg-background py-4.5 pb-6.5">
        <div className="flex items-center gap-3">
          <div className="flex h-[46px] flex-1 items-center rounded-[12px] border border-border-strong bg-card pr-1.5 pl-4 focus-within:border-faint">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Push back, or ask Smith to reconsider…"
              className="flex-1 border-none bg-transparent text-sm text-foreground placeholder:text-faint focus:outline-none"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="rounded-[8px] bg-secondary px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
            >
              Send
            </button>
          </div>
          {isPendingDecision && (
            <>
              <Button
                variant="outline"
                className="h-auto rounded-[10px] px-5 py-3 text-[13.5px]"
                onClick={() => setCheckpointStatus("failed")}
              >
                Reject
              </Button>
              <Button
                variant="default"
                className="h-auto rounded-[10px] px-5 py-3 text-[13.5px]"
                onClick={() => setCheckpointStatus("done")}
              >
                Approve amendment
              </Button>
            </>
          )}
        </div>
        {isPendingDecision && (
          <p className="mt-2.5 text-xs text-faint">
            Approving records this exchange in the project ledger and unblocks the agent.
          </p>
        )}
      </div>
    </div>
  );
}
