import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone } from "lucide-react";

interface UserCardProps {
  name: string;
  role: "admin" | "student" | "parent";
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export function UserCard({ name, role, email, phone, avatarUrl }: UserCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-500";
      case "student":
        return "bg-green-500";
      case "parent":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{name}</h3>
          <Badge className={`${getRoleColor(role)} text-white`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span>{email}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{phone}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}