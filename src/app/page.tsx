import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CopyCommand } from "@/components/landing/CopyCommand";
import { PixelSweep } from "@/components/landing/PixelSweep";
import { Reveal } from "@/components/landing/Reveal";
import { ScoreMeter } from "@/components/landing/ScoreMeter";
import { SmithTerminal } from "@/components/landing/SmithTerminal";
import { createClient } from "@/lib/supabase/server";

const INSTALL_COMMAND = "npm install -g @flash_dev/agent-smith";
const NPM_URL = "https://www.npmjs.com/package/@flash_dev/agent-smith";
const GITHUB_URL = "https://github.com/AnanthuNarashimman/smith_2.0";

const STEPS = [
  {
    title: "State your goal",
    body: "smith init opens a chat. He asks just enough questions to pin down what you're actually building, then locks it in.",
  },
  {
    title: "He watches",
    body: "A local server checks every risky Bash, Edit and Write call your agent makes — package installs, infra keywords, destructive commands, sensitive files — against that goal.",
  },
  {
    title: "He flags contradictions, not routine work",
    body: "Most actions pass through invisibly. The ones that look like they contradict your goal get judged by an LLM and surfaced as a normal permission prompt, with his reasoning attached.",
  },
  {
    title: "You decide, he keeps score",
    body: "Approve it anyway and it counts against your Consistency Score. Stick to the goal and the score holds.",
  },
  {
    title: "Argue back, if you disagree",
    body: "smith argue opens a conversation to contest a flag or revise the goal. He pushes back, but the final call is always yours.",
  },
  {
    title: "Watch it from the dashboard",
    body: "Every project you're tracking, its goal, its flagged history and its live score — in one place, synced from the terminal.",
  },
];

const FEATURES = [
  {
    title: "Goals by conversation, not config",
    body: "Smith asks the follow-up questions and drafts a concrete, testable goal statement. No YAML to keep in sync with what you meant.",
  },
  {
    title: "Real-time contradiction detection",
    body: "Runs on Claude Code's PreToolUse, PostToolUse and PostToolUseFailure hooks. No polling, no manual checks, no separate review step.",
  },
  {
    title: "One number, with history",
    body: "The Consistency Score tracks how well you actually held to what you said you'd build — and shows you every time you didn't.",
  },
  {
    title: "Fail-open by design",
    body: "Smith flags. He never hard-blocks. If anything in the judgment path fails, the action is allowed — he should never be the reason legitimate work can't happen.",
  },
  {
    title: "An appeals process",
    body: "smith argue contests a flag or forces a goal revision through the same interface, with real accountability: forcing a change still counts against your score.",
  },
  {
    title: "Every project, one account",
    body: "Each directory you run smith init in shows up on the dashboard with its own goal, history and score.",
  },
  {
    title: "Bring your own LLM",
    body: "Groq, OpenAI, Anthropic or Gemini — for both the goal-setting chat and the contradiction judge.",
  },
];

const STACK = [
  { name: "Node.js", role: "CLI, terminal chat, watchdog server" },
  { name: "Express", role: "the local /analyze endpoint hooks call into" },
  { name: "Claude Code", role: "PreToolUse / PostToolUse hooks, Skills" },
  { name: "Supermemory", role: "goals, decision and override history" },
  { name: "Groq · OpenAI · Anthropic · Gemini", role: "pluggable judge backends" },
  { name: "Supabase", role: "dashboard auth and database" },
  { name: "Render", role: "dashboard hosting" },
];

/**
 * Whether the visitor already has a session, so the CTAs can point at the
 * dashboard instead of the sign-in page. This is a cosmetic detail on a public
 * page — if the auth check fails for any reason, fall back to signed-out rather
 * than taking the whole landing page down with it.
 */
async function isSignedIn() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}

