import { SidebarProvider, SidebarTrigger, SidebarMobile } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <SidebarMobile>
          <DashboardSidebar />
        </SidebarMobile>

        <div className="flex-1">
          <header className="flex h-16 items-center border-b px-6">
            <SidebarTrigger />
          </header>
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}