import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PathwayExplorer } from "@/components/pathways/PathwayExplorer"

export default function Pathways() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Learning Pathways</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pathway Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <PathwayExplorer />
        </CardContent>
      </Card>
    </div>
  )
}