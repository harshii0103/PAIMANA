"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { chartTheme, riskHex, type ChartTheme } from "@/lib/chartTheme";
import { cn } from "@/lib/utils";
import type { ProjectWithRisk } from "@/types/project";

/** Physical progress (x) vs backend overall risk score (y). */
export function ProgressRiskScatter({
  rows,
  theme = "light",
  height = 240,
}: {
  rows: ProjectWithRisk[];
  theme?: ChartTheme;
  height?: number;
}) {
  const t = chartTheme[theme];
  const dark = theme === "dark";
  const points = rows.map(({ project, risk }) => ({
    x: project.physicalProgress,
    y: risk.overallRiskScore,
    name: project.projectName,
    code: project.projectCode,
    level: risk.overallRiskLevel,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 6, right: 14, bottom: 24, left: 2 }}>
        <CartesianGrid stroke={t.grid} strokeDasharray="3 3" />
        <XAxis
          type="number" dataKey="x" name="Progress" domain={[0, 100]} tick={{ fontSize: 11, fill: t.tick }} stroke={t.ref}
          label={{ value: "Physical Progress (%)", position: "bottom", offset: 4, fontSize: 11, fill: t.label }}
        />
        <YAxis
          type="number" dataKey="y" name="Overall Risk" domain={[0, 100]} tick={{ fontSize: 11, fill: t.tick }} stroke={t.ref}
          label={{ value: "Overall Risk Score", angle: -90, position: "left", offset: -2, fontSize: 11, fill: t.label }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: t.ref }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const p = payload[0].payload;
            return (
              <div className={cn("rounded-md border px-3 py-2 text-xs shadow-hover", dark ? "border-white/10 bg-[#0B1120] text-slate-200" : "border-ink-200 bg-white")}>
                <div className="font-medium">{p.name}</div>
                <div className={cn("mt-1", dark ? "text-slate-400" : "text-ink-500")}>
                  Progress {p.x}% · Overall Risk {p.y} ({p.level})
                </div>
              </div>
            );
          }}
        />
        <Scatter data={points} isAnimationActive animationDuration={600}>
          {points.map((p) => (
            <Cell key={p.code} fill={riskHex[theme][p.level]} fillOpacity={0.85} stroke={t.stroke} strokeWidth={1.5} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
