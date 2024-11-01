import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ExternalLink } from "lucide-react"
import { PlenaryFormModal } from "../plenaries/PlenaryFormModal"
import { DashboardMetric } from "./DashboardMetric"
import { ProfileHeader } from "./ProfileHeader"
import { format } from "date-fns"

export function AdminDashboard() {
  const [isPlenaryModalOpen, setIsPlenaryModalOpen] = useState(false)

  const handleWhiteboardOpen = () => {
    const date = format(new Date(), "MMMMdo'yyyy'")
    window.open(`https://draw.poiesis.education/multiplayer/${date}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <ProfileHeader />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-1">
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

        <DashboardMetric
          title="Total Students"
          value="--"
          description="Active students in the system"
        />

        <DashboardMetric
          title="Active Pathways"
          value="--"
          description="Learning pathways in progress"
        />
      </div>

      <PlenaryFormModal 
        open={isPlenaryModalOpen} 
        onOpenChange={setIsPlenaryModalOpen} 
      />
    </div>
  )
}