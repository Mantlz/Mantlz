"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Calendar, Globe, MapPin } from "lucide-react"

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
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1}s` }}></div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.05}s` }}></div>
                    <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.1}s` }}></div>
                  </div>
                </TableCell>
                {isPremium && (
                  <TableCell className="py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      <div className="h-4 w-20 sm:w-28 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.1}s` }}></div>
                      <div className="h-4 w-24 sm:w-32 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.15}s` }}></div>
                    </div>
                  </TableCell>
                )}
                <TableCell className="py-3">
                  <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}></div>
                </TableCell>
                <TableCell className="text-right py-3">
                  <div className="w-16 h-7 bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse ml-auto" style={{ animationDelay: `${index * 0.1 + 0.35}s` }}></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="w-24 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-md animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="flex gap-2">
          <div className="w-20 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-20 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  )
} 