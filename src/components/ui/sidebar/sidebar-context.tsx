import * as React from "react"
import { SidebarContextValue } from "./types"

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
  ) as SidebarContextValue

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