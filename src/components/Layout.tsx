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

      <aside className="hidden w-[240px] md:block">
        <div className="fixed inset-y-0 w-[240px] border-r">
          <SidebarContent />
        </div>
      </aside>

      <main className={cn("flex-1 md:pl-[240px]", className)}>
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  )
}