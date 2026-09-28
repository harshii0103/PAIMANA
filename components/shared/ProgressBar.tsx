"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  dark = false,
}: {
  value: number;
  className?: string;
  dark?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("h-1.5 w-full min-w-[56px] overflow-hidden rounded-full", dark ? "bg-white/10" : "bg-ink-200")}>
        <motion.div
          className={cn("h-full rounded-full", dark ? "bg-blue-400" : "bg-brand-600")}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className={cn("w-9 shrink-0 text-right text-xs tabular", dark ? "text-slate-400" : "text-ink-500")}>
        {clamped}%
      </span>
    </div>
  );
}
