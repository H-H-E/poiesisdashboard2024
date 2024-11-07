import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, ExternalLink, Moon, Sun } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "next-themes"
import { supabase } from "@/integrations/supabase/client"
import { adminNavItems, studentNavItems, parentNavItems } from "@/config/navigation"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { NavLinks } from "./sidebar/NavLinks"
import { UserSection } from "./sidebar/UserSection"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
}

export function SidebarContent({ className, isCollapsed = false }: SidebarProps) {
  const { signOut, user } = useAuth()
  const { setTheme, theme } = useTheme()
  const [userType, setUserType] = useState<string>("student")
  const [firstName, setFirstName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.id) {
        setIsLoading(false)
        return
      }
      
      try {
        const { data: profiles, error } = await supabase
          .from("user_profiles")
          .select("user_type, first_name")
          .eq("id", user.id)

        if (error) throw error

        if (profiles && profiles.length > 0) {
          const profile = profiles[0]
          setUserType(profile.user_type)
          setFirstName(profile.first_name || "")
        } else {
          toast({
            title: "Profile not found",
            description: "Your user profile could not be found.",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user?.id, toast])

  const navItems = (() => {
    switch (userType) {
      case "admin":
        return adminNavItems
      case "parent":
        return parentNavItems
      default:
        return studentNavItems
    }
  })()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate("/login")
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleWhiteboardOpen = () => {
    const year = new Date().getFullYear()
    const date = format(new Date(), `MMMMdo'${year}'`)
    window.open(`https://draw.poiesis.education/multiplayer/${date}`, '_blank')
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="flex h-full flex-col">
      <div className={cn(
        "border-b px-4 py-3",
        isCollapsed && "px-2"
      )}>
        <h2 className={cn(
          "text-lg font-semibold",
          isCollapsed && "text-center text-sm"
        )}>
          {isCollapsed ? "P" : "Poiesis"}
        </h2>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <NavLinks 
          navItems={navItems}
          userType={userType}
          isCollapsed={isCollapsed}
          onWhiteboardOpen={handleWhiteboardOpen}
        />
      </ScrollArea>

      <UserSection
        firstName={firstName}
        userType={userType}
        theme={theme}
        setTheme={setTheme}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
      />
    </div>
  )
}