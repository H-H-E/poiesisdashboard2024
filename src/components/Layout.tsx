import { cn } from "@/lib/utils"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarContent } from "./SidebarContent"
import { Outlet } from "react-router-dom"

interface LayoutProps {
  className?: string
}

export default function Layout({ className }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <aside className="fixed inset-y-0 z-20 w-[240px] border-r bg-background transition-transform">
          <SidebarContent />
        </aside>

        <main className={cn(
          "min-h-screen",
          "px-4 py-4 md:px-8 md:py-8",
          "md:ml-[240px]",
          "transition-[margin]",
          className
        )}>
          <SidebarTrigger className="fixed top-4 left-4 z-50" />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}