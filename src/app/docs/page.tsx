import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TopBar } from "@/components/TopBar";

const DOCS = [
  {
    href: "/docs/cli",
    title: "CLI reference",
    body: "Every smith command, the dashboard API contract, and how projects get identified.",
  },
];

export default function DocsIndexPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 lg:px-10">
      <TopBar
        showLogo
        crumbs={[{ label: "Docs" }]}
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
        <p className="eyebrow mb-3.5">Documentation</p>
        <h1 className="font-serif text-[32px] leading-[1.15] font-medium tracking-[-0.015em] text-foreground sm:text-[40px]">
          Docs
        </h1>
      </div>

      <div className="mt-10 divide-y divide-border border-t border-b border-border">
        {DOCS.map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="group flex items-center justify-between gap-6 py-6 transition-colors hover:bg-card"
          >
            <div>
              <h2 className="mb-1.5 text-[16px] font-medium tracking-[-0.01em] text-foreground">
                {doc.title}
              </h2>
              <p className="max-w-[56ch] text-[14px] leading-[1.6] text-muted-foreground">
                {doc.body}
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
