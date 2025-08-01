'use client';

import { Campaign } from './types';


import { CalendarDays } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CampaignStatsProps {
  campaign: Campaign;
}

export function CampaignStats({ campaign }: CampaignStatsProps) {


  return (
    <div className="flex items-center gap-4">
      
      {campaign.status === 'SCHEDULED' && campaign.scheduledAt && (
        <Popover>
          <PopoverTrigger>
            <div className="inline-flex items-center gap-2.5 cursor-help group bg-orange-50/50 dark:bg-amber-700/10 px-2.5 py-1.5 rounded-md">
              <div className="shrink-0">
                <CalendarDays className="h-3.5 w-3.5 text-orange-500 group-hover:text-orange-600 transition-colors" />
              </div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-none">
                {new Date(campaign.scheduledAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-zinc-800 rounded-lg">
                  <CalendarDays className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Scheduled Campaign
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    Will be sent on{' '}
                    {new Date(campaign.scheduledAt).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                      timeZoneName: 'short'
                    })}
                  </p>
                </div>
              </div>
              <div className="pl-11">
                <p className="text-xs text-orange-500 dark:text-orange-400">
                  {`${Math.ceil((new Date(campaign.scheduledAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until sending`}
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
} 