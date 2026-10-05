/**
 * DATA SERVICE LAYER
 * ------------------------------------------------------------
 * Frontend <-> FastAPI boundary.
 */

import { z } from "zod";

import { Project } from "@/types/project";
import {
  ProjectRisk,
  PortfolioRiskSummary,
  SectorRisk,
} from "@/types/risk";
import { ProjectAlert } from "@/types/alert";


// ============================================================
// BASE URL
// ============================================================

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";


// ============================================================
// TYPES FOR BACKEND RESPONSES
// ============================================================

interface BackendProject {
  projectCode: string | number;
  projectName: string;
  sector: string;
  ministry: string;
  implementingAgency: string;
  state?: string;

  originalCost: number;
  revisedCost: number;
  expenditure: number;
  physicalProgress: number;

  sanctionDate: string;
  originalCommissioningDate: string;
  revisedCommissioningDate?: string;
}

interface BackendProjectsResponse {
  total_projects: number;
  projects: BackendProject[];
}

interface BackendRiskRow {
  projectCode: string | number;

  delayRiskScore: number;
  costRiskScore: number;
  overallRiskScore: number;

  delayRiskLevel: string;
  costRiskLevel: string;
  overallRiskLevel: string;

  predictionDate: string;
}

interface BackendRisksResponse {
  total_projects: number;
  risks: BackendRiskRow[];
}


// ============================================================
// ZOD SCHEMAS
// ============================================================

const backendProjectRiskSchema = z.object({
  project: z.object({
    project_code: z.string(),
    project_name: z.string(),
    sector: z.string(),
    ministry: z.string(),
    agency: z.string(),
  }),

  indicators: z.object({
    original_cost: z.number(),
    expenditure: z.number(),
    physical_progress: z.number(),
    expenditure_ratio: z.number(),
    project_age_days: z.number(),
    time_remaining_days: z.number(),
  }),

  cost_risk: z.object({
    probability: z.number(),
    percentage: z.number(),
    risk_level: z.string(),
  }),

  delay_risk: z.object({
    probability: z.number(),
    percentage: z.number(),
    risk_level: z.string(),
  }),

  overall_risk: z.object({
    probability: z.number(),
    percentage: z.number(),
    risk_level: z.string(),
  }),

  as_of_date: z.string(),
});


// ============================================================
// VALIDATION
// ============================================================

function validate<T>(
  schema: z.ZodType<T>,
  data: unknown,
  context: string
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error(
      `[api] ${context} validation failed:`,
      result.error.flatten()
    );

    throw new Error(`Invalid ${context} response`);
  }

  return result.data;
}


// ============================================================
// GENERIC FETCH
// ============================================================

async function apiFetch<T>(
  endpoint: string
): Promise<T> {
  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  return (await response.json()) as T;
}


// ============================================================
// NORMALIZE RISK LEVEL
// ============================================================

function normalizeRiskLevel(
  value: string
): "High" | "Medium" | "Low" {
  const normalized = String(value).toLowerCase().trim();

  if (normalized === "high") {
    return "High";
  }

  if (normalized === "medium") {
    return "Medium";
  }

  return "Low";
}


// ============================================================
// PROJECTS
// ============================================================

export async function fetchProjects(): Promise<Project[]> {
  const raw = await apiFetch<BackendProjectsResponse>(
    "/projects"
  );

  return raw.projects.map((project) => ({
    projectCode: String(project.projectCode),
    projectName: project.projectName,
    sector: project.sector,
    ministry: project.ministry,
    implementingAgency: project.implementingAgency,
    state: project.state ?? "Not available",

    originalCost: Number(project.originalCost ?? 0),
    revisedCost: Number(project.revisedCost ?? 0),
    expenditure: Number(project.expenditure ?? 0),
    physicalProgress: Number(
      project.physicalProgress ?? 0
    ),

    sanctionDate: project.sanctionDate ?? "",
    originalCommissioningDate:
      project.originalCommissioningDate ?? "",

    revisedCommissioningDate:
      project.revisedCommissioningDate ?? "",
  }));
}


