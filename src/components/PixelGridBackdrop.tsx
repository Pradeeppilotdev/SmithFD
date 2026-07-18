/**
 * Static, low-contrast pixel grid for the margins around a page's content
 * column. Unlike the landing page's animated PixelSweep, this is deliberately
 * inert — it's chrome behind working dashboard content, not a hero visual.
 */
export function PixelGridBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="pixel-grid absolute inset-0 opacity-30" />
    </div>
  );
}
