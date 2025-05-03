import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function CampaignSearch() {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
      <Input
        type="search"
        placeholder="Search campaigns..."
        className="w-full pl-8 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-600"
      />
    </div>
  )
} 