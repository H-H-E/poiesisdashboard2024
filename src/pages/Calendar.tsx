import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, TableIcon } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Event } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { CalendarModal } from "@/components/calendar/CalendarModal"
import { EventsTable } from "@/components/calendar/EventsTable"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [view, setView] = useState<'table' | 'calendar'>('table')
  const { toast } = useToast()

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })

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

  // Get events for selected date (for calendar view)
  const selectedDateEvents = events?.filter(event => {
    const eventDate = new Date(event.start_time)
    return date && 
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
  })

  // Get dates with events for highlighting in calendar
  const datesWithEvents = events?.reduce((dates: Date[], event) => {
    const eventDate = new Date(event.start_time)
    dates.push(eventDate)
    return dates
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            onClick={() => setView('table')}
            className="flex-1 sm:flex-none"
          >
            <TableIcon className="mr-2 h-4 w-4" />
            Table View
          </Button>
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            onClick={() => setIsCalendarOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
        </div>
      </div>

      <CalendarModal
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        selected={date}
        onSelect={setDate}
        datesWithEvents={datesWithEvents}
      />
      
      {view === 'table' ? (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <EventsTable events={events} isLoading={isLoading} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">
              Events for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
            </h2>
            <div className="space-y-4">
              {isLoading ? (
                <p>Loading events...</p>
              ) : selectedDateEvents && selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col space-y-2 p-4 border rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <Badge variant={event.event_type === 'online' ? 'default' : 'secondary'}>
                        {event.event_type}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No events for this date</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}