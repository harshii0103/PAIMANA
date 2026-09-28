"use client";

import { useSectorRisk } from "@/hooks/useRisk";
import { ChartCard } from "@/components/shared/ChartCard";
import { QueryBoundary } from "@/components/shared/QueryBoundary";
import { SectorRiskBars } from "@/components/charts/SectorRiskBars";

export function SectorRiskChart() {
  const query = useSectorRisk();
  return (
    <ChartCard title="Sector-wise Risk" description="Projects per sector by overall risk level" tier="secondary">
      <QueryBoundary
        query={query}
        skeletonHeight={220}
        errorMessage="Unable to load sector risk."
        emptyMessage="No sector-level risk data available."
        isEmpty={(d) => d.length === 0}
      >
        {(data) => <SectorRiskBars data={data} height={230} />}
      </QueryBoundary>
    </ChartCard>
  );
}
