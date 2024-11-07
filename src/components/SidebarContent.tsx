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
import { useSidebar } from "./ui/sidebar"
import { cn } from "@/lib/utils"
import { NavLinks } from "./sidebar/NavLinks"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className }: SidebarProps) {
  const { signOut, user } = useAuth()
  const { setTheme, theme } = useTheme()
  const [userType, setUserType] = useState<string>("student")
  const [firstName, setFirstName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isOpen } = useSidebar()

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
    <div className={cn(
      "flex h-full flex-col transition-transform",
      !isOpen && "-translate-x-full",
      className
    )}>
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Poiesis</h2>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <NavLinks 
          navItems={navItems} 
          userType={userType} 
          onWhiteboardOpen={handleWhiteboardOpen} 
        />
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {firstName || "User"}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline"
            className="w-fit text-xs capitalize"
          >
            {userType}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  )
}