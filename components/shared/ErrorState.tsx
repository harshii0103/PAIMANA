import { AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorState({
  message = "Unable to load this data.",
  onRetry,
  dark = false,
}: {
  message?: string;
  onRetry?: () => void;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <AlertTriangle className={cn("h-6 w-6", dark ? "text-red-400" : "text-risk-high")} strokeWidth={1.5} />
      <p className={cn("max-w-xs text-sm", dark ? "text-slate-400" : "text-ink-500")}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
            dark
              ? "border-white/15 text-slate-200 hover:bg-white/5"
              : "border-ink-200 text-ink-700 hover:bg-ink-100"
          )}
        >
          <RotateCw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
