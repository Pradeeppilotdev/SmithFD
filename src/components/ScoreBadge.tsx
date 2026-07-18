import { Pill } from "@/components/Pill";
import { Score, scoreTonePillTone } from "@/lib/scoring";

export function ScoreBadge({ score }: { score: Score }) {
  return (
    <Pill tone={scoreTonePillTone[score.tone]}>
      {score.score !== null ? `${score.score} · ${score.label}` : score.label}
    </Pill>
  );
}
