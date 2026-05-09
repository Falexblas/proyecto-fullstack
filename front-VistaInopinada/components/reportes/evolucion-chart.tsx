"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export interface EvolucionChartData {
  mes: string
  cumplimiento: number
}

const defaultData: EvolucionChartData[] = [
  { mes: "Ene", cumplimiento: 78 },
  { mes: "Feb", cumplimiento: 82 },
  { mes: "Mar", cumplimiento: 79 },
  { mes: "Abr", cumplimiento: 85 },
  { mes: "May", cumplimiento: 88 },
  { mes: "Jun", cumplimiento: 87 },
]

export function EvolucionChart({ data = defaultData }: { data?: EvolucionChartData[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCumplimiento" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="mes" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[70, 100]}
            tickFormatter={(value) => `${value}%`}
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
          <Area 
            type="monotone" 
            dataKey="cumplimiento" 
            stroke="hsl(var(--primary))" 
            fillOpacity={1}
            fill="url(#colorCumplimiento)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
