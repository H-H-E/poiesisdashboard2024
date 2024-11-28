import { usePermissions } from "@/contexts/PermissionsContext"
import { Navigate } from "react-router-dom"

interface RequirePermissionProps {
  permission: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RequirePermission({ permission, children, fallback }: RequirePermissionProps) {
  const { hasPermission, isLoading } = usePermissions()

  if (isLoading) {
    return null
  }

  if (!hasPermission(permission)) {
    return fallback ? <>{fallback}</> : <Navigate to="/" replace />
  }

  return <>{children}</>
}