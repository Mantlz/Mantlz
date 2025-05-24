import { Tag } from 'lucide-react'

interface VersionBadgeProps {
  version: string
  text: string
}

export function VersionBadge({ version, text }: VersionBadgeProps) {
  return (
    <div className="group inline-flex items-center px-2 py-1 rounded-lg bg-black dark:bg-white border-2 border-black dark:border-zinc-600 transform-gpu translate-y-[-1px] translate-x-[-1px] hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all duration-300 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] text-sm">
      <span className="inline-flex items-center mr-2 bg-white dark:bg-black px-1.5 py-0.5 rounded-md border border-black dark:border-zinc-600 text-black dark:text-white font-bold transform-gpu group-hover:translate-y-[-0.5px] group-hover:translate-x-[-0.5px] transition-all duration-300">
        {version}
        <Tag className="w-2.5 h-2.5 ml-1" />
      </span>
      <span className="font-bold text-white dark:text-black text-sm">{text}</span>
    </div>
  )
}
