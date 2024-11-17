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

interface ProjectTableProps {
  projects: any[]
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <ScrollArea className="h-[calc(100vh-16rem)] w-full rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[150px]">Progress</TableHead>
            <TableHead className="w-[150px]">Pathway</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects?.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Progress value={project.progress || 0} />
                  <span className="text-sm text-muted-foreground">
                    {project.progress || 0}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {project.pathway?.title && (
                  <Badge variant="outline">{project.pathway.title}</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}