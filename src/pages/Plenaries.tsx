import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, Table as TableIcon } from "lucide-react"
import { PlenaryCard } from "@/components/plenaries/PlenaryCard"
import { PlenaryDetailsModal } from "@/components/plenaries/PlenaryDetailsModal"
import { PlenaryFormModal } from "@/components/plenaries/PlenaryFormModal"
import { useAuth } from "@/contexts/AuthContext"
import { format } from "date-fns"
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

export default function Plenaries() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [selectedPlenary, setSelectedPlenary] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { user } = useAuth()

  const { data: plenaries, isLoading } = useQuery({
    queryKey: ['plenaries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plenaries')
        .select(`
          *,
          pathway (
            title
          )
        `)
        .order('session_date', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Plenary Sessions</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Plenary
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid View
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

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plenaries?.map((plenary) => (
            <PlenaryCard
              key={plenary.id}
              plenary={plenary}
              onClick={() => setSelectedPlenary(plenary)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Plenary Sessions List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)] w-full rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[150px]">Date</TableHead>
                    <TableHead className="w-[100px]">Points</TableHead>
                    <TableHead className="w-[150px]">Pathway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plenaries?.map((plenary) => (
                    <TableRow key={plenary.id}>
                      <TableCell className="font-medium">{plenary.title}</TableCell>
                      <TableCell>{plenary.description}</TableCell>
                      <TableCell>
                        {format(new Date(plenary.session_date), 'PPP')}
                      </TableCell>
                      <TableCell>
                        {plenary.points_awarded && (
                          <Badge>{plenary.points_awarded} pts</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {plenary.pathway?.title && (
                          <Badge variant="outline">{plenary.pathway.title}</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <PlenaryDetailsModal
        plenary={selectedPlenary}
        open={!!selectedPlenary}
        onOpenChange={(open) => !open && setSelectedPlenary(null)}
      />

      <PlenaryFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </div>
  )
}