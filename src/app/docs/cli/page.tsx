import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TopBar } from "@/components/TopBar";

const COMMANDS = [
  {
    command: "smith init",
    body: "Full setup: collects keys, installs Claude Code hooks + slash commands, starts the local server, then runs the goal-setting chat.",
    hitsApi: true,
  },
  {
    command: "smith update [message]",
    body: "Pushes the current goal + a status message to the dashboard.",
    hitsApi: true,
  },
  {
    command: "smith update key / smith update-key",
    body: "Rotate one stored key (provider / supermemory / web).",
    hitsApi: "Only to validate the new token",
  },
  {
    command: "smith status",
    body: "Prints the goal, Consistency Score, and flagged decision history.",
    hitsApi: false,
  },
  {
    command: "smith argue",
    body: "Chat that can override/replace the goal; logged against the score.",
    hitsApi: false,
  },
  {
    command: "smith clear",
    body: "Deletes all Supermemory data for this project and unlinks it from the dashboard.",
    hitsApi: false,
  },
  {
    command: "smith reset",
    body: "Deletes the local config file (all stored keys).",
    hitsApi: false,
  },
  {
    command: "smith off",
    body: "Stops the local Agent Smith server.",
    hitsApi: false,
  },
];

const ENDPOINTS = [
  {
    endpoint: "POST /api/cli/validate-token",
    body: "(none)",
    sentBy: "key entry during init / update key",
    response: "{ valid: boolean } — CLI rejects the token if valid is falsy",
  },
  {
    endpoint: "POST /api/cli/projects",
    body: "{ name, goal }",
    sentBy: "init, update",
    response: "{ projectId } — cached in config",
  },
  {
    endpoint: "POST /api/cli/projects/:id/sync",
    body: "{ goal, message }",
    sentBy: "init (after goal set), update",
    response: "ignored",
  },
  {
    endpoint: "POST /api/cli/projects/:id/decisions",
    body: "{ action, contradicts, reasoning }",
    sentBy: "local server, on every judged tool call",
    response: "ignored",
  },
  {
    endpoint: "POST /api/cli/projects/:id/overrides",
    body: "{ action, actionHash }",
    sentBy: "local server, when a flagged action runs anyway",
    response: "ignored",
  },
];

