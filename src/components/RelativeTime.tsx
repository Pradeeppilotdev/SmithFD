"use client";

import { useEffect, useState } from "react";
import { clockTime, elapsedShort, relativeTime } from "@/lib/format";

export function RelativeTime({
  iso,
  mode = "relative",
}: {
  iso: string;
  mode?: "relative" | "clock" | "elapsed";
}) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "clock") setText(clockTime(iso));
    else if (mode === "elapsed") setText(elapsedShort(iso));
    else setText(relativeTime(iso));
  }, [iso, mode]);

  return <>{text ?? "—"}</>;
}
