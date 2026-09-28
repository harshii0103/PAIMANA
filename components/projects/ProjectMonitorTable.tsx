"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, SearchX, X } from "lucide-react";
import { useProjectsWithRisk } from "@/hooks/useProjects";
import { useAlerts } from "@/hooks/useAlerts";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { QueryBoundary } from "@/components/shared/QueryBoundary";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Toolbar } from "@/components/shared/Toolbar";
import type { RiskLevel } from "@/types/risk";

type RiskFilter = RiskLevel | "All";
type StatusFilter = "All" | "WithOpen" | "NoOpen";

/**
 * Project Explorer register. Filtering only narrows the rows the API returned (by text, overall
 * risk level, sector, or whether the project has open alerts); risk values are shown as received.
 */
export function ProjectMonitorTable({
  initialSearch = "",
  initialRisk = "All",
}: {
  initialSearch?: string;
  initialRisk?: RiskFilter;
}) {
  const router = useRouter();
  const query = useProjectsWithRisk();
  const alerts = useAlerts();
  const [search, setSearch] = useState(initialSearch);
  const [risk, setRisk] = useState<RiskFilter>(initialRisk);
  const [sector, setSector] = useState("All");
  const [status, setStatus] = useState<StatusFilter>("All");

  const openAlertsByCode = useMemo(() => {
    const map = new Map<string, number>();
    (alerts.data ?? []).forEach((a) => {
      if (a.status === "Open") map.set(a.projectCode, (map.get(a.projectCode) ?? 0) + 1);
    });
    return map;
  }, [alerts.data]);

  function clearAll() {
    setSearch("");
    setRisk("All");
    setSector("All");
    setStatus("All");
  }

  return (
    <QueryBoundary
      query={query}
      skeletonHeight={420}
      errorMessage="Unable to load the project register."
      emptyMessage="No projects are being monitored yet."
      isEmpty={(d) => d.length === 0}
    >
      {(rows) => {
        const sectors = Array.from(new Set(rows.map((r) => r.project.sector))).sort();
        const q = search.trim().toLowerCase();
        const filtered = rows.filter(({ project: p, risk: r }) => {
          const matchesText =
            !q ||
            [p.projectCode, p.projectName, p.sector, p.ministry, p.state, p.implementingAgency].some((f) =>
              f.toLowerCase().includes(q)
            );
          const open = openAlertsByCode.get(p.projectCode) ?? 0;
          return (
            matchesText &&
            (risk === "All" || r.overallRiskLevel === risk) &&
            (sector === "All" || p.sector === sector) &&
            (status === "All" || (status === "WithOpen" ? open > 0 : open === 0))
          );
        });
        const hasFilters = q !== "" || risk !== "All" || sector !== "All" || status !== "All";

        return (
          <div>
            <Toolbar
              count={
                <>
                  <span className="tabular">
                    <span className="font-semibold text-ink-900">{filtered.length}</span>{" "}
                    {filtered.length === rows.length ? (filtered.length === 1 ? "project" : "projects") : `of ${rows.length} projects`}
                  </span>
                  <span className="hidden rounded border border-brand-100 bg-brand-25 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-brand-700 md:inline">
                    DEMO DATA
                  </span>
                </>
              }
            >
              <label className="ui-control flex min-w-[220px] flex-1 items-center gap-2 sm:max-w-sm" data-active={q !== ""}>
                <Search className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects…"
                  aria-label="Search projects by code, name, sector, ministry or state"
                  className="w-full bg-transparent placeholder:text-ink-400 focus:outline-none"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="text-ink-400 hover:text-ink-700">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>
              <FilterSelect
                label="Filter by overall risk"
                value={risk}
                onChange={(v) => setRisk(v as RiskFilter)}
                options={[
                  { value: "All", label: "All Risk" },
                  { value: "High", label: "High Risk" },
                  { value: "Medium", label: "Medium Risk" },
                  { value: "Low", label: "Low Risk" },
                ]}
              />
              <FilterSelect
                label="Filter by sector"
                value={sector}
                onChange={setSector}
                options={[{ value: "All", label: "All Sectors" }, ...sectors.map((s) => ({ value: s, label: s }))]}
              />
              <FilterSelect
                label="Filter by alert status"
                value={status}
                onChange={(v) => setStatus(v as StatusFilter)}
                options={[
                  { value: "All", label: "All Status" },
                  { value: "WithOpen", label: "Has open alerts" },
                  { value: "NoOpen", label: "No open alerts" },
                ]}
              />
              {hasFilters && (
                <button type="button" onClick={clearAll} className="ui-button-ghost px-3">
                  Clear
                </button>
              )}
            </Toolbar>

            {filtered.length === 0 ? (
              <div className="rounded-lg border border-ink-200 bg-white shadow-card">
                <EmptyState icon={SearchX} message="No projects match the current filters." />
                <div className="pb-8 text-center">
                  <button onClick={clearAll} className="text-sm font-medium text-brand-700 hover:text-brand-800">
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile / small tablet: cards */}
                <ul className="space-y-2.5 md:hidden">
                  {filtered.map(({ project: p, risk: r }) => (
                    <li key={p.projectCode}>
                      <Link href={`/projects/${p.projectCode}`} className="block rounded-lg border border-ink-200 bg-white p-4 shadow-card transition-colors hover:bg-ink-25">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-ink-900">{p.projectName}</div>
                            <div className="mt-0.5 text-xs text-ink-400">{p.projectCode} · {p.sector} · {p.state}</div>
                          </div>
                          <RiskBadge level={r.overallRiskLevel} />
                        </div>
                        <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
                          <span>Cost <span className="tabular font-medium text-ink-700">{r.costRiskScore}</span></span>
                          <span>Delay <span className="tabular font-medium text-ink-700">{r.delayRiskScore}</span></span>
                        </div>
                        <ProgressBar value={p.physicalProgress} className="mt-2.5" />
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Desktop table */}
                <div className="scrollbar-thin hidden overflow-x-auto rounded-lg border border-ink-200 bg-white shadow-card md:block">
                  <table className="w-full min-w-[900px] text-[13px]">
                    <thead>
                      <tr className="border-b border-ink-100 bg-ink-25 text-left text-xs text-ink-500">
                        <th className="px-5 py-3 font-medium">Project</th>
                        <th className="px-4 py-3 font-medium">Sector · State</th>
                        <th className="px-4 py-3 font-medium">Overall Risk</th>
                        <th className="px-4 py-3 font-medium">Cost Risk</th>
                        <th className="px-4 py-3 font-medium">Delay Risk</th>
                        <th className="px-4 py-3 font-medium">Progress</th>
                        <th className="px-4 py-3 text-center font-medium">Open alerts</th>
                        <th className="w-10 px-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(({ project: p, risk: r }) => {
                        const open = openAlertsByCode.get(p.projectCode) ?? 0;
                        return (
                          <tr
                            key={p.projectCode}
                            onClick={() => router.push(`/projects/${p.projectCode}`)}
                            className="cursor-pointer border-t border-ink-100 transition-colors hover:bg-brand-25"
                          >
                            <td className="px-5 py-3.5">
                              <Link
                                href={`/projects/${p.projectCode}`}
                                onClick={(e) => e.stopPropagation()}
                                className="block max-w-[280px] truncate font-medium text-ink-900 hover:text-brand-700"
                              >
                                {p.projectName}
                              </Link>
                              <div className="mt-0.5 text-xs text-ink-400">{p.projectCode}</div>
                            </td>
                            <td className="px-4 py-3.5 text-ink-700">
                              {p.sector}
                              <div className="mt-0.5 text-xs text-ink-400">{p.state}</div>
                            </td>
                            {[
                              [r.overallRiskLevel, r.overallRiskScore],
                              [r.costRiskLevel, r.costRiskScore],
                              [r.delayRiskLevel, r.delayRiskScore],
                            ].map(([level, score], i) => (
                              <td key={i} className="px-4 py-3.5">
                                <div className="flex items-center gap-2">
                                  <RiskBadge level={level as RiskLevel} />
                                  <span className="tabular text-xs text-ink-400">{score}</span>
                                </div>
                              </td>
                            ))}
                            <td className="px-4 py-3.5">
                              <ProgressBar value={p.physicalProgress} className="w-28" />
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {open > 0 ? (
                                <span className="inline-flex min-w-[22px] justify-center rounded-full bg-risk-highBg px-1.5 py-0.5 text-xs font-semibold text-risk-high">
                                  {open}
                                </span>
                              ) : (
                                <span className="text-ink-300">—</span>
                              )}
                            </td>
                            <td className="px-3 text-ink-400">
                              <ChevronRight className="h-4 w-4" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );
      }}
    </QueryBoundary>
  );
}
