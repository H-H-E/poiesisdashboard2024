import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Event } from "@/types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { CalendarModal } from "@/components/calendar/CalendarModal"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const { toast } = useToast()

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
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

  // Get events for selected date
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button onClick={() => setIsCalendarOpen(true)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Select Date
        </Button>
      </div>

      <CalendarModal
        open={isCalendarOpen}
        onOpenChange={setIsCalendarOpen}
        selected={date}
        onSelect={setDate}
        datesWithEvents={datesWithEvents}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>
            Events for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <p>Loading events...</p>
            ) : selectedDateEvents && selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col space-y-2 p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
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
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No events for this date</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}