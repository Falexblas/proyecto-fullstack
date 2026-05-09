"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export interface CumplimientoChartData {
  area: string
  porcentajeCumplimiento: number
}

const defaultData: CumplimientoChartData[] = [
  { area: "Control Docente", porcentajeCumplimiento: 92 },
  { area: "Material Virtual", porcentajeCumplimiento: 78 },
  { area: "Asistencia", porcentajeCumplimiento: 95 },
  { area: "Avance Silabico", porcentajeCumplimiento: 85 },
  { area: "Guia Practica", porcentajeCumplimiento: 82 },
]

export function CumplimientoChart({ data = defaultData }: { data?: CumplimientoChartData[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis 
            type="number" 
            domain={[0, 100]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="area"
            type="category"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px"
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value) => [`${value}%`, "Cumplimiento"]}
          />
          <Bar 
            dataKey="porcentajeCumplimiento" 
            fill="hsl(var(--primary))" 
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
