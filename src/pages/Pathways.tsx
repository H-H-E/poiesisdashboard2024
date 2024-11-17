import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PathwayExplorer } from "@/components/pathways/PathwayExplorer"
import { PathwayTable } from "@/components/pathways/PathwayTable"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Table as TableIcon } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export default function Pathways() {
  const [viewMode, setViewMode] = useState<'flow' | 'table'>('flow')

  const { data: pathways } = useQuery({
    queryKey: ['pathways'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pathways')
        .select(`
          *,
          projects (
            id,
            title,
            description,
            progress
          ),
          plenaries (
            id,
            title,
            description,
            points_awarded
          )
        `)
      if (error) throw error
      return data
    }
  })

  return (
    <div className="space-y-4 pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Learning Pathways</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'flow' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('flow')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Flow View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Table View
          </Button>
        </div>
      </div>

      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle>Pathway Explorer</CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-4rem)]">
          {viewMode === 'flow' ? (
            <PathwayExplorer />
          ) : (
            <PathwayTable pathways={pathways || []} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}