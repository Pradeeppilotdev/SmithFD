import { Shimmer } from "@/components/Shimmer";

export function DashboardSkeleton() {
  return (
    <div>
      <div className="mb-14">
        <Shimmer className="mb-4 h-3 w-28" />
        <Shimmer className="mb-3 h-9 w-2/3" />
        <Shimmer className="mb-2 h-5 w-1/2" />
        <div className="mt-6 flex gap-2">
          <Shimmer className="h-7 w-32 rounded-full" />
          <Shimmer className="h-7 w-28 rounded-full" />
          <Shimmer className="h-7 w-36 rounded-full" />
        </div>
      </div>
      <div className="mb-14 flex gap-11 border-t border-b border-border py-5.5">
        <Shimmer className="h-6 w-20" />
        <Shimmer className="h-6 w-24" />
        <Shimmer className="h-6 w-16" />
      </div>
      <Shimmer className="mb-4 h-5 w-40" />
      <Shimmer className="mb-3 h-24 w-full rounded-[14px]" />
      <Shimmer className="mb-10 h-24 w-full rounded-[14px]" />
      <Shimmer className="mb-4 h-5 w-24" />
      <Shimmer className="mb-4 h-16 w-full" />
      <Shimmer className="mb-4 h-16 w-full" />
    </div>
  );
}
