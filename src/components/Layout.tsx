import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { SidebarContent } from "./SidebarContent"
import { Outlet } from "react-router-dom"

interface LayoutProps {
  className?: string
}

export default function Layout({ className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
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

      <aside className="hidden w-[240px] md:block">
        <div className="fixed inset-y-0 z-20 w-[240px] border-r bg-background">
          <SidebarContent />
        </div>
      </aside>

      <main className={cn(
        "min-h-screen",
        "px-4 py-4 md:px-8 md:py-8",
        "md:ml-[240px]",
        className
      )}>
        <Outlet />
      </main>
    </div>
  )
}