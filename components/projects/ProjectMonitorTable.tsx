"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, SearchX } from "lucide-react";
import { useProjectsWithRisk } from "@/hooks/useProjects";
import { useAlerts } from "@/hooks/useAlerts";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { QueryBoundary } from "@/components/shared/QueryBoundary";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/risk";

type RiskFilter = RiskLevel | "All";

/**
 * Filterable project register (Project Explorer + Design 04). Filtering only narrows the rows the
 * API returned by text/level/sector; risk values are displayed exactly as received.
 */
export function ProjectMonitorTable({
  initialSearch = "",
  initialRisk = "All",
  variant = "default",
}: {
  initialSearch?: string;
  initialRisk?: RiskFilter;
  variant?: "default" | "formal";
}) {
  const router = useRouter();
  const query = useProjectsWithRisk();
  const alerts = useAlerts();
  const [search, setSearch] = useState(initialSearch);
  const [risk, setRisk] = useState<RiskFilter>(initialRisk);
  const [sector, setSector] = useState("All");
  const formal = variant === "formal";

  const openAlertsByCode = useMemo(() => {
    const map = new Map<string, number>();
    (alerts.data ?? []).forEach((a) => {
      if (a.status === "Open") map.set(a.projectCode, (map.get(a.projectCode) ?? 0) + 1);
    });
    return map;
  }, [alerts.data]);

  const control = cn(
    "border bg-white px-3 py-1.5 text-[13px] text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600",
    formal ? "rounded-sm border-[#CBD5E1]" : "rounded-md border-ink-200"
  );

  return (
    <QueryBoundary query={query} skeletonHeight={320} errorMessage="Unable to load the project register." emptyMessage="No projects are being monitored yet." isEmpty={(d) => d.length === 0}>
      {(rows) => {
        const sectors = Array.from(new Set(rows.map((r) => r.project.sector))).sort();
        const q = search.trim().toLowerCase();
        const filtered = rows.filter(({ project: p, risk: r }) => {
          const matchesText =
            !q ||
            [p.projectCode, p.projectName, p.sector, p.ministry, p.state, p.implementingAgency].some((f) =>
              f.toLowerCase().includes(q)
            );
          return matchesText && (risk === "All" || r.overallRiskLevel === risk) && (sector === "All" || p.sector === sector);
        });
        const hasFilters = q !== "" || risk !== "All" || sector !== "All";

        return (
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <label className={cn("flex min-w-[220px] flex-1 items-center gap-2", control)}>
                <Search className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Code, name, sector, ministry or state"
                  aria-label="Search projects"
                  className="w-full bg-transparent focus:outline-none"
                />
              </label>
              <select value={risk} onChange={(e) => setRisk(e.target.value as RiskFilter)} aria-label="Filter by overall risk" className={control}>
                <option value="All">All risk levels</option>
                <option value="High">High risk</option>
                <option value="Medium">Medium risk</option>
                <option value="Low">Low risk</option>
              </select>
              <select value={sector} onChange={(e) => setSector(e.target.value)} aria-label="Filter by sector" className={control}>
                <option value="All">All sectors</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className="ml-auto text-xs text-ink-500 tabular">
                Showing {filtered.length} of {rows.length}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className={cn("border bg-white", formal ? "rounded-sm border-[#CBD5E1]" : "rounded-lg border-ink-200")}>
                <EmptyState icon={SearchX} message="No projects match the current filters." />
                {hasFilters && (
                  <div className="pb-6 text-center">
                    <button
                      onClick={() => { setSearch(""); setRisk("All"); setSector("All"); }}
                      className="text-sm font-medium text-brand-700 hover:text-brand-800"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={cn("scrollbar-thin overflow-x-auto border bg-white", formal ? "rounded-sm border-[#CBD5E1]" : "rounded-lg border-ink-200 shadow-card")}>
                <table className="w-full min-w-[880px] text-[13px]">
                  <thead>
                    <tr className={cn("text-left text-xs text-ink-500", formal ? "bg-[#F1F5F9] border-b border-[#CBD5E1]" : "border-b border-ink-100")}>
                      <th className="px-4 py-2.5 font-semibold">Project</th>
                      <th className="px-3 py-2.5 font-semibold">Sector · State</th>
                      <th className="px-3 py-2.5 font-semibold">Overall Risk</th>
                      <th className="px-3 py-2.5 font-semibold">Cost Risk</th>
                      <th className="px-3 py-2.5 font-semibold">Delay Risk</th>
                      <th className="px-3 py-2.5 font-semibold">Progress</th>
                      <th className="px-3 py-2.5 text-center font-semibold">Open alerts</th>
                      <th className="w-8 px-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(({ project: p, risk: r }) => {
                      const open = openAlertsByCode.get(p.projectCode) ?? 0;
                      return (
                        <tr
                          key={p.projectCode}
                          onClick={() => router.push(`/projects/${p.projectCode}`)}
                          className={cn("cursor-pointer border-t transition-colors hover:bg-brand-25", formal ? "border-[#E2E8F0]" : "border-ink-100")}
                        >
                          <td className="px-4 py-2.5">
                            <Link
                              href={`/projects/${p.projectCode}`}
                              onClick={(e) => e.stopPropagation()}
                              className="block max-w-[260px] truncate font-medium text-ink-900 hover:text-brand-700"
                            >
                              {p.projectName}
                            </Link>
                            <div className="text-xs text-ink-400">{p.projectCode}</div>
                          </td>
                          <td className="px-3 py-2.5 text-ink-600">
                            {p.sector}
                            <div className="text-xs text-ink-400">{p.state}</div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <RiskBadge level={r.overallRiskLevel} />
                              <span className="tabular text-xs text-ink-400">{r.overallRiskScore}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <RiskBadge level={r.costRiskLevel} />
                              <span className="tabular text-xs text-ink-400">{r.costRiskScore}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <RiskBadge level={r.delayRiskLevel} />
                              <span className="tabular text-xs text-ink-400">{r.delayRiskScore}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5"><ProgressBar value={p.physicalProgress} className="w-28" /></td>
                          <td className="px-3 py-2.5 text-center">
                            {open > 0 ? (
                              <span className="inline-flex min-w-[20px] justify-center rounded-full bg-risk-highBg px-1.5 py-0.5 text-xs font-semibold text-risk-high">{open}</span>
                            ) : (
                              <span className="text-ink-300">—</span>
                            )}
                          </td>
                          <td className="px-2 text-ink-400"><ChevronRight className="h-4 w-4" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      }}
    </QueryBoundary>
  );
}
