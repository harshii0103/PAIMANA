import { Suspense } from "react";
import { EarlyWarningsView } from "@/components/alerts/EarlyWarningsView";

export default function AlertsPage() {
  return (
    <Suspense fallback={null}>
      <EarlyWarningsView />
    </Suspense>
  );
}
