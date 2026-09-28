"use client";

import { motion } from "framer-motion";
import { HighRiskProjectsPanel } from "./HighRiskProjectsPanel";
import { EarlyWarningsPanel } from "./EarlyWarningsPanel";

export function AttentionSection() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="min-w-0 lg:col-span-3"
      >
        <HighRiskProjectsPanel />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
        className="min-w-0 lg:col-span-2"
      >
        <EarlyWarningsPanel />
      </motion.div>
    </section>
  );
}
