import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StandardForm } from "./StandardForm"

interface StandardFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StandardFormModal({ open, onOpenChange }: StandardFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Educational Standard</DialogTitle>
        </DialogHeader>
        <StandardForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}