export interface Profile {
  id: string
  user_type: "admin" | "student" | "parent"
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Pathway {
  id: string
  title: string
  description: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  pathway_id: string | null
  created_at: string
  updated_at: string
}

export interface Plenary {
  id: string
  title: string
  description: string | null
  pathway_id: string | null
  student_id: string | null
  points_awarded: number | null
  session_date: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_type: "in_person" | "online"
  start_time: string
  end_time: string
  pathway_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}