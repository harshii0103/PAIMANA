import { SectorRiskChart } from "./SectorRiskChart";
import { ProgressRiskChart } from "./ProgressRiskChart";

// Tier 3 — supporting analysis. Visually quieter than Tiers 1–2 via ChartCard tier="secondary".
export function PatternsSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-[13px] font-medium text-ink-500">Portfolio patterns</h2>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectorRiskChart />
        <ProgressRiskChart />
      </div>
    </section>
  );
}
