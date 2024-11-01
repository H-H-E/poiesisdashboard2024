import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Event } from "@/types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
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
      <h1 className="text-2xl font-bold">Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              modifiers={{
                hasEvent: (date) => 
                  datesWithEvents?.some(eventDate => 
                    eventDate.getDate() === date.getDate() &&
                    eventDate.getMonth() === date.getMonth() &&
                    eventDate.getFullYear() === date.getFullYear()
                  ) || false
              }}
              modifiersStyles={{
                hasEvent: { 
                  fontWeight: 'bold',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderRadius: '4px'
                }
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

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
    </div>
  )
}