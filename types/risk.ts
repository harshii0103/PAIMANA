// Mirrors the PAIMANA Prediction table.
// Values are produced by the backend Risk Engine.

export type RiskLevel = "High" | "Medium" | "Low";


export interface ProjectRisk {

  projectCode: string;

  delayRiskScore: number;

  costRiskScore: number;

  overallRiskScore: number;

  delayRiskLevel: RiskLevel;

  costRiskLevel: RiskLevel;

  overallRiskLevel: RiskLevel;

  predictionDate: string;
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