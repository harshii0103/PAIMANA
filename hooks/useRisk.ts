import { useQuery } from "@tanstack/react-query";
import { fetchPortfolioSummary, fetchProjectRisks, fetchSectorRisk } from "@/services/api";

export function usePortfolioSummary() {
  return useQuery({ queryKey: ["risk", "summary"], queryFn: fetchPortfolioSummary });
}

export function useProjectRisks() {
  return useQuery({ queryKey: ["risk", "projects"], queryFn: fetchProjectRisks });
}

export function useSectorRisk() {
  return useQuery({ queryKey: ["risk", "sector"], queryFn: fetchSectorRisk });
}
