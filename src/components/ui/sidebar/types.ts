export type SidebarState = "expanded" | "collapsed"

export interface SidebarContextValue {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}

export type CollapsibleType = "offcanvas" | "icon" | "none"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "collapsed"
  collapsible?: CollapsibleType
}