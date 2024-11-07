import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { SidebarContent } from "./SidebarContent"
import { Outlet } from "react-router-dom"
import { useState } from "react"

interface LayoutProps {
  className?: string
}

export default function Layout({ className }: LayoutProps) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 md:hidden z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:block",
        isDesktopSidebarOpen ? "w-[240px]" : "w-[60px]",
        "transition-all duration-300"
      )}>
        <div className={cn(
          "fixed inset-y-0 z-20 border-r bg-background",
          isDesktopSidebarOpen ? "w-[240px]" : "w-[60px]",
          "transition-all duration-300"
        )}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-4 z-50"
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <SidebarContent isCollapsed={!isDesktopSidebarOpen} />
        </div>
      </aside>

      <main className={cn(
        "min-h-screen",
        "px-4 py-4 md:px-8 md:py-8",
        "transition-all duration-300",
        isDesktopSidebarOpen ? "md:ml-[240px]" : "md:ml-[60px]",
        className
      )}>
        <Outlet />
      </main>
    </div>
  )
}