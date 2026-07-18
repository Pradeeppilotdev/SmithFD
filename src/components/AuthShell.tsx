import Link from "next/link";
import { PixelSweep } from "@/components/landing/PixelSweep";

/**
 * Frame for the sign-in and sign-up pages.
 *
 * The form itself is narrow, which left it floating in a lot of empty paper.
 * Rather than widening it, this wraps it in a ruled column — hairlines down
 * both sides, a rail top and bottom — so the whitespace reads as margin around
 * a document instead of a void. Behind it sits the same pixel field the landing
 * page uses, at low contrast, to tie the two together.
 */
export function AuthShell({
  rail,
  children,
}: {
  /** Short mono label in the top-right of the frame, e.g. "sign in". */
  rail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Backdrop. Kept at z-0 rather than a negative z-index, which would paint
          behind the body background and disappear entirely. */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="pixel-grid pixel-grid-fade absolute inset-0" />
        <div className="absolute inset-0 opacity-45">
          <PixelSweep />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[540px] flex-col border-x border-border bg-background/70 backdrop-blur-[2px]">
        <div className="flex items-center justify-between border-b border-border px-7 py-4 sm:px-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-mono text-[12px] font-semibold tracking-[0.08em] text-foreground uppercase transition-opacity hover:opacity-70"
          >
            <span className="size-2 bg-foreground" />
            Smith
          </Link>
          <span className="font-mono text-[11px] tracking-[0.1em] text-faint uppercase">
            {rail}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center px-7 py-14 sm:px-10">{children}</div>

        <div className="border-t border-border px-7 py-5 sm:px-10">
          <p className="font-serif text-[13.5px] leading-relaxed text-faint italic">
            Never send a human to do a machine&apos;s job.
          </p>
        </div>
      </div>
    </div>
  );
}
