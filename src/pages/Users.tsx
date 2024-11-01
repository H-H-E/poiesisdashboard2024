import { useState, useEffect } from "react"
import { UserList } from "@/components/users/UserList"
import { UserForm } from "@/components/users/UserForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Navigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Profile } from "@/types"
import { supabase } from "@/integrations/supabase/client"
import { ParentStudentManager } from "@/components/users/ParentStudentManager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Users() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Profile | undefined>()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  
  useEffect(() => {
    async function checkUserType() {
      if (!user?.id) {
        setIsLoading(false)
        return
      }
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()

      setIsAdmin(profile?.user_type === 'admin')
      setIsLoading(false)
    }

    checkUserType()
  }, [user?.id])

  if (isLoading) {
    return null // or a loading spinner
  }

  // Redirect non-admin users to dashboard
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6 pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <UserForm
              onSuccess={() => setIsCreateDialogOpen(false)}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="relationships">Parent-Student Links</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserList onEditUser={setSelectedUser} />
        </TabsContent>

        <TabsContent value="relationships">
          <ParentStudentManager />
        </TabsContent>
      </Tabs>

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(undefined)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <UserForm
              user={selectedUser}
              onSuccess={() => setSelectedUser(undefined)}
              onCancel={() => setSelectedUser(undefined)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}