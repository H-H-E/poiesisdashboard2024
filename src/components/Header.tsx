import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface HeaderProps {
  userRole: "admin" | "student" | "parent";
  onLogout: () => void;
}

export function Header({ userRole, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItems = (role: string) => {
    const items: { title: string; href: string }[] = [];

    switch (role) {
      case "admin":
        items.push(
          { title: "Users", href: "/users" },
          { title: "Pathways", href: "/pathways" },
          { title: "Projects", href: "/projects" },
          { title: "Events", href: "/events" }
        );
        break;
      case "student":
        items.push(
          { title: "My Projects", href: "/projects" },
          { title: "My Progress", href: "/progress" },
          { title: "Calendar", href: "/calendar" }
        );
        break;
      case "parent":
        items.push(
          { title: "Child Progress", href: "/progress" },
          { title: "Events", href: "/events" },
          { title: "Settings", href: "/settings" }
        );
        break;
    }

    return items;
  };

  const navItems = getNavItems(userRole);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Poiesis</h1>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="hidden md:flex"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}