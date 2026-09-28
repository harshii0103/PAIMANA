"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ChevronRight, Clock, ShieldCheck, SearchX } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { usePortfolioSummary, useProjectRisks } from "@/hooks/useRisk";
import { QueryBoundary } from "@/components/shared/QueryBoundary";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Toolbar } from "@/components/shared/Toolbar";
import { cn, formatDate } from "@/lib/utils";
import type { ProjectAlert } from "@/types/alert";

/** Designed no-warnings state. Counts and the timestamp come from the existing summary/prediction data. */
function NoWarningsState({ totalProjects, lastRun }: { totalProjects?: number; lastRun?: string }) {
  return (
    <section className="flex flex-col items-center rounded-lg border border-ink-200 bg-white px-6 py-16 text-center shadow-card">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-risk-lowBg text-risk-low ring-1 ring-risk-lowBorder">
        <ShieldCheck className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-semibold text-ink-900">No active warnings</h2>
      <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-ink-500">
        All monitored projects are currently within their expected risk thresholds.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-500">
        <span className="inline-flex items-center gap-2 rounded-full border border-risk-lowBorder bg-risk-lowBg px-2.5 py-1 font-medium text-risk-low">
          <span className="h-1.5 w-1.5 rounded-full bg-risk-low" />
          All projects monitored{totalProjects ? ` · ${totalProjects}` : ""}
        </span>
        {lastRun && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Last prediction run: {formatDate(lastRun)}
          </span>
        )}
      </div>

      <Link href="/explorer" className="ui-button-primary mt-7">
        View Project Explorer <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}

function WarningsList({ alerts }: { alerts: ProjectAlert[] }) {
  const router = useRouter();
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");

  // Open alerts first, then most recent — ordering of returned fields only.
  const sorted = [...alerts].sort(
    (a, b) => Number(b.status === "Open") - Number(a.status === "Open") || b.raisedDate.localeCompare(a.raisedDate)
  );
  const rows = sorted.filter((a) => (severity === "All" || a.severity === severity) && (status === "All" || a.status === status));
  const openCount = alerts.filter((a) => a.status === "Open").length;
  const filtered = severity !== "All" || status !== "All";

  return (
    <div>
      <Toolbar
        count={
          <>
            <span className="tabular">
              <span className="font-semibold text-ink-900">{rows.length}</span>{" "}
              {filtered ? `of ${alerts.length} warnings` : rows.length === 1 ? "warning" : "warnings"}
            </span>
            {openCount > 0 && (
              <span className="rounded-full bg-risk-highBg px-2 py-0.5 text-[11px] font-semibold text-risk-high">{openCount} open</span>
            )}
          </>
        }
      >
        <FilterSelect
          label="Filter by severity"
          value={severity}
          onChange={setSeverity}
          options={[
            { value: "All", label: "All Severity" },
            { value: "Critical", label: "Critical" },
            { value: "High", label: "High" },
            { value: "Medium", label: "Medium" },
          ]}
        />
        <FilterSelect
          label="Filter by status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "All", label: "All Status" },
            { value: "Open", label: "Open" },
            { value: "Acknowledged", label: "Acknowledged" },
            { value: "Resolved", label: "Resolved" },
          ]}
        />
        {filtered && (
          <button type="button" className="ui-button-ghost px-3" onClick={() => { setSeverity("All"); setStatus("All"); }}>
            Clear
          </button>
        )}
      </Toolbar>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-ink-200 bg-white shadow-card">
          <EmptyState icon={SearchX} message="No warnings match the current filters." />
        </div>
      ) : (
        <>
          <ul className="space-y-2.5 md:hidden">
            {rows.map((a) => (
              <li key={a.id}>
                <Link href={`/projects/${a.projectCode}`} className="block rounded-lg border border-ink-200 bg-white p-4 shadow-card transition-colors hover:bg-ink-25">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className={cn("truncate text-sm text-ink-900", a.status === "Open" ? "font-semibold" : "font-medium")}>{a.projectName}</div>
                      <div className="mt-0.5 text-xs text-ink-500">{a.alertType} · {a.relevantRisk}</div>
                    </div>
                    <SeverityBadge severity={a.severity} />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <StatusBadge status={a.status} />
                    <span className="text-xs text-ink-400">{formatDate(a.raisedDate)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="scrollbar-thin hidden overflow-x-auto rounded-lg border border-ink-200 bg-white shadow-card md:block">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-25 text-left text-xs text-ink-500">
                  <th className="px-5 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Alert type</th>
                  <th className="px-4 py-3 font-medium">Relevant risk</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Raised</th>
                  <th className="w-10 px-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => router.push(`/projects/${a.projectCode}`)}
                    className="cursor-pointer border-t border-ink-100 transition-colors hover:bg-brand-25"
                  >
                    <td className="px-5 py-3.5"><SeverityBadge severity={a.severity} /></td>
                    <td className="px-4 py-3.5">
                      <div className={cn("max-w-[280px] truncate text-ink-900", a.status === "Open" ? "font-semibold" : "font-medium")}>{a.projectName}</div>
                      <div className="mt-0.5 text-xs text-ink-400">{a.projectCode}</div>
                    </td>
                    <td className="px-4 py-3.5 text-ink-700">{a.alertType}</td>
                    <td className="px-4 py-3.5 text-ink-700">{a.relevantRisk}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={a.status} /></td>
                    <td className="tabular px-4 py-3.5 text-ink-500">{formatDate(a.raisedDate)}</td>
                    <td className="px-3 text-ink-400"><ChevronRight className="h-4 w-4" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export function EarlyWarningsView() {
  const params = useSearchParams();
  // `?preview=empty` renders the no-warnings state (handy for screenshots when demo data has alerts).
  const previewEmpty = params.get("preview") === "empty";
  const alerts = useAlerts();
  const summary = usePortfolioSummary();
  const risks = useProjectRisks();

  const empty = <NoWarningsState totalProjects={summary.data?.totalProjects} lastRun={risks.data?.[0]?.predictionDate} />;

  return (
    <QueryBoundary query={alerts} skeletonHeight={420} errorMessage="Unable to load early warnings.">
      {(list) => (previewEmpty || list.length === 0 ? empty : <WarningsList alerts={list} />)}
    </QueryBoundary>
  );
}
