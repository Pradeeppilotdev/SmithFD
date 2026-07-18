import { TopBar } from "@/components/TopBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
import { TokensPanel } from "@/components/TokensPanel";
import { createClient } from "@/lib/supabase/server";

export default async function TokensPage() {
  const supabase = await createClient();
  const { data: tokens } = await supabase
    .from("access_tokens")
    .select("id, label, created_at, revoked_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-[960px] px-8 pb-24 lg:px-14">
      <TopBar
        showLogo
        crumbs={[{ label: "Projects", href: "/projects" }, { label: "Access tokens" }]}
        right={
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SignOutButton />
          </div>
        }
      />

      <div className="pt-11">
        <p className="eyebrow mb-3">Settings</p>
        <h1 className="mb-2 font-serif text-[26px] leading-[1.25] font-medium tracking-[-0.2px] text-foreground">
          Access tokens
        </h1>
        <p className="mb-9 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">
          Paste a token into <code className="rounded-[5px] bg-card px-1.5 py-0.5">smith init</code>{" "}
          to connect the CLI on a machine to this dashboard.
        </p>

        <TokensPanel initialTokens={tokens ?? []} />
      </div>
    </div>
  );
}
