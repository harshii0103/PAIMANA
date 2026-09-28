"use client";

import { useProjectsWithRisk } from "@/hooks/useProjects";
import { ChartCard } from "@/components/shared/ChartCard";
import { QueryBoundary } from "@/components/shared/QueryBoundary";
import { ProgressRiskScatter } from "@/components/charts/ProgressRiskScatter";

export function ProgressRiskChart() {
  const query = useProjectsWithRisk();
  return (
    <ChartCard title="Progress vs Risk" description="Physical progress plotted against overall risk score." tier="secondary">
      <QueryBoundary
        query={query}
        skeletonHeight={270}
        errorMessage="Unable to load the progress-risk pattern."
        emptyMessage="No progress data available."
        isEmpty={(d) => d.length === 0}
      >
        {(rows) => <ProgressRiskScatter rows={rows} height={270} />}
      </QueryBoundary>
    </ChartCard>
  );
}
