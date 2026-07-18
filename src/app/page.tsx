import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
import { ScoreBadge } from "@/components/ScoreBadge";
import { RelativeTime } from "@/components/RelativeTime";
import { computeScore } from "@/lib/scoring";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const projectIds = (projects ?? []).map((p) => p.id);

  const flaggedByProject = new Map<string, number>();
  const overriddenByProject = new Map<string, number>();

  if (projectIds.length > 0) {
    const [{ data: decisions }, { data: overrides }] = await Promise.all([
      supabase
        .from("decisions")
        .select("project_id")
        .in("project_id", projectIds)
        .eq("contradicts", true),
      supabase.from("overrides").select("project_id").in("project_id", projectIds),
    ]);

    for (const d of decisions ?? []) {
      flaggedByProject.set(d.project_id, (flaggedByProject.get(d.project_id) ?? 0) + 1);
    }
    for (const o of overrides ?? []) {
      overriddenByProject.set(o.project_id, (overriddenByProject.get(o.project_id) ?? 0) + 1);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-8 pb-24">
      <TopBar
        showLogo
        crumbs={[{ label: "Projects" }]}
        right={
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/settings/tokens" className="text-[13px] text-faint hover:text-muted-foreground">
              Access tokens
            </Link>
            <SignOutButton />
          </div>
        }
      />

      <div className="pt-11">
        {!projects || projects.length === 0 ? (
          <div className="rounded-[14px] border border-border bg-card p-8">
            <p className="mb-2 font-serif text-[20px] font-medium text-foreground">
              No projects yet
            </p>
            <p className="max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
              Generate an{" "}
              <Link href="/settings/tokens" className="text-foreground hover:underline">
                access token
              </Link>{" "}
              and paste it into <code className="rounded-[5px] bg-muted px-1.5 py-0.5">smith init</code>{" "}
              on the machine running your coding agent. Projects show up here once the watchdog
              registers them.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
              const score = computeScore(
                flaggedByProject.get(project.id) ?? 0,
                overriddenByProject.get(project.id) ?? 0,
              );
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block rounded-[14px] border border-border bg-card p-6 hover:border-border-strong"
                >
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-[15px] font-medium tracking-[-0.1px] text-foreground">
                      {project.name}
                    </span>
                    <ScoreBadge score={score} />
                  </div>
                  <p className="mb-3 max-w-2xl truncate text-[13.5px] text-muted-foreground">
                    {project.goal || "No goal declared yet."}
                  </p>
                  <p className="text-[12.5px] text-faint">
                    {project.last_synced_at ? (
                      <>
                        Last synced <RelativeTime iso={project.last_synced_at} />
                      </>
                    ) : (
                      "Never synced"
                    )}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
