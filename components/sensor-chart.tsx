"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SensorChartProps {
  title: string
  data: Array<{ timestamp: string; value: number }>
  unit: string
  color?: string
}

export function SensorChart({ title, data, unit, color = "hsl(var(--primary))" }: SensorChartProps) {
  const chartData = data.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    value: reading.value,
  }))

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-medium text-card-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} unit={unit} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--popover-foreground))",
            }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
