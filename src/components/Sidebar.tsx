import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Book, GraduationCap, Home, Users, Award, LogOut } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    async function checkUserType() {
      if (!user?.id) return
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      setIsAdmin(profile?.user_type === 'admin')
    }

    checkUserType()
  }, [user?.id])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className={cn("flex flex-col min-h-screen", className)}>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Poiesis
        </h2>
      </div>

      <div className="flex-1 px-3">
        <div className="space-y-1">
          <NavLink to="/" end className={({ isActive }) => 
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
          {isAdmin && (
            <NavLink to="/users" className={({ isActive }) => 
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive ? "text-primary bg-accent" : "text-muted-foreground"
              )
            }>
              <Users className="h-4 w-4" />
              Users
            </NavLink>
          )}
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

      <div className="sticky bottom-0 border-t bg-background p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}