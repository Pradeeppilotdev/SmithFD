export type DriftSeverity = "low" | "medium" | "high";
export type DriftStatus = "flagged" | "resolved" | "noted";
export type CheckpointStatus = "pending" | "executing" | "done" | "failed";

export interface ProjectGoal {
  id: string;
  name: string;
  headline: string;
  intent: string;
  declaredAt: string;
  inScope: string[];
  excluded: string[];
  violatedExclusions: string[];
  constraints: string[];
}

export interface DriftEvent {
  id: string;
  projectId: string;
  title: string;
  description: string;
  violatedClause?: string;
  severity: DriftSeverity;
  status: DriftStatus;
  detectedAt: string;
  relatedAction?: string;
}

export interface SmithCheckpoint {
  id: string;
  projectId: string;
  commentText: string;
  status: CheckpointStatus;
  linkedCommit?: string;
  createdAt: string;
  executedAt?: string;
}

export type ChatRole = "smith" | "user";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  cite?: string;
  verdict?: string;
  createdAt: string;
}

export type ChatRefKind = "drift" | "checkpoint";

export interface ChatAmendment {
  before: string;
  after: string;
  note: string;
}

export interface ChatThread {
  id: string;
  title: string;
  refKind: ChatRefKind;
  refId: string;
  clauseChip?: string;
  command?: string;
  messages: ChatMessage[];
  amendment?: ChatAmendment;
  updatedAt: string;
}
