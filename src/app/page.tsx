import { Dashboard } from "@/components/Dashboard";
import { mockChats, mockCheckpoints, mockDriftEvents, mockGoal } from "@/lib/mock-data";

export default function Home() {
  return (
    <Dashboard
      goal={mockGoal}
      driftEvents={mockDriftEvents}
      checkpoints={mockCheckpoints}
      chats={mockChats}
    />
  );
}
