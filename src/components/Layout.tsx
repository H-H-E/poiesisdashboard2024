import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
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
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block w-64 border-r" />
        
        <div className="flex-1">
          {/* Mobile Navigation */}
          <div className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
            <MobileNav />
          </div>
          
          {/* Main Content */}
          <main className={cn("p-4 md:p-8", className)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}