export default async function LandingPage() {
  const signedIn = await isSignedIn();
  const ctaHref = signedIn ? "/projects" : "/login";
  const ctaLabel = signedIn ? "Open your dashboard" : "Open the dashboard";

  return (
    <div className="relative">
      {/* ------------------------------------------------------------------ */}
      {/* Nav                                                                 */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3.5 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="size-2.5 bg-foreground" />
            <span className="font-mono text-[13px] font-semibold tracking-[0.06em] text-foreground uppercase">
              Smith
            </span>
          </Link>

          <nav className="hidden items-center gap-7 font-mono text-[12px] tracking-[0.04em] text-faint md:flex">
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#score" className="transition-colors hover:text-foreground">
              The score
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={ctaHref}
              className="pixel-edge flex items-center gap-1.5 bg-primary px-3.5 py-2 font-mono text-[12px] font-medium tracking-[0.03em] text-primary-foreground transition-opacity hover:opacity-85"
            >
              {signedIn ? "Dashboard" : "Sign in"}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pixel-grid pixel-grid-fade absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0 opacity-70" aria-hidden="true">
          <PixelSweep />
        </div>

        <div className="relative mx-auto grid max-w-[1240px] items-center gap-14 px-6 pt-20 pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10 lg:pt-28 lg:pb-32">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-2.5">
              <span className="pixel-flicker size-1.5 bg-signal" />
              Goal-fidelity watchdog
            </p>

            <h1 className="mb-7 font-serif text-[42px] leading-[1.06] font-medium tracking-[-0.02em] text-balance text-foreground sm:text-[56px] lg:text-[64px]">
              Your agent forgets what you asked for.
              <span className="text-faint"> Smith doesn&apos;t.</span>
            </h1>

            <p className="mb-9 max-w-[52ch] text-[15.5px] leading-[1.65] text-muted-foreground">
              Tell Smith your project&apos;s goal once. He watches every risky move your
              AI coding agent makes from then on, flags the ones that contradict it
              before they run, and keeps score of how well you stuck to it.
            </p>

            <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={ctaHref}
                className="pixel-edge inline-flex items-center justify-center gap-2 bg-primary px-6 py-3.5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-85"
              >
                {ctaLabel}
                <ArrowRight className="size-4" />
              </Link>
              <CopyCommand command={INSTALL_COMMAND} />
            </div>

            <p className="cite max-w-[46ch] text-[14px]">
              Never send a human to do a machine&apos;s job.
            </p>
          </div>

          <Reveal delay={120}>
            <SmithTerminal />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* The problem                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
              <div>
                <p className="eyebrow mb-4">The drift</p>
                <h2 className="font-serif text-[30px] leading-[1.18] font-medium tracking-[-0.015em] text-foreground sm:text-[38px]">
                  Nobody told it to stop.
                </h2>
              </div>
              <div className="space-y-5 text-[15.5px] leading-[1.72] text-muted-foreground">
                <p>
                  You ask for a simple auth fix. Three prompts later it&apos;s pulling in
                  infrastructure you never mentioned. Nothing failed, no test went red —
                  it just quietly wandered off the thing you said you were building.
                </p>
                <p>
                  By the time you notice, you&apos;re reviewing a diff that has nothing to
                  do with what you asked for. Every guardrail in your stack checks whether
                  the code is <em className="font-serif italic">correct</em>. None of them
                  remember what it was <em className="font-serif italic">for</em>.
                </p>
                <p className="text-foreground">
                  Smith sits between you and your coding agent and holds exactly one thing
                  in memory: the goal you stated, in your own words.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* How it works — a genuine sequence, so it's numbered                 */}
      {/* ------------------------------------------------------------------ */}
      <section id="how" className="border-b border-border scroll-mt-16">
        <div className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-4">How it works</p>
            <h2 className="mb-14 max-w-[24ch] font-serif text-[30px] leading-[1.18] font-medium tracking-[-0.015em] text-foreground sm:text-[38px]">
              One conversation up front. Then he stays out of your way.
            </h2>
          </Reveal>

          <ol className="border-t border-border">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 60}>
                <li className="grid gap-3 border-b border-border py-7 sm:grid-cols-[auto_1fr] sm:gap-8 lg:grid-cols-[auto_0.6fr_1fr] lg:gap-10">
                  <span className="font-mono text-[12px] font-semibold text-signal tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[16px] font-medium tracking-[-0.01em] text-foreground">
                    {step.title}
                  </h3>
                  <p className="max-w-[62ch] text-[14.5px] leading-[1.7] text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* The score                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section id="score" className="border-b border-border scroll-mt-16">
        <div className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow mb-4">The score</p>
              <h2 className="mb-6 font-serif text-[30px] leading-[1.18] font-medium tracking-[-0.015em] text-foreground sm:text-[38px]">
                How often you meant it.
              </h2>
              <p className="mb-8 max-w-[46ch] text-[15.5px] leading-[1.7] text-muted-foreground">
                Every flag is a fork: drop the action, or push it through. The Consistency
                Score is just the ratio of the first to both — kept over flagged. It sits
                on every project in your dashboard and moves only when you override him.
              </p>

              <div className="space-y-px font-mono text-[12px]">
                <Tier range="80–100" label="Holding the line" tint="var(--success)" />
                <Tier range="50–79" label="Wavering" tint="var(--warning)" />
                <Tier range="0–49" label="Compromised" tint="var(--destructive)" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <ScoreMeter />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Features                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section id="features" className="border-b border-border scroll-mt-16">
        <div className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-4">What he does</p>
            <h2 className="mb-14 max-w-[26ch] font-serif text-[30px] leading-[1.18] font-medium tracking-[-0.015em] text-foreground sm:text-[38px]">
              A watchdog, not a gate.
            </h2>
          </Reveal>

          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={(i % 3) * 70} className="bg-background">
                <div className="group h-full bg-background p-7 transition-colors hover:bg-card">
                  <span
                    className="mb-5 block size-2 bg-border-strong transition-colors group-hover:bg-signal"
                    aria-hidden="true"
                  />
                  <h3 className="mb-2.5 text-[15px] font-medium tracking-[-0.01em] text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] leading-[1.7] text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              </Reveal>
            ))}

            <Reveal delay={140} className="bg-background">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col justify-between bg-background p-7 transition-colors hover:bg-card"
              >
                <GitBranch className="mb-5 size-4 text-faint transition-colors group-hover:text-foreground" />
                <div>
                  <h3 className="mb-2.5 text-[15px] font-medium tracking-[-0.01em] text-foreground">
                    Read the source
                  </h3>
                  <p className="font-mono text-[13px] text-muted-foreground">
                    AnanthuNarashimman/smith_2.0 →
                  </p>
                </div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Stack                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-24">
          <Reveal>
            <p className="eyebrow mb-8">Built with</p>
            <dl className="grid gap-x-16 gap-y-px sm:grid-cols-2">
              {STACK.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border py-3.5"
                >
                  <dt className="font-mono text-[13px] font-medium text-foreground">
                    {item.name}
                  </dt>
                  <dd className="text-[13px] text-faint">{item.role}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Closing CTA                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden">
        <div className="pixel-grid pixel-grid-fade absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1240px] px-6 py-24 text-center lg:px-10 lg:py-32">
          <Reveal>
            <h2 className="mx-auto mb-6 max-w-[18ch] font-serif text-[34px] leading-[1.12] font-medium tracking-[-0.02em] text-balance text-foreground sm:text-[46px]">
              State your goal once. He&apos;ll hold you to it.
            </h2>
            <p className="mx-auto mb-10 max-w-[44ch] text-[15px] leading-[1.7] text-muted-foreground">
              One command, and Smith starts watching the project you&apos;re in.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CopyCommand command={INSTALL_COMMAND} className="w-full sm:w-auto" />
              <Link
                href={ctaHref}
                className="pixel-edge inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-85 sm:w-auto"
              >
                {ctaLabel}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-2.5">
            <span className="size-2 bg-foreground" />
            <span className="font-mono text-[12px] tracking-[0.06em] text-faint uppercase">
              Agent Smith 2.0
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-[12px] text-faint">
            <a href={NPM_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
              npm
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            <Link href={ctaHref} className="hover:text-foreground">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Tier({ range, label, tint }: { range: string; label: string; tint: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-border py-2.5">
      <span className="size-2.5 shrink-0" style={{ backgroundColor: tint }} />
      <span className="w-[68px] text-faint tabular-nums">{range}</span>
      <span className="tracking-[0.08em] text-muted-foreground uppercase">{label}</span>
    </div>
  );
}
