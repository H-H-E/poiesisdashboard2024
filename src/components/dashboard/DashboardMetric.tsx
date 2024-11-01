import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardMetricProps {
  title: string
  value: string
  description: string
}

export function DashboardMetric({ title, value, description }: DashboardMetricProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}