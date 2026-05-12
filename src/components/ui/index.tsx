
import * as React from "react"
export const Button = React.forwardRef<HTMLButtonElement, any>(({ className, ...props }, ref) => (
  <button ref={ref} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props} />
))

export const Card = ({ children, className }: any) => <div className={`rounded-xl border border-border bg-card text-card-foreground shadow ${className}`}>{children}</div>
export const Badge = ({ children, className }: any) => <span className={`inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>{children}</span>
export const Skeleton = ({ className }: any) => <div className={`animate-pulse rounded-md bg-muted ${className}`} />
export const Input = React.forwardRef<HTMLInputElement, any>(({ className, ...props }, ref) => <input ref={ref} className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />)
export const Textarea = React.forwardRef<HTMLTextAreaElement, any>(({ className, ...props }, ref) => <textarea ref={ref} className={`flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />)

export const ScrollArea = ({ children, className }: any) => <div className={className} style={{ overflowY: 'auto' }}>{children}</div>

export const Tabs = ({ children, className }: any) => <div className={className}>{children}</div>
export const TabsList = ({ children, className }: any) => <div className={`inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground ${className}`}>{children}</div>
export const TabsTrigger = ({ children, className }: any) => <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow ${className}`}>{children}</button>
export const TabsContent = ({ children, className }: any) => <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>{children}</div>
