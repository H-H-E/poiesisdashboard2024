import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { ThemeToggle } from "./ThemeToggle"
import { Badge } from "./ui/badge"
import { LogOut, User, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { supabase } from "@/integrations/supabase/client"
import { adminNavItems, studentNavItems, parentNavItems } from "@/config/navigation"
import type { NavItem } from "@/config/navigation"

export function SidebarContent() {
  const location = useLocation()
  const pathname = location.pathname
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [userType, setUserType] = useState<string>("student")
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [firstName, setFirstName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

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
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <h2 className="text-base font-semibold tracking-tight">Poiesis</h2>
      </div>
      <ScrollArea className="flex-1 px-2">
        <nav className="flex flex-col gap-1">
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
                        className="w-full justify-start gap-2 px-2"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                        <ChevronDown className="ml-auto h-3 w-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-2 mt-1 flex flex-col gap-1">
                      {item.subItems.map((subItem) => (
                        <Button
                          key={subItem.href}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start px-2 text-sm",
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
                      "w-full justify-start gap-2 px-2",
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
      <div className="border-t p-4">
        <div className="flex flex-col gap-3">
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
            <ThemeToggle />
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
        </div>
      </div>
    </div>
  )
}