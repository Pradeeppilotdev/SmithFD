import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
import { ScoreBadge } from "@/components/ScoreBadge";
import { QuietStats } from "@/components/QuietStats";
import { RelativeTime } from "@/components/RelativeTime";
import { Badge } from "@/components/Pill";
import { computeScore } from "@/lib/scoring";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (!project) {
    notFound();
  }

  const [{ data: decisions }, { data: overrides }] = await Promise.all([
    supabase
      .from("decisions")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("overrides")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const flaggedCount = (decisions ?? []).filter((d) => d.contradicts).length;
  const overriddenCount = overrides?.length ?? 0;
  const keptCount = Math.max(flaggedCount - overriddenCount, 0);
  const score = computeScore(flaggedCount, overriddenCount);

  return (
    <div className="mx-auto max-w-[1800px] px-8 pb-24 lg:px-14">
      <TopBar
        crumbs={[{ label: "Projects", href: "/" }, { label: project.name }]}
        right={
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SignOutButton />
          </div>
        }
      />

      <div className="pt-11">
        <p className="eyebrow mb-3.5">Declared goal</p>
        <div className="mb-8 flex items-start justify-between gap-6">
          <p className="max-w-3xl font-serif text-[20px] leading-relaxed font-medium text-foreground">
            {project.goal || "No goal declared yet."}
          </p>
          <ScoreBadge score={score} />
        </div>

        <QuietStats
          stats={[
            { value: flaggedCount, label: "flagged", tone: "destructive" },
            { value: overriddenCount, label: "overridden", tone: "warning" },
            { value: keptCount, label: "kept", tone: "success" },
            {
              value: project.last_synced_at ? (
                <RelativeTime iso={project.last_synced_at} mode="relative" />
              ) : (
                "never"
              ),
              label: "last synced",
            },
          ]}
        />

        <div className="mb-4.5 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold tracking-[-0.1px]">Decisions</h2>
        </div>
        {!decisions || decisions.length === 0 ? (
          <p className="mb-14 text-[13.5px] text-faint">No decisions logged yet.</p>
        ) : (
          <div className="mb-14 space-y-3">
            {decisions.map((decision) => (
              <div key={decision.id} className="rounded-[14px] border border-border bg-card p-5">
                <div className="mb-1.5 flex flex-wrap items-baseline gap-2.5">
                  <Badge tone={decision.contradicts ? "destructive" : "neutral"}>
                    {decision.contradicts ? "Flagged" : "OK"}
                  </Badge>
                  <span className="text-[12.5px] text-faint">
                    <RelativeTime iso={decision.created_at} />
                  </span>
                </div>
                <code className="mb-1.5 block text-[13px] text-foreground">{decision.action}</code>
                {decision.reasoning && (
                  <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                    {decision.reasoning}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mb-4.5 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold tracking-[-0.1px]">Overrides</h2>
        </div>
        {!overrides || overrides.length === 0 ? (
          <p className="text-[13.5px] text-faint">No overrides yet.</p>
        ) : (
          <div className="space-y-3">
            {overrides.map((override) => (
              <div key={override.id} className="rounded-[14px] border border-border bg-card p-5">
                <div className="mb-1.5">
                  <span className="text-[12.5px] text-faint">
                    <RelativeTime iso={override.created_at} />
                  </span>
                </div>
                <code className="block text-[13px] text-foreground">{override.action}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
