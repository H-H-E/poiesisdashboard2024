import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Edit } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface UserCardProps {
  name: string
  role: "admin" | "student" | "parent"
  email: string
  phone?: string
  avatarUrl?: string
  onEdit?: () => void
}

export function UserCard({ name, role, email, phone, avatarUrl, onEdit }: UserCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
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
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-semibold">{name}</h3>
          <Badge className={`${getRoleColor(role)} text-white w-fit`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        </div>
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{email}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{phone}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

UserCard.Skeleton = function UserCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-col flex-1 gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )
}