"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Calendar, Globe, MapPin, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function SubmissionTableSkeleton({ isPremium }: { isPremium: boolean }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-gray-800/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-gray-800/50">
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                <span className="hidden sm:inline">Submission ID</span>
                <span className="sm:hidden">ID</span>
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Email</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                Status
              </TableHead>
              {isPremium && (
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4 hidden md:table-cell">
                  Analytics
                </TableHead>
              )}
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                Submitted
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow 
                key={index} 
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 last:border-0"
              >
                <TableCell className="pl-4 sm:pl-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                    <span className="text-sm text-zinc-400 dark:text-zinc-500"><Skeleton className="h-4 w-16 inline-block" /></span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                      <Skeleton className="h-4 w-16 rounded-md" />
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
                      <Skeleton className="h-3.5 w-12 rounded-md" />
                    </div>
                  </div>
                </TableCell>
                {isPremium && (
                  <TableCell className="py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
                        <Skeleton className="h-4 w-20 sm:w-28 rounded-md" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-zinc-300 dark:text-zinc-600" />
                        <Skeleton className="h-3.5 w-24 sm:w-32 rounded-md" />
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                    <Skeleton className="h-4 w-20 rounded-md" />
                  </div>
                </TableCell>
                <TableCell className="text-right py-3">
                  <div className="flex items-center justify-end">
                    <div className="w-16 h-7 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                      <Eye className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">View</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Page</span>
          <Skeleton className="h-8 w-8 rounded-md inline-block" />
          <span>of</span>
          <Skeleton className="h-8 w-8 rounded-md inline-block" />
        </div>
        <div className="flex gap-2">
          <div className="w-20 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">Previous</div>
          <div className="w-20 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">Next</div>
        </div>
      </div>
    </div>
  )
} 