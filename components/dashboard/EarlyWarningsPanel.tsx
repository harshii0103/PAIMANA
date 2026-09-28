"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useAlerts, useOpenAlertCount } from "@/hooks/useAlerts";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PanelBodySkeleton } from "@/components/shared/Skeletons";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

export function EarlyWarningsPanel() {
  const { data, isLoading, isError, refetch } = useAlerts();
  const openCount = useOpenAlertCount();
  // Open alerts first, then most recent — ordering of returned fields only.
  const rows = [...(data ?? [])]
    .sort((a, b) => Number(b.status === "Open") - Number(a.status === "Open") || b.raisedDate.localeCompare(a.raisedDate))
    .slice(0, 6);

  return (
    <div className="flex flex-col rounded-lg border border-ink-200 bg-white shadow-card transition-shadow duration-200 hover:shadow-hover">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold leading-tight text-ink-900">
            Early Warnings
            {openCount > 0 && (
              <span className="rounded-full bg-risk-highBg px-2 py-0.5 text-[11px] font-semibold text-risk-high">{openCount} open</span>
            )}
          </h3>
          <p className="mt-1 text-[13px] leading-snug text-ink-500">Alerts raised when a project&apos;s risk state changes.</p>
        </div>
        <Link
          href="/alerts"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 sm:flex"
        >
          View all Alerts <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <PanelBodySkeleton rows={6} />
      ) : isError ? (
        <ErrorState message="Unable to load early warnings." onRetry={() => refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState message="No early warnings — all monitored projects are currently within expected risk thresholds." />
      ) : (
        <ul className="flex-1 divide-y divide-ink-100">
          {rows.map((alert, i) => (
            <motion.li
              key={alert.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group flex items-center gap-3 border-l-2 border-l-transparent px-5 py-3.5 transition-colors hover:border-l-risk-high hover:bg-ink-25"
            >
              <span
                className={cn(
                  "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                  alert.severity === "Critical" && "bg-risk-high",
                  alert.severity === "High" && "bg-risk-medium",
                  alert.severity === "Medium" && "bg-brand-400"
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "truncate text-sm text-ink-900",
                      alert.status === "Open" ? "font-semibold" : "font-medium"
                    )}
                  >
                    {alert.projectName}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
                  <span className="truncate">{alert.alertType}</span>
                  <span className="text-ink-300">·</span>
                  <span className="shrink-0">{alert.relevantRisk}</span>
                </div>
              </div>
              <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                <SeverityBadge severity={alert.severity} />
                <StatusBadge status={alert.status} />
              </div>
              <Link
                href={`/projects/${alert.projectCode}`}
                className="shrink-0 rounded-md p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-brand-700"
                aria-label="View project"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.li>
          ))}
        </ul>
      )}

      <div className="border-t border-ink-100 px-5 py-3 sm:hidden">
        <Link href="/alerts" className="flex items-center justify-center gap-1 text-sm font-medium text-brand-700">
          View all Alerts <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
