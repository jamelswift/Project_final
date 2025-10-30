"use client"

import type { Actuator } from "@/types/database"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Lightbulb, Fan, Cog, Droplet, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActuatorCardProps {
  actuator: Actuator
  onToggle: (actuatorId: string) => void
}

const actuatorIcons = {
  switch: Lightbulb,
  motor: Cog,
  valve: Droplet,
  relay: Zap,
  dimmer: Lightbulb,
}

export function ActuatorCard({ actuator, onToggle }: ActuatorCardProps) {
  const Icon = actuator.name.includes("Fan") ? Fan : actuatorIcons[actuator.type]

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-2 rounded-lg transition-colors",
              actuator.state ? "bg-accent text-accent-foreground" : "bg-muted",
            )}
          >
            <Icon className={cn("h-5 w-5", actuator.state ? "text-accent-foreground" : "text-muted-foreground")} />
          </div>
          <div>
            <h3 className="font-medium text-sm text-card-foreground">{actuator.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{actuator.type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge
            variant={actuator.status === "active" ? "default" : "secondary"}
            className={cn("text-xs", actuator.status === "active" && "bg-accent text-accent-foreground")}
          >
            {actuator.status}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {actuator.protocol.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">State:</span>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium", actuator.state ? "text-accent" : "text-muted-foreground")}>
              {actuator.state ? "ON" : "OFF"}
            </span>
            <Switch
              checked={actuator.state}
              onCheckedChange={() => onToggle(actuator.id)}
              disabled={actuator.status !== "active"}
            />
          </div>
        </div>
        {actuator.location && <p className="text-xs text-muted-foreground">Location: {actuator.location}</p>}
        {(actuator.type === "dimmer" || actuator.type === "motor") && actuator.state && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Value:</span>
            <span className="text-xs font-medium">{actuator.value}%</span>
          </div>
        )}
      </div>
    </Card>
  )
}
