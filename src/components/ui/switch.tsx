"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-2xs transition-all outline-hidden focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-zinc-500 data-[state=unchecked]:bg-zinc-500",
        "dark:data-[state=checked]:bg-zinc-50 dark:data-[state=unchecked]:bg-zinc-50",
        "focus-visible:border-ring focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
          "bg-zinc-950 dark:bg-black",
          "data-[state=checked]:bg-zinc-500 dark:data-[state=checked]:bg-zinc-50"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
