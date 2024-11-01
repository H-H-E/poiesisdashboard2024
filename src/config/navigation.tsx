import { Book, Calendar, ChevronDown, GraduationCap, Home, LayoutDashboard, Settings, Users } from "lucide-react"

export type NavItem = {
  title: string
  href: string
  icon: any
  adminOnly?: boolean
  subItems?: { title: string; href: string }[]
}

export const navigationItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Pathways", href: "/pathways", icon: GraduationCap },
  { title: "Projects", href: "/projects", icon: Book },
  { 
    title: "Users", 
    href: "/users", 
    icon: Users,
    adminOnly: true,
    subItems: [
      { title: "All Users", href: "/users" },
      { title: "Parent-Student Links", href: "/users?tab=relationships" }
    ]
  },
  { title: "Points", href: "/points", icon: Settings }
]