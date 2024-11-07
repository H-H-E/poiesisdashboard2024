import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Event } from "@/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EventsTableProps {
  events: Event[] | undefined
  isLoading: boolean
}

export function EventsTable({ events, isLoading }: EventsTableProps) {
  if (isLoading) return <p>Loading events...</p>

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events && events.length > 0 ? (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{format(new Date(event.start_time), 'PPP')}</TableCell>
                <TableCell>
                  {format(new Date(event.start_time), 'p')} - {format(new Date(event.end_time), 'p')}
                </TableCell>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>
                  <Badge variant={event.event_type === 'online' ? 'default' : 'secondary'}>
                    {event.event_type}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No upcoming events
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}