import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export function Layout({ children, className }: LayoutProps) {
  const { user } = useAuth()
  const userRole = user?.role || "student"

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar className="w-64 border-r" />
        <main className={cn("flex-1 p-8", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}