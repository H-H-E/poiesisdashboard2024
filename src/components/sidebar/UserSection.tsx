import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserSectionProps {
  firstName: string
  userType: string
  theme?: string
  setTheme: (theme: string) => void
  onLogout: () => void
  isCollapsed: boolean
}

export function UserSection({
  firstName,
  userType,
  theme,
  setTheme,
  onLogout,
  isCollapsed
}: UserSectionProps) {
  return (
    <div className="border-t p-4">
      {!isCollapsed && (
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
            onClick={onLogout}
            className="h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between">
        {!isCollapsed && (
          <Badge 
            variant="outline"
            className="w-fit text-xs capitalize"
          >
            {userType}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className={cn("h-8 w-8", isCollapsed && "mx-auto")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  )
}