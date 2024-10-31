import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, GraduationCap, Home, Users, Award } from "lucide-react"
import { NavLink } from "react-router-dom"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Poiesis</h2>
          <div className="space-y-1">
            <NavLink to="/" className={({ isActive }) => 
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "text-primary bg-accent" : "text-muted-foreground"
              )
            }>
              <Home className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink to="/pathways" className={({ isActive }) => 
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "text-primary bg-accent" : "text-muted-foreground"
              )
            }>
              <Book className="h-4 w-4" />
              Pathways
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => 
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "text-primary bg-accent" : "text-muted-foreground"
              )
            }>
              <GraduationCap className="h-4 w-4" />
              Projects
            </NavLink>
            <NavLink to="/users" className={({ isActive }) => 
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "text-primary bg-accent" : "text-muted-foreground"
              )
            }>
              <Users className="h-4 w-4" />
              Users
            </NavLink>
            <NavLink to="/points" className={({ isActive }) => 
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "text-primary bg-accent" : "text-muted-foreground"
              )
            }>
              <Award className="h-4 w-4" />
              Points
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}