// components/background-pattern.tsx
"use client"

import { LucideProps } from "lucide-react"

export const BackgroundPattern = (props: LucideProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${props.className}`}>
      {/* Brighter gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-200 to-zinc-800" />
      
      {/* Cartoonish wave/blob pattern */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
        from-zinc-500/50 to-transparent 
        bg-[size:800px_800px] bg-no-repeat bg-center opacity-60 blur-sm"
      />
      <div 
        className="absolute bottom-0 left-[-20%] right-[-20%] top-[-10%] h-[500px] 
        bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
        from-zinc-600/40 to-transparent 
        rounded-[50%] bg-no-repeat opacity-70 blur-lg"
      />
    </div>
  )
}