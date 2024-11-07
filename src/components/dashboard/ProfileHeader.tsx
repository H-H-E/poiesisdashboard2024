import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileHeader() {
  const { user } = useAuth()

  const { data: profile, isLoading } = useQuery({
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

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return (first + last).toUpperCase()
  }

  const getRoleColor = (userType: string) => {
    switch (userType) {
      case "admin":
        return "bg-blue-500"
      case "student":
        return "bg-green-500"
      case "parent":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center gap-4 py-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) return null

  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 py-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src="" alt={`${profile.first_name} ${profile.last_name}`} />
          <AvatarFallback>{getInitials(profile.first_name, profile.last_name)}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            {profile.first_name} {profile.last_name}
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <Badge className={`${getRoleColor(profile.user_type)} text-white w-fit`}>
              {profile.user_type.charAt(0).toUpperCase() + profile.user_type.slice(1)}
            </Badge>
            {profile.email && (
              <span className="text-sm text-muted-foreground break-all md:break-normal">
                {profile.email}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}