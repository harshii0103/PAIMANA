"use client";

import { useProjectsWithRisk } from "@/hooks/useProjects";
import { ChartCard } from "@/components/shared/ChartCard";
import { QueryBoundary } from "@/components/shared/QueryBoundary";
import { RiskMatrix } from "@/components/charts/RiskMatrix";
import { riskHex } from "@/lib/chartTheme";

const LEGEND = [
  { label: "High", color: riskHex.light.High },
  { label: "Medium", color: riskHex.light.Medium },
  { label: "Low", color: riskHex.light.Low },
] as const;

/** Primary decision-support visual: Cost Risk (x) × Delay Risk (y), values straight from the Risk Engine. */
export function RiskMatrixChart() {
  const query = useProjectsWithRisk();

  return (
    <ChartCard
      title="Cost Risk × Delay Risk"
      description="Each project plotted by its Cost Risk and Delay Risk scores — click a point to open it."
      anchor
      className="flex flex-col"
    >
      <QueryBoundary
        query={query}
        skeletonHeight={470}
        errorMessage="Unable to load the risk matrix."
        emptyMessage="No risk predictions are available yet."
        isEmpty={(d) => d.length === 0}
      >
        {(rows) => (
          <div>
            <RiskMatrix rows={rows} height={420} />
            <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-ink-100 pt-3 text-xs text-ink-500">
              <span className="flex items-center gap-3">
                Overall risk:
                {LEGEND.map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </span>
                ))}
              </span>
              <span>Larger point = higher overall score</span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: riskHex.light.High, opacity: 0.2 }} />
                High cost + high delay region
              </span>
            </div>
          </div>
        )}
      </QueryBoundary>
    </ChartCard>
  );
}
