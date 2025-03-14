// components/background-pattern.tsx
"use client"

import { LucideProps } from "lucide-react"

export const BackgroundPattern = (props: LucideProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${props.className}`}>
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-white">
        {/* Gradient blobs - responsive sizes */}
        <div className="absolute -top-12 -left-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 md:-top-24 md:-left-20 
          bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -top-12 -right-10 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 md:-top-24 md:-right-20 
          bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        {/* Optional bottom blob - uncomment if needed
        <div className="absolute -bottom-16 left-16 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 md:-bottom-32 md:left-32 
          bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" /> */}
      </div>

      {/* Responsive grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] 
        bg-[size:30px_30px] sm:bg-[size:45px_45px] md:bg-[size:65px_65px]" />
    </div>
  )
}