// Mirrors the PAIMANA Prediction table — produced by the Risk Engine
// (CatBoost Delay Risk + CatBoost Cost Risk -> Risk Engine -> Overall Risk Score).
// The frontend never computes these values; it only renders what the backend returns.
export type RiskLevel = "High" | "Medium" | "Low";

export interface ProjectRisk {
  projectCode: string;
  delayRiskScore: number; // 0-100, from /predict-delay via /risk
  costRiskScore: number; // 0-100, from /predict-cost via /risk
  overallRiskScore: number; // 0-100, from Risk Engine
  delayRiskLevel: RiskLevel;
  costRiskLevel: RiskLevel;
  overallRiskLevel: RiskLevel;
  predictionDate: string; // ISO date
}

export interface PortfolioRiskSummary {
  totalProjects: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  highDelayRisk: number;
  highCostRisk: number;
}

export interface SectorRisk {
  sector: string;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}
