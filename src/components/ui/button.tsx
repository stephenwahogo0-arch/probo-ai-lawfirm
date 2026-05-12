
import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string, asChild?: boolean }>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // We'll ignore asChild for now to keep it simple, or we could use a slot pattern
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variant === "outline" ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground" : 
          variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" :
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
          size === "sm" ? "h-8 rounded-md px-3 text-xs" : size === "lg" ? "h-10 rounded-md px-8" : "h-9 px-4 py-2",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
