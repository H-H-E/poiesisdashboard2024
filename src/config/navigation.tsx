import { Book, Calendar, GraduationCap, Home, LayoutDashboard, Settings, Users, List } from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  adminOnly?: boolean
  subItems?: { title: string; href: string }[]
}

export const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Users", href: "/users", icon: Users, adminOnly: true },
  {
    title: "Educational Content",
    href: "/content",
    icon: Book,
    subItems: [
      { title: "Standards", href: "/standards" },
      { title: "Pathways", href: "/pathways" },
      { title: "Projects", href: "/projects" },
      { title: "Plenaries", href: "/plenaries" },
    ],
  },
  { title: "Calendar", href: "/calendar", icon: Calendar },
]

export const studentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "My Pathways", href: "/pathways", icon: GraduationCap },
  { title: "My Projects", href: "/projects", icon: Book },
  { title: "My Plenaries", href: "/plenaries", icon: LayoutDashboard },
]

export const parentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Child's Progress", href: "/progress", icon: GraduationCap },
  { title: "Settings", href: "/settings", icon: Settings },
]