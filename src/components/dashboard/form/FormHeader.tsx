"use client"

import { Copy, Users, Activity, BarChart3, Clock, Code, Settings, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { SdkDocs } from "./SdkDocs"
import { FormSettings } from "./FormSettings"

interface FormHeaderProps {
  id: string
  name: string
  createdAt?: Date | string
  responsesCount?: number
  form?: {
    emailSettings?: {
      enabled: boolean
      fromEmail?: string
      subject?: string
      template?: string
      replyTo?: string
    } | null
    formType?: string
    usersJoinedSettings?: {
      enabled: boolean
      count?: number
    } | null
  }
  analytics?: {
    last24HoursSubmissions: number
    completionRate: number
    averageResponseTime: number
  }
  onRefresh?: () => void
  onDelete?: (id: string) => Promise<void>
}

export function FormHeader({
  id,
  name,
  responsesCount = 0,
  form,
  analytics,

  onDelete,
}: FormHeaderProps) {
  const copyId = () => {
    if (id) {
      navigator.clipboard.writeText(id)
      toast.success("Form ID copied to clipboard", {
        description: `ID: ${id}`,
        duration: 2000,
      })
    }
  }

  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="relative p-3 xs:p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 xs:gap-3">
                <Link href="/dashboard" passHref>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 cursor-pointer bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 p-1 h-7"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-xs font-medium">Back</span>
                  </Button>
                </Link>
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-xs xs:text-sm"
                >
                  Form ID: {id.slice(0, 6)}...
                </Badge>
              </div>
              <h1 className="text-xl xs:text-1xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">{name}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 xs:gap-2 cursor-pointer bg-zinc-50 dark:bg-zinc-800 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-200 h-8 xs:h-9"
                  >
                    <Code className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm xs:text-base font-medium text-gray-800 dark:text-gray-200">
                      <span className="hidden xs:inline">Integration</span>
                      <span className="xs:hidden">SDK</span>
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[100vw] sm:w-[100vw] lg:w-[1800px] xl:w-[2000px] p-0 max-w-screen-2xl h-screen overflow-hidden">
                  <div className="h-full flex flex-col">
                    <SheetHeader className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                      <SheetTitle className="text-xl font-bold">Integration Guide</SheetTitle>
                      <SheetDescription className="text-base">
                        Follow these steps to integrate this form into your Next.js application
                      </SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-6 py-6 bg-zinc-50 dark:bg-zinc-900">
                      <SdkDocs formId={id} />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 xs:gap-2 cursor-pointer bg-zinc-50 dark:bg-zinc-800 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-200 h-8 xs:h-9"
                  >
                    <Settings className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm xs:text-base font-medium text-gray-800 dark:text-gray-200">Settings</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[100vw] sm:w-[100vw] lg:w-[1800px] xl:w-[2000px] p-0 max-w-screen-2xl h-screen overflow-hidden">
                  <div className="h-full flex flex-col">
                    <SheetHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-zinc-200 dark:border-zinc-700">
                      <SheetTitle className="text-lg sm:text-xl">Form Settings</SheetTitle>
                      <SheetDescription className="text-sm sm:text-base">
                        Manage your form settings and preferences.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
                      <FormSettings 
                        formId={id} 
                        name={name} 
                        emailSettings={form?.emailSettings}
                        formType={form?.formType} 
                        usersJoinedSettings={form?.usersJoinedSettings}
                        onDelete={onDelete} 
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 xs:gap-2 cursor-pointer bg-zinc-50 dark:bg-background px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow duration-200 h-8 xs:h-9"
                onClick={copyId}
              >
                <Copy className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-gray-600 dark:text-gray-300" />
                <span className="text-sm xs:text-base font-medium text-gray-800 dark:text-gray-200">
                  <span className="hidden xs:inline">Copy ID</span>
                  <span className="xs:hidden">Copy</span>
                </span>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
            <div className="bg-background rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 border border-zinc-100 dark:border-zinc-700/50 hover:border-zinc-200 dark:hover:border-zinc-600/50 transition-all duration-200">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Users className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm xs:text-base font-medium text-gray-900 dark:text-white">{responsesCount || 0}</p>
                  <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">Total Submissions</p>
                </div>
              </div>
              <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-black dark:bg-white rounded-lg transition-all duration-500"
                  style={{ width: `${Math.min(((responsesCount || 0) / 100) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-background rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 border border-zinc-100 dark:border-zinc-700/50 hover:border-zinc-200 dark:hover:border-zinc-600/50 transition-all duration-200">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Activity className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm xs:text-base font-medium text-gray-900 dark:text-white">
                    {analytics?.last24HoursSubmissions || 0}
                  </p>
                  <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">Last 24h</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 border border-zinc-100 dark:border-zinc-700/50 hover:border-zinc-200 dark:hover:border-zinc-600/50 transition-all duration-200">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm xs:text-base font-medium text-gray-900 dark:text-white">
                    {responsesCount > 0 ? `${analytics?.completionRate || 0}%` : 'N/A'}
                  </p>
                  <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 border border-zinc-100 dark:border-zinc-700/50 hover:border-zinc-200 dark:hover:border-zinc-600/50 transition-all duration-200">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Clock className="h-4 w-4 xs:h-4.5 xs:w-4.5 sm:h-5 sm:w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <p className="text-sm xs:text-base font-medium text-gray-900 dark:text-white">
                    {responsesCount > 0 ? `${analytics?.averageResponseTime || 0}s` : 'N/A'}
                  </p>
                  <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">Avg. Time to Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

