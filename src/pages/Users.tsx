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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"

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
    return null
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>Users</BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage user accounts and relationships.</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
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
      </div>

      <div className="glass-morphism rounded-lg p-4">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="relationships">Parent-Student Links</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserList onEditUser={setSelectedUser} />
          </TabsContent>

          <TabsContent value="relationships">
            <ParentStudentManager />
          </TabsContent>
        </Tabs>
      </div>

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