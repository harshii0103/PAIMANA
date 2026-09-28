"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { chartTheme, riskHex, type ChartTheme } from "@/lib/chartTheme";
import type { SectorRisk } from "@/types/risk";

export function SectorRiskBars({
  data,
  theme = "light",
  height = 240,
}: {
  data: SectorRisk[];
  theme?: ChartTheme;
  height?: number;
}) {
  const t = chartTheme[theme];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 12, top: 4, bottom: 0 }}>
        <CartesianGrid stroke={t.grid} horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: t.tick }} stroke={t.ref} />
        <YAxis type="category" dataKey="sector" width={112} tick={{ fontSize: 11, fill: t.label }} stroke={t.ref} />
        <Tooltip
          cursor={{ fill: theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)" }}
          contentStyle={{
            borderRadius: 6, fontSize: 12,
            border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid #E2E8F0",
            background: theme === "dark" ? "#0B1120" : "#fff", color: theme === "dark" ? "#E2E8F0" : "#0F172A",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: t.label }} />
        <Bar dataKey="highRisk" name="High" stackId="a" fill={riskHex[theme].High} isAnimationActive animationDuration={600} />
        <Bar dataKey="mediumRisk" name="Medium" stackId="a" fill={riskHex[theme].Medium} isAnimationActive animationDuration={600} />
        <Bar dataKey="lowRisk" name="Low" stackId="a" fill={riskHex[theme].Low} isAnimationActive animationDuration={600} />
      </BarChart>
    </ResponsiveContainer>
  );
}
