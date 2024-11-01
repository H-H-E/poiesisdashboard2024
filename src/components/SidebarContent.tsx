import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, LogOut, User } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { adminNavItems, studentNavItems, parentNavItems } from "@/config/navigation"
import type { NavItem } from "@/config/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className }: SidebarProps) {
  const { signOut, user } = useAuth()
  const [userType, setUserType] = useState<string>("student")
  const [firstName, setFirstName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [openItem, setOpenItem] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.id) {
        setIsLoading(false)
        return
      }
      
      try {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("user_type, first_name")
          .eq("id", user.id)
          .single()

        if (profile) {
          setUserType(profile.user_type)
          setFirstName(profile.first_name || "")
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user?.id])

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
    await signOut()
    navigate("/login")
  }

  const getRoleBadgeVariant = (type: string = "student") => {
    switch (type) {
      case "admin":
        return "default"
      case "student":
        return "secondary"
      case "parent":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return <div className="p-3">Loading...</div>
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="p-3">
        <h2 className="text-base font-semibold tracking-tight">Poiesis</h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <nav className="flex flex-col gap-1 py-1">
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
                        className="h-8 w-full justify-start gap-2 px-2"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                        <ChevronDown className="ml-auto h-3 w-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-2 flex flex-col gap-1 py-1">
                      {item.subItems.map((subItem) => (
                        <Button
                          key={subItem.href}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-7 w-full justify-start px-2 text-sm",
                            pathname === subItem.href && "bg-accent"
                          )}
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
                    className={cn(
                      "h-8 w-full justify-start gap-2 px-2",
                      pathname === item.href && "bg-accent"
                    )}
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
        </nav>
      </ScrollArea>
      <div className="border-t p-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {firstName || "User"}
              </span>
            </div>
            <Badge 
              variant={getRoleBadgeVariant(userType)}
              className="capitalize w-fit text-xs"
            >
              {userType}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-7 w-7"
            >
              <LogOut className="h-3 w-3" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}