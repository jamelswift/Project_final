"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Notification } from "@/types/database"

interface AlertToastProps {
  notification: Notification
}

export function AlertToast({ notification }: AlertToastProps) {
  const { toast } = useToast()

  useEffect(() => {
    toast({
      title:
        notification.severity === "critical"
          ? "Critical Alert"
          : notification.severity === "warning"
            ? "Warning"
            : "Info",
      description: notification.message,
      variant: notification.severity === "critical" ? "destructive" : "default",
    })
  }, [notification, toast])

  return null
}
