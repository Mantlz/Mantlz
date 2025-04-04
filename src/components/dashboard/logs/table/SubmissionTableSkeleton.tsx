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
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800/50 last:border-0"
              >
                <TableCell className="py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <div className="w-24">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1}s` }}></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <div className="w-20 sm:w-32">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.05}s` }}></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 sm:py-4">
                  <div className="flex flex-col gap-1">
                    <div className="w-20 sm:w-28 h-5 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.1}s` }}></div>
                    {isPremium && (
                      <div className="w-24 sm:w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.15}s` }}></div>
                    )}
                  </div>
                </TableCell>
                {isPremium && (
                  <TableCell className="py-3 sm:py-4 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-gray-400" />
                        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.25}s` }}></div>
                      </div>
                    </div>
                  </TableCell>
                )}
                <TableCell className="py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <div className="w-16 sm:w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" style={{ animationDelay: `${index * 0.1 + 0.3}s` }}></div>
                  </div>
                </TableCell>
                <TableCell className="py-3 sm:py-4 text-right">
                  <div className="w-16 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ml-auto" style={{ animationDelay: `${index * 0.1 + 0.35}s` }}></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center">
        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  )
} 