import { useAuth } from "@/contexts/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProfileCard } from "@/components/profile/ProfileCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"

export default function Profile() {
  const { user } = useAuth()

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load profile</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {profile && <ProfileCard profile={profile} />}
    </div>
  )
}