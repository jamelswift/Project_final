import type React from "react"
import type { User } from "@/types/database"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

interface RoleGuardProps {
  user: User
  allowedRoles: Array<"admin" | "operator" | "viewer">
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ user, allowedRoles, children, fallback }: RoleGuardProps) {
  if (!allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to access this feature.</AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
