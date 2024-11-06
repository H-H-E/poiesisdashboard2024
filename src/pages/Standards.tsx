import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StandardCard } from "@/components/standards/StandardCard"
import { StandardDetailsModal } from "@/components/standards/StandardDetailsModal"
import { StandardFormModal } from "@/components/standards/StandardFormModal"
import { useAuth } from "@/contexts/AuthContext"

export default function Standards() {
  const [selectedStandard, setSelectedStandard] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { user } = useAuth()
  
  const { data: standards, isLoading } = useQuery({
    queryKey: ["standards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("educational_standards")
        .select(`
          *,
          frameworks (
            name,
            version
          )
        `)
        .order("code")
      
      if (error) throw error
      return data
    }
  })

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await supabase
        .from("user_profiles")
        .select("user_type")
        .eq("id", user.id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Educational Standards</h1>
        {userProfile?.user_type === "admin" && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Standard
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[80vh] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standards?.map((standard) => (
            <StandardCard
              key={standard.id}
              standard={standard}
              onClick={() => setSelectedStandard(standard)}
            />
          ))}
        </div>
      </ScrollArea>

      <StandardDetailsModal
        standard={selectedStandard}
        open={!!selectedStandard}
        onOpenChange={(open) => !open && setSelectedStandard(null)}
      />

      <StandardFormModal 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </div>
  )
}