import { useState } from "react"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { SidebarContent } from "./SidebarContent"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export function Layout({ children, className }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <aside className={cn(
        "hidden md:block",
        isCollapsed ? "w-[80px]" : "w-[240px]",
        "transition-all duration-300"
      )}>
        <div className={cn(
          "fixed inset-y-0 z-20 border-r bg-background",
          isCollapsed ? "w-[80px]" : "w-[240px]",
          "transition-all duration-300"
        )}>
          <SidebarContent 
            isCollapsed={isCollapsed} 
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
          />
        </div>
      </aside>

      <main className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "md:ml-[80px]" : "md:ml-[240px]",
        className
      )}>
        <div className="px-2">
          {children}
        </div>
      </main>
    </div>
  )
}