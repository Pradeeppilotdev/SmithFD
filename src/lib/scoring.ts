export type ScoreTone = "gray" | "green" | "yellow" | "red";

export interface Score {
  score: number | null;
  label: string;
  tone: ScoreTone;
}

export function computeScore(flaggedCount: number, overriddenCount: number): Score {
  if (flaggedCount === 0) {
    return { score: null, label: "NO DATA YET", tone: "gray" };
  }

  const keptCount = Math.max(flaggedCount - overriddenCount, 0);
  const score = Math.round((keptCount / flaggedCount) * 100);

  if (score >= 80) return { score, label: "HOLDING THE LINE", tone: "green" };
  if (score >= 50) return { score, label: "WAVERING", tone: "yellow" };
  return { score, label: "COMPROMISED", tone: "red" };
}

export const scoreTonePillTone: Record<ScoreTone, "success" | "warning" | "destructive" | "neutral"> = {
  green: "success",
  yellow: "warning",
  red: "destructive",
  gray: "neutral",
};
