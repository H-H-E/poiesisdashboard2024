import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSidebar } from "./sidebar-context"
import { SidebarProps } from "./types"

const sidebarVariants = cva(
  "relative h-screen border-r bg-background transition-all duration-300",
  {
    variants: {
      variant: {
        default: "w-64",
        collapsed: "w-16",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function Sidebar({ className, variant, collapsible = "none", ...props }: SidebarProps) {
  const { state } = useSidebar()
  
  return (
    <aside 
      className={cn(
        sidebarVariants({ variant }), 
        collapsible === "icon" && "w-64 data-[state=collapsed]:w-16",
        className
      )} 
      data-state={state}
      {...props} 
    />
  )
}

export function MobileSidebar({ className }: { className?: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("md:hidden", className)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px]">
        <Sidebar className="border-none" />
      </SheetContent>
    </Sheet>
  )
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      className={cn("", className)}
      onClick={toggleSidebar}
      {...props}
    />
  )
}

export * from "./sidebar-components"
export * from "./sidebar-context"
export * from "./types"