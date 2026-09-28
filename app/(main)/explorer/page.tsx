"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProjectMonitorTable } from "@/components/projects/ProjectMonitorTable";
import type { RiskLevel } from "@/types/risk";

function ExplorerContent() {
  const params = useSearchParams();
  const search = params.get("search") ?? "";
  const riskParam = params.get("risk");
  const risk: RiskLevel | "All" =
    riskParam === "High" || riskParam === "Medium" || riskParam === "Low" ? riskParam : "All";

  // key resets the local filter state when the URL query changes (e.g. a new header search)
  return <ProjectMonitorTable key={`${search}|${risk}`} initialSearch={search} initialRisk={risk} />;
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={null}>
      <ExplorerContent />
    </Suspense>
  );
}
