import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Mail, LayoutGrid, List } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { StatsGridSkeleton } from "@/components/skeletons"

interface FormsListViewProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onFormSelect: (formId: string) => void
  showCreateButton?: boolean
}

export function FormsListView({ 
  viewMode, 
  onViewModeChange, 
  onFormSelect,
  showCreateButton = true 
}: FormsListViewProps) {
  const router = useRouter()
  const { data: forms, isLoading, error } = useQuery({
    queryKey: ['forms'],
    queryFn: async () => {
      const response = await client.forms.getUserForms.$get();
      return response.json();
    },
  })

  if (isLoading) {
    return <StatsGridSkeleton />
  }

  if (error || !forms?.forms?.length) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let&apos;s create your first form
                    </p>
                  </div>
                </div>
              </div>
              <Button
                className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-lg px-6 shadow-sm hover:shadow-md"
                onClick={() => router.push("/dashboard/forms/new")}
              >
                Create Your First Form
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  Your Forms
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {forms.forms.length} form{forms.forms.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg p-1 flex items-center">
                  <button
                    onClick={() => onViewModeChange('grid')}
                    className={`p-1.5 rounded-lg ${viewMode === 'grid' 
                      ? 'bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onViewModeChange('list')}
                    className={`p-1.5 rounded-lg ${viewMode === 'list' 
                      ? 'bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-lg px-4 shadow-sm"
                  size="sm"
                  onClick={() => router.push("/dashboard/forms/new")}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  New Form
                </Button>
              </div>
            </div>

            {/* Forms Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {forms.forms.map((form: any) => (
                  <div 
                    key={form.id} 
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-300/50 transition-all duration-200 p-4 cursor-pointer"
                    onClick={() => onFormSelect(form.id)}
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{form.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-3">
                        <span>{form.submissionCount} submissions</span>
                      </div>
                    </div>
                    {showCreateButton && (
                      <div className="flex justify-end mt-4">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Mail className="h-3 w-3" />
                          View Campaigns
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">Form Name</th>
                        <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">Submissions</th>
                        {showCreateButton && (
                          <th className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {forms.forms.map((form: any) => (
                        <tr 
                          key={form.id} 
                          className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0 cursor-pointer"
                          onClick={() => onFormSelect(form.id)}
                        >
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{form.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{form.submissionCount}</td>
                          {showCreateButton && (
                            <td className="py-3 px-4 text-right">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs gap-1"
                              >
                                <Mail className="h-3 w-3" />
                                <span>Campaigns</span>
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 