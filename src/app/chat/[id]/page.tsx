import { notFound } from "next/navigation";
import { ChatView } from "@/components/ChatView";
import {
  getChatById,
  getCheckpointById,
  getDriftEventById,
  mockGoal,
} from "@/lib/mock-data";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = getChatById(id);

  if (!thread) {
    notFound();
  }

  const driftEvent =
    thread.refKind === "drift" ? getDriftEventById(thread.refId) : undefined;
  const checkpoint =
    thread.refKind === "checkpoint" ? getCheckpointById(thread.refId) : undefined;

  return (
    <ChatView
      thread={thread}
      goal={mockGoal}
      driftEvent={driftEvent}
      checkpoint={checkpoint}
    />
  );
}
