"use client";

import { motion } from "framer-motion";

// Re-mounts on every navigation inside the (main) group, giving each page a single subtle entrance.
// Reduced motion is honoured by the MotionConfig in AppShell.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
