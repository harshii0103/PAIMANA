// Mirrors the PAIMANA Project table (see solution doc, section 15: Database)
export type Sector =
  | "Roads"
  | "Railways"
  | "Power"
  | "Ports"
  | "Aviation"
  | "Urban Infrastructure"
  | "Irrigation"
  | "Telecom";

export interface Project {
  projectCode: string;
  projectName: string;
  sector: Sector;
  ministry: string;
  implementingAgency: string;
  state: string;
  originalCost: number; // in ₹ Crore
  revisedCost: number; // in ₹ Crore
  expenditure: number; // in ₹ Crore
  physicalProgress: number; // 0-100
  sanctionDate: string; // ISO date
  originalCommissioningDate: string; // ISO date
  revisedCommissioningDate: string; // ISO date
}

import type { ProjectRisk } from "./risk";

/** A project joined with the risk values returned by the backend (never computed in the UI). */
export interface ProjectWithRisk {
  project: Project;
  risk: ProjectRisk;
}
