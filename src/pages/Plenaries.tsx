import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Plenary } from "@/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlenaryCard } from "@/components/plenaries/PlenaryCard"
import { PlenaryDetailsModal } from "@/components/plenaries/PlenaryDetailsModal"

export default function Plenaries() {
  const [selectedPlenary, setSelectedPlenary] = useState<Plenary | null>(null)
  
  const { data: plenaries, isLoading } = useQuery({
    queryKey: ["plenaries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plenaries")
        .select("*")
        .order("session_date", { ascending: false })
      
      if (error) throw error
      return data
    }
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
      <h1 className="text-3xl font-bold mb-8">Past Plenaries</h1>
      
      <ScrollArea className="h-[80vh] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plenaries?.map((plenary) => (
            <PlenaryCard
              key={plenary.id}
              plenary={plenary}
              onClick={() => setSelectedPlenary(plenary)}
            />
          ))}
        </div>
      </ScrollArea>

      <PlenaryDetailsModal
        plenary={selectedPlenary}
        open={!!selectedPlenary}
        onOpenChange={(open) => !open && setSelectedPlenary(null)}
      />
    </div>
  )
}