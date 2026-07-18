import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { PixelGridBackdrop } from "@/components/PixelGridBackdrop";

export default function Loading() {
  return (
    <div className="relative min-h-screen">
      <PixelGridBackdrop />
      <div className="relative z-10 mx-auto max-w-[1800px] px-4 pt-11 pb-24 sm:px-8 lg:px-14">
        <DashboardSkeleton />
      </div>
    </div>
  );
}
