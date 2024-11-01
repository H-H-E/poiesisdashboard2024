import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlenaryForm } from "./PlenaryForm"

interface PlenaryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlenaryFormModal({ open, onOpenChange }: PlenaryFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Plenary</DialogTitle>
        </DialogHeader>
        <PlenaryForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}