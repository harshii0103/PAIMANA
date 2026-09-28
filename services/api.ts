/**
 * DATA SERVICE LAYER
 * ------------------------------------------------------------
 * Single boundary between UI components and data. Today it reads
 * mockData.ts. When the FastAPI backend is ready, only the bodies
 * of these functions change (to real fetch calls against the
 * endpoints below) — components and hooks never need to change.
 *
 * Target FastAPI endpoints (per PAIMANA architecture doc):
 *   GET /projects
 *   GET /project/{id}
 *   GET /risk            -> portfolio + per-project risk
 *   GET /alerts
 *   GET /benchmark
 *   GET /explanation
 */
import { z } from "zod";
import {
  mockProjects,
  mockRisks,
  mockPortfolioSummary,
  mockSectorRisk,
  mockAlerts,
} from "./mockData";
import { Project } from "@/types/project";
import { ProjectRisk, PortfolioRiskSummary, SectorRisk } from "@/types/risk";
import { ProjectAlert } from "@/types/alert";

const SIMULATED_LATENCY_MS = 450;

// Runtime validation at the two boundaries that matter most once this talks
// to a real FastAPI backend: risk predictions and alerts. If the shape ever
// drifts from what the UI expects, this fails loudly in dev instead of
// rendering silently-wrong badges.
const riskLevelSchema = z.enum(["High", "Medium", "Low"]);

const projectRiskSchema = z.object({
  projectCode: z.string(),
  delayRiskScore: z.number().min(0).max(100),
  costRiskScore: z.number().min(0).max(100),
  overallRiskScore: z.number().min(0).max(100),
  delayRiskLevel: riskLevelSchema,
  costRiskLevel: riskLevelSchema,
  overallRiskLevel: riskLevelSchema,
  predictionDate: z.string(),
});

const alertSchema = z.object({
  id: z.string(),
  projectCode: z.string(),
  projectName: z.string(),
  alertType: z.string(),
  severity: z.enum(["Critical", "High", "Medium"]),
  status: z.enum(["Open", "Acknowledged", "Resolved"]),
  relevantRisk: z.enum(["Delay Risk", "Cost Risk", "Overall Risk"]),
  raisedDate: z.string(),
});

function validate<T>(schema: z.ZodType<T>, data: unknown, context: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    // In production this would surface as a card-level ErrorState via
    // TanStack Query's error handling, not a thrown crash.
    console.error(`[api] ${context} failed validation:`, result.error.flatten());
    throw new Error(`Invalid ${context} response shape`);
  }
  return result.data;
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

export async function fetchPortfolioSummary(): Promise<PortfolioRiskSummary> {
  // Future: return (await fetch(`${BASE_URL}/risk/summary`)).json()
  return delay(mockPortfolioSummary);
}

export async function fetchProjects(): Promise<Project[]> {
  // Future: return (await fetch(`${BASE_URL}/projects`)).json()
  return delay(mockProjects);
}

export async function fetchProjectRisks(): Promise<ProjectRisk[]> {
  // Future: const raw = await (await fetch(`${BASE_URL}/risk`)).json()
  const raw = await delay(mockRisks);
  return raw.map((r) => validate(projectRiskSchema, r, "ProjectRisk"));
}

export async function fetchSectorRisk(): Promise<SectorRisk[]> {
  // Future: return (await fetch(`${BASE_URL}/risk/by-sector`)).json()
  return delay(mockSectorRisk);
}

export async function fetchAlerts(): Promise<ProjectAlert[]> {
  // Future: const raw = await (await fetch(`${BASE_URL}/alerts`)).json()
  const raw = await delay(mockAlerts);
  return raw.map((a) => validate(alertSchema, a, "ProjectAlert"));
}

// Convenience: joins Project + ProjectRisk for table/panel rendering.
export async function fetchHighRiskProjects(limit = 6) {
  const [projects, risks] = await Promise.all([fetchProjects(), fetchProjectRisks()]);
  const riskByCode = new Map(risks.map((r) => [r.projectCode, r]));

  return projects
    .map((p) => ({ project: p, risk: riskByCode.get(p.projectCode) }))
    .filter((row): row is { project: Project; risk: ProjectRisk } => !!row.risk)
    .filter((row) => row.risk.overallRiskLevel === "High")
    .sort((a, b) => b.risk.overallRiskScore - a.risk.overallRiskScore)
    .slice(0, limit);
}

// All projects joined with their backend-provided risk values, highest overall score first.
export async function fetchProjectsWithRisk() {
  const [projects, risks] = await Promise.all([fetchProjects(), fetchProjectRisks()]);
  const riskByCode = new Map(risks.map((r) => [r.projectCode, r]));
  return projects
    .map((project) => ({ project, risk: riskByCode.get(project.projectCode) }))
    .filter((row): row is { project: Project; risk: ProjectRisk } => !!row.risk)
    .sort((a, b) => b.risk.overallRiskScore - a.risk.overallRiskScore);
}
