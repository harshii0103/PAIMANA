"use client";

import { FolderKanban, ShieldAlert, ShieldQuestion, ShieldCheck, Clock, IndianRupee } from "lucide-react";
import { usePortfolioSummary } from "@/hooks/useRisk";
import { StatBlock } from "@/components/shared/StatBlock";
import { StatStripSkeleton } from "@/components/shared/Skeletons";
import { ErrorState } from "@/components/shared/ErrorState";

export function PortfolioStatusStrip() {
  const { data, isLoading, isError, refetch } = usePortfolioSummary();

  if (isLoading) return <StatStripSkeleton />;

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-ink-200 bg-white shadow-card">
        <ErrorState message="Unable to load portfolio summary." onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-y-px overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-ink-200/70">
      <StatBlock label="Total Projects" value={data.totalProjects} icon={FolderKanban} tone="neutral" />
      <StatBlock label="High Risk" value={data.highRisk} icon={ShieldAlert} tone="high" emphasis />
      <StatBlock label="Medium Risk" value={data.mediumRisk} icon={ShieldQuestion} tone="medium" />
      <StatBlock label="Low Risk" value={data.lowRisk} icon={ShieldCheck} tone="low" />
      <StatBlock label="High Delay Risk" value={data.highDelayRisk} icon={Clock} tone="high" emphasis />
      <StatBlock label="High Cost Risk" value={data.highCostRisk} icon={IndianRupee} tone="high" emphasis />
    </div>
  );
}
