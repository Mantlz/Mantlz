"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Mail, Calendar, Send, Eye } from "lucide-react"

export function CampaignTableSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header skeleton */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-6 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-40 rounded-lg" />
              <Skeleton className="h-4 w-60 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </div>
      
      {/* Stats Grid Skeleton - Now outside the header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div>
                <Skeleton className="h-4 w-16 mb-1 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </div>
            {i === 0 && <Skeleton className="h-1 w-full mt-2 rounded-lg" />}
          </div>
        ))}
      </div>
      
      {/* Table skeleton */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/50">
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                  <span>Campaign Name</span>
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Subject</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                  Status
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                  Created
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                  Sent
                </TableHead>
                <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4 text-right">
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
                      <span className="text-sm text-zinc-400 dark:text-zinc-500"><Skeleton className="h-4 w-32 inline-block" /></span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                      <Skeleton className="h-4 w-28 rounded-lg" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <div className="flex items-center justify-end space-x-2">
                      <Skeleton className="h-7 w-16 rounded-lg" />
                      <Skeleton className="h-7 w-16 rounded-lg" />
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
            <Skeleton className="h-6 w-6 rounded-lg inline-block" />
            <span>of</span>
            <Skeleton className="h-6 w-6 rounded-lg inline-block" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      </div>
      
      {/* Grid view skeleton alternative */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 