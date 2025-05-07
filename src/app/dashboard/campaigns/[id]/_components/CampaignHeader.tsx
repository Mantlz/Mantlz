'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { formatCampaignStatus } from '@/components/dashboard/campaigns/table/tableUtils';
import { Campaign } from './types';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Clock, Users, Send } from 'lucide-react';

interface CampaignHeaderProps {
  campaign: Campaign;
  onBackClick: () => void;
}

export function CampaignHeader({ campaign, onBackClick }: CampaignHeaderProps) {
  const statusInfo = formatCampaignStatus(campaign.status);

  return (
    <div className="space-y-6 flex-1">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg px-3"
            onClick={onBackClick}
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Back to Campaigns
          </Button>
          <Badge variant="outline" className={statusInfo.color}>
            {statusInfo.label}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          {campaign.name}
        </h1>
        {campaign.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
            {campaign.description}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <Mail className="h-5 w-5 text-gray-900 dark:text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {campaign._count?.sentEmails || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Emails</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <Clock className="h-5 w-5 text-gray-900 dark:text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-900 dark:text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {campaign._count?.recipients || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recipients</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <Send className="h-5 w-5 text-gray-900 dark:text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {campaign.status === 'SENT' ? 
                  formatDistanceToNow(new Date(campaign.sentAt!), { addSuffix: true }) :
                  'Not sent'
                }
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sent Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 