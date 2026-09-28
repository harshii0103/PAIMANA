import { PortfolioPulse } from "@/components/dashboard/PortfolioPulse";
import { AttentionSection } from "@/components/dashboard/AttentionSection";
import { PatternsSection } from "@/components/dashboard/PatternsSection";
import { DemoDataBanner } from "@/components/shared/DemoDataBanner";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DemoDataBanner />
      <div className="space-y-8">
        <PortfolioPulse />
        <AttentionSection />
        <PatternsSection />
      </div>
    </div>
  );
}
