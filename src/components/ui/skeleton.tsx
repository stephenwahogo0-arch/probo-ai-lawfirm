import { cn } from "@/lib/utils"

const Skeleton = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse rounded-md bg-muted", className)} />
)
Skeleton.displayName = "Skeleton"

export { Skeleton }
