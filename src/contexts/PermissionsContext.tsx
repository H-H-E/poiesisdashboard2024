import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { supabase } from "@/integrations/supabase/client"

type Permission = string

interface PermissionsContextType {
  permissions: Permission[]
  isLoading: boolean
  hasPermission: (permission: Permission) => boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPermissions() {
      if (!user?.id) {
        setPermissions([])
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('user_permissions')
          .select('permission')
          .eq('user_id', user.id)

        if (error) throw error

        setPermissions(data.map(p => p.permission))
      } catch (error) {
        console.error('Error loading permissions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPermissions()
  }, [user?.id])

  const hasPermission = (permission: Permission) => {
    return permissions.includes(permission)
  }

  return (
    <PermissionsContext.Provider value={{ permissions, isLoading, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}