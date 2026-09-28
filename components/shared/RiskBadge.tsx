import { cn, riskTokens } from "@/lib/utils";
import type { RiskLevel } from "@/types/risk";

const darkTokens: Record<RiskLevel, string> = {
  High: "border-red-500/30 bg-red-500/15 text-red-300",
  Medium: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  Low: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
};
const darkDot: Record<RiskLevel, string> = { High: "bg-red-400", Medium: "bg-amber-400", Low: "bg-emerald-400" };

export function RiskBadge({ level, className, dark = false }: { level: RiskLevel; className?: string; dark?: boolean }) {
  const t = riskTokens[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        dark ? darkTokens[level] : cn(t.bg, t.text, t.border),
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dark ? darkDot[level] : t.dot)} />
      {level}
    </span>
  );
}
