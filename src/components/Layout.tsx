"use client"

import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { ChevronDown, Home, LayoutDashboard, LogOut, Menu, Settings, User, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { ThemeToggle } from "./ThemeToggle"
import { ScrollArea } from "./ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Badge } from "./ui/badge"
import { supabase } from "@/integrations/supabase/client"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Pathways",
    href: "/pathways",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    adminOnly: true,
    subItems: [
      {
        title: "All Users",
        href: "/users",
      },
      {
        title: "Add User",
        href: "/users/new",
      },
    ],
  },
  {
    title: "Points",
    href: "/points",
    icon: Settings,
  },
]

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

function SidebarContent() {
  const location = useLocation()
  const pathname = location.pathname
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
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

  const filteredNavItems = sidebarNavItems.filter(item => !item.adminOnly || isAdmin)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const getRoleBadgeVariant = (userType?: string) => {
    switch (userType) {
      case 'admin':
        return 'default'
      case 'student':
        return 'secondary'
      case 'parent':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Poiesis</h2>
      </div>
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-2">
          {filteredNavItems.map((item) => (
            <div key={item.href}>
              {item.subItems ? (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-2 flex flex-col gap-2">
                    {item.subItems.map((subItem) => (
                      <Button
                        key={subItem.href}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
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
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === item.href && "bg-accent"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="flex-1">{user?.email}</span>
            <Badge variant={getRoleBadgeVariant(user?.user_metadata?.user_type)}>
              {user?.user_metadata?.user_type || 'student'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9"
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

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-[300px] border-r md:block">
        <SidebarContent />
      </aside>

      <main className={cn("flex-1 p-8", className)}>
        {children}
      </main>
    </div>
  )
}
