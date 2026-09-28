"use client";

import { motion } from "framer-motion";
import { SectorRiskChart } from "./SectorRiskChart";
import { ProgressRiskChart } from "./ProgressRiskChart";

// Tier 3 wrapper — applies the shared "secondary" visual treatment
// (muted card bg + smaller title/chart height, via ChartCard tier="secondary")
// and the plainest motion in the dashboard: a single fade-in, no stagger, no scale.
export function PatternsSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <h2 className="text-[13px] font-medium text-ink-400">Portfolio patterns</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectorRiskChart />
        <ProgressRiskChart />
      </div>
    </motion.section>
  );
}
