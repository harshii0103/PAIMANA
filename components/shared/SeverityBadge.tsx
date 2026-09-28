import { cn, severityTokens } from "@/lib/utils";
import type { AlertSeverity } from "@/types/alert";

const darkTokens: Record<AlertSeverity, string> = {
  Critical: "border-red-500/30 bg-red-500/15 text-red-300",
  High: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  Medium: "border-blue-400/30 bg-blue-400/10 text-blue-300",
};

export function SeverityBadge({ severity, dark = false }: { severity: AlertSeverity; dark?: boolean }) {
  const t = severityTokens[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        dark ? darkTokens[severity] : cn(t.bg, t.text, t.border)
      )}
    >
      {severity}
    </span>
  );
}
