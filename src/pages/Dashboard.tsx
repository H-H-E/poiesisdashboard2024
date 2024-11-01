import { useAuth } from "@/contexts/AuthContext"
import { StudentDashboard } from "@/components/dashboard/StudentDashboard"
import { ParentDashboard } from "@/components/dashboard/ParentDashboard"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { EventsTable } from "@/components/dashboard/EventsTable"

export default function Dashboard() {
  const { user } = useAuth()
  const userType = user?.user_metadata?.user_type || 'student'

  const DashboardComponent = {
    admin: AdminDashboard,
    parent: ParentDashboard,
    student: StudentDashboard,
  }[userType] || StudentDashboard

  return (
    <div className="space-y-4">
      <DashboardComponent />
      <EventsTable />
    </div>
  )
}