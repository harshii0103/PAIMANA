import { BarChart3 } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export default function AnalyticsPage() {
  return (
    <PagePlaceholder
      icon={BarChart3}
      title="Analytics"
      description="Sector-wise risk, cost patterns, progress patterns and benchmarking will be available here."
    />
  );
}
