import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Profile } from "@/types"

interface ProfileCardProps {
  profile: Profile
  children?: React.ReactNode
}

export function ProfileCard({ profile, children }: ProfileCardProps) {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarFallback>
            {getInitials(profile.first_name, profile.last_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-xl">
            {profile.first_name} {profile.last_name}
          </CardTitle>
          <Badge className={`${getRoleColor(profile.user_type)} text-white w-fit mt-1`}>
            {profile.user_type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="text-sm">
            <span className="font-medium">Email:</span> {profile.email}
          </div>
          {profile.phone && (
            <div className="text-sm">
              <span className="font-medium">Phone:</span> {profile.phone}
            </div>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}