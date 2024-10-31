import { Layout } from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, BookOpen, GraduationCap, Users } from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "2,300",
      icon: Users,
    },
    {
      title: "Active Pathways",
      value: "15",
      icon: BookOpen,
    },
    {
      title: "Projects Completed",
      value: "450",
      icon: GraduationCap,
    },
    {
      title: "Points Awarded",
      value: "12,500",
      icon: Award,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}