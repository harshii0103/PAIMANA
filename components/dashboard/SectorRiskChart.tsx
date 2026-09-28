"use client";

import { useSectorRisk } from "@/hooks/useRisk";
import { ChartCard } from "@/components/shared/ChartCard";
import { QueryBoundary } from "@/components/shared/QueryBoundary";
import { SectorRiskBars } from "@/components/charts/SectorRiskBars";

export function SectorRiskChart() {
  const query = useSectorRisk();
  return (
    <ChartCard title="Sector-wise Risk" description="Projects in each sector, grouped by risk level." tier="secondary">
      <QueryBoundary
        query={query}
        skeletonHeight={270}
        errorMessage="Unable to load sector risk."
        emptyMessage="No sector-level risk data available."
        isEmpty={(d) => d.length === 0}
      >
        {(data) => <SectorRiskBars data={data} height={270} />}
      </QueryBoundary>
    </ChartCard>
  );
}
