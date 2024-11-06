import { Plenary } from "@/types"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PlenaryCardProps {
  plenary: Plenary
  onClick: () => void
}

export function PlenaryCard({ plenary, onClick }: PlenaryCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{plenary.title}</CardTitle>
          {plenary.points_awarded && (
            <Badge variant="secondary">{plenary.points_awarded} points</Badge>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {format(new Date(plenary.session_date), "PPP")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-2">{plenary.description}</p>
        <Button 
          onClick={onClick}
          variant="secondary" 
          className="w-full gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}