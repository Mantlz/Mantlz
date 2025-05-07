"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Calendar, MoreHorizontal, CalendarIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function CampaignTableSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Campaign List
          </h3>
          <Badge className="ml-2 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
            <Skeleton className="h-4 w-8" />
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-zinc-800">
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                Campaign Name
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                Created
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                Schedule/Sent Date
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">
                Recipients
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
                <TableCell className="py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-zinc-50 dark:bg-zinc-900/20 p-2 rounded-md">
                      <Mail className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 sm:py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell className="py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell className="py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </TableCell>
                <TableCell className="py-3 sm:py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-7 w-20" />
                    <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Page <Skeleton className="h-4 w-8 inline-block mx-1" /> of <Skeleton className="h-4 w-8 inline-block ml-1" />
        </span>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
} 