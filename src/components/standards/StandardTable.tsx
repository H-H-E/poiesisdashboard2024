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

interface StandardTableProps {
  standards: any[]
}

export function StandardTable({ standards }: StandardTableProps) {
  return (
    <ScrollArea className="h-[calc(100vh-16rem)] w-full rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[200px]">Framework</TableHead>
            <TableHead className="w-[150px]">Grade Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standards?.map((standard) => (
            <TableRow key={standard.id}>
              <TableCell className="font-medium">{standard.code}</TableCell>
              <TableCell>{standard.description}</TableCell>
              <TableCell>
                {standard.frameworks && (
                  <Badge variant="outline">
                    {standard.frameworks.name} {standard.frameworks.version}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {standard.grade_level_start && standard.grade_level_end ? (
                  <Badge>
                    Grade {standard.grade_level_start}-{standard.grade_level_end}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}