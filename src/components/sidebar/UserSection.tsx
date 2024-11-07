import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"

interface UserSectionProps {
  firstName: string
  userType: string
  onLogout: () => void
}

export function UserSection({ firstName, userType, onLogout }: UserSectionProps) {
  return (
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
          onClick={onLogout}
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
        <ThemeToggle />
      </div>
    </div>
  )
}