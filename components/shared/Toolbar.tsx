import { cn } from "@/lib/utils";

/** Single unified control bar: filters on the left, result count on the right. */
export function Toolbar({ children, count, className }: { children: React.ReactNode; count?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-ink-200 bg-white p-2 shadow-card", className)}>
      {children}
      {count && <div className="ml-auto flex items-center gap-2 pl-2 pr-1 text-[13px] text-ink-500">{count}</div>}
    </div>
  );
}
