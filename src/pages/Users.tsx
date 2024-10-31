import { Layout } from "@/components/Layout"
import { UserCard } from "@/components/UserCard"

export default function Users() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UserCard
        name="John Doe"
        role="admin"
        email="john@example.com"
        phone="+1 234 567 8900"
      />
      <UserCard
        name="Jane Smith"
        role="student"
        email="jane@example.com"
      />
      <UserCard
        name="Alice Johnson"
        role="parent"
        email="alice@example.com"
        phone="+1 234 567 8901"
      />
    </div>
  )
}