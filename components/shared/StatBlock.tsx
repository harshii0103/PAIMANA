"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatBlockProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "neutral" | "high" | "medium" | "low";
  countUp?: boolean;
  /** Slightly stronger visual weight — used for the three "attention" metrics
   * (High Risk, High Delay Risk, High Cost Risk) within the status strip. */
  emphasis?: boolean;
}

const toneClasses: Record<NonNullable<StatBlockProps["tone"]>, string> = {
  neutral: "text-brand-700",
  high: "text-risk-high",
  medium: "text-risk-medium",
  low: "text-risk-low",
};

const emphasisIconBg: Record<NonNullable<StatBlockProps["tone"]>, string> = {
  neutral: "bg-ink-100",
  high: "bg-risk-highBg",
  medium: "bg-risk-mediumBg",
  low: "bg-risk-lowBg",
};

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(enabled ? 0 : target);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || reduceMotion) {
      setValue(target);
      return;
    }
    const duration = 500;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled, reduceMotion]);

  return value;
}

export function StatBlock({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  countUp = true,
  emphasis = false,
}: StatBlockProps) {
  const displayValue = useCountUp(value, countUp);

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 px-4 py-4 transition-colors sm:px-5",
        emphasis && "bg-risk-highBg/40"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md",
          emphasis ? "h-10 w-10" : "h-9 w-9",
          emphasis ? emphasisIconBg[tone] : "bg-ink-100",
          toneClasses[tone]
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} size={18} />
      </div>
      <div className="min-w-0">
        <div
          className={cn(
            "tabular font-semibold leading-none",
            emphasis ? "text-[32px] sm:text-[34px]" : "text-[26px] sm:text-[28px]",
            toneClasses[tone]
          )}
        >
          {displayValue}
        </div>
        <div className={cn("mt-1.5 truncate font-medium text-ink-500", emphasis ? "text-xs sm:text-[13px]" : "text-[11px] sm:text-xs")}>
          {label}
        </div>
      </div>
    </div>
  );
}
