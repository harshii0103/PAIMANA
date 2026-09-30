// Mirrors the PAIMANA Project table

export type Sector = string;

export interface Project {
  projectCode: string;

  projectName: string;

  sector: Sector;

  ministry: string;

  implementingAgency: string;

  state: string;

  originalCost: number;

  revisedCost: number;

  expenditure: number;

  physicalProgress: number;

  sanctionDate: string;

  originalCommissioningDate: string;

  revisedCommissioningDate: string;
}


// A project joined with its backend-provided risk values

import type { ProjectRisk } from "./risk";

export interface ProjectWithRisk {
  project: Project;
  risk: ProjectRisk;
}