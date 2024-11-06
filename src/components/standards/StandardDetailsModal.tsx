import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface StandardDetailsModalProps {
  standard: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StandardDetailsModal({ standard, open, onOpenChange }: StandardDetailsModalProps) {
  const { data: objectives } = useQuery({
    queryKey: ["standard-objectives", standard?.id],
    queryFn: async () => {
      if (!standard?.id) return []
      
      const { data, error } = await supabase
        .from("learning_objectives")
        .select("*")
        .eq("standard_id", standard.id)
      
      if (error) throw error
      return data
    },
    enabled: !!standard?.id
  })

  if (!standard) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{standard.code}</DialogTitle>
          <DialogDescription>{standard.description}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Framework</h3>
              <Badge variant="outline">
                {standard.frameworks?.name} {standard.frameworks?.version}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Grade Levels</h3>
              <p>
                {standard.grade_level_start || "?"} - {standard.grade_level_end || "?"}
              </p>
            </div>

            {objectives && objectives.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Learning Objectives</h3>
                <ul className="list-disc pl-4 space-y-2">
                  {objectives.map((objective) => (
                    <li key={objective.id}>{objective.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}