// ============================================================
// SINGLE PROJECT RISK
// ============================================================

export async function fetchProjectRisk(
  projectCode: string
): Promise<ProjectRisk> {
  const raw = await apiFetch<unknown>(
    `/project/${encodeURIComponent(projectCode)}`
  );

  const data = validate(
    backendProjectRiskSchema,
    raw,
    "ProjectRisk"
  );

  return {
    projectCode: data.project.project_code,

    delayRiskScore:
      data.delay_risk.percentage,

    costRiskScore:
      data.cost_risk.percentage,

    overallRiskScore:
      data.overall_risk.percentage,

    delayRiskLevel:
      normalizeRiskLevel(
        data.delay_risk.risk_level
      ),

    costRiskLevel:
      normalizeRiskLevel(
        data.cost_risk.risk_level
      ),

    overallRiskLevel:
      normalizeRiskLevel(
        data.overall_risk.risk_level
      ),

    predictionDate:
      data.as_of_date,
  };
}


// ============================================================
// ALL PROJECT RISKS
// ============================================================

export async function fetchProjectRisks(): Promise<ProjectRisk[]> {
  const data = await apiFetch<BackendRisksResponse>(
    "/risk"
  );

  return data.risks.map((risk) => ({
    projectCode: String(risk.projectCode),

    delayRiskScore: Number(
      risk.delayRiskScore ?? 0
    ),

    costRiskScore: Number(
      risk.costRiskScore ?? 0
    ),

    overallRiskScore: Number(
      risk.overallRiskScore ?? 0
    ),

    delayRiskLevel:
      normalizeRiskLevel(
        risk.delayRiskLevel
      ),

    costRiskLevel:
      normalizeRiskLevel(
        risk.costRiskLevel
      ),

    overallRiskLevel:
      normalizeRiskLevel(
        risk.overallRiskLevel
      ),

    predictionDate:
      risk.predictionDate,
  }));
}


// ============================================================
// PROJECT + RISK
// ============================================================

export async function fetchProjectsWithRisk() {
  const [projects, risks] =
    await Promise.all([
      fetchProjects(),
      fetchProjectRisks(),
    ]);

  const riskByCode = new Map(
    risks.map((risk) => [
      risk.projectCode,
      risk,
    ])
  );

  return projects
    .map((project) => ({
      project,
      risk: riskByCode.get(
        project.projectCode
      ),
    }))
    .filter(
      (
        row
      ): row is {
        project: Project;
        risk: ProjectRisk;
      } => !!row.risk
    )
    .sort(
      (a, b) =>
        b.risk.overallRiskScore -
        a.risk.overallRiskScore
    );
}


// ============================================================
// HIGH-RISK PROJECTS
// ============================================================

export async function fetchHighRiskProjects(
  limit = 6
) {
  const rows =
    await fetchProjectsWithRisk();

  return rows
    .filter(
      (row) =>
        row.risk.overallRiskLevel ===
        "High"
    )
    .slice(0, limit);
}


// ============================================================
// PORTFOLIO SUMMARY
// ============================================================

export async function fetchPortfolioSummary(): Promise<PortfolioRiskSummary> {
  const rows =
    await fetchProjectsWithRisk();

  const highRisk = rows.filter(
    (row) =>
      row.risk.overallRiskLevel === "High"
  ).length;

  const mediumRisk = rows.filter(
    (row) =>
      row.risk.overallRiskLevel === "Medium"
  ).length;

  const lowRisk = rows.filter(
    (row) =>
      row.risk.overallRiskLevel === "Low"
  ).length;

  const highDelayRisk = rows.filter(
    (row) =>
      row.risk.delayRiskLevel === "High"
  ).length;

  const highCostRisk = rows.filter(
    (row) =>
      row.risk.costRiskLevel === "High"
  ).length;

  return {
    totalProjects: rows.length,
    highRisk,
    mediumRisk,
    lowRisk,
    highDelayRisk,
    highCostRisk,
  };
}


