'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, FileSpreadsheet, Clock, ArrowRight, Plus, Users, BarChart3, Calendar } from 'lucide-react'
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

interface FormsListProps {
  itemsPerPage?: number
}

export function FormsList({ itemsPerPage = 8 }: FormsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const { user } = useUser()
  
  const { data: forms = [], isLoading, error } = useQuery<Form[]>({
    queryKey: ['forms'],
    queryFn: async () => {
      try {
        const response = await client.forms.getUserForms.$get()
        const data = await response.json()
        return (data.forms || []).map((form: any) => ({
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
    return <FormCardSkeleton count={itemsPerPage} />
  }
  
  if (error) {
    toast.error('Failed to load forms')
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl border border-red-200 dark:border-red-800 shadow-sm p-6">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-mono font-bold text-red-600 dark:text-red-400">Error Loading Forms</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm">{(error as Error)?.message || "An unknown error occurred"}</p>
        </div>
      </div>
    )
  }
  
  const totalPages = Math.ceil(forms.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentForms = forms.slice(startIndex, endIndex)

  // Calculate statistics
  const totalResponses = forms.reduce((acc, form) => acc + form.responsesCount, 0)
  const mostRecentForm = forms.length > 0 ? forms.reduce((latest, current) => 
    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
  ) : null
  
  return (
    <div className="space-y-8">
      {/* Dashboard Header with Enhanced Retro Grid */}
      <div className="space-y-4 sm:space-y-8">
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Retro Grid Pattern with Glow */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                               linear-gradient(to bottom, #000 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          {/* Retro Corner Accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform -translate-x-16 -translate-y-16 rotate-45"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform translate-x-16 translate-y-16 rotate-45"></div>
          
          <div className="relative w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-900 dark:text-white tracking-tight">
              Welcome back, {user?.firstName || 'there'} 
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-2 font-mono">
              Here's an overview of your forms
            </p>
          </div>
          <Button
            className="relative w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 px-4 sm:px-6 py-4 sm:py-6 text-sm sm:text-base group"
            onClick={() => window.location.href = '/dashboard/form/new'}
          >
            <span className="absolute inset-0 bg-black dark:bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
            <Plus className="h-5 w-5 mr-2 relative" />
            Create New Form
          </Button>
        </div>

        {/* Statistics Cards with Enhanced Retro Style */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          <Card className="p-4 sm:p-6 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            {/* Retro Corner Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 -translate-x-16 translate-y-16"></div>
            
            <div className="flex items-center gap-3 sm:gap-4 relative">
              <div className="p-2 sm:p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
                <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-900 dark:text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono">Total Forms</p>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-white">{forms.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 -translate-x-16 translate-y-16"></div>
            
            <div className="flex items-center gap-3 sm:gap-4 relative">
              <div className="p-2 sm:p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-900 dark:text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono">Total Responses</p>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-white">{totalResponses}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 -translate-x-16 translate-y-16"></div>
            
            <div className="flex items-center gap-3 sm:gap-4 relative">
              <div className="p-2 sm:p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-900 dark:text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono">Latest Form</p>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-white">
                  {mostRecentForm ? format(new Date(mostRecentForm.createdAt), "MMM d") : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Forms Grid with Enhanced Retro Style */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {currentForms.map((form: Form) => (
          <Card 
            key={form.id}
            className="group relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl cursor-pointer"
            onClick={() => window.location.href = `/dashboard/form/${form.id}`}
          >
            {/* Retro Accent Elements */}
            <div className="absolute top-0 left-0 h-full w-0.5 xs:w-1 bg-black dark:bg-white"></div>
            <div className="absolute top-0 right-0 w-24 xs:w-32 h-24 xs:h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 xs:w-32 h-24 xs:h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform rotate-45 -translate-x-16 translate-y-16"></div>
            
            <div className="p-3 xs:p-4 sm:p-6 pl-4 xs:pl-5 sm:pl-7 relative">
              {/* Icon and title with hover effect */}
              <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-2 xs:mb-3 sm:mb-5">
                <div className="rounded-lg p-1.5 xs:p-2 sm:p-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
                  <FileSpreadsheet className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-zinc-900 dark:text-white" />
                </div>
                <div className="font-mono font-bold text-sm xs:text-base sm:text-lg line-clamp-1 text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform duration-300">
                  {form.name}
                </div>
              </div>
              
              {/* Form metadata with retro style */}
              <div className="flex items-center text-[8px] xs:text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-2 xs:mb-3 sm:mb-4 font-mono">
                <Clock className="h-2.5 xs:h-3 sm:h-3.5 w-2.5 xs:w-3 sm:w-3.5 mr-1 sm:mr-1.5" />
                <span>Created {format(new Date(form.createdAt), "MMM d, yyyy")}</span>
              </div>
              
              {/* Response count and view indicator */}
              <div className="flex items-center justify-between">
                <div className="text-[8px] xs:text-[10px] sm:text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-1.5 xs:px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-zinc-200 dark:border-zinc-700 group-hover:scale-105 transition-transform duration-300">
                  {form.responsesCount} responses
                </div>
                
                <div className="flex items-center gap-1 text-[10px] xs:text-xs sm:text-sm font-mono font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  <span>VIEW</span>
                  <ArrowRight className="h-2.5 xs:h-3 sm:h-4 w-2.5 xs:w-3 sm:w-4 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Bottom hover indicator with retro style */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
          </Card>
        ))}
      </div>
      
      {/* Empty State with Enhanced Retro Grid */}
      {forms.length === 0 && (
        <div className="relative text-center py-8 sm:py-12 bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Retro Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                               linear-gradient(to bottom, #000 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          {/* Retro Corner Accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform -translate-x-16 -translate-y-16 rotate-45"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-black dark:bg-white opacity-[0.02] dark:opacity-[0.03] transform translate-x-16 translate-y-16 rotate-45"></div>
          
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-base sm:text-lg font-mono font-bold text-zinc-900 dark:text-white mb-2">No forms yet</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Create your first form to get started</p>
            <Button
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100 border-2 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => window.location.href = '/dashboard/form/new'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Form
            </Button>
          </div>
        </div>
      )}
      
      {/* Pagination with Enhanced Retro Style */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t-2 border-zinc-200 dark:border-zinc-800 gap-4 sm:gap-0">
          <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono">
            Showing {startIndex + 1} to {Math.min(endIndex, forms.length)} of {forms.length} forms
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-xs sm:text-sm border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`w-6 sm:w-8 text-xs sm:text-sm border-2 ${
                    currentPage === page 
                      ? 'bg-black dark:bg-white text-white dark:text-black border-transparent' 
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  } transition-colors`}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-xs sm:text-sm border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 