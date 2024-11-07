import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface RecentPlenariesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecentPlenariesModal({ open, onOpenChange }: RecentPlenariesModalProps) {
  const { user } = useAuth()

  const { data: plenaries, isLoading } = useQuery({
    queryKey: ['plenaries', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plenaries')
        .select('*')
        .eq('student_id', user?.id)
        .order('session_date', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id, // Only run query when we have a user ID
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Recent Plenary Sessions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : plenaries && plenaries.length > 0 ? (
            <div className="space-y-4">
              {plenaries.map((plenary) => (
                <div
                  key={plenary.id}
                  className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{plenary.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{plenary.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">
                          {format(new Date(plenary.session_date), 'PPP')}
                        </Badge>
                        <Badge variant="default">
                          {plenary.points_awarded} points
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent plenary sessions found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}