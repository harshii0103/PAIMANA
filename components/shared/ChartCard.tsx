import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  tier?: "primary" | "secondary";
  /** Marks this as the single most important chart on the page (the
   * Cost×Delay matrix) with a slightly stronger frame — not a new color,
   * just more visual weight than the rest of Tier 1. Use on at most one card. */
  anchor?: boolean;
  action?: React.ReactNode;
}

export function ChartCard({ title, description, children, className, tier = "primary", anchor = false, action }: ChartCardProps) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg border bg-white shadow-card transition-shadow duration-200",
        tier === "primary"
          ? "border-ink-200 p-5 hover:shadow-hover"
          : "border-ink-100 bg-ink-25/50 p-5",
        anchor && "border-brand-200/70 ring-1 ring-brand-50",
        className
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className={cn("font-semibold text-ink-900", tier === "primary" ? "text-base leading-tight" : "text-[15px] leading-tight")}>
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-[13px] leading-snug text-ink-500">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
