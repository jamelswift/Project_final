"use client"

import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/database"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getSeverityIcon = () => {
    switch (notification.severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getSeverityColor = () => {
    switch (notification.severity) {
      case "critical":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      default:
        return "border-l-blue-500"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 border-l-4 p-4 hover:bg-muted/50 transition-colors",
        getSeverityColor(),
        !notification.is_read && "bg-muted/30",
      )}
    >
      <div className="mt-0.5">{getSeverityIcon()}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm leading-relaxed">{notification.message}</p>
        <p className="text-xs text-muted-foreground">{formatTime(notification.created_at)}</p>
      </div>
      {!notification.is_read && (
        <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)}>
          Mark read
        </Button>
      )}
    </div>
  )
}
