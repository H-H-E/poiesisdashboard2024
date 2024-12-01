import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FixedSizeList as List } from 'react-window'
import { cn } from "@/lib/utils"

interface PathwayTableProps {
  pathways: any[]
}

interface FlattenedRow {
  id: string
  type: 'pathway' | 'project' | 'plenary'
  parentId?: string
  data: any
}

export function PathwayTable({ pathways }: PathwayTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (pathwayId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [pathwayId]: !prev[pathwayId]
    }))
  }

  const flattenedData = useMemo(() => {
    const rows: FlattenedRow[] = []
    
    pathways?.forEach(pathway => {
      // Add pathway row
      rows.push({
        id: pathway.id,
        type: 'pathway',
        data: pathway
      })

      // Add child rows if expanded
      if (expandedRows[pathway.id]) {
        pathway.projects?.forEach((project: any) => {
          rows.push({
            id: project.id,
            type: 'project',
            parentId: pathway.id,
            data: project
          })
        })

        pathway.plenaries?.forEach((plenary: any) => {
          rows.push({
            id: plenary.id,
            type: 'plenary',
            parentId: pathway.id,
            data: plenary
          })
        })
      }
    })

    return rows
  }, [pathways, expandedRows])

  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    const row = flattenedData[index]
    
    if (row.type === 'pathway') {
      return (
        <TableRow key={row.id} className="group" style={style}>
          <TableCell>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleRow(row.id)}
              className="h-8 w-8"
            >
              {expandedRows[row.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </TableCell>
          <TableCell className="font-medium">{row.data.title}</TableCell>
          <TableCell>{row.data.description}</TableCell>
          <TableCell>
            <Badge variant="secondary">
              {row.data.projects?.length || 0} Projects
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant="secondary">
              {row.data.plenaries?.length || 0} Plenaries
            </Badge>
          </TableCell>
        </TableRow>
      )
    }

    return (
      <TableRow 
        key={row.id} 
        className={cn("bg-muted/50", row.type === 'project' ? 'border-l-4 border-l-orange-200' : 'border-l-4 border-l-green-200')}
        style={style}
      >
        <TableCell></TableCell>
        <TableCell className="font-medium">
          → {row.data.title}
        </TableCell>
        <TableCell>{row.data.description}</TableCell>
        <TableCell>
          {row.type === 'project' && (
            <Badge variant="outline">
              {row.data.progress}% Complete
            </Badge>
          )}
        </TableCell>
        <TableCell>
          {row.type === 'plenary' && (
            <Badge>
              {row.data.points_awarded || 0} Points
            </Badge>
          )}
        </TableCell>
      </TableRow>
    )
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
          <List
            height={600}
            itemCount={flattenedData.length}
            itemSize={50}
            width="100%"
          >
            {Row}
          </List>
        </TableBody>
      </Table>
    </ScrollArea>
  )
}