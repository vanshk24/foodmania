// ── Skeleton Loader ───────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

const ROUNDED = { sm: "rounded", md: "rounded-md", lg: "rounded-lg", full: "rounded-full" };

export function Skeleton({ className = "", width, height, rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#F0F0F0] via-[#E5E7EB] to-[#F0F0F0] bg-[length:200%_100%] ${ROUNDED[rounded]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// ── Restaurant Card Skeleton ──────────────────────────────────────────────────
export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden">
      <Skeleton className="w-full h-[160px]" rounded="sm" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <div className="pt-2 border-t border-gray-100 flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

// ── Stat Card Skeleton (Business Dashboard) ───────────────────────────────────
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-[14px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8" rounded="full" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

// ── List Item Skeleton ────────────────────────────────────────────────────────
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Skeleton className="w-12 h-12" rounded="lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

// ── Page Skeleton ─────────────────────────────────────────────────────────────
export function PageSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="space-y-3">
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
      </div>
    </div>
  );
}
