import { Button } from "@/components/ui/button"
import { ChevronDown, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { format } from "date-fns"
import type { NavItem } from "@/config/navigation"

interface NavigationSectionProps {
  navItems: NavItem[]
  openItem: string | null
  setOpenItem: (item: string | null) => void
  userType: string
}

export function NavigationSection({ navItems, openItem, setOpenItem, userType }: NavigationSectionProps) {
  const handleWhiteboardOpen = () => {
    const year = new Date().getFullYear()
    const date = format(new Date(), `MMMMdo'${year}'`)
    window.open(`https://draw.poiesis.education/multiplayer/${date}`, '_blank')
  }

  return (
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
  )
}