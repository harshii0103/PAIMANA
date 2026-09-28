// Mirrors the PAIMANA Alert table (Project Code, Alert Type, Severity, Status)
export type AlertSeverity = "Critical" | "High" | "Medium";
export type AlertStatus = "Open" | "Acknowledged" | "Resolved";

export interface ProjectAlert {
  id: string;
  projectCode: string;
  projectName: string;
  alertType: string; // e.g. "Delay Risk Threshold Breach", "Cost Overrun Trend"
  severity: AlertSeverity;
  status: AlertStatus;
  relevantRisk: "Delay Risk" | "Cost Risk" | "Overall Risk";
  raisedDate: string; // ISO date
}
