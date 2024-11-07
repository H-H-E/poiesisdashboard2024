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
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="w-[120px]">Time</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="w-[100px]">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events && events.length > 0 ? (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">
                  {format(new Date(event.start_time), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(event.start_time), 'h:mm a')}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{event.title}</span>
                    <span className="md:hidden text-sm text-muted-foreground">
                      {event.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{event.description}</TableCell>
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