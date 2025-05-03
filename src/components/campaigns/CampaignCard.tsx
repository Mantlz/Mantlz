"use client"

import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/client';
import { format } from 'date-fns';
import { Send, Clock, CheckCircle2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    subject: string;
    status: string;
    createdAt: Date;
    sentAt: Date | null;
  };
  isCompact?: boolean;
}

export function CampaignCard({ campaign, isCompact = false }: CampaignCardProps) {
  const queryClient = useQueryClient();
  
  const { mutate: sendCampaign, isPending } = useMutation({
    mutationFn: () => client.campaign.send.$post({ campaignId: campaign.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });

  const statusConfig = {
    SENT: {
      icon: CheckCircle2,
      className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    },
    SENDING: {
      icon: Clock,
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    },
    DRAFT: {
      icon: null,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    },
  };

  const StatusIcon = statusConfig[campaign.status as keyof typeof statusConfig]?.icon;

  if (isCompact) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn(
            "flex items-center gap-1",
            statusConfig[campaign.status as keyof typeof statusConfig]?.className
          )}>
            {StatusIcon && <StatusIcon className="h-3 w-3" />}
            {campaign.status}
          </Badge>
          {campaign.status === 'DRAFT' && (
            <Button 
              onClick={() => sendCampaign()}
              disabled={isPending}
              size="sm"
              className="gap-1 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100"
            >
              <Send className="h-3 w-3" />
              {isPending ? 'Sending...' : 'Send'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{campaign.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.subject}</p>
        </div>
        <Badge variant="outline" className={cn(
          "flex items-center gap-1",
          statusConfig[campaign.status as keyof typeof statusConfig]?.className
        )}>
          {StatusIcon && <StatusIcon className="h-3 w-3" />}
          {campaign.status}
        </Badge>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <span>Created: {format(new Date(campaign.createdAt), 'MMM d, yyyy')}</span>
        {campaign.sentAt && (
          <>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>Sent: {format(new Date(campaign.sentAt), 'MMM d, yyyy')}</span>
          </>
        )}
      </div>

      <div className="flex justify-end">
        {campaign.status === 'DRAFT' && (
          <Button 
            onClick={() => sendCampaign()}
            disabled={isPending}
            size="sm"
            className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100"
          >
            <Send className="h-4 w-4" />
            {isPending ? 'Sending...' : 'Send Campaign'}
          </Button>
        )}
      </div>
    </div>
  );
} 