import { DashboardCard } from "./DashboardCard"

interface DashboardMetricProps {
  title: string
  value: string | number
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function DashboardMetric({ title, value, icon: Icon, className }: DashboardMetricProps) {
  return (
    <DashboardCard title={title} className={className}>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
    </DashboardCard>
  )
}