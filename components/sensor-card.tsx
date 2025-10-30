"use client"

import type { Sensor } from "@/types/database"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Gauge, Activity, Sun, Wind } from "lucide-react"
import { cn } from "@/lib/utils"

interface SensorCardProps {
  sensor: Sensor
  currentValue?: number
  lastUpdate?: Date
}

const sensorIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  pressure: Gauge,
  motion: Activity,
  light: Sun,
  air_quality: Wind,
}

export function SensorCard({ sensor, currentValue, lastUpdate }: SensorCardProps) {
  const Icon = sensorIcons[sensor.type]

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm text-card-foreground">{sensor.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{sensor.type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge
            variant={sensor.status === "active" ? "default" : "secondary"}
            className={cn("text-xs", sensor.status === "active" && "bg-accent text-accent-foreground")}
          >
            {sensor.status}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {sensor.protocol.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-card-foreground">
            {currentValue !== undefined ? currentValue.toFixed(1) : "--"}
          </span>
          <span className="text-sm text-muted-foreground">{sensor.unit}</span>
        </div>
        {sensor.location && <p className="text-xs text-muted-foreground">Location: {sensor.location}</p>}
        <p className="text-xs text-muted-foreground">
          Last update: {lastUpdate ? lastUpdate.toLocaleTimeString() : "N/A"}
        </p>
      </div>
    </Card>
  )
}
