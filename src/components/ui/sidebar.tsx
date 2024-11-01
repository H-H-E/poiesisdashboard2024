import * as React from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => null,
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <aside className={cn("hidden w-64 flex-col md:flex", className)}>
      {children}
    </aside>
  )
}

export function SidebarTrigger() {
  const { setIsOpen } = React.useContext(SidebarContext)
  return (
    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(true)}>
      <Menu className="h-6 w-6" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  )
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-auto", className)}>{children}</div>
}

export function SidebarFooter({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t p-4", className)}>{children}</div>
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <nav className={cn("space-y-1 px-2", className)}>{children}</nav>
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)}>{children}</div>
}

export function SidebarMenuButton({
  className,
  children,
  isActive,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
        isActive && "bg-accent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarMenuSub({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div className={cn("space-y-1", className)}>
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          return React.cloneElement(child as React.ReactElement, {
            onClick: () => setIsOpen(!isOpen),
          })
        }
        return isOpen ? child : null
      })}
    </div>
  )
}

export function SidebarMenuSubItem({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pl-6", className)}>{children}</div>
}

export function SidebarMenuSubButton({
  className,
  children,
  isActive,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
        isActive && "bg-accent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarMobile({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = React.useContext(SidebarContext)
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-64 p-0">
        {children}
      </SheetContent>
    </Sheet>
  )
}