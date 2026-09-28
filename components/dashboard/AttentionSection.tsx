import { HighRiskProjectsPanel } from "./HighRiskProjectsPanel";
import { EarlyWarningsPanel } from "./EarlyWarningsPanel";

export function AttentionSection() {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="min-w-0 lg:col-span-3 [&>*]:h-full">
        <HighRiskProjectsPanel />
      </div>
      <div className="min-w-0 lg:col-span-2 [&>*]:h-full">
        <EarlyWarningsPanel />
      </div>
    </section>
  );
}
