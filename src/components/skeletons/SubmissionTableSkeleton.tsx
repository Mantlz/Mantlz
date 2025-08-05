"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Calendar, Globe, MapPin, Maximize2, CalendarRange } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function SubmissionTableSkeleton({ isPremium }: { isPremium: boolean }) {
  return (
    <div className="bg-background dark:bg-background rounded-xl border border-zinc-200 dark:border-zinc-800/50 overflow-hidden">
      {/* Header with submission count and date range picker */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Submission Logs
          </h3>
          <Badge className="ml-2 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <Skeleton className="h-3 w-8 rounded-lg" />
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Range Picker Button */}
          <div className="h-8 gap-1 cursor-pointer rounded-lg bg-white/80 dark:bg-zinc-900/80 text-gray-700 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 backdrop-blur shadow-sm flex items-center px-3">
            <CalendarRange className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm text-zinc-600">Date Range</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-zinc-800/50">
              <TableHead className="text-xs font-medium text-zinc-600 dark:text-zinc-300 py-3 sm:py-2">
                <span className="hidden sm:inline">Submission ID</span>
                <span className="sm:hidden">ID</span>
              </TableHead>
              <TableHead className="text-xs font-medium text-zinc-600 dark:text-zinc-300 py-3 sm:py-2">Email</TableHead>
              <TableHead className="text-xs font-medium text-zinc-600 dark:text-zinc-300 py-3 sm:py-2">
                Status
              </TableHead>
              {isPremium && (
                <TableHead className="text-xs font-medium text-zinc-600 dark:text-zinc-300 py-3 sm:py-2 hidden md:table-cell">
                  Analytics
                </TableHead>
              )}
              <TableHead className="text-xs font-medium text-zinc-600 dark:text-zinc-300 py-3 sm:py-2">
                Submitted
              </TableHead>
              <TableHead className="text-xs font-medium text-zinc-600 dark:text-zinc-300 py-3 sm:py-2 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow 
                key={index} 
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 last:border-0"
              >
                <TableCell className="pl-4 sm:pl-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-lg bg-zinc-300 dark:bg-zinc-600"></div>
                    <span className="text-sm text-zinc-400 dark:text-zinc-600"><Skeleton className="h-4 w-16 inline-block" /></span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                    <Skeleton className="h-4 w-28 rounded-lg" />
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-lg bg-zinc-300 dark:bg-zinc-600"></div>
                      <Skeleton className="h-4 w-16 rounded-lg" />
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
                      <Skeleton className="h-3.5 w-12 rounded-lg" />
                    </div>
                  </div>
                </TableCell>
                {isPremium && (
                  <TableCell className="py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
                        <Skeleton className="h-4 w-20 sm:w-28 rounded-lg" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
                        <Skeleton className="h-3.5 w-24 sm:w-32 rounded-lg" />
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                    <Skeleton className="h-4 w-20 rounded-lg" />
                  </div>
                </TableCell>
                <TableCell className="text-right py-3">
                  <div className="flex items-center justify-end">
                    <div className="w-20 h-7 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      <Maximize2 className="h-4 w-4 mr-1 mt-1" />
                      <span className="text-xs text-zinc-400 dark:text-zinc-600 ml-1">Details</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span>Page</span>
          <Skeleton className="h-8 w-8 rounded-lg inline-block" />
          <span>of</span>
          <Skeleton className="h-8 w-8 rounded-lg inline-block" />
        </div>
        <div className="flex gap-2">
          <div className="w-20 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-sm">Previous</div>
          <div className="w-20 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-sm">Next</div>
        </div>
      </div>
    </div>
  )
} 