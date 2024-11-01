import { Project } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
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