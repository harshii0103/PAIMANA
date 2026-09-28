import { useQuery } from "@tanstack/react-query";
import { fetchAlerts } from "@/services/api";

export function useAlerts() {
  return useQuery({ queryKey: ["alerts"], queryFn: fetchAlerts });
}

/** Open-alert count derived from real alert data (never hardcoded). */
export function useOpenAlertCount() {
  const { data } = useAlerts();
  return data?.filter((a) => a.status === "Open").length ?? 0;
}
