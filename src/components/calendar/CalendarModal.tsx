import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface CalendarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  datesWithEvents: Date[] | undefined
}

export function CalendarModal({ open, onOpenChange, selected, onSelect, datesWithEvents }: CalendarModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Date</DialogTitle>
        </DialogHeader>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
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
      </DialogContent>
    </Dialog>
  )
}