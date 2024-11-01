import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProfileHeader } from "./ProfileHeader"
import { UserCard } from "../UserCard"

export function ParentDashboard() {
  const { user } = useAuth()

  const { data: children, isLoading, error } = useQuery({
    queryKey: ['children', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_parent_relationships')
        .select(`
          students (
            id,
            user_profiles (
              first_name,
              last_name,
              email,
              phone
            )
          )
        `)
        .eq('parent_id', user?.id)

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load children data</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <ProfileHeader />
      
      <Card>
        <CardHeader>
          <CardTitle>My Children</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {isLoading ? (
            <>
              <UserCard.Skeleton />
              <UserCard.Skeleton />
            </>
          ) : (
            children?.map((relationship) => {
              const student = relationship.students.user_profiles
              return (
                <UserCard
                  key={relationship.students.id}
                  name={`${student.first_name} ${student.last_name}`}
                  role="student"
                  email={student.email}
                  phone={student.phone}
                />
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
