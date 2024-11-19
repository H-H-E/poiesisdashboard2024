import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { EmptyState } from "../ui/empty-state"
import { FolderGit2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectTableProps {
  projects: any[]
}

export function ProjectTable({ projects }: ProjectTableProps) {
  if (!projects?.length) {
    return (
      <EmptyState
        icon={FolderGit2}
        title="No projects found"
        description="Projects you create or join will appear here."
      />
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] w-full rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead className="min-w-[300px]">Description</TableHead>
            <TableHead className="w-[150px]">Progress</TableHead>
            <TableHead className="w-[150px]">Pathway</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="group hover:bg-muted/50">
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>
                <div className="max-h-20 overflow-y-auto">
                  {project.description}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Progress 
                    value={project.progress || 0}
                    className={cn(
                      "h-2",
                      project.progress === 100 && "bg-green-100 dark:bg-green-900",
                      project.progress === 0 && "bg-red-100 dark:bg-red-900"
                    )}
                  />
                  <span className="text-sm text-muted-foreground">
                    {project.progress || 0}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {project.pathway?.title && (
                  <Badge variant="outline" className="whitespace-nowrap">
                    {project.pathway.title}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}