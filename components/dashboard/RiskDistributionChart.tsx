"use client";

import { usePortfolioSummary } from "@/hooks/useRisk";
import { ChartCard } from "@/components/shared/ChartCard";
import { QueryBoundary } from "@/components/shared/QueryBoundary";
import { RiskDonut } from "@/components/charts/RiskDonut";

export function RiskDistributionChart() {
  const query = usePortfolioSummary();

  return (
    <ChartCard title="Risk Distribution" description="Projects by overall risk level" className="flex flex-col">
      <div className="flex flex-1 flex-col justify-center">
        <QueryBoundary
          query={query}
          skeletonHeight={300}
          errorMessage="Unable to load risk distribution."
          emptyMessage="No projects are currently being monitored."
          isEmpty={(s) => s.totalProjects === 0}
        >
          {(summary) => <RiskDonut summary={summary} height={250} />}
        </QueryBoundary>
      </div>
    </ChartCard>
  );
}
