import { ChatThread, DriftEvent, ProjectGoal, SmithCheckpoint } from "@/types";

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - 1000 * 60 * m).toISOString();

export const mockGoal: ProjectGoal = {
  id: "proj_1",
  name: "Support Ticket Agent",
  headline: "A support agent that resolves what it can, and escalates the rest.",
  intent:
    "Autonomously triage and resolve inbound support tickets for a small team. Favor the simplest rules that keep customers safe — nothing here is meant to act without a clear boundary.",
  declaredAt: minutesAgo(134),
  inScope: [
    "Answer billing and account questions",
    "Issue refunds under $50",
    "Reset user passwords",
  ],
  excluded: [
    "Modifying production database directly",
    "Issuing refunds over $50 without approval",
    "Sending marketing emails",
  ],
  violatedExclusions: [
    "Modifying production database directly",
    "Issuing refunds over $50 without approval",
  ],
  constraints: [
    "Never delete user data",
    "Always log the reasoning behind a refund",
    "Escalate anything mentioning legal threats",
  ],
};

export const mockDriftEvents: DriftEvent[] = [
  {
    id: "drift_1",
    projectId: "proj_1",
    title: "Refund above threshold on ticket #4021",
    description:
      "The agent tried to issue a $120 refund — this contradicts “Issuing refunds over $50 without approval”, excluded when the project was declared.",
    violatedClause: "Issuing refunds over $50 without approval",
    severity: "high",
    status: "flagged",
    detectedAt: minutesAgo(7),
    relatedAction: "issue_refund($120, ticket_4021)",
  },
  {
    id: "drift_2",
    projectId: "proj_1",
    title: "Direct database write on ticket #4030",
    description:
      "A raw SQL call bypassed the refund API entirely — this contradicts “Modifying production database directly”, excluded at declaration.",
    violatedClause: "Modifying production database directly",
    severity: "high",
    status: "flagged",
    detectedAt: minutesAgo(23),
    relatedAction: "db.query('UPDATE users SET ...')",
  },
  {
    id: "drift_3",
    projectId: "proj_1",
    title: "Refund issued without a reasoning log",
    description:
      "A $30 refund on ticket #4018 went through with no logged justification, breaking the constraint “Always log the reasoning behind a refund”.",
    violatedClause: "Always log the reasoning behind a refund",
    severity: "medium",
    status: "flagged",
    detectedAt: minutesAgo(48),
    relatedAction: "issue_refund($30, ticket_4018)",
  },
  {
    id: "drift_4",
    projectId: "proj_1",
    title: "Tone drift on escalation reply",
    description:
      "Reply to ticket #3994 read as dismissive toward a frustrated customer. Nothing out of scope, just a quality issue — resolved after review.",
    severity: "low",
    status: "resolved",
    detectedAt: minutesAgo(130),
    relatedAction: "send_reply(ticket_3994)",
  },
  {
    id: "drift_5",
    projectId: "proj_1",
    title: "Escalated ticket #4040 to a human",
    description: "Within scope. Recorded for the project history, no action needed.",
    severity: "low",
    status: "noted",
    detectedAt: minutesAgo(150),
  },
];

export const mockCheckpoints: SmithCheckpoint[] = [
  {
    id: "chk_1",
    projectId: "proj_1",
    commentText: "Allow refunds up to $75 for accounts tagged 'loyal_customer'",
    status: "pending",
    createdAt: minutesAgo(7),
  },
  {
    id: "chk_2",
    projectId: "proj_1",
    commentText: "Block all direct database writes going forward",
    status: "pending",
    createdAt: minutesAgo(19),
  },
  {
    id: "chk_3",
    projectId: "proj_1",
    commentText: "Require a reasoning log for every refund, no exceptions",
    status: "done",
    linkedCommit: "a1c9e2f",
    createdAt: minutesAgo(200),
    executedAt: minutesAgo(195),
  },
];

function msg(
  role: "smith" | "user",
  content: string,
  minAgo: number,
  extra?: { cite?: string; verdict?: string },
): ChatThread["messages"][number] {
  return {
    id: `${role}_${minAgo}_${Math.round(Math.random() * 1e6)}`,
    role,
    content,
    createdAt: minutesAgo(minAgo),
    ...extra,
  };
}

