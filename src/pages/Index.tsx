import { UserCard } from "@/components/UserCard"

const Index = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-gradient">Welcome to Poiesis</h1>
      <p className="lead">Manage your educational journey with ease.</p>
      
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
    </div>
  )
}

export default Index