import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ProfileHeader } from "./ProfileHeader"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface PlenarySession {
  id: string
  title: string
  description: string
  session_date: string
  points_awarded: number
}

interface PathwayProgress {
  id: string
  title: string
  description: string
  status: string
}

export function StudentDashboard() {
  const { user } = useAuth()

  const { data: plenaries, isLoading: plenariesLoading, error: plenariesError } = useQuery({
    queryKey: ['plenaries', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plenaries')
        .select('*')
        .eq('student_id', user?.id)
        .order('session_date', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data as PlenarySession[]
    },
  })

  const { data: points, isLoading: pointsLoading } = useQuery({
    queryKey: ['points', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('poiesis_points')
        .select('points, created_at')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    },
  })

  const { data: pathways, isLoading: pathwaysLoading } = useQuery({
    queryKey: ['pathways', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_pathways')
        .select(`
          pathway_id,
          status,
          pathways (
            id,
            title,
            description
          )
        `)
        .eq('student_id', user?.id)
      
      if (error) throw error
      return data
    },
  })

  if (plenariesError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load dashboard data</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <ProfileHeader />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Plenaries - Now more prominent */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Plenary Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {plenariesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : plenaries && plenaries.length > 0 ? (
              <div className="space-y-4">
                {plenaries.map((plenary) => (
                  <div
                    key={plenary.id}
                    className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{plenary.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{plenary.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary">
                            {format(new Date(plenary.session_date), 'PPP')}
                          </Badge>
                          <Badge variant="default">
                            {plenary.points_awarded} points
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent plenary sessions found.</p>
            )}
          </CardContent>
        </Card>

        {/* Points Graph */}
        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Poiesis Points</CardTitle>
          </CardHeader>
          <CardContent>
            {pointsLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={points}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="points" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Active Pathways */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Active Pathways</CardTitle>
          </CardHeader>
          <CardContent>
            {pathwaysLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pathways?.map((pathway) => (
                  <Card key={pathway.pathway_id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{pathway.pathways.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{pathway.pathways.description}</p>
                      <p className="mt-2 text-sm font-medium">Status: {pathway.status}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}