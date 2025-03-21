// components/background-pattern.tsx
"use client"

import { LucideProps } from "lucide-react"

export const BackgroundPattern = (props: LucideProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${props.className}`}>
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
      
      {/* Subtle modern grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4444440A_1px,transparent_1px),linear-gradient(to_bottom,#4444440A_1px,transparent_1px)] 
        bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  )
}