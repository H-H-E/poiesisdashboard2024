import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { SidebarContent } from "./SidebarContent"
import { Outlet, useLocation } from "react-router-dom"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { Helmet } from "react-helmet"

interface LayoutProps {
  className?: string
}

// Map routes to readable names
const routeNames: Record<string, string> = {
  "": "Dashboard",
  "calendar": "Calendar",
  "pathways": "Learning Pathways",
  "projects": "Projects",
  "plenaries": "Plenaries",
  "points": "Points",
  "profile": "Profile",
  "standards": "Standards",
  "users": "Users",
}

export default function Layout({ className }: LayoutProps) {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)
  
  // Generate page title
  const currentPage = pathSegments[pathSegments.length - 1] || ""
  const pageTitle = routeNames[currentPage] || "Poiesis"
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle} | Poiesis</title>
      </Helmet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 md:hidden z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <aside className="hidden w-[240px] md:block">
        <div className="fixed inset-y-0 z-20 w-[240px] border-r bg-background">
          <SidebarContent />
        </div>
      </aside>

      <main className={cn(
        "min-h-screen",
        "px-4 py-4 md:px-8 md:py-8",
        "md:ml-[240px]",
        className
      )}>
        <Breadcrumb className="mb-6 mt-8 md:mt-0">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1
              const href = `/${pathSegments.slice(0, index + 1).join('/')}`
              const name = routeNames[segment] || segment

              return (
                <BreadcrumbItem key={segment}>
                  <BreadcrumbSeparator />
                  {isLast ? (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <Outlet />
      </main>
    </div>
  )
}