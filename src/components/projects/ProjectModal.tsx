import { Project } from "@/types"
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
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ProjectModalProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  const { data: standards } = useQuery({
    queryKey: ["project-standards", project?.id],
    queryFn: async () => {
      if (!project?.id) return []
      
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
        .eq("plenary_id", project.id)
      
      if (error) throw error
      return data?.map(d => d.educational_standards) ?? []
    },
    enabled: !!project?.id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true
  })

  const { data: plenaries } = useQuery({
    queryKey: ["project-plenaries", project?.id],
    queryFn: async () => {
      if (!project?.id) return []
      
      const { data, error } = await supabase
        .from("plenaries")
        .select("*")
        .is("pathway_id", null)
      
      if (error) throw error
      return data ?? []
    },
    enabled: !!project?.id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true
  })

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {standards && standards.length > 0 && (
            <>
              <h3 className="font-semibold mb-2">Educational Standards</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {standards.map((standard) => (
                  <Badge key={standard.id} variant="outline">
                    {standard.code}
                  </Badge>
                ))}
              </div>
              <Separator className="my-4" />
            </>
          )}

          {plenaries && plenaries.length > 0 && (
            <>
              <h3 className="font-semibold mb-2">Related Plenaries</h3>
              <div className="space-y-2">
                {plenaries.map((plenary) => (
                  <div key={plenary.id} className="p-2 bg-muted rounded-md">
                    <h4 className="font-medium">{plenary.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {plenary.description}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
