import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { variant?: string }>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "secondary" && "border-border bg-secondary text-secondary-foreground",
        variant === "default" && "border-border bg-primary text-primary-foreground",
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge }
