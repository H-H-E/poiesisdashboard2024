import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Profile } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { UserFormFields } from "./UserFormFields"
import { createRoleSpecificEntry } from "@/utils/userUtils"

const userFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["admin", "student", "parent"]),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
})

export type UserFormValues = z.infer<typeof userFormSchema>

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
      password: "",
    },
  })

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (user) {
        // Update existing user
        const { error: profileError } = await supabase
          .from("user_profiles")
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            user_type: data.role,
          })
          .eq("id", user.id)

        if (profileError) throw profileError

        // Update password if provided
        if (data.password) {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: data.password }
          )
          if (passwordError) throw passwordError
        }

        toast({ title: "User updated successfully" })
      } else {
        // Check if user exists
        const { data: existingUser } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("email", data.email)
          .single()

        if (existingUser) {
          toast({ 
            title: "User already exists", 
            description: "Please use a different email address.",
            variant: "destructive"
          })
          return
        }

        // Create new user with password
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password || "temporary-password",
          email_confirm: true,
          user_metadata: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        })

        if (authError) {
          if (authError.message.includes("already registered")) {
            toast({ 
              title: "User already exists", 
              description: "Please use a different email address.",
              variant: "destructive"
            })
            return
          }
          throw authError
        }

        if (authData.user) {
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

          await createRoleSpecificEntry(authData.user.id, data.role)
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
        <UserFormFields form={form} />
        
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