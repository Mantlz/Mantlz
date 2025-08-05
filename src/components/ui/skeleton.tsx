import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-zinc-100 dark:bg-zinc-950/20 animate-pulse rounded-lg", className)}
      {...props}
    />
  )
}

export { Skeleton }
