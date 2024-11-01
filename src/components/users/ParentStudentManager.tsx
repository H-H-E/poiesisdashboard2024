import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface Student {
  id: string
  user_profiles: {
    first_name: string | null
    last_name: string | null
    email: string | null
  }
}

interface Parent {
  id: string
  user_profiles: {
    first_name: string | null
    last_name: string | null
    email: string | null
  }
}

export function ParentStudentManager() {
  const [selectedParent, setSelectedParent] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const { toast } = useToast()

  const { data: parents } = useQuery({
    queryKey: ["parents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parents")
        .select(`
          id,
          user_profiles (
            first_name,
            last_name,
            email
          )
        `)
      if (error) throw error
      return data as Parent[]
    },
  })

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select(`
          id,
          user_profiles (
            first_name,
            last_name,
            email
          )
        `)
      if (error) throw error
      return data as Student[]
    },
  })

  const { data: relationships } = useQuery({
    queryKey: ["parent-student-relations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parent_student_relations")
        .select("*")
      if (error) throw error
      return data
    },
  })

  const handleLink = async () => {
    if (!selectedParent || !selectedStudent) {
      toast({
        title: "Error",
        description: "Please select both a parent and a student",
        variant: "destructive",
      })
      return
    }

    // Check if relationship already exists
    const exists = relationships?.some(
      (r) => r.parent_id === selectedParent && r.student_id === selectedStudent
    )

    if (exists) {
      toast({
        title: "Error",
        description: "This relationship already exists",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase.from("parent_student_relations").insert({
      parent_id: selectedParent,
      student_id: selectedStudent,
    })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create relationship",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Parent-student relationship created",
    })

    // Reset selections
    setSelectedParent("")
    setSelectedStudent("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Parents to Students</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Parent</label>
          <Select value={selectedParent} onValueChange={setSelectedParent}>
            <SelectTrigger>
              <SelectValue placeholder="Select a parent" />
            </SelectTrigger>
            <SelectContent>
              {parents?.map((parent) => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.user_profiles.first_name} {parent.user_profiles.last_name} ({parent.user_profiles.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Student</label>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students?.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.user_profiles.first_name} {student.user_profiles.last_name} ({student.user_profiles.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleLink} className="w-full">
          Link Parent to Student
        </Button>
      </CardContent>
    </Card>
  )
}