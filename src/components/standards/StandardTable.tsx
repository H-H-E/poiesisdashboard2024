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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface StandardTableProps {
  standards: any[]
}

export function StandardTable({ standards }: StandardTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Standards List</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-16rem)] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] text-base text-muted-foreground">Code</TableHead>
                <TableHead className="text-base text-muted-foreground">Description</TableHead>
                <TableHead className="w-[300px] text-base text-muted-foreground">Framework</TableHead>
                <TableHead className="w-[150px] text-base text-muted-foreground">Grade Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standards?.map((standard) => (
                <TableRow key={standard.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{standard.code}</TableCell>
                  <TableCell className="text-sm">{standard.description}</TableCell>
                  <TableCell>
                    {standard.frameworks && (
                      <Badge 
                        variant="outline" 
                        className="rounded-full px-4 py-1 bg-background"
                      >
                        {standard.frameworks.name} {standard.frameworks.version}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {standard.grade_level_start && standard.grade_level_end ? (
                      <Badge 
                        className="rounded-full px-4 py-1 bg-primary text-primary-foreground"
                      >
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
      </CardContent>
    </Card>
  )
}