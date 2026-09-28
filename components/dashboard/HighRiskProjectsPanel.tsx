"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useHighRiskProjects } from "@/hooks/useProjects";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { PanelBodySkeleton } from "@/components/shared/Skeletons";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";

export function HighRiskProjectsPanel() {
  const { data, isLoading, isError, refetch } = useHighRiskProjects(6);

  return (
    <div className="flex flex-col rounded-lg border border-ink-200 bg-white shadow-card transition-shadow duration-200 hover:shadow-hover">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold leading-tight text-ink-900">High-Risk Projects</h3>
          <p className="mt-1 text-[13px] leading-snug text-ink-500">Projects whose overall risk is currently classified High.</p>
        </div>
        <Link
          href="/explorer?risk=High"
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 sm:flex"
        >
          View all in Explorer <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <PanelBodySkeleton rows={6} />
      ) : isError ? (
        <ErrorState message="Unable to load high-risk projects." onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState message="No projects are currently classified as High risk." />
      ) : (
        <>
        {/* Mobile: compact cards */}
        <ul className="divide-y divide-ink-100 sm:hidden">
          {data.map((row) => (
            <li key={row.project.projectCode}>
              <Link href={`/projects/${row.project.projectCode}`} className="block px-5 py-3.5 transition-colors hover:bg-ink-25">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-900">{row.project.projectName}</div>
                    <div className="mt-0.5 text-xs text-ink-400">{row.project.projectCode} · {row.project.sector}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <RiskBadge level={row.risk.overallRiskLevel} />
                    <span className="tabular text-xs text-ink-400">{row.risk.overallRiskScore}</span>
                  </div>
                </div>
                <ProgressBar value={row.project.physicalProgress} className="mt-2.5" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="scrollbar-thin hidden flex-1 overflow-x-auto sm:block">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="text-left text-[11px] text-ink-400">
                <th className="px-5 py-2.5 font-medium">Project</th>
                <th className="px-3 py-2.5 font-medium">Overall Risk</th>
                <th className="px-3 py-2.5 font-medium">Cost Risk</th>
                <th className="px-3 py-2.5 font-medium">Delay Risk</th>
                <th className="px-3 py-2.5 font-medium">Progress</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <motion.tr
                  key={row.project.projectCode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="border-t border-ink-100 border-l-2 border-l-transparent transition-colors hover:border-l-risk-high hover:bg-ink-25"
                >
                  <td className="px-5 py-3.5">
                    <div className="max-w-[210px] truncate font-medium text-ink-900">{row.project.projectName}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-400">
                      <span>{row.project.projectCode}</span>
                      <span className="text-ink-300">·</span>
                      <span className="truncate">{row.project.sector}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <RiskBadge level={row.risk.overallRiskLevel} />
                      <span className="tabular text-xs text-ink-400">{row.risk.overallRiskScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <RiskBadge level={row.risk.costRiskLevel} />
                  </td>
                  <td className="px-3 py-3.5">
                    <RiskBadge level={row.risk.delayRiskLevel} />
                  </td>
                  <td className="px-3 py-3.5">
                    <ProgressBar value={row.project.physicalProgress} className="w-24" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/projects/${row.project.projectCode}`}
                      className="inline-flex items-center gap-0.5 text-xs font-medium text-brand-700 transition-colors hover:text-brand-800"
                    >
                      View <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}

      <div className="border-t border-ink-100 px-5 py-3 sm:hidden">
        <Link href="/explorer?risk=High" className="flex items-center justify-center gap-1 text-sm font-medium text-brand-700">
          View all in Explorer <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
