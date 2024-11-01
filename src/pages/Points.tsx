import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { PlenaryFormModal } from "@/components/plenaries/PlenaryFormModal"

export default function Points() {
  const [isPlenaryModalOpen, setIsPlenaryModalOpen] = useState(false)

  const handleWhiteboardOpen = () => {
    const date = format(new Date(), "MMMMdo'yyyy'")
    window.open(`https://draw.poiesis.education/multiplayer/${date}`, '_blank')
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button 
            onClick={() => setIsPlenaryModalOpen(true)}
            className="w-full"
            size="lg"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Plenary
          </Button>
          <Button
            onClick={handleWhiteboardOpen}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Open Today's Whiteboard
          </Button>
        </CardContent>
      </Card>

      <PlenaryFormModal 
        open={isPlenaryModalOpen} 
        onOpenChange={setIsPlenaryModalOpen} 
      />
    </div>
  )
}