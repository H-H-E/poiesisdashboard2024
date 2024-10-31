"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_COLLAPSED = "4rem"
const SIDEBAR_COOKIE_NAME = "sidebar-state"

interface SidebarContextValue {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SidebarProvider({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  ...props
}: SidebarProviderProps) {
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
  )

  return (
    <SidebarContext.Provider value={value}>
      <div {...props}>{children}</div>
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "collapsed"
}

export function Sidebar({ className, variant, ...props }: SidebarProps) {
  return (
    <aside className={cn(sidebarVariants({ variant }), className)} {...props} />
  )
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-auto border-t p-4", className)} {...props} />
  )
}

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />
}

export function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

export function SidebarMenuButton({
  className,
  isActive,
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean
  asChild?: boolean
}) {
  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export function SidebarMenuSub({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pl-6 pt-1", className)} {...props} />
}

export function SidebarMenuSubItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

export function SidebarMenuSubButton({
  className,
  isActive,
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean
  asChild?: boolean
}) {
  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    />
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