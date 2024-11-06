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

interface StandardCardProps {
  standard: any
  onClick: () => void
}

export function StandardCard({ standard, onClick }: StandardCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{standard.code}</CardTitle>
          {standard.frameworks?.name && (
            <Badge variant="secondary">
              {standard.frameworks.name} {standard.frameworks.version}
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Grade {standard.grade_level_start || "?"} - {standard.grade_level_end || "?"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-2">{standard.description}</p>
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