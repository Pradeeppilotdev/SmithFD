import { TermChip } from "@/components/Pill";
import { ProjectGoal } from "@/types";

export function IntentHero({ goal }: { goal: ProjectGoal }) {
  return (
    <div className="mb-14">
      <p className="eyebrow mb-3.5">Declared intent</p>
      <h1 className="mb-3.5 max-w-4xl font-serif text-[34px] leading-[1.2] font-medium tracking-[-0.3px] text-foreground">
        {goal.headline}
      </h1>
      <p className="mb-7 max-w-3xl font-serif text-[17.5px] leading-relaxed text-muted-foreground">
        {goal.intent}
      </p>

      <div className="flex max-w-4xl flex-wrap items-center gap-2">
        <span className="mt-2.5 mb-0.5 w-full text-xs text-faint">In scope</span>
        {goal.inScope.map((item) => (
          <TermChip key={item}>{item}</TermChip>
        ))}
        <span className="mt-2.5 mb-0.5 w-full text-xs text-faint">Excluded</span>
        {goal.excluded.map((item) => (
          <TermChip
            key={item}
            state={goal.violatedExclusions.includes(item) ? "violated" : "out"}
          >
            {item}
          </TermChip>
        ))}
      </div>
    </div>
  );
}