// ============================================================
// ALERTS
// ============================================================

export async function fetchAlerts(): Promise<ProjectAlert[]> {
  const [projects, risks] =
    await Promise.all([
      fetchProjects(),
      fetchProjectRisks(),
    ]);

  const projectByCode = new Map(
    projects.map((project) => [
      project.projectCode,
      project,
    ])
  );

  const alerts: ProjectAlert[] = [];

  for (const risk of risks) {
    const project =
      projectByCode.get(
        risk.projectCode
      );

    if (!project) {
      continue;
    }

    // --------------------------------------------------------
    // Delay Risk Alert
    // --------------------------------------------------------

    if (
      risk.delayRiskLevel === "High"
    ) {
      alerts.push({
        id: `${risk.projectCode}-delay`,
        projectCode: risk.projectCode,
        projectName: project.projectName,
        alertType:
          "Delay Risk Threshold Breach",

        severity:
          risk.delayRiskScore >= 90
            ? "Critical"
            : "High",

        status: "Open",

        relevantRisk: "Delay Risk",

        raisedDate:
          risk.predictionDate,
      });
    }

    // --------------------------------------------------------
    // Cost Risk Alert
    // --------------------------------------------------------

    if (
      risk.costRiskLevel === "High"
    ) {
      alerts.push({
        id: `${risk.projectCode}-cost`,
        projectCode: risk.projectCode,
        projectName: project.projectName,
        alertType:
          "Cost Overrun Risk Threshold Breach",

        severity:
          risk.costRiskScore >= 90
            ? "Critical"
            : "High",

        status: "Open",

        relevantRisk: "Cost Risk",

        raisedDate:
          risk.predictionDate,
      });
    }

    // --------------------------------------------------------
    // Overall Risk Alert
    // --------------------------------------------------------

    if (
      risk.overallRiskLevel === "High"
    ) {
      alerts.push({
        id: `${risk.projectCode}-overall`,
        projectCode: risk.projectCode,
        projectName: project.projectName,
        alertType:
          "Overall Risk Threshold Breach",

        severity:
          risk.overallRiskScore >= 90
            ? "Critical"
            : "High",

        status: "Open",

        relevantRisk: "Overall Risk",

        raisedDate:
          risk.predictionDate,
      });
    }
  }

  return alerts.sort(
    (a, b) =>
      new Date(b.raisedDate).getTime() -
      new Date(a.raisedDate).getTime()
  );
}


// ============================================================
// SECTOR RISK
// ============================================================

export async function fetchSectorRisk(): Promise<SectorRisk[]> {
  const [projects, risks] =
    await Promise.all([
      fetchProjects(),
      fetchProjectRisks(),
    ]);

  const projectByCode = new Map(
    projects.map((project) => [
      project.projectCode,
      project,
    ])
  );

  const sectorMap = new Map<
    string,
    {
      highRisk: number;
      mediumRisk: number;
      lowRisk: number;
    }
  >();

  for (const risk of risks) {
    const project =
      projectByCode.get(
        risk.projectCode
      );

    if (!project) {
      continue;
    }

    const sector =
      project.sector || "Unknown";

    if (!sectorMap.has(sector)) {
      sectorMap.set(sector, {
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
      });
    }

    const stats =
      sectorMap.get(sector)!;

    if (
      risk.overallRiskLevel === "High"
    ) {
      stats.highRisk += 1;
    } else if (
      risk.overallRiskLevel === "Medium"
    ) {
      stats.mediumRisk += 1;
    } else {
      stats.lowRisk += 1;
    }
  }

  return Array.from(
    sectorMap.entries()
  )
    .map(([sector, stats]) => ({
      sector,
      highRisk: stats.highRisk,
      mediumRisk: stats.mediumRisk,
      lowRisk: stats.lowRisk,
    }))
    .sort(
      (a, b) =>
        b.highRisk - a.highRisk
    );
}