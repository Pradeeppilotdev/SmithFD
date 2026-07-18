import Link from "next/link";

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[12px] font-semibold text-secondary-foreground">
        {number}
      </span>
      <div>
        <p className="mb-0.5 text-[13.5px] font-medium text-foreground">{title}</p>
        <div className="text-[13px] leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}

export function GetStartedCard() {
  return (
    <div className="rounded-[14px] border border-border bg-card p-6 sm:p-8">
      <p className="mb-2 font-serif text-[20px] font-medium text-foreground">
        Get Smith watching your first project
      </p>
      <p className="mb-6 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">
        Three steps and your first project will show up here.
      </p>

      <ol className="space-y-5">
        <Step number={1} title="Generate an access token">
          <Link href="/settings/tokens" className="text-foreground hover:underline">
            Create one under Access tokens
          </Link>{" "}
          — it&apos;s shown once, so copy it right away.
        </Step>
        <Step number={2} title="Install the CLI">
          <code className="mt-1 block max-w-full overflow-x-auto rounded-[6px] border border-border bg-muted px-2.5 py-1 text-xs whitespace-nowrap text-foreground">
            npm install -g @flash_dev/agent-smith
          </code>
        </Step>
        <Step number={3} title="Run smith init and paste the token">
          From your project&apos;s folder. Smith asks a few questions about your goal, then starts
          watching your agent&apos;s actions against it.
        </Step>
      </ol>
    </div>
  );
}
