import { cn } from "@/lib/utils";

export function Shimmer({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-sm", className)} />;
}
