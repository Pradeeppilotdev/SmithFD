import { DashboardSkeleton } from "@/components/DashboardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1800px] px-8 pb-24 pt-11 lg:px-14">
      <DashboardSkeleton />
    </div>
  );
}
