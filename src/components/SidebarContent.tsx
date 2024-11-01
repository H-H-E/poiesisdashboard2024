import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, LogOut, User, ExternalLink, Moon, Sun } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "next-themes"
import { supabase } from "@/integrations/supabase/client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { adminNavItems, studentNavItems, parentNavItems } from "@/config/navigation"
import { format } from "date-fns"
import type { NavItem } from "@/config/navigation"
import { useToast } from "@/components/ui/use-toast"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className }: SidebarProps) {
  const { signOut, user } = useAuth()
  const { setTheme, theme } = useTheme()
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

        // Check if we got any profiles back
        if (profiles && profiles.length > 0) {
          const profile = profiles[0]
          setUserType(profile.user_type)
          setFirstName(profile.first_name || "")
        } else {
          // Handle case where no profile is found
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
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">Poiesis</h2>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {navItems.map((item: NavItem) => {
            if (item.adminOnly && userType !== "admin") {
              return null
            }

            return (
              <div key={item.href}>
                {item.subItems ? (
                  <Collapsible
                    open={openItem === item.href}
                    onOpenChange={() => setOpenItem(openItem === item.href ? null : item.href)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                        <ChevronDown className="ml-auto h-3 w-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Button
                          key={subItem.href}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link to={subItem.href}>{subItem.title}</Link>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </Button>
                )}
              </div>
            )
          })}

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 mt-2"
            onClick={handleWhiteboardOpen}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm">Today's Whiteboard</span>
          </Button>
        </div>
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