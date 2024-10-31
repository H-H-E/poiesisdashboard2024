import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { UserCard } from "@/components/UserCard"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface UserListProps {
  onEditUser?: (user: Profile) => void
}

export function UserList({ onEditUser }: UserListProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const { toast } = useToast()

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (profilesError) {
        toast({
          title: "Error fetching user profiles",
          description: profilesError.message,
          variant: "destructive",
        })
        throw profilesError
      }

      return profiles as Profile[]
    },
  })

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      search === "" ||
      `${user.first_name || ""} ${user.last_name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())

    const matchesRole = roleFilter === "all" || user.user_type === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <UserCard.Skeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers?.map((user) => (
            <UserCard
              key={user.id}
              name={`${user.first_name || ""} ${user.last_name || ""}`}
              role={user.user_type}
              email={user.email || ""}
              phone={user.phone || ""}
              onEdit={() => onEditUser?.(user)}
            />
          ))}
        </div>
      )}
    </div>
  )
}