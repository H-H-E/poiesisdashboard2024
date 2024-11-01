import { Home, LayoutDashboard, Users } from "lucide-react"

export const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Pathways",
    href: "/pathways",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    adminOnly: true,
    subItems: [
      {
        title: "All Users",
        href: "/users",
      },
      {
        title: "Add User",
        href: "/users/new",
      },
    ],
  },
  {
    title: "Points",
    href: "/points",
    icon: LayoutDashboard,
  },
]