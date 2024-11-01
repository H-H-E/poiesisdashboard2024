import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Event } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function EventsTable() {
  const { toast } = useToast()

  const { data: events, isLoading } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(10)

      if (error) {
        toast({
          title: "Error fetching events",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }

      return data as Event[]
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <p>Loading events...</p>
          ) : events && events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.start_time), 'PPP')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.start_time), 'p')} - {format(new Date(event.end_time), 'p')}
                    </p>
                  </div>
                  <Badge variant={event.event_type === 'online' ? 'default' : 'secondary'}>
                    {event.event_type}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming events</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}