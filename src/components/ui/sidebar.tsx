import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface SidebarContextValue {
  isOpen: boolean
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  isOpen: true,
  toggle: () => {},
})

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen(!isOpen),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle, isOpen } = useSidebar()

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(className)}
      onClick={toggle}
    >
      <ChevronRight
        className={cn(
          "h-4 w-4 transition-transform",
          isOpen ? "rotate-180" : "rotate-0"
        )}
      />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}