import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { adminNavItems, studentNavItems, parentNavItems } from "@/config/navigation"
import { useToast } from "@/hooks/use-toast"
import { NavigationSection } from "./sidebar/NavigationSection"
import { UserSection } from "./sidebar/UserSection"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className }: SidebarProps) {
  const { signOut, user } = useAuth()
  const [userType, setUserType] = useState<string>("student")
  const [firstName, setFirstName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [openItem, setOpenItem] = useState<string | null>(null)
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

  if (isLoading) {
    return null
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Poiesis</h2>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <NavigationSection
          navItems={navItems}
          openItem={openItem}
          setOpenItem={setOpenItem}
          userType={userType}
        />
      </ScrollArea>

      <UserSection
        firstName={firstName}
        userType={userType}
        onLogout={handleLogout}
      />
    </div>
  )
}