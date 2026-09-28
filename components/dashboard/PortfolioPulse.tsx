"use client";

import { motion } from "framer-motion";
import { PortfolioStatusStrip } from "./PortfolioStatusStrip";
import { RiskDistributionChart } from "./RiskDistributionChart";
import { RiskMatrixChart } from "./RiskMatrixChart";

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export function PortfolioPulse() {
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-5"
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.3, ease: "easeOut" }}>
        <PortfolioStatusStrip />
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-w-0 lg:col-span-2 [&>*]:h-full"
        >
          <RiskDistributionChart />
        </motion.div>
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.04 }}
          className="min-w-0 lg:col-span-3 [&>*]:h-full"
        >
          <RiskMatrixChart />
        </motion.div>
      </div>
    </motion.section>
  );
}
