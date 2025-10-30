"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { NotificationItem } from "./notification-item"
import type { Notification } from "@/types/database"

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClearAll: () => void
}

export function NotificationList({ notifications, onMarkAsRead, onMarkAllAsRead, onClearAll }: NotificationListProps) {
  const hasUnread = notifications.some((n) => !n.is_read)

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex gap-2">
          {hasUnread && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Clear all
            </Button>
          )}
        </div>
      </div>
      <Separator />
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">No notifications</div>
      ) : (
        <ScrollArea className="h-96">
          <div className="flex flex-col">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