export default function CliReferencePage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 lg:px-10">
      <TopBar
        showLogo
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "CLI reference" }]}
        right={
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="text-[13px] text-faint hover:text-muted-foreground">
              ← Back home
            </Link>
          </div>
        }
      />

      <div className="pt-11">
        <p className="eyebrow mb-3.5">Reference</p>
        <h1 className="mb-3 font-serif text-[32px] leading-[1.15] font-medium tracking-[-0.015em] text-foreground sm:text-[40px]">
          Agent Smith CLI — command reference
        </h1>
        <p className="max-w-[62ch] text-[15px] leading-[1.7] text-muted-foreground">
          Everything the <code className="font-mono text-[13.5px] text-foreground">smith</code> CLI
          exposes, plus which commands talk to the dashboard API. Source of truth:{" "}
          <code className="font-mono text-[13.5px] text-foreground">bin/smith.js</code> (dispatch at
          the bottom of the file).
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Command summary                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="mt-14">
        <h2 className="mb-5 font-serif text-[22px] font-medium tracking-[-0.01em] text-foreground">
          Command summary
        </h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-card text-left font-mono text-[11px] tracking-[0.06em] text-faint uppercase">
                <th className="px-4 py-3 font-medium">Command</th>
                <th className="px-4 py-3 font-medium">What it does</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Hits dashboard API?</th>
              </tr>
            </thead>
            <tbody>
              {COMMANDS.map((row) => (
                <tr key={row.command} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 align-top font-mono text-[12.5px] whitespace-nowrap text-foreground">
                    {row.command}
                  </td>
                  <td className="px-4 py-3 align-top leading-[1.6] text-muted-foreground">
                    {row.body}
                  </td>
                  <td className="px-4 py-3 align-top whitespace-nowrap">
                    {row.hitsApi === false ? (
                      <span className="text-faint">No</span>
                    ) : row.hitsApi === true ? (
                      <span className="font-medium text-success">Yes</span>
                    ) : (
                      <span className="text-warning">{row.hitsApi}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-faint">
          Unknown/absent command prints the usage line and exits 1.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* How a project is identified                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="mt-14">
        <h2 className="mb-5 font-serif text-[22px] font-medium tracking-[-0.01em] text-foreground">
          How a project is identified
        </h2>
        <p className="max-w-[68ch] text-[14.5px] leading-[1.75] text-muted-foreground">
          <code className="font-mono text-[13px] text-foreground">getContainerTag()</code> (
          <code className="font-mono text-[13px] text-foreground">lib/goal-store.js:5</code>) derives
          an ID from the <strong className="font-medium text-foreground">git repo root&apos;s folder name</strong>,
          falling back to <code className="font-mono text-[13px] text-foreground">process.cwd()</code> when
          not in a repo. Non-alphanumeric characters become{" "}
          <code className="font-mono text-[13px] text-foreground">-</code> (Supermemory only permits{" "}
          <code className="font-mono text-[13px] text-foreground">[a-zA-Z0-9_:-]</code>).
        </p>

        <pre className="pixel-edge mt-5 overflow-x-auto border border-border-strong bg-card px-4 py-3 font-mono text-[12.5px] leading-[1.7] text-muted-foreground">
          {"~/Desktop/CodeBase/smith_2.0  ->  project-smith_2-0"}
        </pre>

        <p className="mt-5 mb-2 text-[14.5px] leading-[1.75] text-foreground">
          Two consequences worth designing around on the web side:
        </p>
        <ul className="list-disc space-y-2.5 pl-5 text-[14.5px] leading-[1.7] text-muted-foreground">
          <li>
            The tag is <strong className="font-medium text-foreground">not globally unique</strong> —
            two different users, or the same user with two clones in differently-named folders,
            produce colliding or diverging tags. The dashboard should treat{" "}
            <code className="font-mono text-[13px] text-foreground">(user, containerTag)</code> as the
            key, never <code className="font-mono text-[13px] text-foreground">containerTag</code>{" "}
            alone.
          </li>
          <li>Renaming the folder silently creates a new project on the next command.</li>
        </ul>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Local config                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="mt-14">
        <h2 className="mb-5 font-serif text-[22px] font-medium tracking-[-0.01em] text-foreground">
          Local config
        </h2>
        <p className="max-w-[68ch] text-[14.5px] leading-[1.75] text-muted-foreground">
          <code className="font-mono text-[13px] text-foreground">~/.agent-smith/config.json</code>,
          written with mode <code className="font-mono text-[13px] text-foreground">0600</code>:
        </p>
        <pre className="pixel-edge mt-4 overflow-x-auto border border-border-strong bg-card px-4 py-3.5 font-mono text-[12.5px] leading-[1.65] text-muted-foreground">
{`{
  "provider": "groq",
  "apiKey": "...",
  "supermemoryApiKey": "...",
  "webAccessToken": "...",
  "dashboardProjects": { "project-smith_2-0": "<uuid>" }
}`}
        </pre>
        <p className="mt-4 max-w-[68ch] text-[14.5px] leading-[1.75] text-muted-foreground">
          <code className="font-mono text-[13px] text-foreground">dashboardProjects</code> maps
          containerTag → the dashboard&apos;s project UUID. It&apos;s the CLI&apos;s only memory of
          what the server calls this project.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Dashboard API contract                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="mt-14">
        <h2 className="mb-3 font-serif text-[22px] font-medium tracking-[-0.01em] text-foreground">
          Dashboard API contract
        </h2>
        <p className="mb-5 max-w-[68ch] text-[14.5px] leading-[1.75] text-muted-foreground">
          Base URL: <code className="font-mono text-[13px] text-foreground">AGENT_SMITH_DASHBOARD_URL</code>{" "}
          env var, defaulting to{" "}
          <code className="font-mono text-[13px] text-foreground">https://smith-bmjd.onrender.com</code>.
          All calls are <code className="font-mono text-[13px] text-foreground">POST</code>, JSON body,
          bearer token in the <code className="font-mono text-[13px] text-foreground">Authorization</code>{" "}
          header. Client code:{" "}
          <code className="font-mono text-[13px] text-foreground">lib/dashboard-client.js</code>.
        </p>

        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-border bg-card text-left font-mono text-[11px] tracking-[0.06em] text-faint uppercase">
                <th className="px-4 py-3 font-medium">Endpoint</th>
                <th className="px-4 py-3 font-medium">Body</th>
                <th className="px-4 py-3 font-medium">Sent by</th>
                <th className="px-4 py-3 font-medium">Response used</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((row) => (
                <tr key={row.endpoint} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 align-top font-mono text-[12px] whitespace-nowrap text-foreground">
                    {row.endpoint}
                  </td>
                  <td className="px-4 py-3 align-top font-mono text-[12px] whitespace-nowrap text-muted-foreground">
                    {row.body}
                  </td>
                  <td className="px-4 py-3 align-top leading-[1.6] text-muted-foreground">
                    {row.sentBy}
                  </td>
                  <td className="px-4 py-3 align-top leading-[1.6] text-muted-foreground">
                    {row.response}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 max-w-[68ch] text-[14.5px] leading-[1.75] text-muted-foreground">
          <code className="font-mono text-[13px] text-foreground">name</code> on project creation is
          the containerTag. <code className="font-mono text-[13px] text-foreground">goal</code> and{" "}
          <code className="font-mono text-[13px] text-foreground">message</code> are nullable —{" "}
          <code className="font-mono text-[13px] text-foreground">message</code> falls back to{" "}
          <code className="font-mono text-[13px] text-foreground">git log -1 --format=%s</code> when{" "}
          <code className="font-mono text-[13px] text-foreground">smith update</code> is called with
          no argument, and is <code className="font-mono text-[13px] text-foreground">null</code> on
          the <code className="font-mono text-[13px] text-foreground">init</code> sync.
        </p>

        <p className="mt-4 max-w-[68ch] text-[14.5px] leading-[1.75] text-foreground">
          Any non-2xx response makes the CLI throw. Every dashboard call is{" "}
          <strong className="font-medium">fail-open</strong>: a failure prints a non-blocking warning
          and the CLI carries on, so the dashboard being down never breaks someone&apos;s local
          workflow.
        </p>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Automatic pushes                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="mt-14">
        <h2 className="mb-5 font-serif text-[22px] font-medium tracking-[-0.01em] text-foreground">
          Automatic pushes from the local server
        </h2>
        <p className="mb-4 max-w-[68ch] text-[14.5px] leading-[1.75] text-muted-foreground">
          <code className="font-mono text-[13px] text-foreground">server/app.js</code> runs on
          localhost and receives Claude Code hook events. Two of them push without any user command:
        </p>
        <ul className="list-disc space-y-2.5 pl-5 text-[14.5px] leading-[1.7] text-muted-foreground">
          <li>
            <code className="font-mono text-[13px] text-foreground">/decisions</code> — fires on
            every tool call that passes the static filter and gets judged, whether or not it
            contradicts the goal. This is the high-volume endpoint; expect bursts during an active
            coding session.
          </li>
          <li>
            <code className="font-mono text-[13px] text-foreground">/overrides</code> — fires only
            when an action Smith flagged was executed anyway.
          </li>
        </ul>
        <p className="mt-4 text-[14.5px] leading-[1.75] text-muted-foreground">
          Both are skipped silently if no token or no cached projectId exists.
        </p>
      </section>

      
    </div>
  );
}
