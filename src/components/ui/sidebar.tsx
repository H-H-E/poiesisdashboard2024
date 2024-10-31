import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

// Types
type CollapsibleType = "offcanvas" | "icon" | "none"

interface SidebarContextValue {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "collapsed"
  collapsible?: CollapsibleType
}

// Context
const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

// Provider Component
export function SidebarProvider({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  ...props
}: {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
} & React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [openMobile, setOpenMobile] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    if (openProp === undefined) {
      setOpen((prev) => !prev)
    } else {
      onOpenChangeProp?.(!openProp)
    }
  }, [openProp, onOpenChangeProp])

  const value = React.useMemo(
    () => ({
      state: open ? "expanded" : "collapsed",
      open: openProp ?? open,
      setOpen: (value: boolean) => {
        if (openProp === undefined) {
          setOpen(value)
        } else {
          onOpenChangeProp?.(value)
        }
      },
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [open, openProp, onOpenChangeProp, openMobile, toggleSidebar]
  ) as SidebarContextValue

  return (
    <SidebarContext.Provider value={value}>
      <div {...props}>{children}</div>
    </SidebarContext.Provider>
  )
}

// Hook
export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Variants
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

// Components
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

// Re-export all components
export * from "./sidebar-components"