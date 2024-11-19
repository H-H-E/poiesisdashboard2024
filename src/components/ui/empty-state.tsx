import { LucideIcon } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      "border-2 border-dashed rounded-lg",
      "bg-muted/50",
      className
    )}>
      {Icon && <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button 
          onClick={action.onClick}
          variant="outline"
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}