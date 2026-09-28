"use client";

import { motion } from "framer-motion";
import type { UseQueryResult } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";

interface QueryBoundaryProps<T> {
  query: UseQueryResult<T, Error>;
  children: (data: T) => React.ReactNode;
  skeletonHeight?: number;
  dark?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  isEmpty?: (data: T) => boolean;
}

/** Card-level loading / error / empty handling so one failed request never blanks a page. */
export function QueryBoundary<T>({
  query,
  children,
  skeletonHeight = 200,
  dark = false,
  errorMessage,
  emptyMessage = "No data available.",
  isEmpty,
}: QueryBoundaryProps<T>) {
  if (query.isLoading) {
    return (
      <div
        className={cn("animate-pulse rounded-md", dark ? "bg-white/[0.06]" : "bg-ink-200/60")}
        style={{ height: skeletonHeight }}
        aria-busy="true"
      />
    );
  }
  if (query.isError || query.data === undefined) {
    return <ErrorState dark={dark} message={errorMessage} onRetry={() => query.refetch()} />;
  }
  if (isEmpty && isEmpty(query.data)) {
    return <EmptyState dark={dark} message={emptyMessage} />;
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      {children(query.data)}
    </motion.div>
  );
}
