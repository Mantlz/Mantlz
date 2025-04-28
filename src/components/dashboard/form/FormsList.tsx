'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, FileSpreadsheet, Clock, ArrowRight, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { client } from '@/lib/client'
import { format } from 'date-fns'
import { FormCardSkeleton } from '@/components/skeletons/FormCardSkeleton'
import { useUser } from '@clerk/nextjs'


interface Form {
  id: string
  name: string
  createdAt: Date | string
  responsesCount: number
  emailSettings?: {
    enabled: boolean
    fromEmail?: string
    subject?: string
    template?: string
    replyTo?: string
  }
}

interface FormApiResponse {
  id: string
  name: string
  createdAt: Date | string
  submissionCount: number
  emailSettings?: {
    enabled: boolean
    fromEmail?: string
    subject?: string
    template?: string
    replyTo?: string
  }
}

interface FormsListProps {
  itemsPerPage?: number
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
}

export function FormsList({ 
  itemsPerPage = 8, 
  viewMode: externalViewMode,
  onViewModeChange
}: FormsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [internalViewMode, setInternalViewMode] = useState<'grid' | 'list'>('grid')
  const { user } = useUser()
  
  // Use external viewMode if provided, otherwise use internal state
  const viewMode = externalViewMode || internalViewMode

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    if (onViewModeChange) {
      onViewModeChange(mode)
    } else {
      setInternalViewMode(mode)
    }
  }
  
  const { data: forms = [], isLoading, error } = useQuery<Form[]>({
    queryKey: ['forms'],
    queryFn: async () => {
      try {
        const response = await client.forms.getUserForms.$get()
        const data = await response.json()
        return (data.forms || []).map((form: FormApiResponse) => ({
          ...form,
          responsesCount: form.submissionCount
        }))
      } catch (err) {
        console.error("Error fetching forms:", err)
        throw new Error('Failed to fetch forms')
      }
    }
  })
  
  if (isLoading) {
    // Get the count from the query data if available, otherwise use default
    const formCount = forms?.length || 1;
    return <FormCardSkeleton count={formCount} />
  }
  
  if (error) {
    toast.error('Failed to load forms')
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center bg-white dark:bg-zinc-900 rounded-lg border border-red-100 dark:border-red-900/50 shadow-sm p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Error Loading Forms</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{(error as Error)?.message || "An unknown error occurred"}</p>
        </div>
      </div>
    )
  }
  
  const totalPages = Math.ceil(forms.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentForms = forms.slice(startIndex, endIndex)

  const totalResponses = forms.reduce((acc, form) => acc + form.responsesCount, 0)
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section with Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-800 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black dark:bg-white flex items-center justify-center overflow-hidden">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl} 
                      alt={`${user?.firstName || 'User'}'s avatar`}
                      className="w-full h-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-lg sm:text-xl font-medium text-white dark:text-black">
                      {user?.firstName?.[0] || '👋'}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
                    Welcome back, {user?.firstName || 'there'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {forms.length > 0 
                      ? `You have ${forms.length} form${forms.length !== 1 ? 's' : ''}`
                      : "Let's create your first form"}
                  </p>
                </div>
              </div>
              
              {forms.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <FileSpreadsheet className="h-5 w-5 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{forms.length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Forms</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-black dark:bg-white rounded-lg transition-all duration-500"
                        style={{ width: `${Math.min((forms.length / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-zinc-800/50 rounded-xl p-4 sm:p-5 border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-900 dark:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{totalResponses}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Submissions</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-black dark:bg-white rounded-lg transition-all duration-500"
                        style={{ width: `${Math.min((totalResponses / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button
              className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-xl px-6 shadow-sm hover:shadow-md"
              onClick={() => window.location.href = '/dashboard/form-builder'}
            >
              <Plus className="h-4 w-4 mr-2" />
              {forms.length === 0 ? 'Create Your First Form' : 'New Form'}
            </Button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      {forms.length > 0 && (
        <div className="flex justify-end mb-2">
          <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-lg p-1 flex items-center">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' 
                ? 'bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' 
                ? 'bg-zinc-100 dark:bg-zinc-700 text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Forms Grid or List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {currentForms.map((form: Form) => (
            <Card 
              key={form.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer hover:shadow-md"
              onClick={() => window.location.href = `/dashboard/form/${form.id}`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">
                    {form.name}
                  </h3>
                  <span className="text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white px-2 sm:px-3 py-1 rounded-lg">
                    {form.responsesCount} responses
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    <span>{format(new Date(form.createdAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    <span>View</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {currentForms.map((form: Form) => (
            <div 
              key={form.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer hover:shadow-md rounded-lg"
              onClick={() => window.location.href = `/dashboard/form/${form.id}`}
            >
              <div className="p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <FileSpreadsheet className="h-5 w-5 text-gray-900 dark:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">
                      {form.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                        <span>{format(new Date(form.createdAt), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                        <span>{form.responsesCount} responses</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  <span>View</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {forms.length === 0 && (
        <div className="text-center py-12 sm:py-16 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
            <FileSpreadsheet className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2 sm:mb-3">
            No forms yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6 sm:mb-8">
            Create your first form to start collecting submissions and managing your data.
          </p>
          <Button
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all duration-200 rounded-lg px-6 shadow-sm hover:shadow-md"
            onClick={() => window.location.href = '/dashboard/form-builder'}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Form
          </Button>
        </div>
      )}

      {/* Pagination */}
      {forms.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
} 