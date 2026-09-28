"use client";

import { useProjectsWithRisk } from "@/hooks/useProjects";
import { ChartCard } from "@/components/shared/ChartCard";
import { QueryBoundary } from "@/components/shared/QueryBoundary";
import { ProgressRiskScatter } from "@/components/charts/ProgressRiskScatter";

export function ProgressRiskChart() {
  const query = useProjectsWithRisk();
  return (
    <ChartCard title="Progress vs Risk" description="Physical progress against overall risk score" tier="secondary">
      <QueryBoundary
        query={query}
        skeletonHeight={220}
        errorMessage="Unable to load the progress-risk pattern."
        emptyMessage="No progress data available."
        isEmpty={(d) => d.length === 0}
      >
        {(rows) => <ProgressRiskScatter rows={rows} height={230} />}
      </QueryBoundary>
    </ChartCard>
  );
}
