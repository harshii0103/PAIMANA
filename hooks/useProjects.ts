import { useQuery } from "@tanstack/react-query";
import {
  fetchProjects,
  fetchHighRiskProjects,
  fetchProjectsWithRisk,
} from "@/services/api";

export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
}

export function useHighRiskProjects(limit = 6) {
  return useQuery({
    queryKey: ["projects", "high-risk", limit],
    queryFn: () => fetchHighRiskProjects(limit),
  });
}

/** Projects joined with backend risk values — single source for the design concepts. */
export function useProjectsWithRisk() {
  return useQuery({ queryKey: ["projects", "with-risk"], queryFn: fetchProjectsWithRisk });
}
