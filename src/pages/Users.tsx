import { useQuery } from "@tanstack/react-query"
import { Layout } from "@/components/Layout"
import { UserCard } from "@/components/UserCard"
import { supabase } from "@/integrations/supabase/client"
import { Profile } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

export default function Users() {
  const { toast } = useToast()
  
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }
      
      return data as Profile[]
    },
  })

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 space-y-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {profiles?.map((profile) => (
        <UserCard
          key={profile.id}
          name={`${profile.first_name || ''} ${profile.last_name || ''}`}
          role={profile.role}
          email={profile.email || ''}
          phone={profile.phone || ''}
        />
      ))}
    </div>
  )
}