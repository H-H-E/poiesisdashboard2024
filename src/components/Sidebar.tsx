import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, GraduationCap, Home, Users, Award, LogOut } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

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
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 px-3 text-sm text-muted-foreground hover:bg-accent hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}