import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "@/types/risk";
import type { AlertSeverity, AlertStatus } from "@/types/alert";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Single source of truth for risk -> color mapping.
// Reused by RiskBadge, charts, and matrix dots so meaning never drifts.
export const riskTokens: Record<
  RiskLevel,
  { text: string; bg: string; border: string; dot: string; hex: string }
> = {
  High: {
    text: "text-risk-high",
    bg: "bg-risk-highBg",
    border: "border-risk-highBorder",
    dot: "bg-risk-high",
    hex: "#DC2626",
  },
  Medium: {
    text: "text-risk-medium",
    bg: "bg-risk-mediumBg",
    border: "border-risk-mediumBorder",
    dot: "bg-risk-medium",
    hex: "#F59E0B",
  },
  Low: {
    text: "text-risk-low",
    bg: "bg-risk-lowBg",
    border: "border-risk-lowBorder",
    dot: "bg-risk-low",
    hex: "#16A34A",
  },
};

export const severityTokens: Record<
  AlertSeverity,
  { text: string; bg: string; border: string }
> = {
  Critical: {
    text: "text-risk-high",
    bg: "bg-risk-highBg",
    border: "border-risk-highBorder",
  },
  High: {
    text: "text-risk-medium",
    bg: "bg-risk-mediumBg",
    border: "border-risk-mediumBorder",
  },
  Medium: {
    text: "text-brand-600",
    bg: "bg-brand-50",
    border: "border-brand-200",
  },
};

export const statusTokens: Record<AlertStatus, { text: string; bg: string }> = {
  Open: { text: "text-risk-high", bg: "bg-risk-highBg" },
  Acknowledged: { text: "text-risk-medium", bg: "bg-risk-mediumBg" },
  Resolved: { text: "text-risk-low", bg: "bg-risk-lowBg" },
};

export function formatCurrencyCr(value: number): string {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 1 })} Cr`;
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
