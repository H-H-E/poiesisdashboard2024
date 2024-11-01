import { useAuth } from "@/contexts/AuthContext"
import { StudentDashboard } from "@/components/dashboard/StudentDashboard"
import { ParentDashboard } from "@/components/dashboard/ParentDashboard"
import { EventsTable } from "@/components/dashboard/EventsTable"

export default function Dashboard() {
  const { user } = useAuth()
  const userType = user?.user_metadata?.user_type || 'student'

  return (
    <div className="container mx-auto p-6 space-y-6">
      {userType === 'parent' ? <ParentDashboard /> : <StudentDashboard />}
      <EventsTable />
    </div>
  )
}