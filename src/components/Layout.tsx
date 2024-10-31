import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { LogOut, User } from "lucide-react"
import { Button } from "./ui/button"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export function Layout({ children, className }: LayoutProps) {
  const { user, signOut } = useAuth()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="px-6 py-3">
              <h1 className="text-xl font-bold">Poiesis</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/pathways">
                    <User className="h-4 w-4" />
                    <span>Pathways</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/projects">
                    <User className="h-4 w-4" />
                    <span>Projects</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/users">
                    <User className="h-4 w-4" />
                    <span>Users</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/points">
                    <User className="h-4 w-4" />
                    <span>Points</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button 
              variant="ghost" 
              className="w-full justify-start px-6" 
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className={cn("flex-1 p-8", className)}>
          <div className="container mx-auto">
            <SidebarTrigger className="mb-4 lg:hidden" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}