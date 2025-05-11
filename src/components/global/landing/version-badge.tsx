import { Tag } from 'lucide-react'

interface VersionBadgeProps {
  version: string
  text: string
}

export function VersionBadge({ version, text }: VersionBadgeProps) {
  return (
    <div className="group inline-flex items-center px-3 py-1 rounded-full bg-black/90 dark:bg-white/90 text-white dark:text-black text-sm transition-all duration-200 hover:bg-black dark:hover:bg-white shadow-sm hover:shadow-md">
      <span className="inline-flex items-center mr-2 bg-gradient-to-bl from-zinc-100 via-zinc-200 to-zinc-400 hover:from-zinc-700 hover:to-zinc-900 rounded-lg px-1 py-0.5 text-black font-medium transition-all duration-200 group-hover:scale-105">
        {version}
        <Tag className="w-3 h-3 ml-1 text-black/80" />
      </span>
      <span className="font-medium">{text}</span>
    </div>
  )
}
