import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/config/navigation"

interface NavigationItemsProps {
  items: NavItem[]
  isCollapsed: boolean
}

export function NavigationItems({ items, isCollapsed }: NavigationItemsProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) => 
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isActive ? "text-primary bg-accent" : "text-muted-foreground",
              isCollapsed && "justify-center px-2"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {!isCollapsed && <span>{item.title}</span>}
        </NavLink>
      ))}
    </div>
  )
}