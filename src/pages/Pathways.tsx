import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PathwayExplorer } from "@/components/pathways/PathwayExplorer"

export default function Pathways() {
  return (
    <div className="space-y-4 pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Learning Pathways</h1>
      </div>

      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle>Pathway Explorer</CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-4rem)]">
          <PathwayExplorer />
        </CardContent>
      </Card>
    </div>
  )
}