import { cn, statusTokens } from "@/lib/utils";
import type { AlertStatus } from "@/types/alert";

const darkTokens: Record<AlertStatus, string> = {
  Open: "bg-red-500/15 text-red-300",
  Acknowledged: "bg-amber-500/15 text-amber-300",
  Resolved: "bg-emerald-500/15 text-emerald-300",
};

export function StatusBadge({ status, dark = false }: { status: AlertStatus; dark?: boolean }) {
  const t = statusTokens[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        dark ? darkTokens[status] : cn(t.bg, t.text)
      )}
    >
      {status}
    </span>
  );
}