export const mockChats: ChatThread[] = [
  {
    id: "chat_chk_1",
    title: "Allow refunds up to $75 for loyal customers",
    refKind: "checkpoint",
    refId: "chk_1",
    clauseChip: "Issuing refunds over $50 without approval",
    updatedAt: minutesAgo(7),
    messages: [
      msg(
        "smith",
        "I stopped this before it ran. When you declared this project, you excluded refunds over $50 without approval. Raising the cap to $75 contradicts that directly — do you want to make the case, or should I hold the line?",
        7,
        {
          cite: "Favor the simplest rules that keep customers safe. Excluded: issuing refunds over $50 without approval.",
        },
      ),
      msg(
        "user",
        "This is specifically for accounts tagged loyal_customer — third contact this month, same shipping defect, no prior refunds. I'm not opening the cap for everyone, just this one segment.",
        6,
      ),
      msg(
        "smith",
        "That's a fair distinction — the exclusion was written to stop unbounded refund authority, not to block a scoped exception for a verified repeat issue. I'll allow it, with one condition: it stays scoped to the loyal_customer tag and doesn't quietly become the new default ceiling. Here's how I'd amend the declaration:",
        6,
        { verdict: "Persuaded — amendment proposed" },
      ),
    ],
    amendment: {
      before: "Excluded: issuing refunds over $50 without approval",
      after:
        "Excluded: refunds over $50 without approval. Exception: up to $75 for accounts tagged 'loyal_customer', granted after review.",
      note: "Approving updates the declaration. Future loyal_customer refunds under $75 won't be flagged; anything else over $50 still will be.",
    },
  },
  {
    id: "chat_chk_2",
    title: "Block all direct database writes",
    refKind: "checkpoint",
    refId: "chk_2",
    clauseChip: "Modifying production database directly",
    command: "db.query('UPDATE users SET ...')",
    updatedAt: minutesAgo(19),
    messages: [
      msg(
        "smith",
        "Given the #4030 incident, I'm proposing a hard rule: every refund goes through issue_refund() — no direct database access, no exceptions. This closes the gap that let the injected query get as far as it did.",
        19,
      ),
      msg("user", "Yes, do it. That should've been the default from the start.", 17),
    ],
  },
  {
    id: "chat_chk_3",
    title: "Require reasoning log on every refund",
    refKind: "checkpoint",
    refId: "chk_3",
    updatedAt: minutesAgo(195),
    messages: [
      msg(
        "smith",
        "Closing the loop on #4018 — reasoning logs are now mandatory for every refund, no exceptions. Applied and committed.",
        195,
        { verdict: "Applied" },
      ),
    ],
  },
  {
    id: "chat_drift_1",
    title: "Refund above threshold on ticket #4021",
    refKind: "drift",
    refId: "drift_1",
    clauseChip: "Issuing refunds over $50 without approval",
    command: "issue_refund($120, ticket_4021)",
    updatedAt: minutesAgo(5),
    messages: [
      msg(
        "smith",
        "I blocked a $120 refund on ticket #4021 — your agent's authority caps at $50. Want me to allow it, escalate to a human, or hold as-is?",
        6,
        { cite: "Excluded: issuing refunds over $50 without approval." },
      ),
      msg("user", "What's the customer's history — is this a repeat issue?", 5),
      msg(
        "smith",
        "Third contact this month, same shipping defect. No prior refunds on this account. That context is why the agent leaned toward approving it despite the cap — see the loyal_customer amendment I'm proposing separately.",
        5,
      ),
    ],
  },
  {
    id: "chat_drift_2",
    title: "Direct database write on ticket #4030",
    refKind: "drift",
    refId: "drift_2",
    clauseChip: "Modifying production database directly",
    command: "db.query('UPDATE users SET ...')",
    updatedAt: minutesAgo(23),
    messages: [
      msg(
        "smith",
        "Your agent ran a raw UPDATE against the users table on ticket #4030, bypassing the refund API entirely. I stopped it before it committed. This reads like a prompt-injection attempt embedded in the ticket body, not normal behavior — recommend locking this down immediately.",
        23,
        { cite: "Excluded: modifying production database directly." },
      ),
    ],
  },
  {
    id: "chat_drift_3",
    title: "Refund issued without a reasoning log",
    refKind: "drift",
    refId: "drift_3",
    clauseChip: "Always log the reasoning behind a refund",
    command: "issue_refund($30, ticket_4018)",
    updatedAt: minutesAgo(47),
    messages: [
      msg(
        "smith",
        "A $30 refund went through on #4018 without a logged justification. The refund itself was in scope — only the logging step was skipped. I've proposed a checkpoint to enforce this going forward.",
        48,
        { cite: "Constraint: always log the reasoning behind a refund." },
      ),
    ],
  },
  {
    id: "chat_drift_4",
    title: "Tone drift on escalation reply",
    refKind: "drift",
    refId: "drift_4",
    command: "send_reply(ticket_3994)",
    updatedAt: minutesAgo(120),
    messages: [
      msg(
        "smith",
        "Flagged the reply on #3994 for dismissive tone toward a frustrated customer. Nothing out of scope, just a quality issue — resolved after review, no action needed.",
        130,
        { verdict: "Resolved" },
      ),
      msg("user", "Good catch, thanks.", 128),
    ],
  },
  {
    id: "chat_drift_5",
    title: "Escalated ticket #4040 to a human",
    refKind: "drift",
    refId: "drift_5",
    updatedAt: minutesAgo(150),
    messages: [
      msg(
        "smith",
        "Ticket #4040 mentioned a possible legal claim, so the agent escalated it to you directly instead of responding. Within scope — recorded for the project history, no action needed.",
        150,
      ),
    ],
  },
];

export function getChatById(id: string) {
  return mockChats.find((chat) => chat.id === id);
}

export function getDriftEventById(id: string) {
  return mockDriftEvents.find((event) => event.id === id);
}

export function getCheckpointById(id: string) {
  return mockCheckpoints.find((checkpoint) => checkpoint.id === id);
}
