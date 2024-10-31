import { supabase } from "@/integrations/supabase/client"

export type RoleTable = "students" | "parents" | "admins"

export const createRoleSpecificEntry = async (userId: string, role: "student" | "parent" | "admin") => {
  const roleTable = `${role}s` as RoleTable
  const { error } = await supabase
    .from(roleTable)
    .insert({ id: userId })

  if (error) throw error
}