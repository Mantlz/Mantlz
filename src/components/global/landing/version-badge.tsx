interface VersionBadgeProps {
  version: string
  text: string
}

export function VersionBadge({ version, text }: VersionBadgeProps) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm transition-colors">
      <span className="mr-2">{version}</span>
      <span>{text}</span>
    </div>
  )
}
