'use client';

import { Campaign } from './types';
import { SendCampaignDialog } from '@/components/dashboard/campaigns/dialogs/SendCampaignDialog';
import { ScheduleCampaignDialog } from '@/components/dashboard/campaigns/dialogs/ScheduleCampaignDialog';

interface CampaignActionsProps {
  campaign: Campaign;
  isPremium: boolean;
  userPlan: string;
  onUpgradeClick: () => void;
  onSent: () => Promise<void>;
  onScheduled: () => Promise<void>;
}

export function CampaignActions({
  campaign,
  isPremium,
  userPlan,
  onUpgradeClick,
  onSent,
  onScheduled
}: CampaignActionsProps) {
  if (campaign.status !== 'DRAFT') {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <SendCampaignDialog
        campaignId={campaign.id}
        onSent={onSent}
        onUpgradeClick={onUpgradeClick}
        userPlan={userPlan}
      />
      
      <ScheduleCampaignDialog
        campaignId={campaign.id}
        onScheduled={onScheduled}
        isPremium={isPremium}
        onUpgradeClick={onUpgradeClick}
        userPlan={userPlan}
      />
    </div>
  );
} 