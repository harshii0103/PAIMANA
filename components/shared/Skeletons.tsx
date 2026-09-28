import { cn } from "@/lib/utils";

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("animate-pulse rounded-md bg-ink-200/70", className)} style={style} />;
}

export function StatStripSkeleton() {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-4 rounded-lg border border-ink-200 bg-white p-4 shadow-card sm:p-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex min-w-[128px] flex-1 items-center gap-3 px-2">
          <Shimmer className="h-9 w-9 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-6 w-10" />
            <Shimmer className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-card">
      <Shimmer className="mb-4 h-4 w-32" />
      <Shimmer className="w-full rounded-lg" style={{ height }} />
    </div>
  );
}

export function PanelRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-5 shadow-card">
      <Shimmer className="mb-4 h-4 w-40" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Shimmer className="h-4 w-1/4" />
            <Shimmer className="h-4 w-1/6" />
            <Shimmer className="h-4 w-1/6" />
            <Shimmer className="ml-auto h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
