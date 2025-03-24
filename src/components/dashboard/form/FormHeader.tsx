import { Calendar, Copy, Share, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

interface FormHeaderProps {
  id?: string
  name: string
  createdAt?: Date | string
  responsesCount?: number
}

export function FormHeader({ id, name, createdAt, responsesCount = 0 }: FormHeaderProps) {
  const copyId = () => {
    if (id) {
      navigator.clipboard.writeText(id)
    }
  }

  // Convert string to Date if needed
  const createdAtDate = createdAt 
    ? (createdAt instanceof Date ? createdAt : new Date(createdAt))
    : new Date();

  return (
    <Card className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200">{name}</h1>
          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            Created {format(createdAtDate, "MMM d, yyyy")}
            {responsesCount > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>{responsesCount} {responsesCount === 1 ? 'response' : 'responses'}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          {id && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
              onClick={copyId}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
} 