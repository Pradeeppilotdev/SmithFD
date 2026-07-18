/**
 * Static pixel grid used behind dashboard pages. Unlike the landing page's
 * animated PixelSweep, this is deliberately inert — it's chrome behind working
 * dashboard content, not a hero visual. Same visibility as the landing page's
 * own `.pixel-grid` (no extra opacity layered on — that stacked with the
 * class's built-in fade and made it nearly invisible, especially in light mode).
 */
export function PixelGridBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="pixel-grid absolute inset-0" />
    </div>
  );
}
