import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export function TopBar({
  crumbs,
  right,
  showLogo = false,
}: {
  crumbs: Crumb[];
  right?: React.ReactNode;
  showLogo?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-b border-border py-4 sm:py-5">
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        {showLogo && (
          <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className="size-2 rounded-full bg-foreground" />
            Smith
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 text-[13.5px] text-faint">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-border-strong">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-muted-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    i === crumbs.length - 1 ? "font-medium text-foreground" : undefined
                  }
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
      {right}
    </div>
  );
}
