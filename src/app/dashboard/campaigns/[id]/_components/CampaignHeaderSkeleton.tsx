'use client';

import { ChevronLeft, Mail, Clock, Users, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function CampaignHeaderSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4 w-full">
              <div className="flex items-center gap-3">
                <div className="h-8 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-amber-500rounded-lg px-3 bg-zinc-50 dark:bg-zinc-800/50 flex items-center">
                  <ChevronLeft className="h-3.5 w-3.5 mr-1 text-zinc-500 dark:text-zinc-400" />
                  <span className="text-zinc-500 dark:text-zinc-400">Back to Campaigns</span>
                </div>
                <div className="h-6 px-2 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center">
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 rounded-lg" />
              </div>
            </div>
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                </div>
                <div>
                  <Skeleton className="h-4 w-8 mb-1" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">Total Emails</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">Created</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                </div>
                <div>
                  <Skeleton className="h-4 w-10 mb-1" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">Recipients</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                  <Send className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">Sent Date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 