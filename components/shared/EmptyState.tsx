import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon = CheckCircle2,
  message,
  dark = false,
}: {
  icon?: LucideIcon;
  message: string;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <Icon className={cn("h-6 w-6", dark ? "text-slate-500" : "text-ink-400")} strokeWidth={1.5} />
      <p className={cn("max-w-xs text-sm", dark ? "text-slate-400" : "text-ink-500")}>{message}</p>
    </div>
  );
}
