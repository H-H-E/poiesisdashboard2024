import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarHeaderProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function SidebarHeader({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  return (
    <div className="border-b px-4 py-3 flex items-center justify-between">
      {!isCollapsed && <h2 className="text-lg font-semibold">Poiesis</h2>}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onToggleCollapse}
        className="h-8 w-8"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}