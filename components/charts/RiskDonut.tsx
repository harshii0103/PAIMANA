"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { chartTheme, riskHex, type ChartTheme } from "@/lib/chartTheme";
import { cn } from "@/lib/utils";
import type { PortfolioRiskSummary } from "@/types/risk";

/** Overall-risk distribution from backend counts. Center shows total projects. */
export function RiskDonut({
  summary,
  theme = "light",
  height = 220,
  legend = true,
}: {
  summary: PortfolioRiskSummary;
  theme?: ChartTheme;
  height?: number;
  legend?: boolean;
}) {
  const dark = theme === "dark";
  const t = chartTheme[theme];
  const data = [
    { name: "High", value: summary.highRisk },
    { name: "Medium", value: summary.mediumRisk },
    { name: "Low", value: summary.lowRisk },
  ] as const;
  const inner = Math.round(height * 0.29);
  const outer = Math.round(height * 0.42);

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data as unknown as { name: string; value: number }[]}
              dataKey="value" nameKey="name" cx="50%" cy="50%"
              innerRadius={inner} outerRadius={outer} paddingAngle={2}
              isAnimationActive animationDuration={700} animationEasing="ease-out"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={riskHex[theme][d.name]} stroke={t.stroke} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value} projects`, name]}
              contentStyle={{
                borderRadius: 6, fontSize: 12,
                border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #E2E8F0",
                background: dark ? "#0B1120" : "#fff", color: dark ? "#E2E8F0" : "#0F172A",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("tabular text-3xl font-semibold leading-none", dark ? "text-white" : "text-ink-900")}>
            {summary.totalProjects}
          </span>
          <span className={cn("mt-1 text-xs", dark ? "text-slate-400" : "text-ink-500")}>Total Projects</span>
        </div>
      </div>
      {legend && (
        <div className={cn("mt-2 grid grid-cols-3 gap-2 border-t pt-3", dark ? "border-white/[0.07]" : "border-ink-100")}>
          {data.map((d) => {
            const pct = summary.totalProjects > 0 ? Math.round((d.value / summary.totalProjects) * 100) : 0;
            return (
              <div key={d.name} className="flex flex-col items-center gap-0.5 text-center">
                <div className={cn("flex items-center gap-1.5 text-xs font-medium", dark ? "text-slate-300" : "text-ink-700")}>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: riskHex[theme][d.name] }} />
                  {d.name}
                </div>
                <div className={cn("tabular text-sm font-semibold", dark ? "text-white" : "text-ink-900")}>
                  {d.value} <span className={cn("text-xs font-normal", dark ? "text-slate-500" : "text-ink-400")}>({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
