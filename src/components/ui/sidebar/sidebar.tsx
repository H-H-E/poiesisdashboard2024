import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

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

type CollapsibleType = "offcanvas" | "icon" | "none"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "collapsed"
  collapsible?: CollapsibleType
}

export function Sidebar({ className, variant, collapsible = "none", ...props }: SidebarProps) {
  const { state } = useSidebar()
  
  return (
    <aside 
      className={cn(
        sidebarVariants({ variant }), 
        collapsible === "icon" && "w-64 data-[state=collapsed]:w-16",
        "hidden md:block", // Hide on mobile, show on md and up
        className
      )} 
      data-state={state}
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