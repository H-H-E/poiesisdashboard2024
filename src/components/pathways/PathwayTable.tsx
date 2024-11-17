import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PathwayTableProps {
  pathways: any[]
}

export function PathwayTable({ pathways }: PathwayTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (pathwayId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [pathwayId]: !prev[pathwayId]
    }))
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] w-full rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[150px]">Projects</TableHead>
            <TableHead className="w-[150px]">Plenaries</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pathways?.map((pathway) => (
            <>
              <TableRow key={pathway.id} className="group">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRow(pathway.id)}
                    className="h-8 w-8"
                  >
                    {expandedRows[pathway.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{pathway.title}</TableCell>
                <TableCell>{pathway.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {pathway.projects?.length || 0} Projects
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {pathway.plenaries?.length || 0} Plenaries
                  </Badge>
                </TableCell>
              </TableRow>
              {expandedRows[pathway.id] && (
                <>
                  {pathway.projects?.map((project: any) => (
                    <TableRow key={project.id} className="bg-muted/50">
                      <TableCell></TableCell>
                      <TableCell className="font-medium">
                        → {project.title}
                      </TableCell>
                      <TableCell>{project.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {project.progress}% Complete
                        </Badge>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                  {pathway.plenaries?.map((plenary: any) => (
                    <TableRow key={plenary.id} className="bg-muted/50">
                      <TableCell></TableCell>
                      <TableCell className="font-medium">
                        → {plenary.title}
                      </TableCell>
                      <TableCell>{plenary.description}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Badge>
                          {plenary.points_awarded || 0} Points
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}