import { Plenary } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface PlenaryDetailsModalProps {
  plenary: Plenary | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlenaryDetailsModal({ plenary, open, onOpenChange }: PlenaryDetailsModalProps) {
  const { data: standards } = useQuery({
    queryKey: ["plenary-standards", plenary?.id],
    queryFn: async () => {
      if (!plenary?.id) return []
      
      const { data, error } = await supabase
        .from("plenary_standards")
        .select(`
          educational_standards (
            id,
            code,
            description,
            category
          )
        `)
        .eq("plenary_id", plenary.id)
      
      if (error) throw error
      return data?.map(d => d.educational_standards) ?? []
    },
    enabled: !!plenary?.id
  })

  if (!plenary) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{plenary.title}</DialogTitle>
            {plenary.points_awarded && (
              <Badge variant="secondary">{plenary.points_awarded} points</Badge>
            )}
          </div>
          <DialogDescription>
            {format(new Date(plenary.session_date), "PPP")}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{plenary.description}</p>
            </div>

            {plenary.work_url && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Work Submission</h3>
                  <a 
                    href={plenary.work_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View submitted work
                  </a>
                </div>
              </>
            )}

            {standards && standards.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Educational Standards</h3>
                  <div className="space-y-2">
                    {standards.map((standard) => (
                      <div key={standard.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{standard.code}</Badge>
                          {standard.category && (
                            <span className="text-xs text-muted-foreground">
                              {standard.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{standard.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}