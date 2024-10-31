import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Profile } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

const userFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["admin", "student", "parent"]),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  user?: Profile
  onSuccess?: () => void
  onCancel?: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const { toast } = useToast()
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role: "student",
    },
  })

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (user) {
        // Update existing user
        const { error } = await supabase
          .from("user_profiles")
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            user_type: data.role,
          })
          .eq("id", user.id)

        if (error) throw error
        toast({ title: "User updated successfully" })
      } else {
        // Create new user in Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: "temporary-password", // In production, implement proper password handling
          options: {
            data: {
              first_name: data.first_name,
              last_name: data.last_name,
            },
          },
        })

        if (authError) throw authError

        if (authData.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from("user_profiles")
            .insert({
              id: authData.user.id,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              phone: data.phone,
              user_type: data.role,
            })

          if (profileError) throw profileError

          // Create role-specific entry
          const roleTable = `${data.role}s` // students, parents, or admins
          const { error: roleError } = await supabase
            .from(roleTable)
            .insert({
              id: authData.user.id,
            })

          if (roleError) throw roleError
        }

        toast({ title: "User created successfully" })
      }

      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {user ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  )
}