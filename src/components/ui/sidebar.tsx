"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronRight } from "lucide-react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SIDEBAR_CONTENT_PADDING = "p-2"

interface SidebarContextValue {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextValue>({
  expanded: true,
  setExpanded: () => {},
  isMobile: false,
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      setExpanded(window.innerWidth >= 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded, isMobile } = React.useContext(SidebarContext)

  return (
    <aside
      className={cn(
        "relative h-screen border-r bg-background transition-all duration-300",
        expanded ? "w-64" : "w-16",
        isMobile && !expanded && "w-0",
        className
      )}
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header className={cn("border-b", className)}>
      {children}
    </header>
  )
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("overflow-y-auto", SIDEBAR_CONTENT_PADDING, className)}>
      {children}
    </div>
  )
}

export function SidebarFooter({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer className={cn("mt-auto border-t", SIDEBAR_CONTENT_PADDING, className)}>
      {children}
    </footer>
  )
}

export function SidebarTrigger({ className }: React.HTMLAttributes<HTMLButtonElement>) {
  const { expanded, setExpanded } = React.useContext(SidebarContext)

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("shrink-0", className)}
      onClick={() => setExpanded(!expanded)}
    >
      <ChevronRight className={cn(
        "h-4 w-4 transition-transform",
        expanded && "rotate-180"
      )} />
    </Button>
  )
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center", className)}>
      {children}
    </div>
  )
}

const sidebarMenuButtonVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 w-full justify-start",
  {
    variants: {
      variant: {
        default: "",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "ghost",
    },
  }
)

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "ghost"
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, variant, ...props }, ref) => {
    const { expanded } = React.useContext(SidebarContext)

    return (
      <button
        ref={ref}
        className={cn(sidebarMenuButtonVariants({ variant }), 
          !expanded && "justify-center px-2",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"