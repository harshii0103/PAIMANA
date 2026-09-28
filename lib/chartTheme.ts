import type { RiskLevel } from "@/types/risk";

export type ChartTheme = "light" | "dark";

export const chartTheme = {
  light: { tick: "#94A3B8", label: "#64748B", grid: "#EEF2F7", ref: "#CBD5E1", stroke: "#FFFFFF", quadrant: "#DC2626", quadrantOpacity: 0.05, cost: "#2563EB", delay: "#0F172A" },
  dark: { tick: "#64748B", label: "#94A3B8", grid: "#1E293B", ref: "#334155", stroke: "#0F172A", quadrant: "#EF4444", quadrantOpacity: 0.12, cost: "#60A5FA", delay: "#94A3B8" },
} as const;

// Same semantic meaning in both themes: red = High, amber = Medium, green = Low.
export const riskHex: Record<ChartTheme, Record<RiskLevel, string>> = {
  light: { High: "#DC2626", Medium: "#F59E0B", Low: "#16A34A" },
  dark: { High: "#EF4444", Medium: "#F59E0B", Low: "#22C55E" },
};
