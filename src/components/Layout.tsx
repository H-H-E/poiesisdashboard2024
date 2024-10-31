import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"

interface LayoutProps {
  children: React.ReactNode
  userRole: "admin" | "student" | "parent"
  onLogout: () => void
  className?: string
}

export function Layout({ children, userRole, onLogout, className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onLogout={onLogout} />
      <div className="flex">
        <Sidebar className="w-64 border-r" />
        <main className={cn("flex-1 p-8", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}