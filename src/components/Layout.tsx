import { Header } from "./Header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  userRole: "admin" | "student" | "parent";
  onLogout: () => void;
  className?: string;
}

export function Layout({ children, userRole, onLogout, className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onLogout={onLogout} />
      <main className={cn("container mx-auto px-4 py-8", className)}>
        {children}
      </main>
    </div>
  );
}