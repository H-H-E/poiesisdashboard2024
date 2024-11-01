import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { adminNavItems, studentNavItems, parentNavItems } from "@/config/navigation"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NavigationItems } from "./sidebar/NavigationItems"
import { SidebarHeader } from "./sidebar/SidebarHeader"
import { SidebarFooter } from "./sidebar/SidebarFooter"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function SidebarContent({ 
  isCollapsed = false, 
  onToggleCollapse = () => {}, 
}: SidebarProps) {
  const { signOut, user } = useAuth()
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
      <SidebarHeader 
        isCollapsed={isCollapsed} 
        onToggleCollapse={onToggleCollapse} 
      />
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          <NavigationItems items={navItems} isCollapsed={isCollapsed} />

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-2 mt-2",
              isCollapsed && "justify-center px-2"
            )}
            onClick={handleWhiteboardOpen}
          >
            <ExternalLink className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm">Today's Whiteboard</span>}
          </Button>
        </div>
      </ScrollArea>

      <SidebarFooter 
        firstName={firstName}
        userType={userType}
        isCollapsed={isCollapsed}
        onLogout={handleLogout}
      />
    </div>
  )
}