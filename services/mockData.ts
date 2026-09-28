/**
 * MOCK DATA — FOR FRONTEND DEVELOPMENT ONLY
 * ------------------------------------------------------------
 * This file simulates responses from the future FastAPI backend
 * (/projects, /risk, /alerts). Every shape here matches the types
 * in /types exactly, so services/api.ts can swap this module out
 * for real fetch calls with zero changes to components or hooks.
 *
 * No values here are real predictions. Risk scores and alerts are
 * illustrative placeholders for layout/UI development, not derived
 * from any model.
 */
import { Project } from "@/types/project";
import { ProjectRisk, PortfolioRiskSummary, SectorRisk } from "@/types/risk";
import { ProjectAlert } from "@/types/alert";

export const mockProjects: Project[] = [
  {
    projectCode: "PRJ-70671",
    projectName: "NH-44 Widening — Phase II",
    sector: "Roads",
    ministry: "Ministry of Road Transport & Highways",
    implementingAgency: "NHAI",
    state: "Madhya Pradesh",
    originalCost: 1240,
    revisedCost: 1490,
    expenditure: 980,
    physicalProgress: 62,
    sanctionDate: "2021-03-10",
    originalCommissioningDate: "2024-06-30",
    revisedCommissioningDate: "2025-09-30",
  },
  {
    projectCode: "PRJ-70812",
    projectName: "Dedicated Freight Corridor — Segment C",
    sector: "Railways",
    ministry: "Ministry of Railways",
    implementingAgency: "DFCCIL",
    state: "Uttar Pradesh",
    originalCost: 3200,
    revisedCost: 3960,
    expenditure: 2100,
    physicalProgress: 48,
    sanctionDate: "2020-11-01",
    originalCommissioningDate: "2023-12-31",
    revisedCommissioningDate: "2026-03-31",
  },
  {
    projectCode: "PRJ-71120",
    projectName: "Paradip Port Berth Expansion",
    sector: "Ports",
    ministry: "Ministry of Ports, Shipping & Waterways",
    implementingAgency: "Paradip Port Authority",
    state: "Odisha",
    originalCost: 640,
    revisedCost: 655,
    expenditure: 610,
    physicalProgress: 91,
    sanctionDate: "2022-01-15",
    originalCommissioningDate: "2024-12-31",
    revisedCommissioningDate: "2025-02-28",
  },
  {
    projectCode: "PRJ-71305",
    projectName: "Greenfield Airport — Terminal 1",
    sector: "Aviation",
    ministry: "Ministry of Civil Aviation",
    implementingAgency: "AAI",
    state: "Karnataka",
    originalCost: 2100,
    revisedCost: 2870,
    expenditure: 1350,
    physicalProgress: 39,
    sanctionDate: "2021-07-20",
    originalCommissioningDate: "2024-03-31",
    revisedCommissioningDate: "2026-06-30",
  },
  {
    projectCode: "PRJ-71540",
    projectName: "Ultra Mega Power Plant — Unit 4",
    sector: "Power",
    ministry: "Ministry of Power",
    implementingAgency: "NTPC",
    state: "Chhattisgarh",
    originalCost: 5400,
    revisedCost: 5510,
    expenditure: 5100,
    physicalProgress: 88,
    sanctionDate: "2019-05-12",
    originalCommissioningDate: "2023-08-31",
    revisedCommissioningDate: "2024-02-28",
  },
  {
    projectCode: "PRJ-71689",
    projectName: "Metro Line 3 Extension",
    sector: "Urban Infrastructure",
    ministry: "Ministry of Housing & Urban Affairs",
    implementingAgency: "State Metro Rail Corp",
    state: "Maharashtra",
    originalCost: 1870,
    revisedCost: 2340,
    expenditure: 1120,
    physicalProgress: 55,
    sanctionDate: "2021-09-01",
    originalCommissioningDate: "2024-11-30",
    revisedCommissioningDate: "2026-01-31",
  },
  {
    projectCode: "PRJ-71822",
    projectName: "Indira Sagar Canal Modernisation",
    sector: "Irrigation",
    ministry: "Ministry of Jal Shakti",
    implementingAgency: "State Irrigation Dept",
    state: "Madhya Pradesh",
    originalCost: 480,
    revisedCost: 610,
    expenditure: 260,
    physicalProgress: 41,
    sanctionDate: "2020-02-18",
    originalCommissioningDate: "2023-05-31",
    revisedCommissioningDate: "2025-11-30",
  },
  {
    projectCode: "PRJ-71950",
    projectName: "Optical Fibre Backbone — North East",
    sector: "Telecom",
    ministry: "Ministry of Communications",
    implementingAgency: "BSNL",
    state: "Assam",
    originalCost: 310,
    revisedCost: 315,
    expenditure: 298,
    physicalProgress: 96,
    sanctionDate: "2022-04-05",
    originalCommissioningDate: "2024-07-31",
    revisedCommissioningDate: "2024-09-30",
  },
];

