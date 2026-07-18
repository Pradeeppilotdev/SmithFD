"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const CELL = 12; // px per pixel-cell, including its 1px gutter
const BAND = 90; // height of the scan band, in px
const SPEED = 46; // px per second the band travels

type Cell = { seed: number; hot: boolean };

/**
 * Ambient hero texture: a field of pixel cells with a scan band travelling down
 * it, the way Smith samples a stream of tool calls. A small fraction of cells
 * are "hot" — they flare in the signal colour as the band crosses them, standing
 * in for the risky actions that get judged.
 *
 * Decorative only, and hidden from assistive tech. Reduced motion gets one
 * static frame instead of the sweep.
 */
export function PixelSweep({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cells: Cell[][] = [];
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let base = "160,160,152";
    let signal = "154,107,21";

    function readThemeColors() {
      const styles = getComputedStyle(document.documentElement);
      base = toRgbTriplet(styles.getPropertyValue("--border-strong")) ?? base;
      signal = toRgbTriplet(styles.getPropertyValue("--signal")) ?? signal;
    }

    function layout() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      cells = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          seed: Math.random(),
          hot: Math.random() < 0.035,
        })),
      );
    }

    function draw(bandY: number) {
      ctx!.clearRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        const y = r * CELL;
        // Distance from the band's leading edge, normalised over the band height.
        const dist = bandY - y;
        const inBand = dist >= 0 && dist < BAND;
        const bandFalloff = inBand ? 1 - dist / BAND : 0;

        for (let c = 0; c < cols; c++) {
          const cell = cells[r][c];
          // Resting field: a sparse scatter so the grid never looks uniform.
          const rest = cell.seed > 0.82 ? 0.12 + (cell.seed - 0.82) * 0.5 : 0;
          const lit = bandFalloff * (0.25 + cell.seed * 0.6);
          const alpha = Math.max(rest, lit);
          if (alpha < 0.02) continue;

          const flare = cell.hot && bandFalloff > 0.35;
          ctx!.fillStyle = `rgba(${flare ? signal : base},${
            flare ? Math.min(alpha * 1.7, 0.95) : alpha
          })`;
          ctx!.fillRect(c * CELL, y, CELL - 1, CELL - 1);
        }
      }
    }

    readThemeColors();
    layout();

    let frame = 0;
    let start = 0;

    function tick(now: number) {
      if (!start) start = now;
      const travel = height + BAND;
      const bandY = (((now - start) / 1000) * SPEED) % travel;
      draw(bandY);
      frame = requestAnimationFrame(tick);
    }

    if (reduceMotion) {
      draw(height * 0.42);
    } else {
      frame = requestAnimationFrame(tick);
    }

    const onResize = () => {
      layout();
      if (reduceMotion) draw(height * 0.42);
    };
    window.addEventListener("resize", onResize);

    // The theme toggle swaps a class on <html>; re-read the palette when it does.
    const themeObserver = new MutationObserver(() => {
      readThemeColors();
      if (reduceMotion) draw(height * 0.42);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none h-full w-full", className)}
    />
  );
}

/** "#d4a351" → "212,163,81". Returns null for anything it can't parse. */
function toRgbTriplet(value: string): string | null {
  const hex = value.trim().replace("#", "");
  if (hex.length !== 6) return null;
  const int = Number.parseInt(hex, 16);
  if (Number.isNaN(int)) return null;
  return `${(int >> 16) & 255},${(int >> 8) & 255},${int & 255}`;
}
