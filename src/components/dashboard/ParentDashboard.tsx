import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Student {
  id: string
  first_name: string
  last_name: string
  grade_level: string
}

interface Event {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
}

export function ParentDashboard() {
  const { user } = useAuth()

  const { data: children, isLoading: childrenLoading, error: childrenError } = useQuery({
    queryKey: ['children', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parent_student_relations')
        .select(`
          student:student_id (
            id,
            user_profiles (
              first_name,
              last_name
            ),
            grade_level
          )
        `)
        .eq('parent_id', user?.id)
      
      if (error) throw error
      return data?.map(relation => relation.student) as Student[]
    },
  })

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5)
      
      if (error) throw error
      return data as Event[]
    },
  })

  if (childrenError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load dashboard data</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Children Overview */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Children Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {childrenLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {children?.map((child) => (
                <Card key={child.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {child.first_name} {child.last_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Grade Level: {child.grade_level}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {events?.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="mt-2 text-sm">
                      <p>Start: {new Date(event.start_time).toLocaleString()}</p>
                      <p>End: {new Date(event.end_time).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}