export const mockRisks: ProjectRisk[] = [
  { projectCode: "PRJ-70671", delayRiskScore: 78, costRiskScore: 71, overallRiskScore: 76, delayRiskLevel: "High", costRiskLevel: "High", overallRiskLevel: "High", predictionDate: "2026-09-20" },
  { projectCode: "PRJ-70812", delayRiskScore: 82, costRiskScore: 88, overallRiskScore: 85, delayRiskLevel: "High", costRiskLevel: "High", overallRiskLevel: "High", predictionDate: "2026-09-20" },
  { projectCode: "PRJ-71120", delayRiskScore: 22, costRiskScore: 18, overallRiskScore: 19, delayRiskLevel: "Low", costRiskLevel: "Low", overallRiskLevel: "Low", predictionDate: "2026-09-20" },
  { projectCode: "PRJ-71305", delayRiskScore: 74, costRiskScore: 69, overallRiskScore: 72, delayRiskLevel: "High", costRiskLevel: "Medium", overallRiskLevel: "High", predictionDate: "2026-09-20" },
  { projectCode: "PRJ-71540", delayRiskScore: 31, costRiskScore: 24, overallRiskScore: 28, delayRiskLevel: "Medium", costRiskLevel: "Low", overallRiskLevel: "Low", predictionDate: "2026-09-20" },
  { projectCode: "PRJ-71689", delayRiskScore: 63, costRiskScore: 58, overallRiskScore: 61, delayRiskLevel: "Medium", costRiskLevel: "Medium", overallRiskLevel: "Medium", predictionDate: "2026-09-20" },
  { projectCode: "PRJ-71822", delayRiskScore: 69, costRiskScore: 62, overallRiskScore: 66, delayRiskLevel: "Medium", costRiskLevel: "Medium", overallRiskLevel: "Medium", predictionDate: "2026-09-20" },
  { projectCode: "PRJ-71950", delayRiskScore: 12, costRiskScore: 9, overallRiskScore: 11, delayRiskLevel: "Low", costRiskLevel: "Low", overallRiskLevel: "Low", predictionDate: "2026-09-20" },
];

export const mockPortfolioSummary: PortfolioRiskSummary = {
  totalProjects: mockProjects.length,
  highRisk: mockRisks.filter((r) => r.overallRiskLevel === "High").length,
  mediumRisk: mockRisks.filter((r) => r.overallRiskLevel === "Medium").length,
  lowRisk: mockRisks.filter((r) => r.overallRiskLevel === "Low").length,
  highDelayRisk: mockRisks.filter((r) => r.delayRiskLevel === "High").length,
  highCostRisk: mockRisks.filter((r) => r.costRiskLevel === "High").length,
};

export const mockSectorRisk: SectorRisk[] = [
  { sector: "Railways", highRisk: 1, mediumRisk: 0, lowRisk: 0 },
  { sector: "Roads", highRisk: 1, mediumRisk: 0, lowRisk: 0 },
  { sector: "Aviation", highRisk: 1, mediumRisk: 0, lowRisk: 0 },
  { sector: "Urban Infrastructure", highRisk: 0, mediumRisk: 1, lowRisk: 0 },
  { sector: "Irrigation", highRisk: 0, mediumRisk: 1, lowRisk: 0 },
  { sector: "Power", highRisk: 0, mediumRisk: 0, lowRisk: 1 },
  { sector: "Ports", highRisk: 0, mediumRisk: 0, lowRisk: 1 },
  { sector: "Telecom", highRisk: 0, mediumRisk: 0, lowRisk: 1 },
];

export const mockAlerts: ProjectAlert[] = [
  { id: "ALT-1001", projectCode: "PRJ-70812", projectName: "Dedicated Freight Corridor — Segment C", alertType: "Cost Overrun Trend", severity: "Critical", status: "Open", relevantRisk: "Cost Risk", raisedDate: "2026-09-24" },
  { id: "ALT-1002", projectCode: "PRJ-70671", projectName: "NH-44 Widening — Phase II", alertType: "Delay Risk Threshold Breach", severity: "High", status: "Open", relevantRisk: "Delay Risk", raisedDate: "2026-09-23" },
  { id: "ALT-1003", projectCode: "PRJ-71305", projectName: "Greenfield Airport — Terminal 1", alertType: "Delay Risk Threshold Breach", severity: "High", status: "Acknowledged", relevantRisk: "Delay Risk", raisedDate: "2026-09-21" },
  { id: "ALT-1004", projectCode: "PRJ-71822", projectName: "Indira Sagar Canal Modernisation", alertType: "Overall Risk Increase", severity: "Medium", status: "Open", relevantRisk: "Overall Risk", raisedDate: "2026-09-19" },
  { id: "ALT-1005", projectCode: "PRJ-71689", projectName: "Metro Line 3 Extension", alertType: "Cost Overrun Trend", severity: "Medium", status: "Acknowledged", relevantRisk: "Cost Risk", raisedDate: "2026-09-17" },
];
