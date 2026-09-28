"use client";

import { useRouter } from "next/navigation";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea, Cell,
} from "recharts";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { chartTheme, riskHex, type ChartTheme } from "@/lib/chartTheme";
import { cn } from "@/lib/utils";
import type { ProjectWithRisk } from "@/types/project";

/**
 * Cost Risk (x) × Delay Risk (y). Colors = backend overall risk level; point size = backend
 * overall risk score. The shaded quadrant is visual guidance only — no risk is calculated here.
 */
export function RiskMatrix({
  rows,
  theme = "light",
  height = 340,
}: {
  rows: ProjectWithRisk[];
  theme?: ChartTheme;
  height?: number;
}) {
  const router = useRouter();
  const t = chartTheme[theme];
  const dark = theme === "dark";

  const points = rows.map(({ project, risk }) => ({
    x: risk.costRiskScore,
    y: risk.delayRiskScore,
    z: risk.overallRiskScore,
    name: project.projectName,
    code: project.projectCode,
    costLevel: risk.costRiskLevel,
    delayLevel: risk.delayRiskLevel,
    overallLevel: risk.overallRiskLevel,
    overallScore: risk.overallRiskScore,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 8, right: 20, bottom: 26, left: 6 }}>
        <ReferenceArea
          x1={50} x2={100} y1={50} y2={100}
          fill={t.quadrant} fillOpacity={t.quadrantOpacity} ifOverflow="hidden"
          label={{ value: "High cost + high delay", position: "insideTopRight", fontSize: 11, fill: t.label }}
        />
        <CartesianGrid stroke={t.grid} strokeDasharray="3 3" />
        <XAxis
          type="number" dataKey="x" name="Cost Risk" domain={[0, 100]} tickCount={6}
          tick={{ fontSize: 11, fill: t.tick }} stroke={t.ref}
          label={{ value: "Cost Risk Score", position: "bottom", offset: 6, fontSize: 12, fill: t.label }}
        />
        <YAxis
          type="number" dataKey="y" name="Delay Risk" domain={[0, 100]} tickCount={6}
          tick={{ fontSize: 11, fill: t.tick }} stroke={t.ref}
          label={{ value: "Delay Risk Score", angle: -90, position: "left", offset: -2, fontSize: 12, fill: t.label }}
        />
        <ZAxis type="number" dataKey="z" domain={[0, 100]} range={[90, 280]} />
        <ReferenceLine x={50} stroke={t.ref} strokeDasharray="4 4" />
        <ReferenceLine y={50} stroke={t.ref} strokeDasharray="4 4" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: t.ref }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const p = payload[0].payload;
            return (
              <div
                className={cn(
                  "min-w-[200px] rounded-md border px-3.5 py-3 text-xs shadow-hover",
                  dark ? "border-white/10 bg-[#0B1120] text-slate-200" : "border-ink-200 bg-white"
                )}
              >
                <div className={cn("mb-0.5 font-medium", dark ? "text-white" : "text-ink-900")}>{p.name}</div>
                <div className={cn("mb-2", dark ? "text-slate-500" : "text-ink-400")}>{p.code}</div>
                <div className="space-y-1.5">
                  {[
                    ["Cost Risk", p.x, p.costLevel],
                    ["Delay Risk", p.y, p.delayLevel],
                  ].map(([label, score, level]) => (
                    <div key={label as string} className="flex items-center justify-between gap-3">
                      <span className={dark ? "text-slate-400" : "text-ink-500"}>{label}</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        {score} <RiskBadge level={level as "High" | "Medium" | "Low"} dark={dark} />
                      </span>
                    </div>
                  ))}
                  <div className={cn("flex items-center justify-between gap-3 border-t pt-1.5", dark ? "border-white/10" : "border-ink-100")}>
                    <span className={dark ? "text-slate-400" : "text-ink-500"}>Overall Risk</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      {p.overallScore} <RiskBadge level={p.overallLevel} dark={dark} />
                    </span>
                  </div>
                </div>
                <div className={cn("mt-2 text-[11px]", dark ? "text-slate-500" : "text-ink-400")}>Click point to open project</div>
              </div>
            );
          }}
        />
        <Scatter
          data={points}
          isAnimationActive
          animationDuration={700}
          animationEasing="ease-out"
          className="cursor-pointer"
          onClick={(d: any) => {
            const code = d?.payload?.code ?? d?.code;
            if (code) router.push(`/projects/${code}`);
          }}
        >
          {points.map((p) => (
            <Cell key={p.code} fill={riskHex[theme][p.overallLevel]} fillOpacity={0.85} stroke={t.stroke} strokeWidth={1.5} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
