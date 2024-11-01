import { Link, useLocation } from "react-router-dom"
import { GraduationCap, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { navigationItems } from "@/config/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const location = useLocation()
  const { signOut, user } = useAuth()
  const isAdmin = user?.user_metadata?.user_type === 'admin'

  const filteredNavItems = navigationItems.filter(item => !item.adminOnly || isAdmin)

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span className="text-lg">Poiesis</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredNavItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              {item.subItems ? (
                <SidebarMenuSub>
                  <SidebarMenuButton>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </SidebarMenuButton>
                  {item.subItems.map((subItem, subIndex) => (
                    <SidebarMenuSubItem key={subIndex}>
                      <SidebarMenuSubButton
                        onClick={() => {}}
                        isActive={location.pathname + location.search === subItem.href}
                      >
                        <Link to={subItem.href}>{subItem.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              ) : (
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.href}
                >
                  <Link to={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}